"use client"

import { useEffect, useState } from "react"

type Contact = {
  id: string
  name: string
  email: string
  whatsapp?: string
  subject?: string
  message: string
  is_read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  useEffect(() => {
    loadMessages()

    // Setup Supabase Realtime subscription
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setContacts((prev) => [payload.new as Contact, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          setContacts((prev) => 
            prev.map(c => c.id === payload.new.id ? { ...c, is_read: payload.new.is_read } : c)
          )
          if (selected?.id === payload.new.id) {
            setSelected(prev => prev ? { ...prev, is_read: payload.new.is_read } : null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selected?.id])

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

  async function toggleStatus(id: string, is_read: boolean) {
    const newStatus = !is_read
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: newStatus }),
      })
      if (res.ok) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, is_read: newStatus } : c)))
        if (selected?.id === id) setSelected({ ...selected, is_read: newStatus })
      }
    } catch (err) {
      console.error("Failed to update:", err)
    }
  }

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return c.is_read === false
    if (filter === "read") return c.is_read === true
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pesan Client</h1>
        <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-white text-blue-600 dark:bg-white/10 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {f === "all" ? "Semua" : f === "unread" ? "Belum dibaca" : "Dibaca"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 min-h-[500px]">
          {/* List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                Tidak ada pesan.
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelected(c)
                    if (!c.is_read) toggleStatus(c.id, c.is_read)
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 ${
                    selected?.id === c.id
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30 shadow-sm"
                      : "bg-white border-gray-200 dark:bg-white/5 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm truncate mb-0.5 ${!c.is_read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {c.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{c.email}</div>
                      <div className={`text-xs truncate ${!c.is_read ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-500'}`}>
                        {c.message}
                      </div>
                    </div>
                    {!c.is_read && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-blue-500 hover:underline">{selected.email}</a>
                </div>
                <div className="flex flex-col gap-2 items-end">
                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                     {new Date(selected.created_at).toLocaleString("id-ID")}
                   </p>
                   <button
                    onClick={() => toggleStatus(selected.id, selected.is_read)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      selected.is_read
                        ? "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    }`}
                  >
                    {selected.is_read ? "Tandai Belum dibaca" : "Tandai Dibaca"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {selected.whatsapp && (
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">WhatsApp</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selected.whatsapp}</p>
                  </div>
                )}
                {selected.subject && (
                  <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subjek</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selected.subject}</p>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-gray-50 dark:bg-black/20 p-6 rounded-xl border border-gray-100 dark:border-white/5 mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Isi Pesan</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">{selected.message}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-6 border-t border-gray-100 dark:border-white/10">
                <a
                  href={`mailto:${selected.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 text-sm font-bold text-center transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                  Balas via Email
                </a>
                
                {selected.whatsapp && (
                  <a
                    href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}?text=Halo%20${encodeURIComponent(selected.name)},%20ini%20Daffa%20Rizky.%20Saya%20sudah%20membaca%20pesan%20Anda:`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-500/20 text-sm font-bold text-center transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Balas via WhatsApp
                  </a>
                )}
                
                <button
                  onClick={() => deleteMessage(selected.id)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 hover:text-red-500 text-sm font-bold transition sm:ml-auto"
                >
                  Hapus Pesan
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm h-full">
              <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-4xl mb-4 border border-gray-100 dark:border-white/10">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pilih Pesan</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">Klik salah satu pesan di daftar sebelah kiri untuk melihat detail dan membalas pesan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
