import { useQuery } from '@tanstack/react-query'
import { useApi } from '@tutsy-crown/shared'
import { formatCurrency, formatDate, ORDER_STATUS } from '@tutsy-crown/shared'
import { Package } from 'lucide-react'

export default function OrdersPage() {
  const api = useApi()
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.orders.getOrders(1, 20),
  })

  if (isLoading) return <div className="container py-8">Loading...</div>

  const orders = data?.data?.data || []

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300" />
          <p className="mt-4 text-gray-500">No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                  <p className="mt-1 font-bold">{formatCurrency(order.total)}</p>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-500">{order.items.length} items</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item.id} className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {item.product.name} × {item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-sm text-gray-400">+{order.items.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}