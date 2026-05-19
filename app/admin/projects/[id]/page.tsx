'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa'

export default function ProjectForm() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const id = params.id as string

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    description_id: '',
    description_en: '',
    image_url: '',
    tech_stack: '',
    demo_url: '',
    github_url: '',
    category: 'Website',
    featured: false,
  })

  useEffect(() => {
    if (!isNew) {
      fetchProject()
    }
  }, [isNew, id])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          title_id: data.title_id || '',
          title_en: data.title_en || '',
          description_id: data.description_id || '',
          description_en: data.description_en || '',
          image_url: data.image_url || '',
          tech_stack: data.tech_stack ? data.tech_stack.join(', ') : '',
          demo_url: data.demo_url || '',
          github_url: data.github_url || '',
          category: data.category || 'Website',
          featured: data.featured || false,
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Gagal mengambil data project')
      router.push('/admin/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengupload gambar')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const techStackArray = formData.tech_stack.split(',').map(item => item.trim()).filter(Boolean)
      
      const payload = {
        title_id: formData.title_id,
        title_en: formData.title_en,
        description_id: formData.description_id,
        description_en: formData.description_en,
        image_url: formData.image_url,
        tech_stack: techStackArray,
        demo_url: formData.demo_url,
        github_url: formData.github_url,
        category: formData.category,
        featured: formData.featured,
      }

      if (isNew) {
        const { error } = await supabase.from('projects').insert([payload])
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').update(payload).eq('id', id)
        if (error) throw error
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Gagal menyimpan project')
    } finally {
      setSaving(false)
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
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors shadow-sm">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">
            {isNew ? 'Tambah Project Baru' : 'Edit Project'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Lengkapi informasi proyek di bawah ini (Bilingual).</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
          
          {/* Judul Bilingual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Judul Project <span className="text-blue-500">(Indonesia) *</span>
              </label>
              <input
                type="text"
                name="title_id"
                required
                value={formData.title_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                placeholder="Judul dalam Bahasa Indonesia"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Project Title <span className="text-purple-500">(English) *</span>
              </label>
              <input
                type="text"
                name="title_en"
                required
                value={formData.title_en}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                placeholder="Title in English"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
                >
                  <option value="Website">Website</option>
                  <option value="Branding">Branding</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tech Stack</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={formData.tech_stack}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="React, Next.js, Tailwind (pisahkan koma)"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 dark:border-white/10 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 bg-white dark:bg-black/20 cursor-pointer transition-all"
                  />
                </div>
                <label htmlFor="featured" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer flex flex-col">
                  <span>Tampilkan di Beranda (Featured)</span>
                  <span className="text-xs font-normal text-gray-500">Project ini akan mendapatkan sorotan utama.</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Gambar Project</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative overflow-hidden">
                {formData.image_url ? (
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Ganti Gambar</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FaImage className="text-2xl" />
                    </div>
                    <p className="text-sm font-medium">Klik untuk upload gambar</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP hingga 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="image-upload"
                />
              </div>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm transition-all"
                placeholder="Atau paste URL gambar di sini"
              />
            </div>
          </div>

          {/* Deskripsi Bilingual */}
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Deskripsi Lengkap <span className="text-blue-500">(Indonesia) *</span>
              </label>
              <textarea
                name="description_id"
                required
                rows={4}
                value={formData.description_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                placeholder="Ceritakan tentang project ini dalam bahasa Indonesia..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Full Description <span className="text-purple-500">(English) *</span>
              </label>
              <textarea
                name="description_en"
                required
                rows={4}
                value={formData.description_en}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                placeholder="Tell about this project in English..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Demo / Video URL</label>
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                placeholder="https://... (live site atau video YouTube jika belum ada hosting)"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:hover:shadow-none"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave />
            )}
            Simpan Project
          </button>
        </div>
      </form>
    </div>
  )
}
