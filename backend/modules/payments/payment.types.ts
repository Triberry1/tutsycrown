import { z } from 'zod'

export const initializePaymentSchema = z.object({
  orderId: z.string(),
  provider: z.enum(['PAYSTACK', 'STRIPE']),
})

export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>