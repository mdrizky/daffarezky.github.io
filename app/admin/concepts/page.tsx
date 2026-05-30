'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import type { Concept } from '@/types'

export default function AdminConcepts() {
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Concept>>({
    title_id: '',
    title_en: '',
    subtitle_id: '',
    subtitle_en: '',
    description_id: '',
    description_en: '',
    technology: [],
    status: 'Concept',
    featured: false,
    order_index: 0,
  })

  useEffect(() => {
    fetchConcepts()
  }, [])

  const fetchConcepts = async () => {
    try {
      const { data } = await supabase
        .from('concepts')
        .select('*')
        .order('order_index', { ascending: true })
      if (data) setConcepts(data)
    } catch (error) {
      console.error('Error fetching concepts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase
          .from('concepts')
          .update(formData)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('concepts').insert([formData])
        if (error) throw error
      }
      resetForm()
      fetchConcepts()
    } catch (error) {
      console.error('Error saving concept:', error)
    }
  }

  const handleEdit = (concept: Concept) => {
    setFormData(concept)
    setEditingId(concept.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus konsep ini?')) return
    try {
      const { error } = await supabase.from('concepts').delete().eq('id', id)
      if (error) throw error
      fetchConcepts()
    } catch (error) {
      console.error('Error deleting concept:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title_id: '',
      title_en: '',
      subtitle_id: '',
      subtitle_en: '',
      description_id: '',
      description_en: '',
      technology: [],
      status: 'Concept',
      featured: false,
      order_index: 0,
    })
    setEditingId(null)
    setIsEditing(false)
  }

  const handleTechnologyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const techArray = e.target.value.split(',').map(t => t.trim()).filter(t => t)
    setFormData({ ...formData, technology: techArray })
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Konsep</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#00FF88] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00CC6A] transition-colors flex items-center gap-2"
          >
            <FaPlus /> Tambah
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Judul (ID)</label>
                <input
                  type="text"
                  value={formData.title_id || ''}
                  onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Judul (EN)</label>
                <input
                  type="text"
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Subjudul (ID)</label>
                <input
                  type="text"
                  value={formData.subtitle_id || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_id: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Subjudul (EN)</label>
                <input
                  type="text"
                  value={formData.subtitle_en || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Teknologi (pisahkan dengan koma)</label>
              <input
                type="text"
                value={formData.technology?.join(', ') || ''}
                onChange={handleTechnologyChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                placeholder="ESP32, React, Node.js"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={formData.status || 'Concept'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                >
                  <option value="Concept">Concept</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Urutan</label>
                <input
                  type="number"
                  value={formData.order_index || 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Featured</label>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Deskripsi (ID)</label>
              <textarea
                value={formData.description_id || ''}
                onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Deskripsi (EN)</label>
              <textarea
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-[#00FF88] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00CC6A] transition-colors flex items-center gap-2"
              >
                <FaSave /> Simpan
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {concepts.map((concept) => (
          <div key={concept.id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white">{concept.title_id}</h3>
              <p className="text-sm text-gray-400">{concept.subtitle_id}</p>
              <p className="text-xs text-gray-500">{concept.status} • {concept.featured ? 'Featured' : 'Not Featured'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(concept)}
                className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(concept.id)}
                className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
