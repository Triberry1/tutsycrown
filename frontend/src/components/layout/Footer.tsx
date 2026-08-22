export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">TUTSY CROWN</h3>
          <p className="text-gray-400 text-sm">Premium fashion for the modern individual.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/explore">All Products</a></li>
            <li><a href="/explore?category=rompers">Rompers</a></li>
            <li><a href="/explore?category=puffer">Puffer</a></li>
            <li><a href="/explore?category=jackets">Jackets</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">YouTube</a>
          </div>
        </div>
      </div>
      <div className="container border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Tutsy Crown. All rights reserved.
      </div>
    </footer>
  )
}