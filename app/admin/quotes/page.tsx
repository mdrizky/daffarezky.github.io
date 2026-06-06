"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaQuoteLeft } from "react-icons/fa"
import { Quote } from "@/types"

export default function AdminQuotes() {
  const [items, setItems] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Partial<Quote> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
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
          .from('quotes')
          .update(editingItem)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('quotes')
          .insert([editingItem])
        if (error) throw error
      }
      setEditingItem(null)
      fetchItems()
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id)
      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Error deleting quote:', error)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kata-kata & Quotes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quotes favorit atau kata-kata motivasi pribadi.</p>
        </div>
        <button
          onClick={() => setEditingItem({ text_id: '', text_en: '', author: '', is_personal: false, sort_order: items.length + 1 })}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          <FaPlus /> Tambah Quote
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"><FaEdit /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash /></button>
            </div>
            <FaQuoteLeft className="text-3xl text-blue-500/20 mb-4" />
            <div className="space-y-4">
              <p className="text-xl font-medium italic text-gray-900 dark:text-white">"{item.text_id}"</p>
              <p className="text-lg text-gray-500 dark:text-gray-400">"{item.text_en}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="font-bold text-gray-700 dark:text-gray-300">— {item.author || 'Anonim'}</span>
                {item.is_personal && <span className="text-xs bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 px-2 py-1 rounded-full font-bold">Personal Quote</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem.id ? 'Edit Quote' : 'Tambah Quote'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Teks Quote (ID)</label>
                <textarea rows={3} required value={editingItem.text_id} onChange={e => setEditingItem({...editingItem, text_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quote Text (EN)</label>
                <textarea rows={3} required value={editingItem.text_en} onChange={e => setEditingItem({...editingItem, text_en: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Penulis</label>
                  <input type="text" value={editingItem.author} onChange={e => setEditingItem({...editingItem, author: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Urutan</label>
                  <input type="number" value={editingItem.sort_order} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_personal" checked={editingItem.is_personal} onChange={e => setEditingItem({...editingItem, is_personal: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                <label htmlFor="is_personal" className="text-sm font-semibold cursor-pointer">Quote Pribadi</label>
              </div>

              <button type="submit" disabled={saving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                Simpan Quote
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
