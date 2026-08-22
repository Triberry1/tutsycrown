import { ApiClient } from './client'
import { ApiResponse } from '../types/api.types'
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput } from '../types/cart.types'

export class CartApi {
  constructor(private client: ApiClient) {}

  async getCart(): Promise<ApiResponse<Cart>> {
    return this.client.get('/cart')
  }

  async addToCart(data: AddToCartInput): Promise<ApiResponse<CartItem>> {
    return this.client.post('/cart/items', data)
  }

  async updateCartItem(itemId: string, data: UpdateCartItemInput): Promise<ApiResponse<CartItem>> {
    return this.client.put(`/cart/items/${itemId}`, data)
  }

  async removeCartItem(itemId: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/cart/items/${itemId}`)
  }

  async clearCart(): Promise<ApiResponse<void>> {
    return this.client.delete('/cart/clear')
  }
}