'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaCheck, FaTrash, FaWhatsapp } from 'react-icons/fa'
import { Message } from '@/types'

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id)
      if (error) throw error
      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Gagal menghapus pesan')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Pesan Masuk</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola pesan dari pengunjung website Anda.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center p-16 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl">📭</div>
              <p>Belum ada pesan masuk.</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${
                msg.is_read 
                  ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/5' 
                  : 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/30 ring-1 ring-blue-500/10'
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-3 text-gray-900 dark:text-white">
                    {msg.name}
                    {!msg.is_read && (
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold">Baru</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{msg.email}</p>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm mb-6 border border-gray-100 dark:border-white/5">
                {msg.message}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Halo ${msg.name}, saya Daffa Rizky. Membalas pesan Anda dari website portfolio saya: "${msg.message.substring(0, 50)}..."`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors text-sm font-semibold shadow-sm"
                >
                  <FaWhatsapp /> Balas via WA
                </a>
                
                {!msg.is_read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <FaCheck /> Tandai Dibaca
                  </button>
                )}

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm ml-auto"
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
