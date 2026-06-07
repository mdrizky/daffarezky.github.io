'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaTrash, FaEnvelope, FaUserCheck, FaUserSlash } from 'react-icons/fa'

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubscribers(data || [])
    } catch (error: any) {
      console.error('Error fetching subscribers:', error.message)
      alert('Gagal mengambil data subscriber')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      setSubscribers(subscribers.map(sub => 
        sub.id === id ? { ...sub, is_active: !currentStatus } : sub
      ))
      alert(currentStatus ? 'Subscriber dinonaktifkan' : 'Subscriber diaktifkan')
    } catch (error: any) {
      alert('Gagal mengubah status subscriber')
    }
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus subscriber ini?')) return

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setSubscribers(subscribers.filter(sub => sub.id !== id))
      alert('Subscriber dihapus')
    } catch (error: any) {
      alert('Gagal menghapus subscriber')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white flex items-center gap-3">
          <FaEnvelope className="text-blue-500" /> Newsletter Subscribers
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar email yang berlangganan newsletter Anda.</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-bottom border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Tanggal Daftar</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Belum ada subscriber.</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {sub.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                          <FaUserCheck size={10} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400">
                          <FaUserSlash size={10} /> Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(sub.id, sub.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          sub.is_active 
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400'
                        }`}
                        title={sub.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {sub.is_active ? <FaUserSlash /> : <FaUserCheck />}
                      </button>
                      <button
                        onClick={() => deleteSubscriber(sub.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
