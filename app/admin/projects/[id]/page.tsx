'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaImage, FaPlus, FaTrash, FaStar, FaUpload } from 'react-icons/fa'

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
    progress: 0,
    start_date: '',
    completion_date: '',
    is_current: false,
    estimated_hours: '',
    actual_hours: '',
    difficulty: 'Medium',
    slug: '',
    duration: '',
    year: new Date().getFullYear(),
    status: 'Completed',
    bottom_flyer_id: '',
    bottom_flyer_en: '',
    current_features_id: '',
    current_features_en: '',
    problem_id: '',
    problem_en: '',
    solution_id: '',
    solution_en: '',
    result_id: '',
    result_en: '',
    target_audience_id: '',
    target_audience_en: '',
    workflow_id: '',
    workflow_en: '',
  })

  // Multi-image gallery state
  interface GalleryItem {
    id?: string;
    image_url: string;
    caption_id?: string;
    caption_en?: string;
    sort_order?: number;
  }
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [newGalleryCaption, setNewGalleryCaption] = useState('')
  const [uploadingGallery, setUploadingGallery] = useState(false)

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
          progress: data.progress || 0,
          start_date: data.start_date || '',
          completion_date: data.completion_date || '',
          is_current: data.is_current || false,
          estimated_hours: data.estimated_hours || '',
          actual_hours: data.actual_hours || '',
          difficulty: data.difficulty || 'Medium',
          slug: data.slug || '',
          duration: data.duration || '',
          year: data.year || new Date().getFullYear(),
          status: data.status || 'Completed',
          bottom_flyer_id: data.bottom_flyer_id || '',
          bottom_flyer_en: data.bottom_flyer_en || '',
          current_features_id: data.current_features_id || '',
          current_features_en: data.current_features_en || '',
          problem_id: data.problem_id || '',
          problem_en: data.problem_en || '',
          solution_id: data.solution_id || '',
          solution_en: data.solution_en || '',
          result_id: data.result_id || '',
          result_en: data.result_en || '',
          target_audience_id: data.target_audience_id || '',
          target_audience_en: data.target_audience_en || '',
          workflow_id: data.workflow_id || '',
          workflow_en: data.workflow_en || '',
        })
      }

      // Fetch gallery images
      const { data: galleryData } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('sort_order', { ascending: true })

      if (galleryData) {
        setGalleryImages(galleryData)
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

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return
    setGalleryImages(prev => [
      ...prev,
      {
        image_url: newGalleryUrl.trim(),
        caption_id: newGalleryCaption.trim(),
        caption_en: newGalleryCaption.trim(),
        sort_order: prev.length
      }
    ])
    setNewGalleryUrl('')
    setNewGalleryCaption('')
  }

  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingGallery(true)
      const newItems: GalleryItem[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        const filePath = `projects/gallery/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Gallery image upload error:', uploadError)
          continue
        }

        const { data } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath)

        if (data?.publicUrl) {
          newItems.push({
            image_url: data.publicUrl,
            caption_id: file.name.replace(/\.[^/.]+$/, ""),
            caption_en: file.name.replace(/\.[^/.]+$/, ""),
            sort_order: galleryImages.length + newItems.length
          })
        }
      }

      setGalleryImages(prev => [...prev, ...newItems])
    } catch (error) {
      console.error('Error uploading gallery images:', error)
      alert('Gagal mengupload beberapa gambar galeri')
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSetGalleryAsCover = (imgUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imgUrl }))
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
        progress: Number(formData.progress),
        start_date: formData.start_date,
        completion_date: formData.completion_date,
        is_current: formData.is_current,
        estimated_hours: formData.estimated_hours,
        actual_hours: formData.actual_hours,
        difficulty: formData.difficulty,
        slug: formData.slug,
        duration: formData.duration,
        year: Number(formData.year),
        status: formData.status,
        bottom_flyer_id: formData.bottom_flyer_id,
        bottom_flyer_en: formData.bottom_flyer_en,
        current_features_id: formData.current_features_id,
        current_features_en: formData.current_features_en,
        problem_id: formData.problem_id,
        problem_en: formData.problem_en,
        solution_id: formData.solution_id,
        solution_en: formData.solution_en,
        result_id: formData.result_id,
        result_en: formData.result_en,
        target_audience_id: formData.target_audience_id,
        target_audience_en: formData.target_audience_en,
        workflow_id: formData.workflow_id,
        workflow_en: formData.workflow_en,
      }

      let savedProjectId = id
      if (isNew) {
        const { data: inserted, error } = await supabase
          .from('projects')
          .insert([payload])
          .select('id')
          .single()
        if (error) throw error
        savedProjectId = inserted.id
      } else {
        const { error } = await supabase.from('projects').update(payload).eq('id', id)
        if (error) throw error
      }

      // Sync gallery images into project_images table
      if (savedProjectId) {
        try {
          await supabase.from('project_images').delete().eq('project_id', savedProjectId)
          if (galleryImages.length > 0) {
            const rows = galleryImages.map((img, idx) => ({
              project_id: savedProjectId,
              image_url: img.image_url,
              caption_id: img.caption_id || '',
              caption_en: img.caption_en || '',
              sort_order: idx
            }))
            await supabase.from('project_images').insert(rows)
          }
        } catch (galleryErr) {
          console.warn('Could not sync project_images:', galleryErr)
        }
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

          {/* Galeri Banyak Foto Proyek (Carousel / Slider) */}
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Galeri Foto Proyek (Multi-Photo Slider)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                    {galleryImages.length} Foto
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Foto-foto ini akan tampil di slider/carousel halaman detail project dan bisa digeser ke kanan & ke kiri.
                </p>
              </div>

              {/* Upload Multiple Photos Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-all hover:shadow-blue-500/30">
                <FaUpload />
                <span>{uploadingGallery ? 'Mengupload...' : '+ Upload Banyak Foto Sekaligus'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingGallery}
                  onChange={handleMultipleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Add By URL */}
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/10">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Atau masukkan URL foto baru..."
                className="flex-1 px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                type="text"
                value={newGalleryCaption}
                onChange={(e) => setNewGalleryCaption(e.target.value)}
                placeholder="Keterangan foto (opsional)..."
                className="sm:w-64 px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                disabled={!newGalleryUrl.trim()}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
              >
                + Tambahkan
              </button>
            </div>

            {/* Grid of gallery photos */}
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden p-2 flex flex-col gap-2 shadow-sm">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-black/40">
                      <img src={img.image_url} alt={img.caption_id || `Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={img.caption_id || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGalleryImages(prev => prev.map((item, i) => i === idx ? { ...item, caption_id: val, caption_en: val } : item));
                      }}
                      placeholder="Keterangan..."
                      className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded text-gray-900 dark:text-white"
                    />
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-white/5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleSetGalleryAsCover(img.image_url)}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <FaStar size={10} /> Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <FaTrash size={10} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-gray-400 text-xs">
                Belum ada foto tambahan di galeri. Klik &quot;Upload Banyak Foto&quot; atau paste URL di atas.
              </div>
            )}
          </div>
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Tambahan & SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Project Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="contoh: e-commerce-nextjs"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tahun</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Durasi Pengerjaan</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Contoh: 3 Minggu"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
                >
                  <option value="Selesai 100%">Selesai 100%</option>
                  <option value="Tahap Pengembangan (Siap Pakai)">Tahap Pengembangan (Siap Pakai)</option>
                  <option value="Dalam Pengerjaan">Dalam Pengerjaan</option>
                  <option value="Rencana">Rencana</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Bottom Flyer Text (ID)</label>
                <input
                  type="text"
                  name="bottom_flyer_id"
                  value={formData.bottom_flyer_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Teks singkat di bawah card"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Bottom Flyer Text (EN)</label>
                <input
                  type="text"
                  name="bottom_flyer_en"
                  value={formData.bottom_flyer_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Short text at bottom of card"
                />
              </div>
            </div>
          </div>

          {/* Progres & Detail Proyek */}
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progres & Detail Proyek</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Progres (%)</label>
                <input
                  type="number"
                  name="progress"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Kesulitan</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl self-end">
                <input
                  type="checkbox"
                  id="is_current"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 dark:border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-white dark:bg-black/20 cursor-pointer transition-all"
                />
                <label htmlFor="is_current" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Project Sedang Berjalan
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                <input
                  type="text"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Contoh: Jan 2024"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
                <input
                  type="text"
                  name="completion_date"
                  value={formData.completion_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Contoh: Mar 2024 (Kosongkan jika masih berjalan)"
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Estimasi Jam Kerja</label>
                <input
                  type="text"
                  name="estimated_hours"
                  value={formData.estimated_hours}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Contoh: 40 Jam"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Jam Kerja Aktual</label>
                <input
                  type="text"
                  name="actual_hours"
                  value={formData.actual_hours}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Contoh: 35 Jam"
                />
              </div>
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

          {/* Case Study Details */}
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Case Study Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Problem (ID)</label>
                <textarea
                  name="problem_id"
                  rows={3}
                  value={formData.problem_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Masalah yang ingin diselesaikan..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Problem (EN)</label>
                <textarea
                  name="problem_en"
                  rows={3}
                  value={formData.problem_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Problem to solve..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Solution (ID)</label>
                <textarea
                  name="solution_id"
                  rows={3}
                  value={formData.solution_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Solusi yang diberikan..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Solution (EN)</label>
                <textarea
                  name="solution_en"
                  rows={3}
                  value={formData.solution_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Solution provided..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Result (ID)</label>
                <textarea
                  name="result_id"
                  rows={3}
                  value={formData.result_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Hasil akhir atau dampak..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Result (EN)</label>
                <textarea
                  name="result_en"
                  rows={3}
                  value={formData.result_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Final result or impact..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Target Pengguna / Audiens <span className="text-blue-500">(Indonesia)</span>
                </label>
                <textarea
                  name="target_audience_id"
                  rows={3}
                  value={formData.target_audience_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Kepada siapa proyek ini ditujukan (misal: Pelaku UMKM, Mahasiswa, Komunitas)..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Target Audience <span className="text-purple-500">(English)</span>
                </label>
                <textarea
                  name="target_audience_en"
                  rows={3}
                  value={formData.target_audience_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Who is this project built for (e.g. Small Businesses, Students)..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Alur Kerja & Cara Kerja Sistem <span className="text-blue-500">(Indonesia)</span>
                </label>
                <textarea
                  name="workflow_id"
                  rows={3}
                  value={formData.workflow_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Jelaskan alur proses atau flow sistem aplikasi..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Workflow & System Architecture <span className="text-purple-500">(English)</span>
                </label>
                <textarea
                  name="workflow_en"
                  rows={3}
                  value={formData.workflow_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                  placeholder="Explain system workflow or operational lifecycle..."
                />
              </div>
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
