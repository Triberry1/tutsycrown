import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useApi } from '@tutsy-crown/shared'
import ProductCard from '../components/products/productCard'
import { Filter, ChevronDown } from 'lucide-react'

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const api = useApi()
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') || 'createdAt') as 'price' | 'name' | 'createdAt' | 'rating',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.products.getProducts(filters),
  })

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
    if (filters.page > 1) params.set('page', String(filters.page))
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as 'price' | 'name' | 'createdAt' | 'rating',
      sortOrder: (sortOrder || 'desc') as 'asc' | 'desc',
    }))
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Filter size={18} /> Filters
            </h3>
            {/* Category filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                className="w-full border rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
              >
                <option value="">All Categories</option>
                {/* Add dynamic categories */}
              </select>
            </div>
            {/* Price range */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
                  className="w-1/2 border rounded px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
                  className="w-1/2 border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Explore</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded px-3 py-1 text-sm focus:ring-accent focus:border-accent"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {data?.data?.data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {data?.data?.meta && (
                <div className="flex justify-center mt-8 gap-2">
                  {[...Array(data.data.meta.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                      className={`px-4 py-2 rounded ${filters.page === i + 1 ? 'bg-accent text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}