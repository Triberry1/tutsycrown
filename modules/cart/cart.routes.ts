import { Router } from 'express'
import { CartController } from './cart.controller'
import { requireAuth } from '../../middleware/auth'
import { validate } from '../../middleware/validation'
import { addToCartSchema, updateCartItemSchema } from './cart.types'

const router = Router()

router.use(requireAuth)

router.get('/', CartController.getCart)
router.post('/items', validate(addToCartSchema), CartController.addToCart)
router.put('/items/:itemId', validate(updateCartItemSchema), CartController.updateCartItem)
router.delete('/items/:itemId', CartController.removeCartItem)
router.delete('/clear', CartController.clearCart)

export default router