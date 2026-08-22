import { z } from 'zod'

export const createOrderSchema = z.object({
	shippingAddress: z.record(z.string(), z.unknown()),
	billingAddress: z.record(z.string(), z.unknown()).optional(),
	shippingMethodId: z.string().optional(),
	couponCode: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>