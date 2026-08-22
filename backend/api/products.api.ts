import { ApiClient } from './client'
import { ApiResponse, PaginatedResponse } from '../types/api.types'
import { Product, Category, ProductFilters, CreateProductInput, UpdateProductInput } from '../types/product.types'

export class ProductsApi {
  constructor(private client: ApiClient) {}

  async getProducts(filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.client.get('/products', filters)
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.client.get(`/products/${id}`)
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    return this.client.get(`/products/slug/${slug}`)
  }

  async getRelatedProducts(id: string, limit = 4): Promise<ApiResponse<Product[]>> {
    return this.client.get(`/products/${id}/related`, { limit })
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.client.get('/categories')
  }

  async createProduct(data: CreateProductInput): Promise<ApiResponse<Product>> {
    return this.client.post('/products', data)
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<ApiResponse<Product>> {
    return this.client.put(`/products/${id}`, data)
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/products/${id}`)
  }
}