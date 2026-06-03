'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const isLoginPage = pathname === '/admin/login' || pathname?.includes('/admin/login')

  useEffect(() => {
    // If we are on the login page, we don't need to check auth
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const checkAuth = () => {
      try {
        const isAuthenticated = localStorage.getItem('admin_pin_auth') === 'true'
        
        if (!isAuthenticated) {
          router.replace('/admin/login')
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('AdminGuard error:', error)
        router.replace('/admin/login')
      }
    }

    checkAuth()
  }, [router, pathname, isLoginPage])

  // Don't show loading spinner on login page
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0F] flex items-center justify-center transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
