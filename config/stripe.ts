// Ensure 'stripe' package is installed: npm install stripe
import Stripe from 'stripe'
import { env } from './env'

export const stripe: Stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-07-29.dahlia',
})

export const stripeConfig = {
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
}