"use client"

import { useEffect, useState } from "react"

interface Education {
  id: string
  school_name: string
  description?: string
  start_year: number
  end_year?: number
  location?: string
  achievements?: string
  image_url?: string
}

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Education>>({
    school_name: "",
    description: "",
    start_year: new Date().getFullYear(),
    end_year: undefined,
    location: "",
    achievements: "",
    image_url: "",
  })

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
      if (!formData.school_name || !formData.start_year) {
        alert("Nama sekolah dan tahun harus diisi!")
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
        setFormData({
          school_name: "",
          description: "",
          start_year: new Date().getFullYear(),
          end_year: undefined,
          location: "",
          achievements: "",
          image_url: "",
        })
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
          onClick={() => setEditingId("new")}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
        >
          + Tambah
        </button>
      </div>

      {/* Modal Form */}
      {editingId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-2xl space-y-4 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-white">
              {editingId === "new" ? "Tambah Pendidikan" : "Edit Pendidikan"}
            </h2>

            <input
              type="text"
              placeholder="Nama Sekolah / Universitas"
              value={formData.school_name || ""}
              onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Tahun Mulai"
                value={formData.start_year || ""}
                onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
              <input
                type="number"
                placeholder="Tahun Selesai (opsional)"
                value={formData.end_year || ""}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value ? parseInt(e.target.value) : undefined })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            </div>

            <input
              type="text"
              placeholder="Lokasi"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image_url || ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

            <textarea
              placeholder="Deskripsi..."
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

            <textarea
              placeholder="Pencapaian (pisahkan dengan enter)..."
              rows={3}
              value={formData.achievements || ""}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            />

            <div className="flex justify-end gap-3">
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
              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.school_name}</h3>
                <p className="text-sm text-zinc-400">
                  {item.start_year}
                  {item.end_year && ` - ${item.end_year}`}
                  {item.location && ` • ${item.location}`}
                </p>
                {item.description && <p className="text-sm text-zinc-300 mt-1">{item.description}</p>}
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
