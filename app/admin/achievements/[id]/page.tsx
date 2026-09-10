'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaSave } from 'react-icons/fa'

export default function AchievementForm() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const id = params.id as string

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    organization: '',
    category: 'Other',
    achieved_on: '',
    description_id: '',
    description_en: '',
    image_url: '',
    certificate_url: '',
    credential_url: '',
    featured: false,
    sort_order: 0,
    is_published: true,
  })

  const fetchAchievement = async () => {
    try {
      const { data, error } = await supabase.from('achievements').select('*').eq('id', id).single()
      if (error) throw error
      if (data) {
        setFormData({
          title_id: data.title_id ?? '',
          title_en: data.title_en ?? '',
          organization: data.organization ?? '',
          category: data.category ?? 'Other',
          achieved_on: data.achieved_on ? data.achieved_on.slice(0, 10) : '',
          description_id: data.description_id ?? '',
          description_en: data.description_en ?? '',
          image_url: data.image_url ?? '',
          certificate_url: data.certificate_url ?? '',
          credential_url: data.credential_url ?? '',
          featured: data.featured ?? false,
          sort_order: data.sort_order ?? 0,
          is_published: data.is_published ?? true,
        })
      }
    } catch (error) {
      console.error('Error fetching achievement:', error)
      alert('Gagal mengambil data achievement')
      router.push('/admin/achievements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isNew) fetchAchievement()
  }, [isNew, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'sort_order' ? Number(value) : value }))
  }

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        const { error } = await supabase.from('achievements').insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase.from('achievements').update(formData).eq('id', id)
        if (error) throw error
      }

      router.push('/admin/achievements')
      router.refresh()
    } catch (error) {
      console.error('Error saving achievement:', error)
      alert('Gagal menyimpan achievement')
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

  const inputCls =
    'w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white'
  const selectCls =
    'w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]'

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/achievements" className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors shadow-sm">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">
            {isNew ? 'Tambah Achievement' : 'Edit Achievement'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul (ID) *</label>
              <input
                type="text"
                name="title_id"
                required
                value={formData.title_id}
                onChange={handleChange}
                className={inputCls}
                placeholder="Misal: Juara 1 Web Design Competition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul (EN) *</label>
              <input
                type="text"
                name="title_en"
                required
                value={formData.title_en}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. 1st Place Web Design Competition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Organisasi / Penyelenggara</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className={inputCls}
                placeholder="Misal: Dinas Pendidikan Provinsi Jabar"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
              <select name="category" value={formData.category} onChange={handleChange} className={selectCls}>
                <option value="Competition">Competition</option>
                <option value="Certification">Certification</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Award">Award</option>
                <option value="Course">Course</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tanggal Perolehan</label>
            <input
              type="date"
              name="achieved_on"
              value={formData.achieved_on}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi (ID)</label>
            <textarea
              name="description_id"
              value={formData.description_id}
              onChange={handleChange}
              rows={3}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi (EN)</label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              rows={3}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Gambar / Logo</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className={inputCls}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Sertifikat</label>
              <input
                type="url"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleChange}
                className={inputCls}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Kredensial</label>
              <input
                type="url"
                name="credential_url"
                value={formData.credential_url}
                onChange={handleChange}
                className={inputCls}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Urutan</label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <label className="flex items-center gap-3 pt-6 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleToggle}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tampil unggulan</span>
            </label>
            <label className="flex items-center gap-3 pt-6 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleToggle}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Publikasikan</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/achievements"
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
            Simpan Achievement
          </button>
        </div>
      </form>
    </div>
  )
}