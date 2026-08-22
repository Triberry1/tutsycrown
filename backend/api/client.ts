import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, ApiError } from '../types/api.types'

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          const apiError: ApiError = {
            success: false,
            error: error.response.data?.error || error.message || 'An error occurred',
          }
          return Promise.reject(apiError)
        } else if (error.request) {
          // Request made but no response
          return Promise.reject({
            success: false,
            error: 'Network error - no response from server',
          })
        } else {
          // Something else
          return Promise.reject({
            success: false,
            error: error.message || 'An error occurred',
          })
        }
      }
    )
  }

  private getAuthToken(): string | null {
    // This will be overridden by platform-specific storage
    return localStorage?.getItem('auth_token') || null
  }

  // Set auth token (platform-specific)
  setAuthToken(token: string | null) {
    if (typeof window !== 'undefined' && localStorage) {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  // Generic request method
  async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.request(config)
    return response.data
  }

  // Convenience methods
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'GET',
      params,
    })
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'POST',
      data,
    })
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'PUT',
      data,
    })
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'PATCH',
      data,
    })
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'DELETE',
    })
  }
}

// Create singleton instance
let apiClientInstance: ApiClient | null = null

export function createApiClient(baseURL: string): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(baseURL)
  }
  return apiClientInstance
}

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call createApiClient first.')
  }
  return apiClientInstance
}

export { ApiClient }