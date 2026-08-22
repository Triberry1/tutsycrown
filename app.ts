import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { morganStream } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/ratelimiter'
import { requestLogger } from './middleware/loggings'

// Import routes
import userRoutes from './modules/users/user.routes'
import productRoutes from './modules/products/product.routes'
import cartRoutes from './modules/cart/cart.routes'
import orderRoutes from './modules/orders/order.routes'
import paymentRoutes from './modules/payments/payment.routes'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: [env.CLIENT_URL, env.MOBILE_URL, 'http://localhost:3000'],
  credentials: true,
}))

// Logging
app.use(morgan('combined', { stream: morganStream }))
app.use(requestLogger)

// Body parsing - raw for webhooks
app.use('/api/webhooks', express.raw({ type: 'application/json' }))

// Body parsing - JSON for everything else
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use(rateLimiter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  })
})

// API routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/payments', paymentRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

export { app }