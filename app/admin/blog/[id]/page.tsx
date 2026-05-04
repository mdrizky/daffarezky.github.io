'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa'

export default function BlogPostForm() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const id = params.id as string

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    thumbnail: '',
    category: 'Edukasi',
    excerpt: '',
  })

  useEffect(() => {
    if (!isNew) {
      fetchPost()
    }
  }, [isNew, id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          thumbnail: data.thumbnail || '',
          category: data.category || 'Edukasi',
          excerpt: data.excerpt || '',
        })
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      alert('Gagal mengambil data artikel')
      router.push('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Auto generate slug from title if it's a new post or slug is empty
    if (name === 'title' && (isNew || !formData.slug)) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      
      setFormData(prev => ({ 
        ...prev, 
        title: value,
        slug: generatedSlug
      }))
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
      const filePath = `blog/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, thumbnail: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengupload thumbnail')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        const { error } = await supabase.from('blog_posts').insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase.from('blog_posts').update(formData).eq('id', id)
        if (error) throw error
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Gagal menyimpan artikel. Pastikan slug unik.')
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
        <Link href="/admin/blog" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold font-syne">
          {isNew ? 'Tulis Artikel Baru' : 'Edit Artikel'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Judul Artikel *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white text-lg font-bold"
                  placeholder="Judul Artikel..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL Slug *</label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-gray-400 font-mono text-sm"
                  placeholder="judul-artikel-anda"
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
                  <option value="Edukasi">Edukasi</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Opini">Opini</option>
                  <option value="Update">Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ringkasan (Excerpt)</label>
                <textarea
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                  placeholder="Ringkasan singkat artikel untuk ditampilkan di list..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors">
                  {formData.thumbnail ? (
                    <div className="relative aspect-video mb-4 rounded overflow-hidden">
                      <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <FaImage className="text-4xl mb-2" />
                      <p className="text-sm">Belum ada thumbnail</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                  >
                    Upload Thumbnail
                  </label>
                </div>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white text-sm"
                  placeholder="Atau paste URL gambar"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Konten (Markdown / HTML)</label>
            <textarea
              name="content"
              rows={15}
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white font-mono text-sm leading-relaxed"
              placeholder="Tulis konten artikel di sini..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/blog"
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
            Simpan Artikel
          </button>
        </div>
      </form>
    </div>
  )
}
