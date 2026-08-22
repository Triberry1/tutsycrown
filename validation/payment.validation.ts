import { z } from 'zod'

export const initializePaymentSchema = z.object({
  orderId: z.string(),
  provider: z.enum(['PAYSTACK', 'STRIPE']),
})

export const verifyPaymentSchema = z.object({
  reference: z.string(),
})

export const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.string(), z.unknown()),
})

export type InitializePaymentValidation = z.infer<typeof initializePaymentSchema>
export type VerifyPaymentValidation = z.infer<typeof verifyPaymentSchema>
export type WebhookValidation = z.infer<typeof webhookSchema>