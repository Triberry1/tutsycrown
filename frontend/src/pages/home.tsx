import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useApi } from '@tutsy-crown/shared'
import ProductCard from '../components/products/productCard'
import CategoryCard from '../components/products/CategoryCard'
import HeroBanner from '../components/home/HeroBanner'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const api = useApi()

  const { data: popularProducts, isLoading } = useQuery({
    queryKey: ['products', 'popular'],
    queryFn: () => api.products.getProducts({ limit: 8, sortBy: 'rating' }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.products.getCategories(),
  })

  return (
    <div>
      <HeroBanner />

      {/* Categories */}
      <section className="container py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link to="/explore" className="text-accent flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.data?.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">Popular</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularProducts?.data?.data?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}