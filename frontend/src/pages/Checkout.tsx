import { Link } from 'react-router-dom'
import { useCartStore } from '../stores'
import { formatCurrency } from '@tutsy-crown/shared'

export default function CheckoutPage() {
  const { totalPrice, items } = useCartStore()

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {items.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link to="/explore" className="mt-4 inline-block rounded bg-accent px-6 py-3 text-white">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-8 max-w-lg rounded-lg border bg-white p-6">
          <p className="text-gray-600">Order total</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(totalPrice)}</p>
          <p className="mt-4 text-sm text-gray-500">Payment processing is ready to be connected.</p>
          <Link to="/cart" className="mt-6 inline-block text-accent hover:underline">Back to cart</Link>
        </div>
      )}
    </div>
  )
}
