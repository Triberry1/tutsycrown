// apps/mobile/src/App.tsx
import { createApiClient, useApi, useAuth } from '@tutsy-crown/shared'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
const apiClient = createApiClient(process.env.API_URL!) // Your API URL

function App() {
  const { user, isAuthenticated } = useAuth(apiClient)
  const { products, cart, orders } = useApi(apiClient)

  // Use the same APIs as web
  const loadProducts = async () => {
    const response = await products.getProducts({ page: 1, limit: 20 })
    console.log(response.data)
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  )
}