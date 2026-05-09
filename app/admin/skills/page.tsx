'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { Skill } from '@/types'

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error
      if (data) setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus skill ini?')) return

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      setSkills(skills.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Error deleting skill:', error)
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
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Skills</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola keahlian dan teknologi yang Anda kuasai.</p>
        </div>
        <Link 
          href="/admin/skills/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          <FaPlus /> Tambah Skill
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold text-sm">Nama Skill</th>
                <th className="p-4 font-semibold text-sm">Kategori</th>
                <th className="p-4 font-semibold text-sm">Level</th>
                <th className="p-4 font-semibold text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl">⚡</div>
                      <p>Belum ada skill. Silakan tambah skill baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                skills.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3 font-bold text-gray-900 dark:text-white max-w-[200px]">
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-gray-200 dark:border-white/10">
                          {item.icon.trim().startsWith('<svg') || item.icon.trim().startsWith('<?xml') ? (
                            <div dangerouslySetInnerHTML={{ __html: item.icon }} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />
                          ) : (
                            <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                          )}
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 rounded-full border border-gray-200 dark:border-white/5">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        item.level === 'Advanced' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        item.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                      }`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/skills/${item.id}`}
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
