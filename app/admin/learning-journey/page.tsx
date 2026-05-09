'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaBriefcase } from 'react-icons/fa'
import { useLanguage } from '@/components/LanguageProvider'

interface LearningJourney {
  id: string
  year: string
  title_id: string
  title_en: string
  description_id: string
  description_en: string
  created_at: string
}

export default function AdminLearningJourney() {
  const [items, setItems] = useState<LearningJourney[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LearningJourney | null>(null)
  const [formData, setFormData] = useState({
    year: '',
    title_id: '',
    title_en: '',
    description_id: '',
    description_en: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_journey')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error
      if (data) setItems(data)
    } catch (error) {
      console.error('Error fetching learning journey:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return

    try {
      const { error } = await supabase.from('learning_journey').delete().eq('id', id)
      if (error) throw error
      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Gagal menghapus item')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('learning_journey')
          .update(formData)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('learning_journey')
          .insert([formData])
        if (error) throw error
      }

      setIsModalOpen(false)
      setEditingItem(null)
      setFormData({ year: '', title_id: '', title_en: '', description_id: '', description_en: '' })
      fetchItems()
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (item: LearningJourney) => {
    setEditingItem(item)
    setFormData({
      year: item.year,
      title_id: item.title_id,
      title_en: item.title_en,
      description_id: item.description_id,
      description_en: item.description_en
    })
    setIsModalOpen(true)
  }

  if (loading && items.length === 0) {
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
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Perjalanan Belajar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola riwayat pembelajaran dan milestone karir Anda.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null)
            setFormData({ year: '', title_id: '', title_en: '', description_id: '', description_en: '' })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          <FaPlus /> Tambah Item
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold text-sm w-24">Tahun</th>
                <th className="p-4 font-semibold text-sm">Judul & Deskripsi</th>
                <th className="p-4 font-semibold text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl"><FaBriefcase /></div>
                      <p>Belum ada data perjalanan belajar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{item.year}</td>
                    <td className="p-4">
                      <div className="mb-2">
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded uppercase font-bold">ID</span>
                          {item.title_id}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description_id}</p>
                      </div>
                      <div className="opacity-60">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold">EN</span>
                          {item.title_en}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.description_en}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEdit(item)}
                          className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0F0F1A] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Item' : 'Tambah Item Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tahun</label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="Contoh: 2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded uppercase font-bold">Indonesia</span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul (ID)</label>
                    <input
                      type="text"
                      required
                      value={formData.title_id}
                      onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi (ID)</label>
                    <textarea
                      required
                      value={formData.description_id}
                      onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all h-24 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold">English</span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title (EN)</label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description (EN)</label>
                    <textarea
                      required
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all h-24 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
