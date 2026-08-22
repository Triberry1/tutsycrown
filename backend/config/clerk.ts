import { createClerkClient } from '@clerk/backend'
import { env } from './env'

export const clerk = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
})

export const clerkConfig = {
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  webhookSecret: env.CLERK_WEBHOOK_SECRET,
}