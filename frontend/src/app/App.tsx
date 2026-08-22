import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignedIn } from '@clerk/clerk-react'
import { Suspense, lazy } from 'react'

// Layout
import MainLayout from '../components/layout/MainLayout'

// Pages (lazy-loaded)
const HomePage = lazy(() => import('../pages/home'))
const ExplorePage = lazy(() => import('../pages/explore'))
const ProductDetailPage = lazy(() => import('../pages/ProductDetail'))
const FavoritesPage = lazy(() => import('../pages/Favourites'))
const ProfilePage = lazy(() => import('../pages/Profile'))
const OrdersPage = lazy(() => import('../pages/orders'))
const CartPage = lazy(() => import('../pages/Cart'))
const CheckoutPage = lazy(() => import('../pages/Checkout'))
function LoginPage() {
  return (
    <div className="min-h-[80vh] flex justify-center items-center py-12">
      <SignIn routing="path" path="/login" signUpUrl="/signup" afterSignInUrl="/" afterSignUpUrl="/" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected */}
            <Route path="/favorites" element={
              <SignedIn><FavoritesPage /></SignedIn>
            } />
            <Route path="/profile" element={
              <SignedIn><ProfilePage /></SignedIn>
            } />
            <Route path="/orders" element={
              <SignedIn><OrdersPage /></SignedIn>
            } />
            <Route path="/cart" element={
              <SignedIn><CartPage /></SignedIn>
            } />
            <Route path="/checkout" element={
              <SignedIn><CheckoutPage /></SignedIn>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App