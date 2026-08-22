import axios from 'axios'
import { env } from './env'

export const paystackClient = axios.create({
  baseURL: env.PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
})

export const paystackConfig = {
  secretKey: env.PAYSTACK_SECRET_KEY,
  publicKey: env.PAYSTACK_PUBLIC_KEY,
  webhookSecret: env.PAYSTACK_WEBHOOK_SECRET,
  baseUrl: env.PAYSTACK_BASE_URL,
}