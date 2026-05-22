'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      setLoading(false)
      return
    }

    // A simple PIN auth check via localStorage
    const isAuthenticated = localStorage.getItem('admin_pin_auth') === 'true'
    
    if (!isAuthenticated) {
      router.push('/admin/login')
    } else {
      setLoading(false)
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
