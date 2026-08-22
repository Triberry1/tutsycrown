import { ApiClient } from './client'
import { ApiResponse, PaginatedResponse } from '../types/api.types'
import { Order, CreateOrderInput, OrderStatus } from '../types/order.types'

export class OrdersApi {
  constructor(private client: ApiClient) {}

  async createOrder(data: CreateOrderInput): Promise<ApiResponse<Order>> {
    return this.client.post('/orders', data)
  }

  async getOrders(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return this.client.get('/orders', { page, limit })
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.client.get(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    return this.client.put(`/orders/${id}/status`, { status })
  }
}