"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Education } from "@/types"
import { FaCloudUploadAlt, FaImage } from "react-icons/fa"

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
      const fileExt = file.name.split('.').pop()
      const fileName = `education-logo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `education/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, logo_url: data.publicUrl }))
    } catch (err) {
      console.error("Error uploading logo:", err)
      alert("Gagal mengupload logo. Pastikan bucket 'portfolio-images' sudah ada.")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!formData.institution || !formData.start_year) {
      alert("Nama institusi dan tahun mulai harus diisi!")
      return
    }

    setSaving(true)
    try {
      const payload = {
        institution: formData.institution,
        degree_id: formData.degree_id || null,
        degree_en: formData.degree_en || null,
        start_year: formData.start_year,
        end_year: formData.end_year || null,
        description_id: formData.description_id || null,
        description_en: formData.description_en || null,
        is_current: formData.is_current ?? false,
        logo_url: formData.logo_url || null,
        is_published: formData.is_published ?? true,
      }

      let error
      if (editingId && editingId !== "new") {
        // UPDATE
        const { error: updateError } = await supabase
          .from("education")
          .update(payload)
          .eq("id", editingId)
        error = updateError
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from("education")
          .insert([payload])
        error = insertError
      }

      if (error) throw error

      setEditingId(null)
      setFormData(initialFormState)
      fetchEducation()
    } catch (err) {
      console.error("Error saving education:", err)
      alert("Gagal menyimpan data. Cek console untuk detail error.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus data pendidikan ini?")) return
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      fetchEducation()
    } catch (err) {
      console.error("Error deleting education:", err)
      alert("Gagal menghapus data.")
    }
  }

  if (loading) {
    return <div className="p-4 text-zinc-400">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Pendidikan</h1>
        <button
          onClick={() => {
            setFormData(initialFormState)
            setEditingId("new")
          }}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
        >
          + Tambah
        </button>
      </div>

      {/* Modal Form */}
      {editingId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-2xl space-y-4 my-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId === "new" ? "Tambah Pendidikan" : "Edit Pendidikan"}
            </h2>

            <input
              type="text"
              placeholder="Nama Institusi / Universitas *"
              value={formData.institution || ""}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />
            
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Gelar / Jurusan (ID)"
                value={formData.degree_id || ""}
                onChange={(e) => setFormData({ ...formData, degree_id: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Gelar / Jurusan (EN)"
                value={formData.degree_en || ""}
                onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tahun Mulai (contoh: 2020) *"
                value={formData.start_year || ""}
                onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Tahun Selesai (contoh: 2024)"
                  value={formData.end_year || ""}
                  onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                  disabled={formData.is_current}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white disabled:opacity-50"
                />
                <label className="flex items-center gap-2 whitespace-nowrap text-white text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.is_current || false}
                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    className="accent-cyan-500"
                  />
                  Saat Ini
                </label>
              </div>
            </div>

            {/* Logo Upload - File picker */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-300">Logo Institusi</label>
              <div className="flex items-center gap-4">
                {/* Logo Preview */}
                <div className="w-16 h-16 rounded-lg bg-white border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <FaImage className="text-zinc-400 text-xl" />
                  )}
                </div>
                
                {/* Upload Button */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 border-dashed rounded-lg cursor-pointer hover:bg-zinc-750 hover:border-cyan-500/50 transition-all group">
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
                        <span className="text-sm text-zinc-400">Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                          {formData.logo_url ? 'Ganti Logo' : 'Pilih File Logo'}
                        </span>
                      </>
                    )}
                  </label>
                  <p className="text-xs text-zinc-500 mt-1">Format: PNG, JPG, SVG. Max 2MB.</p>
                </div>

                {/* Remove Logo */}
                {formData.logo_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>

            <textarea
              placeholder="Deskripsi (ID)"
              rows={3}
              value={formData.description_id || ""}
              onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />
            
            <textarea
              placeholder="Deskripsi (EN)"
              rows={3}
              value={formData.description_en || ""}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

            {/* Published Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published ?? true}
                  onChange={e => setFormData({...formData, is_published: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                <span className="ml-3 text-sm font-semibold text-zinc-300">Tampilkan di website</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => { setEditingId(null); setFormData(initialFormState) }}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
                disabled={saving}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-zinc-400">Belum ada data pendidikan.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 flex items-start justify-between">
              <div className="flex gap-4 items-center">
                {item.logo_url && (
                  <div className="w-12 h-12 rounded bg-white p-1 flex-shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo_url} alt={item.institution} className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{item.institution}</h3>
                    {item.is_published === false && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Draft</span>
                    )}
                    {item.is_published === null && (
                      <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">Perlu Publish</span>
                    )}
                  </div>
                  <p className="text-sm text-cyan-400">{item.degree_id}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {item.start_year} - {item.is_current ? "Sekarang" : item.end_year}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingId(item.id)
                    setFormData(item)
                  }}
                  className="text-sm px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
