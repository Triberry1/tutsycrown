import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@tutsy-crown/shared'

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get()
        if (!items.find(item => item.id === product.id)) {
          set({ items: [...items, product] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) })
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId)
      }
    }),
    { name: 'wishlist-storage' }
  )
)