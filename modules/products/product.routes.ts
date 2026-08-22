import { Router } from 'express'
import { ProductController } from './product.controller'
import { requireAuth } from '../../middleware/auth'
import { requireAdmin } from '../../middleware/authorization'
import { validate } from '../../middleware/validation'
import { productSchema, updateProductSchema } from './product.types'

const router = Router()

// Public routes
router.get('/', ProductController.getAllProducts)
router.get('/:id', ProductController.getProductById)
router.get('/slug/:slug', ProductController.getProductBySlug)
router.get('/:id/related', ProductController.getRelatedProducts)

// Admin routes
router.post('/', requireAuth, requireAdmin, validate(productSchema), ProductController.createProduct)
router.put('/:id', requireAuth, requireAdmin, validate(updateProductSchema), ProductController.updateProduct)
router.delete('/:id', requireAuth, requireAdmin, ProductController.deleteProduct)

export default router