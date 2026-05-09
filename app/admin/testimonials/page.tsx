'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaQuoteLeft } from 'react-icons/fa'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  role: string
  content_id: string
  content_en: string
  avatar_url: string | null
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content_id: '',
    content_en: '',
    avatar_url: ''
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) setTestimonials(data)
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id)
    setFormData(item)
  }

  const handleSave = async () => {
    try {
      if (editingId && editingId !== 'new') {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([formData])
        if (error) throw error
      }
      
      setEditingId(null)
      setFormData({ name: '', role: '', content_id: '', content_en: '', avatar_url: '' })
      fetchTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Gagal menyimpan testimoni')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (!error) fetchTestimonials()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-[var(--color-neon-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Testimoni</h1>
          <p className="text-gray-500 dark:text-gray-400">Apa kata klien tentang Anda</p>
        </div>
        <button
          onClick={() => setEditingId('new')}
          className="flex items-center gap-2 bg-gradient-neon text-[#0A0A0F] px-4 py-2 rounded-lg font-bold"
        >
          <FaPlus /> Tambah Testimoni
        </button>
      </div>

      {(editingId || editingId === 'new') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F0F17] p-8 rounded-2xl w-full max-w-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <FaQuoteLeft className="text-[var(--color-neon-green)]" />
              {editingId === 'new' ? 'Tambah Testimoni Baru' : 'Edit Testimoni'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Klien</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]/50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Jabatan / Role</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]/50"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Avatar URL</label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]/50"
                value={formData.avatar_url || ''}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Konten (ID)</label>
              <textarea
                rows={3}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]/50"
                value={formData.content_id}
                onChange={(e) => setFormData({ ...formData, content_id: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Content (EN)</label>
              <textarea
                rows={3}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]/50"
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-neon text-[#0A0A0F] px-8 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <FaSave /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div key={item.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl relative group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaQuoteLeft />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.role}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4 line-clamp-3">
              "{item.content_id}"
            </p>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
