'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import type { Experience } from '@/types'

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Experience>>({
    title_id: '',
    title_en: '',
    organization: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description_id: '',
    description_en: '',
    category: 'Leadership',
    order_index: 0,
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const { data } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true })
      if (data) setExperiences(data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase
          .from('experience')
          .update(formData)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('experience').insert([formData])
        if (error) throw error
      }
      resetForm()
      fetchExperiences()
    } catch (error) {
      console.error('Error saving experience:', error)
    }
  }

  const handleEdit = (exp: Experience) => {
    setFormData(exp)
    setEditingId(exp.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengalaman ini?')) return
    try {
      const { error } = await supabase.from('experience').delete().eq('id', id)
      if (error) throw error
      fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title_id: '',
      title_en: '',
      organization: '',
      role: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description_id: '',
      description_en: '',
      category: 'Leadership',
      order_index: 0,
    })
    setEditingId(null)
    setIsEditing(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengalaman</h1>
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
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Organisasi</label>
                <input
                  type="text"
                  value={formData.organization || ''}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                <input
                  type="text"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  placeholder="Jan 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
                <input
                  type="text"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  placeholder="Des 2024"
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Kategori</label>
              <select
                value={formData.category || 'Leadership'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              >
                <option value="Leadership">Leadership</option>
                <option value="Religious">Religious</option>
                <option value="Training">Training</option>
                <option value="Achievement">Achievement</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_current || false}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Masih Berjalan</label>
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

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Urutan</label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
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
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white">{exp.title_id}</h3>
              <p className="text-sm text-gray-400">{exp.organization} • {exp.role}</p>
              <p className="text-xs text-gray-500">{exp.start_date} - {exp.is_current ? 'Sekarang' : exp.end_date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
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
