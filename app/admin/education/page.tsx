"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Education } from "@/types"
import { FaCloudUploadAlt, FaImage, FaTrash, FaEdit, FaPlus, FaCheck, FaTimes } from "react-icons/fa"

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const initialFormState: Partial<Education> = {
    institution: "",
    degree_id: "",
    degree_en: "",
    start_year: new Date().getFullYear().toString(),
    end_year: "",
    description_id: "",
    description_en: "",
    is_current: false,
    logo_url: "",
    is_published: true,
  }
  const [formData, setFormData] = useState<Partial<Education>>(initialFormState)

  useEffect(() => {
    fetchEducation()
  }, [])

  async function fetchEducation() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("start_year", { ascending: false })
      
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error("Error fetching education:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop() || 'png'
      const cleanFileName = `education-logo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      
      // Use 'general/' prefix to ensure compatibility with Supabase storage whitelist
      const filePath = `general/${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        })

      if (uploadError) {
        throw new Error(uploadError.message || "Gagal mengunggah file ke storage.")
      }

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      if (data?.publicUrl) {
        setFormData(prev => ({ ...prev, logo_url: data.publicUrl }))
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error("Error uploading logo:", err)
      alert(`Gagal upload logo: ${errorMsg}\n\nTip: Pastikan sudah menjalankan script FIX_STORAGE_AND_EDUCATION.sql di Supabase SQL Editor. Anda juga bisa mengisi URL logo secara manual di bawah.`)
    } finally {
      setUploading(false)
      // reset file input
      e.target.value = ''
    }
  }

  async function handleSave() {
    if (!formData.institution?.trim() || !formData.start_year?.trim()) {
      alert("Nama institusi dan tahun mulai wajib diisi!")
      return
    }

    setSaving(true)
    try {
      // Check auth session
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert("Sesi login Anda telah berakhir. Silakan login kembali ke panel admin.")
        return
      }

      const payload = {
        institution: formData.institution.trim(),
        degree_id: formData.degree_id?.trim() || null,
        degree_en: formData.degree_en?.trim() || null,
        start_year: formData.start_year.trim(),
        end_year: formData.is_current ? null : (formData.end_year?.trim() || null),
        description_id: formData.description_id?.trim() || null,
        description_en: formData.description_en?.trim() || null,
        is_current: formData.is_current ?? false,
        logo_url: formData.logo_url?.trim() || null,
        is_published: formData.is_published ?? true,
      }

      let saveError
      if (editingId && editingId !== "new") {
        // UPDATE existing row
        const { error: updateError } = await supabase
          .from("education")
          .update(payload)
          .eq("id", editingId)
        saveError = updateError
      } else {
        // INSERT new row
        const { error: insertError } = await supabase
          .from("education")
          .insert([payload])
        saveError = insertError
      }

      if (saveError) {
        throw new Error(saveError.message || saveError.details || JSON.stringify(saveError))
      }

      setEditingId(null)
      setFormData(initialFormState)
      await fetchEducation()
      alert("Data pendidikan berhasil disimpan!")
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error("Error saving education:", err)
      alert(`Gagal menyimpan data pendidikan:\n${errorMsg}\n\nSilakan periksa izin database Supabase Anda atau jalankan FIX_STORAGE_AND_EDUCATION.sql.`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus data pendidikan ini?")) return
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      await fetchEducation()
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error("Error deleting education:", err)
      alert(`Gagal menghapus data: ${errorMsg}`)
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Pendidikan</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola riwayat pendidikan, logo universitas, dan status publikasi.</p>
        </div>
        <button
          onClick={() => {
            setFormData(initialFormState)
            setEditingId("new")
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <FaPlus /> Tambah Pendidikan
        </button>
      </div>

      {/* Modal Form */}
      {editingId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#0F111A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 w-full max-w-2xl space-y-6 my-8 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId === "new" ? "Tambah Pendidikan Baru" : "Edit Pendidikan"}
              </h2>
              <button 
                onClick={() => { setEditingId(null); setFormData(initialFormState) }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Nama Institusi / Universitas *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Universitas Indonesia, STDI Imam Syafi'i..."
                  value={formData.institution || ""}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Gelar / Jurusan (ID)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 Hukum Keluarga Islam"
                    value={formData.degree_id || ""}
                    onChange={(e) => setFormData({ ...formData, degree_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Gelar / Jurusan (EN)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bachelor of Islamic Family Law"
                    value={formData.degree_en || ""}
                    onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Tahun Mulai *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2022"
                    value={formData.start_year || ""}
                    onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Tahun Selesai
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.is_current || false}
                        onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                        className="rounded accent-cyan-500"
                      />
                      <span>Masih Belajar / Sekarang</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: 2026"
                    value={formData.end_year || ""}
                    onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                    disabled={formData.is_current}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* Logo Upload & URL Box */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Logo Kampus / Institusi
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview */}
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-gray-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm p-2">
                    {formData.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <FaImage className="text-gray-400 dark:text-zinc-500 text-3xl" />
                    )}
                  </div>
                  
                  {/* File Upload Trigger */}
                  <div className="flex-1 w-full">
                    <label className="flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-cyan-500 rounded-xl cursor-pointer transition-all group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-zinc-300">Mengupload ke storage...</span>
                        </>
                      ) : (
                        <>
                          <FaCloudUploadAlt className="text-xl text-gray-400 group-hover:text-cyan-500 transition-colors" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300 group-hover:text-cyan-500 transition-colors">
                            {formData.logo_url ? 'Ganti File Logo (Galeri / File)' : 'Pilih File Logo dari Perangkat'}
                          </span>
                        </>
                      )}
                    </label>

                    {/* Manual URL Input Fallback */}
                    <input
                      type="url"
                      placeholder="Atau tempelkan URL logo (https://...)"
                      value={formData.logo_url || ""}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      className="w-full mt-2 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs text-gray-600 dark:text-zinc-300 placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Deskripsi / Catatan (ID)
                </label>
                <textarea
                  placeholder="Fokus studi, kegiatan akademik, prestasi..."
                  rows={2}
                  value={formData.description_id || ""}
                  onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Deskripsi / Catatan (EN)
                </label>
                <textarea
                  placeholder="Focus of study, academic activities, achievements..."
                  rows={2}
                  value={formData.description_en || ""}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                />
              </div>

              {/* Published Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published ?? true}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">Tampilkan di Website Publik</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Jika aktif, data pendidikan ini langsung muncul di halaman Tentang & Pendidikan.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData(initialFormState) }}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-white rounded-xl font-semibold transition"
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="px-8 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Simpan Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Education Cards */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-gray-500 dark:text-zinc-400">Belum ada data pendidikan tersimpan.</p>
            <button
              onClick={() => { setFormData(initialFormState); setEditingId("new") }}
              className="mt-4 px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg text-sm"
            >
              + Tambah Sekarang
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 dark:border-zinc-700 p-2 flex items-center justify-center flex-shrink-0 shadow-xs">
                  {item.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.logo_url} alt={item.institution} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <FaImage className="text-gray-400 dark:text-zinc-600 text-xl" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.institution}</h3>
                    {item.is_published === false && (
                      <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 rounded-full font-bold">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{item.degree_id}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    {item.start_year} — {item.is_current ? "Sekarang (Aktif)" : (item.end_year || "-")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    setEditingId(item.id)
                    setFormData(item)
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition text-xs font-bold"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition text-xs font-bold"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
