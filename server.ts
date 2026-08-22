import { app } from './app'
import { env } from './config/env'
import { logger } from './utils/logger'
import { prisma } from './config/prisma'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { verifyToken } from '@clerk/backend'

const server = createServer(app)

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: [env.CLIENT_URL, env.MOBILE_URL, 'http://localhost:3000'],
    credentials: true,
  },
})

// Socket.IO authentication and chat handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication required'))
    }

    const session = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    })

    if (!session) {
      return next(new Error('Invalid token'))
    }

    socket.data.userId = session.sub
    next()
  } catch (error) {
    next(new Error('Authentication failed'))
  }
})

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)
  socket.emit('connected', { message: 'Connected to server' })

  // Join a room for the user's chat
  const userId = socket.data.userId
  if (userId) {
    socket.join(`user:${userId}`)
  }

  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`)
    socket.emit('joined_conversation', { conversationId })
  })

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`)
  })

  socket.on('send_message', async (data) => {
    try {
      // Store message in database
      // Broadcast to conversation room
      io.to(`conversation:${data.conversationId}`).emit('new_message', {
        ...data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...')
  await prisma.$disconnect()
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Start server
server.listen(env.PORT, () => {
  logger.info(`🚀 Tutsy Crown Backend`)
  logger.info(`📍 Server: http://localhost:${env.PORT}`)
  logger.info(`📡 WebSocket: http://localhost:${env.PORT}`)
  logger.info(`🔧 Environment: ${env.NODE_ENV}`)
  logger.info(`🗄️  Database: PostgreSQL (Prisma)`)

  if (env.NODE_ENV === 'development') {
    logger.info(`📊 Prisma Studio: npx prisma studio`)
    logger.info(`📝 API Base: http://localhost:${env.PORT}/api/v1`)
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason)
  process.exit(1)
})

export { server, io }