import { PaymentProvider } from './order.types'

export interface InitializePaymentInput {
  orderId: string
  provider: PaymentProvider
}

export interface PaystackPaymentResponse {
  authorizationUrl: string
  reference: string
}

export interface StripePaymentResponse {
  sessionId: string
  url: string
}

export interface PaymentVerificationResponse {
  success: boolean
  message?: string
}

export interface WebhookEvent {
  id: string
  provider: PaymentProvider
  eventId: string
  eventType: string
  rawPayload: any
  processed: boolean
  processedAt?: string | null
  error?: string | null
  createdAt: string
  updatedAt: string
}