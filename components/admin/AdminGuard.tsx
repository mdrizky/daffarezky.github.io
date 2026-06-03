'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const isLoginPage = pathname?.includes('/admin/login')

  useEffect(() => {
    const checkAuth = () => {
      // If we are on the login page, just stop loading and don't redirect
      if (isLoginPage) {
        setLoading(false)
        return
      }

      try {
        const authStatus = localStorage.getItem('admin_pin_auth')
        const isAuthenticated = authStatus === 'true'
        
        console.log('AdminGuard Check:', { pathname, isAuthenticated, authStatus })
        
        if (!isAuthenticated) {
          console.log('Not authenticated, redirecting to login...')
          router.replace('/admin/login')
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('AdminGuard error:', error)
        router.replace('/admin/login')
      }
    }

    // Run check immediately
    checkAuth()
    
    // Also check on storage events (multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_pin_auth') checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', checkAuth)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', checkAuth)
    }
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
