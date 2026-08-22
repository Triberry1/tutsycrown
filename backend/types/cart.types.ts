import { Product, ProductVariant } from './product.types'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  variantId?: string | null
  quantity: number
  price: number
  product: Product & {
    images?: { url: string }[]
  }
  variant?: ProductVariant | null
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  expiresAt?: string | null
  subtotal: number
  totalItems: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartInput {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemInput {
  quantity: number
}

export interface CartResponse {
  success: boolean
  data: Cart
}