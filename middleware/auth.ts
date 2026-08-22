import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@clerk/backend'
import { env } from '../config/env'
import { prisma } from '../config/prisma'
import { UnauthorizedError } from '../utils/errors'

export interface AuthRequest extends Request {
  userId?: string
  clerkUserId?: string
  userRole?: string
}

export const requireAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    const session = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    })

    if (!session) {
      throw new UnauthorizedError('Invalid token')
    }

    const clerkUserId = session.sub
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    })

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    req.userId = user.id
    req.clerkUserId = clerkUserId
    req.userRole = user.role

    next()
  } catch (error) {
    next(new UnauthorizedError('Authentication failed'))
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const session = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
      })

      if (session) {
        const clerkUserId = session.sub
        const user = await prisma.user.findUnique({
          where: { clerkUserId },
        })

        if (user) {
          req.userId = user.id
          req.clerkUserId = clerkUserId
          req.userRole = user.role
        }
      }
    }
    next()
  } catch (error) {
    next()
  }
}

export { requireAdmin, requireCustomer, requireVendor } from './authorization'