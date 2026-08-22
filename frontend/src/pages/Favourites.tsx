import { useWishlistStore } from '../stores'
import ProductCard from '../components/products/productCard'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const { items } = useWishlistStore()

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300" />
          <p className="mt-4 text-gray-500">No favorites yet. Start saving your favorite items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}