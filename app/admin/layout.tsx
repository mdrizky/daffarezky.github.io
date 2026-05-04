'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import AdminGuard from '@/components/admin/AdminGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0A0A0F] text-white">
        {isLoginPage ? (
          children
        ) : (
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 md:ml-64 w-full overflow-x-hidden min-h-screen">
              {children}
            </main>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
