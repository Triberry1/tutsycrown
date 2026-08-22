import { z } from 'zod'
import { addressSchema } from './user.validation'

export const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
})

export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  shippingMethodId: z.string().optional(),
  couponCode: z.string().optional(),
  paymentProvider: z.enum(['PAYSTACK', 'STRIPE']),
})

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
})

export const orderFiltersSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

export type CreateOrderValidation = z.infer<typeof createOrderSchema>
export type OrderStatusValidation = z.infer<typeof orderStatusSchema>
export type OrderFiltersValidation = z.infer<typeof orderFiltersSchema>