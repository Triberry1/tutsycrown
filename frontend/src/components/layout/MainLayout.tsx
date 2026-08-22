import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}