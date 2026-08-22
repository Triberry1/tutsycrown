import { Router } from 'express'
import { PaymentController } from './payment.controller'
import { requireAuth } from '../../middleware/auth'
import { validate } from '../../middleware/validation'
import { initializePaymentSchema } from './payment.types'

const router = Router()

router.post('/initialize', requireAuth, validate(initializePaymentSchema), PaymentController.initializePayment)
router.get('/verify', PaymentController.verifyPayment)

export default router