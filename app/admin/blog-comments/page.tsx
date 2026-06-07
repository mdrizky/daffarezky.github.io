'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaTrash, FaCheck, FaTimes, FaComments } from 'react-icons/fa'

export default function BlogCommentsAdmin() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          blog_posts (
            title_id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error: any) {
      console.error('Error fetching comments:', error.message)
      alert('Gagal mengambil data komentar')
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, is_approved: !currentStatus } : comment
      ))
      alert(currentStatus ? 'Komentar disembunyikan' : 'Komentar disetujui')
    } catch (error: any) {
      alert('Gagal mengubah status approval')
    }
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setComments(comments.filter(comment => comment.id !== id))
      alert('Komentar dihapus')
    } catch (error: any) {
      alert('Gagal menghapus komentar')
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
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white flex items-center gap-3">
          <FaComments className="text-blue-500" /> Moderasi Komentar Blog
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola komentar yang masuk di artikel blog Anda.</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-bottom border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Pengirim</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Artikel / Komentar</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {comments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Belum ada komentar.</td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{comment.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{comment.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-md">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                        Art: {comment.blog_posts?.title_id || 'Unknown Post'}
                      </div>
                      <p className="line-clamp-2 text-sm italic">"{comment.content}"</p>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {new Date(comment.created_at).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {comment.is_approved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                          <FaCheck size={10} /> Disetujui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
                          <FaTimes size={10} /> Menunggu
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => toggleApproval(comment.id, comment.is_approved)}
                        className={`p-2 rounded-lg transition-colors ${
                          comment.is_approved 
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400'
                        }`}
                        title={comment.is_approved ? 'Batalkan Approval' : 'Setujui'}
                      >
                        {comment.is_approved ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
