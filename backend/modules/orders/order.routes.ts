import { Router } from 'express'
import { OrderController } from './order.controller'
import { requireAuth } from '../../middleware/auth'
import { requireAdmin } from '../../middleware/authorization'
import { validate } from '../../middleware/validation'
import { createOrderSchema } from './order.types'

const router = Router()

router.use(requireAuth)

router.post('/', validate(createOrderSchema), OrderController.createOrder)
router.get('/', OrderController.getUserOrders)
router.get('/:id', OrderController.getOrderById)
router.put('/:id/status', requireAdmin, OrderController.updateOrderStatus)

export default router