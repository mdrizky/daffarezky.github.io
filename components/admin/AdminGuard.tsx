'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // A simple PIN auth check via localStorage
    const isAuthenticated = localStorage.getItem('admin_pin_auth') === 'true'
    
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else if (isAuthenticated && pathname === '/admin/login') {
      router.push('/admin')
    } else {
      setLoading(false)
    }
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0F] flex items-center justify-center transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
