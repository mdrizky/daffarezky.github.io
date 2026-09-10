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
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const verify = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/admin/login')
          return
        }

        const { data: adminRow } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .maybeSingle()

        if (!adminRow) {
          await supabase.auth.signOut()
          router.replace('/admin/login?error=not_admin')
          return
        }

        setLoading(false)
      } catch {
        router.replace('/admin/login')
      }
    }

    verify()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.replace('/admin/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname, isLoginPage])

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
