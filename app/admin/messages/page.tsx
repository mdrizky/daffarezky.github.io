"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { db, supabase } from "@/lib/database"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { FaEnvelope, FaTrash, FaReply, FaWhatsapp, FaSync } from "react-icons/fa"
import { playNotificationSound } from "@/lib/sound"

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
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "connected" | "fallback">("connecting")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const selectedRef = useRef<Contact | null>(null)
  selectedRef.current = selected

  const loadMessages = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true)
    try {
      const { data, error } = await db.messages.getAll()
      if (error) throw error
      if (data) {
        setContacts(data)
        setLastUpdated(new Date())
      }
    } catch (err) {
      console.error("Failed to load messages:", err)
    } finally {
      if (showSpinner) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMessages(true)

    // Setup Supabase Realtime subscription
    const channel = supabase
      .channel('admin-messages-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: RealtimePostgresChangesPayload<Contact>) => {
          const newMsg = payload.new as Contact
          setContacts((prev) => {
            // Deduplicate if already present
            if (prev.some(c => c.id === newMsg.id)) return prev
            return [newMsg, ...prev]
          })
          setLastUpdated(new Date())
          playNotificationSound()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload: RealtimePostgresChangesPayload<Contact>) => {
          const updated = payload.new as Contact
          setContacts((prev) => 
            prev.map(c => c.id === updated.id ? { ...c, ...updated } : c)
          )
          if (selectedRef.current?.id === updated.id) {
            setSelected(prev => prev ? { ...prev, ...updated } : null)
          }
          setLastUpdated(new Date())
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          const deletedId = (payload.old as { id?: string })?.id
          if (deletedId) {
            setContacts(prev => prev.filter(c => c.id !== deletedId))
            if (selectedRef.current?.id === deletedId) {
              setSelected(null)
            }
            setLastUpdated(new Date())
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected')
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeStatus('fallback')
        }
      })

    // Silent background polling fallback every 8 seconds
    // Ensures zero missed messages even if websocket temporarily disconnects or before SQL publication is run
    const pollInterval = setInterval(() => {
      loadMessages(false)
    }, 8000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [loadMessages])

  async function deleteMessage(id: string) {
    if (!confirm("Yakin hapus pesan ini?")) return
    try {
      const { error } = await db.messages.delete(id)
      if (!error) {
        setContacts((prev) => prev.filter((c) => c.id !== id))
        if (selected?.id === id) setSelected(null)
      }
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  async function toggleStatus(id: string, is_read: boolean) {
    const newStatus = !is_read
    try {
      const { error } = newStatus 
        ? await db.messages.markAsRead(id)
        : await db.messages.markAsUnread(id)

      if (!error) {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, is_read: newStatus } : c)))
        if (selected?.id === id) setSelected((prev) => prev ? { ...prev, is_read: newStatus } : null)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pesan Client</h1>
          {/* Live Realtime Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Realtime Aktif</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadMessages(false)}
            title="Sinkronisasi pesan manual"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors text-xs flex items-center gap-1"
          >
            <FaSync className="text-xs" />
          </button>

          <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-white text-blue-600 dark:bg-white/10 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {f === "all" ? "Semua" : f === "unread" ? "Belum dibaca" : "Dibaca"}
              </button>
            ))}
          </div>
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
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{c.email}</div>
                      {c.subject && (
                        <div className="text-[10px] font-bold text-blue-500 dark:text-[var(--color-neon-blue)] uppercase tracking-wider mb-2">
                          {c.subject}
                        </div>
                      )}
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
              {/* Message Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selected.name}</h2>
                  {selected.subject && (
                    <p className="text-sm font-bold text-blue-500 dark:text-[var(--color-neon-blue)] uppercase tracking-[0.2em] mb-4">
                      {selected.subject}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    <a 
                      href={`mailto:${selected.email}`} 
                      className="text-blue-500 hover:text-blue-600 dark:text-[var(--color-neon-blue)] dark:hover:text-blue-400 font-medium flex items-center gap-2 transition-colors"
                    >
                      <FaEnvelope className="text-xs" />
                      {selected.email}
                    </a>
                    {selected.whatsapp && (
                      <a 
                        href={`https://wa.me/${selected.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 dark:text-[var(--color-neon-green)] dark:hover:text-green-400 font-medium flex items-center gap-2 transition-colors"
                      >
                        <FaWhatsapp className="text-sm" />
                        {selected.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                     {new Date(selected.created_at).toLocaleString("id-ID")}
                   </p>
                   <button
                    onClick={() => toggleStatus(selected.id, selected.is_read)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      selected.is_read
                        ? "bg-gray-100 dark:bg-white/5 text-gray-500"
                        : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    }`}
                  >
                    {selected.is_read ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-3xl p-8 mb-8 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FaReply className="text-4xl" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Isi Pesan</p>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {selected.message}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-gray-200 dark:border-white/5">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Portfolio Inquiry'}`)}&body=${encodeURIComponent(`Halo ${selected.name},\n\nTerima kasih telah menghubungi saya melalui portfolio. Saya telah menerima pesan Anda dan akan segera merespons.\n\nSalam,\nDaffa Rizky\n\n---\nOriginal Message:\n${selected.message}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-2xl transition-all border border-red-500/20"
                >
                  <FaEnvelope /> Balas via Email
                </a>
                <a
                  href={`https://wa.me/${selected.whatsapp ? selected.whatsapp.replace(/\D/g, '') : ''}?text=${encodeURIComponent(`Halo ${selected.name},\n\nTerima kasih telah menghubungi saya melalui portfolio. Saya telah menerima pesan Anda dan akan segera merespons.\n\nSalam,\nDaffa Rizky`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 ${selected.whatsapp ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'} font-bold rounded-2xl transition-all border ${selected.whatsapp ? 'border-green-500/20' : 'border-gray-200 dark:border-white/10'}`}
                  onClick={(e) => {
                    if (!selected.whatsapp) {
                      e.preventDefault()
                      alert('User tidak menyertakan nomor WhatsApp')
                    }
                  }}
                >
                  <FaWhatsapp /> Hubungi via WhatsApp
                </a>
                <button
                  onClick={() => deleteMessage(selected.id)}
                  className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-red-600 hover:text-white font-bold rounded-2xl transition-all"
                >
                  <FaTrash />
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
