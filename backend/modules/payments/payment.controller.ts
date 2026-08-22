import { Request, Response, NextFunction } from 'express'
import { PaymentService } from './payment.service'
import { AuthRequest } from '../../middleware/auth'

export class PaymentController {
  static async initializePayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.initializePayment(
        req.body.orderId,
        req.body.provider,
        req.userId!
      )
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.verifyPaystackPayment(req.query.reference as string)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}