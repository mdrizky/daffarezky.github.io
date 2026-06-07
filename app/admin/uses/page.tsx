'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaTrash, FaPlus, FaEdit, FaTools, FaSave, FaTimes } from 'react-icons/fa'

export default function UsesAdmin() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>({
    category: '',
    name: '',
    description_id: '',
    description_en: '',
    link: '',
    sort_order: 0
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('uses_items')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      console.error('Error fetching uses items:', error.message)
      alert('Gagal mengambil data uses items')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: any) => {
    setCurrentItem(item)
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setCurrentItem({
      category: '',
      name: '',
      description_id: '',
      description_en: '',
      link: '',
      sort_order: items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0
    })
    setIsEditing(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentItem.id) {
        const { error } = await supabase
          .from('uses_items')
          .update(currentItem)
          .eq('id', currentItem.id)
        if (error) throw error
        alert('Item berhasil diupdate')
      } else {
        const { error } = await supabase
          .from('uses_items')
          .insert([currentItem])
        if (error) throw error
        alert('Item berhasil ditambahkan')
      }
      setIsEditing(false)
      fetchItems()
    } catch (error: any) {
      alert('Gagal menyimpan data: ' + error.message)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return

    try {
      const { error } = await supabase
        .from('uses_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setItems(items.filter(item => item.id !== id))
      alert('Item dihapus')
    } catch (error: any) {
      alert('Gagal menghapus item')
    }
  }

  if (loading && !isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white flex items-center gap-3">
            <FaTools className="text-blue-500" /> Kelola Uses Items
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar hardware, software, atau tools yang Anda gunakan.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
          >
            <FaPlus /> Tambah Baru
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            {currentItem.id ? 'Edit Item' : 'Tambah Item Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Tool/Item</label>
                <input
                  type="text"
                  required
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Contoh: VS Code"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                <input
                  type="text"
                  required
                  value={currentItem.category}
                  onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Contoh: Software"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (ID)</label>
              <textarea
                value={currentItem.description_id}
                onChange={(e) => setCurrentItem({ ...currentItem, description_id: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                rows={2}
                placeholder="Deskripsi dalam Bahasa Indonesia"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (EN)</label>
              <textarea
                value={currentItem.description_en}
                onChange={(e) => setCurrentItem({ ...currentItem, description_en: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                rows={2}
                placeholder="Description in English"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link (Opsional)</label>
                <input
                  type="url"
                  value={currentItem.link || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, link: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Urutan (Sort Order)</label>
                <input
                  type="number"
                  value={currentItem.sort_order}
                  onChange={(e) => setCurrentItem({ ...currentItem, sort_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
              >
                <FaSave /> Simpan
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-bottom border-gray-200 dark:border-white/10">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 w-16">No.</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Nama / Kategori</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Deskripsi</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Belum ada data.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-400">{item.sort_order}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-xs px-2 py-0.5 inline-block bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded mt-1">
                          {item.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        <p className="line-clamp-2">{item.description_id}</p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
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
      )}
    </div>
  )
}
