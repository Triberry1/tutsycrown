import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useCartStore, useWishlistStore } from '../../stores'
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()

  const debouncedSearch = useDebounce(searchQuery, 500)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
          TUTSY<span className="text-accent">CROWN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/explore" className="text-gray-700 hover:text-accent transition">Explore</Link>
          <Link to="/favorites" className="text-gray-700 hover:text-accent transition">Favorites</Link>
          {isSignedIn && (
            <Link to="/orders" className="text-gray-700 hover:text-accent transition">Orders</Link>
          )}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 flex-1 max-w-md mx-4">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full ml-2"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingBag size={24} className="text-gray-700 hover:text-accent transition" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link to="/favorites" className="relative hidden md:block">
            <Heart size={24} className="text-gray-700 hover:text-accent transition" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link to={isSignedIn ? "/profile" : "/login"} className="hidden md:block">
            <User size={24} className="text-gray-700 hover:text-accent transition" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 rounded-full px-4 py-2 mb-4">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full ml-2"
            />
          </form>
          <nav className="flex flex-col space-y-3">
            <Link to="/explore" className="text-gray-700 hover:text-accent" onClick={() => setIsMenuOpen(false)}>Explore</Link>
            <Link to="/favorites" className="text-gray-700 hover:text-accent" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
            {isSignedIn && (
              <Link to="/orders" className="text-gray-700 hover:text-accent" onClick={() => setIsMenuOpen(false)}>Orders</Link>
            )}
            <Link to={isSignedIn ? "/profile" : "/login"} className="text-gray-700 hover:text-accent" onClick={() => setIsMenuOpen(false)}>
              {isSignedIn ? 'Profile' : 'Login'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}