import { Router } from 'express'
import { UserController } from './user.controller'
import { requireAuth } from '../../middleware/auth'
import { requireAdmin } from '../../middleware/authorization'
import { validate } from '../../middleware/validation'
import { updateUserSchema } from './user.types'

const router = Router()

// Public webhook for Clerk sync (no auth)
router.post('/webhook', UserController.syncClerkWebhook)

// Protected routes
router.get('/me', requireAuth, UserController.getProfile)
router.put('/me', requireAuth, validate(updateUserSchema), UserController.updateProfile)
router.get('/me/addresses', requireAuth, UserController.getAddresses)
router.post('/me/addresses', requireAuth, UserController.addAddress)

// Admin routes
router.get('/admin/users', requireAuth, requireAdmin, UserController.listUsers)

export default router