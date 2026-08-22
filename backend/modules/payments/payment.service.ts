import { prisma } from '../../config/prisma'
import { NotFoundError, PaymentError } from '../../utils/errors'
import { paystackClient } from '../../config/paystack'
import { stripe } from '../../config/stripe'
import { env } from '../../config/env'

export class PaymentService {
  static async initializePayment(orderId: string, provider: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.userId !== userId) {
      throw new Error('You do not own this order')
    }

    if (order.status === 'PAID') {
      throw new Error('Order already paid')
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    })

    if (existingPayment && existingPayment.status === 'SUCCESSFUL') {
      throw new Error('Order already paid')
    }

    if (provider === 'PAYSTACK') {
      return this.initializePaystackPayment(order)
    } else if (provider === 'STRIPE') {
      return this.initializeStripePayment(order)
    } else {
      throw new Error('Invalid payment provider')
    }
  }

  private static async initializePaystackPayment(order: any) {
    const callbackUrl = `${env.CLIENT_URL}/payment/verify`

    try {
      const response = await paystackClient.post('/transaction/initialize', {
        email: order.user.email,
        amount: Number(order.total) * 100, // Paystack uses kobo
        reference: `ORDER-${order.orderNumber}-${Date.now()}`,
        callback_url: callbackUrl,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'PAYSTACK',
          providerReference: response.data.data.reference,
          amount: order.total,
          status: 'PENDING',
          metadata: response.data,
        },
      })

      return {
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
      }
    } catch (error: any) {
      console.error('Paystack initialization error:', error.response?.data || error.message)
      throw new PaymentError('Failed to initialize payment')
    }
  }

  private static async initializeStripePayment(order: any) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.items.map((item: any) => ({
          price_data: {
            currency: 'ngn',
            product_data: {
              name: item.product.name,
            },
            unit_amount: Number(item.price) * 100,
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.CLIENT_URL}/payment/cancel`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        shipping_address_collection: {
          allowed_countries: ['NG'],
        },
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'STRIPE',
          providerReference: session.id,
          amount: order.total,
          status: 'PENDING',
          metadata: JSON.parse(JSON.stringify(session)),
        },
      })

      return {
        sessionId: session.id,
        url: session.url,
      }
    } catch (error: any) {
      console.error('Stripe initialization error:', error.message)
      throw new PaymentError('Failed to initialize payment')
    }
  }

  static async verifyPaystackPayment(reference: string) {
    try {
      const response = await paystackClient.get(`/transaction/verify/${reference}`)
      const data = response.data.data

      // Find payment by reference
      const payment = await prisma.payment.findFirst({
        where: { providerReference: reference },
        include: { order: true },
      })

      if (!payment) {
        throw new NotFoundError('Payment not found')
      }

      if (data.status === 'success') {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESSFUL',
              paidAt: new Date(),
            },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAID' },
          }),
        ])

        return { success: true }
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })

      return { success: false, message: 'Payment verification failed' }
    } catch (error) {
      console.error('Paystack verification error:', error)
      throw new PaymentError('Payment verification failed')
    }
  }

  static async handlePaystackWebhook(event: any) {
    const eventData = event.data
    const eventReference = eventData.reference

    // Check for duplicate event
    const existingEvent = await prisma.paymentWebhookEvent.findUnique({
      where: { eventId: eventReference },
    })

    if (existingEvent) {
      return { success: true, message: 'Duplicate event ignored' }
    }

    // Store webhook event
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: 'PAYSTACK',
        eventId: eventReference,
        eventType: event.event,
        rawPayload: event,
        processed: false,
      },
    })

    // Process based on event type
    if (event.event === 'charge.success') {
      await this.verifyPaystackPayment(eventReference)
    }

    // Mark as processed
    await prisma.paymentWebhookEvent.update({
      where: { eventId: eventReference },
      data: { processed: true, processedAt: new Date() },
    })

    return { success: true }
  }

  static async handleStripeWebhook(event: any) {
    const eventId = event.id

    // Check for duplicate event
    const existingEvent = await prisma.paymentWebhookEvent.findUnique({
      where: { eventId },
    })

    if (existingEvent) {
      return { success: true, message: 'Duplicate event ignored' }
    }

    // Store webhook event
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: 'STRIPE',
        eventId,
        eventType: event.type,
        rawPayload: event,
        processed: false,
      },
    })

    // Process based on event type
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const payment = await prisma.payment.findFirst({
        where: { providerReference: session.id },
      })

      if (payment) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESSFUL',
              paidAt: new Date(),
            },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAID' },
          }),
        ])
      }
    }

    // Mark as processed
    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processed: true, processedAt: new Date() },
    })

    return { success: true }
  }
}