'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import type { Achievement } from '@/types'

const categoryColors: Record<string, string> = {
  Competition: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  Certification: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  Exhibition: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Hackathon: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  Award: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
  Course: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
  Other: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300',
}

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) setAchievements(data)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pencapaian ini?')) return

    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id)
      if (error) throw error
      setAchievements(achievements.filter((a) => a.id !== id))
    } catch (error) {
      console.error('Error deleting achievement:', error)
      alert('Gagal menghapus data')
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Achievements</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola prestasi, sertifikasi, dan penghargaan.</p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          <FaPlus /> Tambah Achievement
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold text-sm">Pencapaian</th>
                <th className="p-4 font-semibold text-sm">Kategori</th>
                <th className="p-4 font-semibold text-sm">Tahun</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {achievements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl">🏆</div>
                      <p>Belum ada achievement. Silakan tambah data baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                achievements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3 font-bold text-gray-900 dark:text-white max-w-[260px]">
                        <span className="truncate">{item.title_id}</span>
                        {item.featured && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-full">FEATURED</span>
                        )}
                      </div>
                      {item.organization && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[260px]">{item.organization}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border border-gray-200 dark:border-white/5 ${categoryColors[item.category] || categoryColors.Other}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {item.achieved_on ? item.achieved_on.slice(0, 4) : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        item.is_published === false
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                      }`}>
                        {item.is_published === false ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/achievements/${item.id}`}
                          className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/20"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
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