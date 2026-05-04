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
        <div className="w-8 h-8 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-syne mb-8">Pesan Masuk</h1>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-xl text-gray-400">
            Belum ada pesan masuk.
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-6 rounded-xl border ${
                msg.is_read ? 'bg-white/5 border-white/5' : 'bg-[#00FF88]/5 border-[#00FF88]/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-3">
                    {msg.name}
                    {!msg.is_read && (
                      <span className="text-xs bg-[#00FF88] text-black px-2 py-0.5 rounded-full font-bold">Baru</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{msg.email}</p>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="p-4 bg-black/20 rounded-lg text-gray-300 whitespace-pre-wrap text-sm mb-6">
                {msg.message}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Halo ${msg.name}, saya Daffa Rizky. Membalas pesan Anda dari website portfolio saya: "${msg.message.substring(0, 50)}..."`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors text-sm font-medium"
                >
                  <FaWhatsapp /> Balas via WA
                </a>
                
                {!msg.is_read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors text-sm"
                  >
                    <FaCheck /> Tandai Dibaca
                  </button>
                )}

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm ml-auto"
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
