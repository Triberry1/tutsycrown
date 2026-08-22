import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@tutsy-crown/shared'

interface CompareState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInCompare: (productId: string) => boolean
  clearCompare: () => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get()
        if (items.length >= 4) {
          // Max 4 items for compare
          alert('You can compare up to 4 products.')
          return
        }
        if (!items.find(item => item.id === product.id)) {
          set({ items: [...items, product] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) })
      },
      isInCompare: (productId) => {
        return get().items.some(item => item.id === productId)
      },
      clearCompare: () => set({ items: [] })
    }),
    { name: 'compare-storage' }
  )
)