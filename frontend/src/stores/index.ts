import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@tutsy-crown/shared'

interface CartItem extends Product {
	quantity: number
}

interface CartState {
	items: CartItem[]
	addItem: (product: Product, quantity?: number) => void
	removeItem: (productId: string) => void
	updateQuantity: (productId: string, quantity: number) => void
	clearCart: () => void
	totalItems: number
	totalPrice: number
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],
			addItem: (product, quantity = 1) => {
				const items = get().items
				const existing = items.find(item => item.id === product.id)
				set({ items: existing
					? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
					: [...items, { ...product, quantity }] })
			},
			removeItem: productId => set({ items: get().items.filter(item => item.id !== productId) }),
			updateQuantity: (productId, quantity) => quantity <= 0
				? get().removeItem(productId)
				: set({ items: get().items.map(item => item.id === productId ? { ...item, quantity } : item) }),
			clearCart: () => set({ items: [] }),
			get totalItems() { return get().items.reduce((sum, item) => sum + item.quantity, 0) },
			get totalPrice() { return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0) },
		}),
		{ name: 'cart-storage' },
	),
)
export { useWishlistStore } from './WishlistStore'
export { useCompareStore } from './compareStore'