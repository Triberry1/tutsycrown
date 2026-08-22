import { SignIn } from '@clerk/clerk-react'

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex justify-center items-center py-12">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  )
}