'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaCertificate, FaImage, FaFilePdf, FaCheck, FaTimes, FaCloudUploadAlt } from 'react-icons/fa'
import type { Certificate } from '@/types'

export default function AdminCertificates() {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Certificate | null>(null)
  
  const initialForm = {
    title_id: '',
    title_en: '',
    issuer: '',
    image_url: '',
    file_url: '',
    date_issued: '',
    description_id: '',
    is_published: true
  }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      setLoading(true)
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
      alert('Sertifikat berhasil dihapus!')
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error deleting item:', error)
      alert(`Gagal menghapus sertifikat: ${errorMsg}`)
    }
  }

  // Upload preview image (PNG/JPG/SVG/WEBP)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop() || 'png'
      const fileName = `cert-img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `general/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ 
        ...prev, 
        image_url: data.publicUrl,
        file_url: prev.file_url || data.publicUrl 
      }))
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error uploading image:', error)
      alert(`Gagal mengupload gambar pratinjau: ${errorMsg}`)
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  // Upload PDF document
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    try {
      const fileExt = file.name.split('.').pop() || 'pdf'
      const fileName = `cert-doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `general/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, file_url: data.publicUrl }))
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error uploading document:', error)
      alert(`Gagal mengupload dokumen: ${errorMsg}`)
    } finally {
      setUploadingPdf(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title_id?.trim() || !formData.issuer?.trim()) {
      alert('Judul sertifikat dan penerbit wajib diisi!')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title_id: formData.title_id.trim(),
        title_en: formData.title_en?.trim() || formData.title_id.trim(),
        issuer: formData.issuer.trim(),
        image_url: formData.image_url?.trim() || null,
        file_url: formData.file_url?.trim() || formData.image_url?.trim() || '',
        date_issued: formData.date_issued?.trim() || '2025',
        description_id: formData.description_id?.trim() || null,
        is_published: formData.is_published ?? true
      }

      if (editingItem) {
        const { error } = await supabase
          .from('certificates')
          .update(payload)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('certificates')
          .insert([payload])
        if (error) throw error
      }

      setIsModalOpen(false)
      setEditingItem(null)
      setFormData(initialForm)
      await fetchItems()
      alert('Sertifikat berhasil disimpan!')
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error saving item:', error)
      alert(`Gagal menyimpan sertifikat:\n${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (item: Certificate) => {
    setEditingItem(item)
    setFormData({
      title_id: item.title_id || '',
      title_en: item.title_en || '',
      issuer: item.issuer || '',
      image_url: item.image_url || '',
      file_url: item.file_url || '',
      date_issued: item.date_issued || '',
      description_id: (item as Record<string, unknown>).description_id as string || '',
      is_published: item.is_published ?? true
    })
    setIsModalOpen(true)
  }

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Sertifikat & Lisensi</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola pratinjau sertifikat, dokumen PDF, dan status publikasi.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null)
            setFormData(initialForm)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <FaPlus /> Tambah Sertifikat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl text-cyan-500"><FaCertificate /></div>
              <p className="font-semibold">Belum ada data sertifikat tersimpan di database.</p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-[#12141D] border border-gray-200 dark:border-zinc-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-[16/10] relative bg-gray-100 dark:bg-zinc-900 overflow-hidden">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : item.file_url?.toLowerCase().endsWith('.pdf') ? (
                  <div className="flex flex-col items-center justify-center h-full bg-red-50 dark:bg-red-950/20 text-red-500">
                    <FaFilePdf className="text-5xl mb-2" />
                    <span className="text-xs font-bold uppercase">Dokumen PDF</span>
                  </div>
                ) : item.file_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.file_url} alt={item.title_id} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400"><FaImage className="text-4xl" /></div>
                )}
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/80 text-white text-[11px] font-bold rounded-md uppercase tracking-wider">
                    {item.issuer}
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-3 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><FaTrash /></button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-base">{item.title_id}</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-1">{item.date_issued || '2024-2025'}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${item.is_published !== false ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.is_published !== false ? 'Published' : 'Draft'}
                  </span>
                  <button onClick={() => openEdit(item)} className="text-cyan-500 hover:underline font-bold">
                    Edit Detail →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#10121A] border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Penerbit (Issuer) *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                    placeholder="Contoh: Dicoding, Kominfo, Tasheel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Tanggal / Waktu Terbit</label>
                  <input
                    type="text"
                    value={formData.date_issued}
                    onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                    placeholder="Contoh: 23 September 2025"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Judul Sertifikat (ID) *</label>
                <input
                  type="text"
                  required
                  value={formData.title_id}
                  onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                  placeholder="Contoh: Dasar-Dasar Literasi Keuangan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Judul Sertifikat (EN)</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                  placeholder="Contoh: Financial Literacy Fundamentals"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description_id}
                  onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white text-sm"
                  placeholder="Sertifikat pembelajaran dan kompetensi resmi dari Dicoding Indonesia..."
                />
              </div>

              {/* Preview Image Upload & URL */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  1. Foto / Gambar Pratinjau Sertifikat (Tampil di Kartu)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {formData.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-700 hover:border-cyan-500 rounded-xl cursor-pointer text-xs font-bold text-gray-700 dark:text-zinc-300 transition">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                      <FaCloudUploadAlt className="text-base text-cyan-500" />
                      <span>{uploadingImage ? 'Mengupload...' : 'Pilih Gambar (JPG, PNG, SVG)'}</span>
                    </label>
                    <input
                      type="url"
                      placeholder="Atau masukkan URL gambar pratinjau..."
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full mt-2 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs outline-none text-gray-700 dark:text-zinc-300"
                    />
                  </div>
                </div>
              </div>

              {/* Document PDF Upload & URL */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  2. File Dokumen Asli (PDF / Dokumen)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {formData.file_url?.toLowerCase().endsWith('.pdf') ? (
                      <FaFilePdf className="text-red-500 text-2xl" />
                    ) : (
                      <FaCertificate className="text-cyan-500 text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-700 hover:border-cyan-500 rounded-xl cursor-pointer text-xs font-bold text-gray-700 dark:text-zinc-300 transition">
                      <input type="file" accept="application/pdf,image/*" onChange={handlePdfUpload} className="hidden" disabled={uploadingPdf} />
                      <FaFilePdf className="text-base text-red-500" />
                      <span>{uploadingPdf ? 'Mengupload PDF...' : 'Pilih File Dokumen PDF'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Atau masukkan URL link dokumen PDF..."
                      value={formData.file_url}
                      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                      className="w-full mt-2 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs outline-none text-gray-700 dark:text-zinc-300"
                    />
                  </div>
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-5 h-5 accent-cyan-500 rounded"
                  />
                  <span className="text-sm font-bold text-gray-800 dark:text-white">Tampilkan di Halaman Sertifikat & Keahlian</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 font-semibold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage || uploadingPdf}
                  className="px-8 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
                >
                  <FaCheck />
                  <span>Simpan Sertifikat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
