'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

// Lazy load non-critical components — they don't need to block initial render
const FloatingWA = dynamic(() => import('@/components/FloatingWA'), {
  ssr: false,
})

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
)

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWA />}
      {/* Vercel Analytics — loads after page is interactive */}
      <Analytics />
    </>
  )
}
