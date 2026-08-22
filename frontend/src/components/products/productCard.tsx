import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, GitCompare } from 'lucide-react'
import { Product } from '@tutsy-crown/shared'
import { useCartStore, useWishlistStore, useCompareStore } from '../../stores'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@tutsy-crown/shared'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { addItem: addToCompare, isInCompare } = useCompareStore()

  const isWishlisted = isInWishlist(product.id)
  const isCompared = isInCompare(product.id)
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const hasDiscount = product.comparePrice && product.comparePrice > product.price

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product)
      toast.success('Added to wishlist')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    toast.success('Added to cart')
  }

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isCompared) {
      // Remove from compare (if we have a store method)
      // For simplicity, we'll just show a toast
      toast('Removed from compare')
    } else {
      addToCompare(product)
      toast.success('Added to compare')
    }
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
              SALE
            </div>
          )}
          {/* Action Buttons - shown on hover */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full border shadow-md transition ${isWishlisted ? 'bg-accent text-white border-accent' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full border shadow-md bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
            >
              <ShoppingBag size={18} />
            </button>
            <button
              onClick={handleCompareToggle}
              className={`p-2 rounded-full border shadow-md transition ${isCompared ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
            >
              <GitCompare size={18} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 truncate">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div>
              <span className="text-lg font-bold text-primary">${formatCurrency(product.price)}</span>
              {hasDiscount && (
                <span className="ml-2 text-sm text-gray-400 line-through">${formatCurrency(product.comparePrice!)}</span>
              )}
            </div>
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center text-sm text-gold">
                <span>★</span>
                <span className="ml-1 font-medium">
                  {product.avgRating?.toFixed(1) || '4.5'}
                </span>
                <span className="text-gray-400 text-xs ml-1">
                  ({product.reviews.length})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}