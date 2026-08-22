import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export type AddToCartValidation = z.infer<typeof addToCartSchema>
export type UpdateCartItemValidation = z.infer<typeof updateCartItemSchema>