'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaCertificate, FaImage } from 'react-icons/fa'
import { useLanguage } from '@/components/LanguageProvider'
import type { Certificate } from '@/types'

export default function AdminCertificates() {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Certificate | null>(null)
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    issuer: '',
    file_url: '',
    date_issued: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('date_issued', { ascending: false })

      if (error) throw error
      if (data) setItems(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus sertifikat ini?')) return

    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id)
      if (error) throw error
      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Gagal menghapus item')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `cert-${Math.random()}.${fileExt}`
      const filePath = `certificates/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, file_url: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengupload file')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('certificates')
          .update(formData)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('certificates')
          .insert([formData])
        if (error) throw error
      }

      setIsModalOpen(false)
      setEditingItem(null)
      setFormData({ title_id: '', title_en: '', issuer: '', file_url: '', date_issued: '' })
      fetchItems()
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (item: Certificate) => {
    setEditingItem(item)
    setFormData({
      title_id: item.title_id,
      title_en: item.title_en,
      issuer: item.issuer,
      file_url: item.file_url,
      date_issued: item.date_issued
    })
    setIsModalOpen(true)
  }

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Sertifikat & Lisensi</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola bukti kompetensi dan pencapaian akademik Anda.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null)
            setFormData({ title_id: '', title_en: '', issuer: '', file_url: '', date_issued: '' })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          <FaPlus /> Tambah Sertifikat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl"><FaCertificate /></div>
              <p>Belum ada data sertifikat.</p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="aspect-[4/3] relative bg-gray-100 dark:bg-black/20 overflow-hidden">
                {item.file_url ? (
                  <img src={item.file_url} alt={item.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400"><FaImage className="text-4xl" /></div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-3 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><FaTrash /></button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded uppercase font-bold">ID</span>
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title_id}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3 opacity-60">
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold">EN</span>
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{item.title_en}</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{item.issuer}</p>
                  <p className="text-[10px] text-gray-400">{item.date_issued}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0F0F1A] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Penerbit (Issuer)</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="Contoh: Google, Coursera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tanggal Terbit</label>
                  <input
                    type="text"
                    required
                    value={formData.date_issued}
                    onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="Contoh: Jan 2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul Sertifikat (ID)</label>
                    <input
                      type="text"
                      required
                      value={formData.title_id}
                      onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Certificate Title (EN)</label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">File / Preview Sertifikat</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center">
                    {formData.file_url ? (
                      <img src={formData.file_url} className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="text-2xl text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cert-upload"
                    />
                    <label htmlFor="cert-upload" className="cursor-pointer inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-blue-500/20">
                      Pilih Gambar
                    </label>
                    <p className="text-[10px] text-gray-500 mt-2">Format: JPG, PNG. Ukuran maks: 2MB.</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full mt-4 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-500 outline-none"
                  placeholder="URL File..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Simpan Sertifikat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
