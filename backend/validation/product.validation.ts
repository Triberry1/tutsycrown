import { z } from 'zod'

export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string(),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().default(0),
})

export const productVariantSchema = z.object({
  attributes: z.record(z.string(), z.string()),
  sku: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  stock: z.number().int().min(0).default(0),
  imageId: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  weight: z.number().positive().optional(),
  dimensions: z.record(z.string(), z.unknown()).optional(),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  images: z.array(productImageSchema).optional(),
  variants: z.array(productVariantSchema).optional(),
  collections: z.array(z.string()).optional(),
})

export const updateProductSchema = productSchema.partial()

export const productFiltersSchema = z.object({
  categoryId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export type ProductValidation = z.infer<typeof productSchema>
export type UpdateProductValidation = z.infer<typeof updateProductSchema>
export type ProductFiltersValidation = z.infer<typeof productFiltersSchema>