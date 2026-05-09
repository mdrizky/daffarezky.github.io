'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaSave } from 'react-icons/fa'

export default function EducationForm() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const id = params.id as string

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    institution: '',
    degree_id: '',
    degree_en: '',
    start_year: '',
    end_year: '',
    description_id: '',
    description_en: '',
    is_current: false,
  })

  useEffect(() => {
    if (!isNew) fetchEducation()
  }, [isNew, id])

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase.from('education').select('*').eq('id', id).single()
      if (error) throw error
      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching education:', error)
      alert('Gagal mengambil data pendidikan')
      router.push('/admin/education')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        const { error } = await supabase.from('education').insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase.from('education').update(formData).eq('id', id)
        if (error) throw error
      }

      router.push('/admin/education')
      router.refresh()
    } catch (error) {
      console.error('Error saving education:', error)
      alert('Gagal menyimpan pendidikan')
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
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/education" className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-colors shadow-sm">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">
            {isNew ? 'Tambah Pendidikan' : 'Edit Pendidikan'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Institusi *</label>
            <input
              type="text"
              name="institution"
              required
              value={formData.institution}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
              placeholder="Misal: Universitas Indonesia"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gelar / Jurusan <span className="text-blue-500">(ID) *</span></label>
              <input
                type="text"
                name="degree_id"
                required
                value={formData.degree_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="Misal: S1 Sistem Informasi"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Degree / Major <span className="text-purple-500">(EN) *</span></label>
              <input
                type="text"
                name="degree_en"
                required
                value={formData.degree_en}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white"
                placeholder="E.g: B.Sc Information Systems"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tahun Mulai *</label>
              <input
                type="text"
                name="start_year"
                required
                value={formData.start_year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="Misal: 2020"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tahun Selesai</label>
              <input
                type="text"
                name="end_year"
                disabled={formData.is_current}
                value={formData.is_current ? 'Sekarang' : formData.end_year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder="Misal: 2024"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_current"
              name="is_current"
              checked={formData.is_current}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 dark:border-white/10 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="is_current" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Masih menempuh pendidikan ini
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi / Kegiatan <span className="text-blue-500">(ID) *</span></label>
              <textarea
                name="description_id"
                required
                rows={3}
                value={formData.description_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="Ceritakan aktivitas atau pencapaian..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description / Activities <span className="text-purple-500">(EN) *</span></label>
              <textarea
                name="description_en"
                required
                rows={3}
                value={formData.description_en}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white"
                placeholder="Tell about activities or achievements..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/education"
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
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}
