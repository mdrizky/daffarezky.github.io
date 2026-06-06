"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/database"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaRocket, FaCode, FaLightbulb, FaHandsHelping } from "react-icons/fa"
import { ReasonsToHire } from "@/types"

export default function AdminReasonsToHire() {
  const [items, setItems] = useState<ReasonsToHire[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Partial<ReasonsToHire> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await db.reasonsToHire.getAll()
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching reasons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    setSaving(true)

    try {
      if (editingItem.id) {
        const { error } = await db.reasonsToHire.update(editingItem.id, editingItem)
        if (error) throw error
      } else {
        const { error } = await db.reasonsToHire.create(editingItem)
        if (error) throw error
      }
      setEditingItem(null)
      fetchItems()
    } catch (error) {
      console.error('Error saving reason:', error)
      alert('Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return
    try {
      const { error } = await db.reasonsToHire.delete(id)
      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Error deleting reason:', error)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alasan Bekerja Sama</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Section "Mengapa Bekerja Sama dengan Saya?" di Beranda.</p>
        </div>
        <button
          onClick={() => setEditingItem({ title_id: '', title_en: '', description_id: '', description_en: '', icon: 'rocket', sort_order: items.length + 1 })}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          <FaPlus /> Tambah Alasan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500 text-xl">
                {item.icon === 'rocket' && <FaRocket />}
                {item.icon === 'code' && <FaCode />}
                {item.icon === 'lightbulb' && <FaLightbulb />}
                {item.icon === 'hands' && <FaHandsHelping />}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"><FaEdit /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title_id} / {item.title_en}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.description_id}</p>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem.id ? 'Edit Alasan' : 'Tambah Alasan'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Judul (ID)</label>
                  <input type="text" required value={editingItem.title_id} onChange={e => setEditingItem({...editingItem, title_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Title (EN)</label>
                  <input type="text" required value={editingItem.title_en} onChange={e => setEditingItem({...editingItem, title_en: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Deskripsi (ID)</label>
                  <textarea rows={3} value={editingItem.description_id} onChange={e => setEditingItem({...editingItem, description_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description (EN)</label>
                  <textarea rows={3} value={editingItem.description_en} onChange={e => setEditingItem({...editingItem, description_en: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Icon</label>
                  <select value={editingItem.icon} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                    <option value="rocket">Rocket (Fast Delivery)</option>
                    <option value="code">Code (Clean Code)</option>
                    <option value="lightbulb">Lightbulb (Problem Solver)</option>
                    <option value="hands">Hands (Komunikatif)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Urutan</label>
                  <input type="number" value={editingItem.sort_order} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
