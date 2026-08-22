import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react'
import { useCartStore, useWishlistStore } from '../../stores'

export default function MobileNav() {
  const location = useLocation()
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-accent' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/explore" className={`flex flex-col items-center ${isActive('/explore') ? 'text-accent' : 'text-gray-500'}`}>
          <Search size={24} />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link to="/favorites" className={`flex flex-col items-center relative ${isActive('/favorites') ? 'text-accent' : 'text-gray-500'}`}>
          <Heart size={24} />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
          <span className="text-xs mt-1">Wishlist</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center relative ${isActive('/cart') ? 'text-accent' : 'text-gray-500'}`}>
          <ShoppingBag size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-accent' : 'text-gray-500'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )
}