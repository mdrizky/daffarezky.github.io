'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { BlogPost } from '@/types'

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      setPosts(posts.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Gagal menghapus artikel')
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-syne">Kelola Artikel Blog</h1>
        <Link 
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00FF88] text-[#0A0A0F] font-bold rounded-lg hover:bg-[#00cc6a] transition-colors"
        >
          <FaPlus /> Tulis Artikel
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold">Artikel</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    Belum ada artikel. Silakan tulis artikel baru.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold">{post.title}</div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs bg-white/10 rounded-full">{post.category}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {new Date(post.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/blog/${post.id}`}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
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
