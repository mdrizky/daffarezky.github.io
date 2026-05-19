"use client"

import { useEffect, useState } from "react"

interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  avatar?: string
  rating?: number
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar: "",
    rating: 5,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials")
      const { data } = await res.json()
      setTestimonials(data || [])
    } catch (err) {
      console.error("Error fetching testimonials:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id)
    setFormData(item)
  }

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.content) {
        alert("Nama dan konten harus diisi!")
        return
      }

      const method = editingId && editingId !== "new" ? "PUT" : "POST"
      const body =
        editingId && editingId !== "new"
          ? { ...formData, id: editingId }
          : formData

      const res = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setEditingId(null)
        setFormData({
          name: "",
          role: "",
          company: "",
          content: "",
          avatar: "",
          rating: 5,
        })
        fetchTestimonials()
      }
    } catch (err) {
      console.error("Error saving:", err)
      alert("Gagal menyimpan testimoni")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus?")) return
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchTestimonials()
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
        <h1 className="text-2xl font-bold text-white">Kelola Testimoni</h1>
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-white">
              {editingId === "new" ? "Testimoni Baru" : "Edit Testimoni"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Jabatan"
                value={formData.role || ""}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Perusahaan"
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
              <input
                type="text"
                placeholder="Avatar URL"
                value={formData.avatar || ""}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            </div>

            <textarea
              placeholder="Konten testimoni..."
              rows={4}
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              {t.avatar && (
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{t.name}</p>
                <p className="text-xs text-zinc-400 truncate">{t.role || t.company}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 line-clamp-2">{t.content}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => handleEdit(t)}
                className="text-sm px-2 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-sm px-2 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
