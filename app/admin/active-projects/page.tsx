"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaHammer, FaCheckSquare } from "react-icons/fa"
import { ActiveProject } from "@/types"

export default function AdminActiveProjects() {
  const [items, setItems] = useState<ActiveProject[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Partial<ActiveProject> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('active_projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching active projects:', error)
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
        const { error } = await supabase
          .from('active_projects')
          .update(editingItem)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('active_projects')
          .insert([editingItem])
        if (error) throw error
      }
      setEditingItem(null)
      fetchItems()
    } catch (error) {
      console.error('Error saving active project:', error)
      alert('Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return
    try {
      const { error } = await supabase.from('active_projects').delete().eq('id', id)
      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Error deleting active project:', error)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proyek Aktif (Being Built)</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar karya yang sedang dibangun dan detail fiturnya.</p>
        </div>
        <button
          onClick={() => setEditingItem({ name_id: '', name_en: '', description_id: '', description_en: '', status_id: 'Sedang Dikerjakan', status_en: 'In Progress', progress_percent: 0, features_id: [], features_en: [], sort_order: items.length + 1 })}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          <FaPlus /> Tambah Proyek Aktif
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500 text-xl">
                  <FaHammer />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name_id}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 rounded-full">{item.status_id}</span>
                    <span className="text-xs text-gray-400">Est: {item.estimated_completion || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"><FaEdit /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash /></button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-500">PROGRES PENGERJAAN</span>
                <span className="text-blue-500">{item.progress_percent}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${item.progress_percent}%` }} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaCheckSquare className="text-blue-500" /> Fitur (ID)</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {item.features_id?.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaCheckSquare className="text-purple-500" /> Features (EN)</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {item.features_en?.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem.id ? 'Edit Proyek Aktif' : 'Tambah Proyek Aktif'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Nama Proyek (ID)</label>
                  <input type="text" required value={editingItem.name_id} onChange={e => setEditingItem({...editingItem, name_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Project Name (EN)</label>
                  <input type="text" required value={editingItem.name_en} onChange={e => setEditingItem({...editingItem, name_en: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Status (ID)</label>
                  <input type="text" value={editingItem.status_id} onChange={e => setEditingItem({...editingItem, status_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Status (EN)</label>
                  <input type="text" value={editingItem.status_en} onChange={e => setEditingItem({...editingItem, status_en: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Progres (%)</label>
                  <input type="number" min="0" max="100" value={editingItem.progress_percent} onChange={e => setEditingItem({...editingItem, progress_percent: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Fitur Sedang Dikerjakan (ID) - Pisahkan Koma</label>
                  <textarea rows={3} value={editingItem.features_id?.join(', ')} onChange={e => setEditingItem({...editingItem, features_id: e.target.value.split(',').map(s => s.trim())})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Features Being Built (EN) - Pisahkan Koma</label>
                  <textarea rows={3} value={editingItem.features_en?.join(', ')} onChange={e => setEditingItem({...editingItem, features_en: e.target.value.split(',').map(s => s.trim())})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Estimasi Selesai</label>
                  <input type="text" value={editingItem.estimated_completion} onChange={e => setEditingItem({...editingItem, estimated_completion: e.target.value})} placeholder="Contoh: Akhir 2024" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Urutan</label>
                  <input type="number" value={editingItem.sort_order} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                Simpan Proyek Aktif
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
