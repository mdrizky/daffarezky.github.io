"use client"

import { useEffect, useState } from "react"

type Contact = {
  id: string
  name: string
  email: string
  whatsapp?: string
  subject?: string
  message: string
  status: string
  created_at: string
}

export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/contacts")
      const { data } = await res.json()
      setContacts(data || [])
    } catch (err) {
      console.error("Failed to load contacts:", err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Yakin hapus pesan ini?")) return
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setContacts(contacts.filter((c) => c.id !== id))
        if (selected?.id === id) setSelected(null)
      }
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  async function toggleStatus(id: string, status: string) {
    const newStatus = status === "read" ? "unread" : "read"
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))
        if (selected?.id === id) setSelected({ ...selected, status: newStatus })
      }
    } catch (err) {
      console.error("Failed to update:", err)
    }
  }

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return c.status === "unread"
    if (filter === "read") return c.status === "read"
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pesan Client</h1>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === f
                  ? "bg-cyan-500 text-white"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {f === "all" ? "Semua" : f === "unread" ? "Belum dibaca" : "Dibaca"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-zinc-400">Memuat pesan...</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4 min-h-96">
          {/* List */}
          <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-zinc-400 text-sm">Tidak ada pesan.</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    selected?.id === c.id
                      ? "bg-cyan-500/20 border-cyan-500"
                      : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                  } ${c.status === "unread" ? "font-bold" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-sm truncate">{c.name}</div>
                      <div className="text-xs text-zinc-400 truncate">{c.email}</div>
                    </div>
                    {c.status === "unread" && <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          {selected && (
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                  <p className="text-sm text-zinc-400">{selected.email}</p>
                </div>
                <button
                  onClick={() => toggleStatus(selected.id, selected.status)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selected.status === "read"
                      ? "bg-zinc-800 text-zinc-300"
                      : "bg-cyan-500/20 text-cyan-300"
                  }`}
                >
                  {selected.status === "read" ? "Tandai Belum dibaca" : "Tandai Dibaca"}
                </button>
              </div>

              {selected.whatsapp && (
                <div>
                  <p className="text-xs text-zinc-400">WhatsApp</p>
                  <p className="text-white font-mono">{selected.whatsapp}</p>
                </div>
              )}

              {selected.subject && (
                <div>
                  <p className="text-xs text-zinc-400">Subjek</p>
                  <p className="text-white">{selected.subject}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-zinc-400 mb-2">Pesan</p>
                <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <p className="text-xs text-zinc-500">
                {new Date(selected.created_at).toLocaleString("id-ID")}
              </p>

              <button
                onClick={() => deleteMessage(selected.id)}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded hover:bg-red-600/30 text-sm font-medium transition"
              >
                Hapus Pesan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
