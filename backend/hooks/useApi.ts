import { useMemo } from 'react'
import { ApiClient, getApiClient } from '../api/client'
import { UsersApi } from '../api/users.api'
import { ProductsApi } from '../api/products.api'
import { CartApi } from '../api/cart.api'
import { OrdersApi } from '../api/orders.api'
import { PaymentsApi } from '../api/payments.api'

export function useApi(apiClient: ApiClient = getApiClient()) {
  return useMemo(() => ({
    users: new UsersApi(apiClient),
    products: new ProductsApi(apiClient),
    cart: new CartApi(apiClient),
    orders: new OrdersApi(apiClient),
    payments: new PaymentsApi(apiClient),
  }), [apiClient])
}