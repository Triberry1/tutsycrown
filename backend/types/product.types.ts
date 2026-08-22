export interface ProductImage {
  id: string
  productId: string
  url: string
  publicId: string
  altText?: string | null
  isPrimary: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  attributes: Record<string, string>
  sku?: string | null
  price?: number | null
  stock: number
  imageId?: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductReview {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string | null
  comment?: string | null
  images?: string[] | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  user?: {
    firstName?: string | null
    lastName?: string | null
  }
}

export interface ProductCollection {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number | null
  costPrice?: number | null
  sku?: string | null
  barcode?: string | null
  isActive: boolean
  isDigital: boolean
  weight?: number | null
  dimensions?: any
  stock: number
  lowStockThreshold: number
  categoryId?: string | null
  category?: Category | null
  vendorId?: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  collections: ProductCollection[]
  reviews: ProductReview[]
  avgRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  parent?: Category | null
  children: Category[]
  products: Product[]
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'name' | 'createdAt' | 'rating'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CreateProductInput {
  name: string
  description: string
  price: number
  comparePrice?: number
  sku?: string
  stock?: number
  categoryId?: string
  images?: Omit<ProductImage, 'id' | 'productId' | 'createdAt' | 'updatedAt'>[]
  variants?: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>[]
  collections?: string[]
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}