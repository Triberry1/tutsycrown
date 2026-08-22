import { useCartStore } from '../stores'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@tutsy-crown/shared'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300" />
        <h2 className="text-xl font-semibold mt-4">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Browse our collection and add items you love.</p>
        <Link to="/explore" className="mt-6 inline-block bg-accent text-white px-6 py-3 rounded-full hover:bg-opacity-90">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex gap-4">
              <img
                src={item.images?.[0]?.url || '/placeholder.png'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 w-full bg-accent text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition block text-center"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-center text-sm text-gray-500 hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}