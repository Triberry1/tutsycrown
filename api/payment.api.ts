import { ApiClient } from './client'
import { ApiResponse } from '../types/api.types'
import { InitializePaymentInput, PaystackPaymentResponse, StripePaymentResponse } from '../types/payment.types'

export class PaymentsApi {
  constructor(private client: ApiClient) {}

  async initializePayment(data: InitializePaymentInput): Promise<ApiResponse<PaystackPaymentResponse | StripePaymentResponse>> {
    return this.client.post('/payments/initialize', data)
  }

  async verifyPaystackPayment(reference: string): Promise<ApiResponse<{ success: boolean; message?: string }>> {
    return this.client.get('/payments/verify', { reference })
  }
}