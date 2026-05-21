"use client"

import { useEffect, useState } from "react"
import type { Education } from "@/types"

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
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
  }
  const [formData, setFormData] = useState<Partial<Education>>(initialFormState)

  useEffect(() => {
    fetchEducation()
  }, [])

  async function fetchEducation() {
    try {
      const res = await fetch("/api/admin/education")
      const { data } = await res.json()
      setItems(data || [])
    } catch (err) {
      console.error("Error fetching:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (!formData.institution || !formData.start_year) {
        alert("Nama institusi dan tahun mulai harus diisi!")
        return
      }

      const method = editingId && editingId !== "new" ? "PUT" : "POST"
      const body =
        editingId && editingId !== "new"
          ? { ...formData, id: editingId }
          : formData

      const res = await fetch("/api/admin/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setEditingId(null)
        setFormData(initialFormState)
        fetchEducation()
      }
    } catch (err) {
      console.error("Error saving:", err)
      alert("Gagal menyimpan data")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus?")) return
    try {
      const res = await fetch(`/api/admin/education?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchEducation()
      }
    } catch (err) {
      console.error("Error deleting:", err)
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
              placeholder="Nama Institusi / Universitas"
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
                placeholder="Tahun Mulai (contoh: 2020)"
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

            <input
              type="text"
              placeholder="URL Logo Institusi"
              value={formData.logo_url || ""}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

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

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
              >
                Simpan
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
                  <h3 className="font-semibold text-white">{item.institution}</h3>
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
