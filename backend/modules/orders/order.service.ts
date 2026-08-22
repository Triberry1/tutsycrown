import { prisma } from '../../config/prisma'
import { NotFoundError, ValidationError } from '../../utils/errors'
import { generateOrderNumber, calculateTax } from '../../utils/helpers'
import { CreateOrderInput } from './order.types'

export class OrderService {
  static async createOrder(userId: string, data: CreateOrderInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Cart is empty')
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for product: ${item.product.name}`)
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    const tax = calculateTax(subtotal)
    const shippingCost = 0
    const discount = 0
    const total = subtotal + tax + shippingCost - discount

    let coupon = null
    if (data.couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } })
      if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        throw new ValidationError('Invalid or expired coupon')
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new ValidationError('Coupon has reached its usage limit')
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        shippingAddress: JSON.parse(JSON.stringify(data.shippingAddress)),
        billingAddress: JSON.parse(JSON.stringify(data.billingAddress || data.shippingAddress)),
        shippingMethodId: data.shippingMethodId,
        couponId: coupon?.id,
        subtotal,
        tax,
        shippingCost,
        discount,
        total,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: Number(item.price) * item.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    if (coupon) {
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } })
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return order
  }

  static async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { include: { images: { take: 1 } } } } },
        payment: true,
        shippingMethod: true,
        coupon: true,
      },
    })

    if (!order) throw new NotFoundError('Order not found')

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    if (order.userId !== userId && user?.role !== 'ADMIN') {
      throw new ValidationError('You do not have permission to view this order')
    }
    return order
  }

  static async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: { include: { product: { include: { images: { take: 1 } } } } },
          payment: true,
          shippingMethod: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ])

    return { data: orders, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  static async updateOrderStatus(orderId: string, status: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Order not found')
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    if (user?.role !== 'ADMIN') throw new ValidationError('Admin permission required')

    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' },
    })
  }
}
