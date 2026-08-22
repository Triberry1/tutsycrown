import { ApiClient } from './client'
import { ApiResponse } from '../types/api.types'
import { User, Address, UpdateUserInput, CreateAddressInput } from '../types/user.types'

export class UsersApi {
  constructor(private client: ApiClient) {}

  async getProfile(): Promise<ApiResponse<User>> {
    return this.client.get('/users/me')
  }

  async updateProfile(data: UpdateUserInput): Promise<ApiResponse<User>> {
    return this.client.put('/users/me', data)
  }

  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return this.client.get('/users/me/addresses')
  }

  async addAddress(data: CreateAddressInput): Promise<ApiResponse<Address>> {
    return this.client.post('/users/me/addresses', data)
  }

  async updateAddress(id: string, data: Partial<CreateAddressInput>): Promise<ApiResponse<Address>> {
    return this.client.put(`/users/me/addresses/${id}`, data)
  }

  async deleteAddress(id: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/users/me/addresses/${id}`)
  }

  async setDefaultAddress(id: string): Promise<ApiResponse<void>> {
    return this.client.patch(`/users/me/addresses/${id}/default`)
  }
}