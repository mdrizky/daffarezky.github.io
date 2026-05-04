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
    title: '',
    description: '',
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
          title: data.title || '',
          description: data.description || '',
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
        title: formData.title,
        description: formData.description,
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
        <div className="w-8 h-8 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold font-syne">
          {isNew ? 'Tambah Project Baru' : 'Edit Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Judul Project *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                  placeholder="Nama Project"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white [&>option]:bg-[#0A0A0F]"
                >
                  <option value="Website">Website</option>
                  <option value="Branding">Branding</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={formData.tech_stack}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                  placeholder="React, Next.js, Tailwind (pisahkan dengan koma)"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-black/20 border-white/10 text-[#00FF88] focus:ring-[#00FF88] focus:ring-offset-[#0A0A0F]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                  Tampilkan di Beranda (Featured)
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gambar Project</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors">
                  {formData.image_url ? (
                    <div className="relative aspect-video mb-4 rounded overflow-hidden">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <FaImage className="text-4xl mb-2" />
                      <p className="text-sm">Belum ada gambar</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                  >
                    Upload Gambar Baru
                  </label>
                </div>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white text-sm"
                  placeholder="Atau paste URL gambar di sini"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Lengkap</label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
              placeholder="Ceritakan tentang project ini..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL</label>
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-6 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00FF88] to-[#0099FF] text-[#0A0A0F] font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin"></div>
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
