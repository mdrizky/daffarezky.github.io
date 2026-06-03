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
  const isLoginPage = pathname?.includes('/admin/login')

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0A0A0F] dark:text-white transition-colors duration-300">
        {isLoginPage ? (
          <div className="min-h-screen">
            {children}
          </div>
        ) : (
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0A0A0F] md:ml-64 w-full">
              <div className="p-8 mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
