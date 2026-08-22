import { Request, Response, NextFunction } from 'express'
import { UserService } from './user.service'
import { AuthRequest } from '../../middleware/auth'

export class UserController {
  static async listUsers(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.listUsers()
      res.json({ success: true, data: users })
    } catch (error) {
      next(error)
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.userId!)
      res.json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.userId!, req.body)
      res.json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }

  static async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await UserService.getUserAddresses(req.userId!)
      res.json({ success: true, data: addresses })
    } catch (error) {
      next(error)
    }
  }

  static async addAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await UserService.addAddress(req.userId!, req.body)
      res.status(201).json({ success: true, data: address })
    } catch (error) {
      next(error)
    }
  }

  static async syncClerkWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body
      const { id: clerkUserId, email_addresses, first_name, last_name } = data

      if (!clerkUserId || !email_addresses || email_addresses.length === 0) {
        throw new Error('Invalid webhook data')
      }

      const email = email_addresses[0].email_address
      const user = await UserService.syncClerkUser(clerkUserId, email, {
        firstName: first_name,
        lastName: last_name,
      })

      res.json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }
}