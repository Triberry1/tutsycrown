import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useApi } from '@tutsy-crown/shared'
import { useState } from 'react'
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore, useWishlistStore } from '../stores'
import { toast } from 'react-hot-toast'
import { formatCurrency, formatDate } from '@tutsy-crown/shared'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const api = useApi()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.products.getProductBySlug(slug!),
    enabled: !!slug,
  })

  const product = data?.data

  if (isLoading) return <div className="container py-12">Loading...</div>
  if (!product) return <div className="container py-12 text-center">Product not found</div>

  const isWishlisted = isInWishlist(product.id)
  const images = product.images || []
  const currentImage = images[currentImageIndex] || images[0]
  const variants = product.variants || []

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success('Added to cart')
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product)
      toast.success('Added to wishlist')
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={currentImage.altText || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-20 rounded border-2 flex-shrink-0 overflow-hidden ${idx === currentImageIndex ? 'border-accent' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-gold">
              <Star size={20} fill="currentColor" />
              <span className="ml-1 font-medium">{product.avgRating?.toFixed(1) || '4.5'}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">{product.reviews?.length || 0} reviews</span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="ml-3 text-lg text-gray-400 line-through">{formatCurrency(product.comparePrice)}</span>
            )}
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Select Variant</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`px-4 py-2 border rounded-md text-sm ${selectedVariant === variant.id ? 'border-accent bg-accent/10' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <span key={key}>{key}: {value}</span>
                    ))}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label className="font-medium block mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">{product.stock} in stock</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Add to Bag
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-4 rounded-full border transition ${isWishlisted ? 'bg-accent text-white border-accent' : 'border-gray-300 hover:border-accent'}`}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="font-medium">{review.user?.firstName} {review.user?.lastName}</span>
                  <span className="text-sm text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
                {review.title && <p className="font-medium mt-1">{review.title}</p>}
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}