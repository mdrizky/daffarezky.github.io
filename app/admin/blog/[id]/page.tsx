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
    title_id: '',
    title_en: '',
    slug: '',
    content_id: '',
    content_en: '',
    thumbnail: '',
    category: 'Edukasi',
    excerpt_id: '',
    excerpt_en: '',
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
          title_id: data.title_id || '',
          title_en: data.title_en || '',
          slug: data.slug || '',
          content_id: data.content_id || '',
          content_en: data.content_en || '',
          thumbnail: data.thumbnail || '',
          category: data.category || 'Edukasi',
          excerpt_id: data.excerpt_id || '',
          excerpt_en: data.excerpt_en || '',
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
    
    if (name === 'title_id' && (isNew || !formData.slug)) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      
      setFormData(prev => ({ 
        ...prev, 
        title_id: value,
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
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors shadow-sm">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">
            {isNew ? 'Tulis Artikel Baru' : 'Edit Artikel'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Lengkapi konten artikel (Bilingual).</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Title Bilingual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul Artikel <span className="text-blue-500">(ID) *</span></label>
                  <input
                    type="text"
                    name="title_id"
                    required
                    value={formData.title_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white font-bold"
                    placeholder="Judul Artikel..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Article Title <span className="text-purple-500">(EN) *</span></label>
                  <input
                    type="text"
                    name="title_en"
                    required
                    value={formData.title_en}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white font-bold"
                    placeholder="Article Title..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-500 dark:text-gray-400 font-mono text-sm"
                    placeholder="judul-artikel-anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
                  >
                    <option value="Edukasi">Edukasi</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Opini">Opini</option>
                    <option value="Update">Update</option>
                  </select>
                </div>
              </div>

              {/* Excerpt Bilingual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ringkasan <span className="text-blue-500">(ID)</span></label>
                  <textarea
                    name="excerpt_id"
                    rows={3}
                    value={formData.excerpt_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm"
                    placeholder="Ringkasan singkat artikel..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Excerpt <span className="text-purple-500">(EN)</span></label>
                  <textarea
                    name="excerpt_en"
                    rows={3}
                    value={formData.excerpt_en}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white text-sm"
                    placeholder="Short article summary..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Thumbnail</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative overflow-hidden">
                {formData.thumbnail ? (
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                    <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Ganti Thumbnail</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                      <FaImage className="text-2xl" />
                    </div>
                    <p className="text-sm font-medium">Upload Thumbnail</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="thumbnail-upload"
                />
              </div>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm"
                placeholder="Atau paste URL gambar"
              />
            </div>
          </div>

          {/* Content Bilingual */}
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Konten Artikel <span className="text-blue-500">(ID) *</span></label>
              <textarea
                name="content_id"
                rows={12}
                required
                value={formData.content_id}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white font-mono text-sm leading-relaxed"
                placeholder="Tulis konten artikel di sini (Markdown / HTML)..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Article Content <span className="text-purple-500">(EN) *</span></label>
              <textarea
                name="content_en"
                rows={12}
                required
                value={formData.content_en}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white font-mono text-sm leading-relaxed"
                placeholder="Write article content here (Markdown / HTML)..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/blog"
            className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
