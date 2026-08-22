import { prisma } from '../../config/prisma'
import { NotFoundError, ValidationError } from '../../utils/errors'
import { AddToCartInput, UpdateCartItemInput } from './cart.types'

export class CartService {
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                  },
                },
              },
            },
          },
        },
      })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      ...cart,
      subtotal,
      totalItems,
    }
  }

  static async addToCart(userId: string, data: AddToCartInput) {
    const { productId, variantId, quantity } = data

    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    })

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    // Check variant if specified
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId)
      if (!variant) {
        throw new NotFoundError('Variant not found')
      }
      if (variant.stock < quantity) {
        throw new ValidationError('Insufficient stock for this variant')
      }
    } else if (product.stock < quantity) {
      throw new ValidationError('Insufficient stock')
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    })

    const price = variantId
      ? product.variants.find(v => v.id === variantId)?.price || product.price
      : product.price

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price,
        },
        include: {
          product: {
            include: {
              images: {
                take: 1,
              },
            },
          },
        },
      })
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
        price,
      },
      include: {
        product: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    })
  }

  static async updateCartItem(userId: string, itemId: string, data: UpdateCartItemInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    })

    if (!item) {
      throw new NotFoundError('Cart item not found')
    }

    if (data.quantity <= 0) {
      return prisma.cartItem.delete({
        where: { id: itemId },
      })
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: data.quantity },
      include: {
        product: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    })
  }

  static async removeCartItem(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    })

    if (!item) {
      throw new NotFoundError('Cart item not found')
    }

    return prisma.cartItem.delete({
      where: { id: itemId },
    })
  }

  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }
}