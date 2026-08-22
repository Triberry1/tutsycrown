import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string().optional().default(''),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),
  PAYSTACK_PUBLIC_KEY: z.string(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional().default(''),
  PAYSTACK_BASE_URL: z.string().default('https://api.paystack.co'),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  MOBILE_URL: z.string().default('*'),
  JWT_SECRET: z.string().default('your_jwt_secret_here'),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format())
  process.exit(1)
}

export const env = parsedEnv.data
export type Env = z.infer<typeof envSchema>