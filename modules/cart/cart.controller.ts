import { Response, NextFunction } from 'express'
import { CartService } from './cart.service'
import { AuthRequest } from '../../middleware/auth'

export class CartController {
  static async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.userId!)
      res.json({ success: true, data: cart })
    } catch (error) {
      next(error)
    }
  }

  static async addToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const item = await CartService.addToCart(req.userId!, req.body)
      res.status(201).json({ success: true, data: item })
    } catch (error) {
      next(error)
    }
  }

  static async updateCartItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const item = await CartService.updateCartItem(req.userId!, String(req.params.itemId), req.body)
      res.json({ success: true, data: item })
    } catch (error) {
      next(error)
    }
  }

  static async removeCartItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await CartService.removeCartItem(req.userId!, String(req.params.itemId))
      res.json({ success: true, message: 'Item removed from cart' })
    } catch (error) {
      next(error)
    }
  }

  static async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await CartService.clearCart(req.userId!)
      res.json({ success: true, message: 'Cart cleared' })
    } catch (error) {
      next(error)
    }
  }
}