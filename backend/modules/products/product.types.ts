import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  categoryId: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  variants: z.array(z.object({
    attributes: z.record(z.string(), z.string()),
    sku: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).default(0),
  })).optional(),
  collections: z.array(z.string()).optional(),
})

export const updateProductSchema = productSchema.partial()

export type CreateProductInput = z.infer<typeof productSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>