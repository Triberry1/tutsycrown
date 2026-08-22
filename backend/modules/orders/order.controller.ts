import { Response, NextFunction } from 'express'
import { OrderService } from './order.service'
import { AuthRequest } from '../../middleware/auth'

export class OrderController {
  static async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(req.userId!, req.body)
      res.status(201).json({ success: true, data: order })
    } catch (error) {
      next(error)
    }
  }

  static async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(String(req.params.id), req.userId!)
      res.json({ success: true, data: order })
    } catch (error) {
      next(error)
    }
  }

  static async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const orders = await OrderService.getUserOrders(req.userId!, page, limit)
      res.json({ success: true, ...orders })
    } catch (error) {
      next(error)
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.updateOrderStatus(
        String(req.params.id),
        req.body.status,
        req.userId!
      )
      res.json({ success: true, data: order })
    } catch (error) {
      next(error)
    }
  }
}