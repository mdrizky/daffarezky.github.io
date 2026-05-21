'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaImage, FaCode } from 'react-icons/fa'

export default function SkillForm() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const id = params.id as string

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadMode, setUploadMode] = useState<'svg' | 'image'>('svg')
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    category: 'Frontend',
    level: 'Beginner',
  })
  const fetchSkill = async () => {
    try {
      const { data, error } = await supabase.from('skills').select('*').eq('id', id).single()
      if (error) throw error
      if (data) {
        setFormData(data)
        if (data.icon.startsWith('http') || data.icon.startsWith('/')) {
          setUploadMode('image')
        } else {
          setUploadMode('svg')
        }
      }
    } catch (error) {
      console.error('Error fetching skill:', error)
      alert('Gagal mengambil data skill')
      router.push('/admin/skills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isNew) fetchSkill()
  }, [isNew, id])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `skill-${Math.random()}.${fileExt}`
      const filePath = `skills/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, icon: data.publicUrl }))
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
      if (isNew) {
        const { error } = await supabase.from('skills').insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase.from('skills').update(formData).eq('id', id)
        if (error) throw error
      }

      router.push('/admin/skills')
      router.refresh()
    } catch (error) {
      console.error('Error saving skill:', error)
      alert('Gagal menyimpan skill')
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

  const isIconSvg = formData.icon.startsWith('<svg')
  const isIconUrl = formData.icon.startsWith('http') || formData.icon.startsWith('/')

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/skills" className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors shadow-sm">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">
            {isNew ? 'Tambah Skill' : 'Edit Skill'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Skill *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
              placeholder="Misal: React.js"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Analytics">Analytics</option>
                <option value="AI Tools">AI Tools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tingkat</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
              >
                <option value="Beginner">Pemula (Beginner)</option>
                <option value="Intermediate">Menengah (Intermediate)</option>
                <option value="Advanced">Canggih (Advanced)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Ikon Skill *</label>
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadMode('svg')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${uploadMode === 'svg' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-gray-500'}`}
                >
                  <FaCode /> Kode SVG
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('image')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${uploadMode === 'image' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-gray-500'}`}
                >
                  <FaImage /> Upload Gambar
                </button>
              </div>
            </div>

            {uploadMode === 'svg' ? (
              <textarea
                name="icon"
                required={uploadMode === 'svg'}
                value={isIconSvg ? formData.icon : ''}
                onChange={handleChange}
                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="<svg>...</svg>"
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                    {isIconUrl ? (
                      <img src={formData.icon} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <FaImage className="text-3xl text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="skill-icon-upload"
                    />
                    <label
                      htmlFor="skill-icon-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-all shadow-sm"
                    >
                      <FaImage /> Pilih Gambar
                    </label>
                    <p className="text-[10px] text-gray-500 mt-2">Format: PNG, JPG, SVG, WebP. Maks 1MB.</p>
                  </div>
                </div>
                <input
                  type="text"
                  name="icon"
                  value={isIconUrl ? formData.icon : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-500 outline-none"
                  placeholder="URL Ikon Gambar..."
                />
              </div>
            )}

            {(formData.icon && isIconSvg) && (
              <div className="mt-4 p-6 bg-gray-100 dark:bg-black/40 rounded-2xl flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/10">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Preview Ikon SVG</span>
                <div dangerouslySetInnerHTML={{ __html: formData.icon }} className="w-16 h-16 text-gray-900 dark:text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/skills"
            className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave />
            )}
            Simpan Skill
          </button>
        </div>
      </form>
    </div>
  )
}
