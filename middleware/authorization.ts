import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../utils/errors'
import { AuthRequest } from './auth'

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new ForbiddenError('Authentication required')
    }

    if (!req.userRole || !roles.includes(req.userRole)) {
      throw new ForbiddenError('Insufficient permissions')
    }

    next()
  }
}

export const requireAdmin = requireRole(['ADMIN'])

export const requireVendor = requireRole(['VENDOR', 'ADMIN'])

export const requireCustomer = requireRole(['CUSTOMER', 'VENDOR', 'ADMIN'])

export const requireOwnership = (
  getResourceUserId: (req: Request) => Promise<string | null>
) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const resourceUserId = await getResourceUserId(req)
      
      if (!resourceUserId) {
        throw new ForbiddenError('Resource not found')
      }

      if (req.userRole === 'ADMIN') {
        return next()
      }

      if (req.userId !== resourceUserId) {
        throw new ForbiddenError('You do not own this resource')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}