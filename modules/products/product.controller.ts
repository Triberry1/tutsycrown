import { Request, Response, NextFunction } from 'express'
import { ProductService } from './product.service'
import { AuthRequest } from '../../middleware/auth'

export class ProductController {
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const filters = {
        categoryId: req.query.categoryId as string,
        search: req.query.search as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      }

      const result = await ProductService.getAllProducts(page, limit, filters)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(String(req.params.id))
      res.json({ success: true, data: product })
    } catch (error) {
      next(error)
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlug(String(req.params.slug))
      res.json({ success: true, data: product })
    } catch (error) {
      next(error)
    }
  }

  static async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body)
      res.status(201).json({ success: true, data: product })
    } catch (error) {
      next(error)
    }
  }

  static async updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(String(req.params.id), req.body)
      res.json({ success: true, data: product })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(String(req.params.id))
      res.json({ success: true, message: 'Product deleted successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 4
      const products = await ProductService.getRelatedProducts(String(req.params.id), limit)
      res.json({ success: true, data: products })
    } catch (error) {
      next(error)
    }
  }
}