import { useAuth, useUser, SignOutButton } from '@clerk/clerk-react'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return <div>Please sign in</div>
  }

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={40} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <Link to="/orders" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
            <span>Orders</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link to="/profile/addresses" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
            <span>Addresses</span>
            <span className="text-gray-400">→</span>
          </Link>
          <div className="p-3">
            <SignOutButton>
              <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
                <LogOut size={18} /> Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  )
}