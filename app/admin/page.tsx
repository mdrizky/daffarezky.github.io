'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaProjectDiagram, FaBlog, FaEnvelope, FaServicestack } from 'react-icons/fa'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    services: 0,
  })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [projectsRes, blogsRes, messagesRes, servicesRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('services').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        projects: projectsRes.count || 0,
        blogs: blogsRes.count || 0,
        messages: messagesRes.count || 0,
        services: servicesRes.count || 0,
      })

      // Fetch recent messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (messagesData) {
        setRecentMessages(messagesData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: FaProjectDiagram, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Blog Posts', value: stats.blogs, icon: FaBlog, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Unread Messages', value: stats.messages, icon: FaEnvelope, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Services', value: stats.services, icon: FaServicestack, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-syne mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`text-xl ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-syne">Pesan Terbaru</h2>
            <Link href="/admin/messages" className="text-sm text-[#00FF88] hover:underline">
              Lihat Semua
            </Link>
          </div>
          
          {recentMessages.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Belum ada pesan masuk.</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 bg-black/20 rounded-lg border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        {msg.name}
                        {!msg.is_read && (
                          <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">New</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400">{msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold font-syne mb-6">Quick Links</h2>
          <div className="space-y-3">
            <Link href="/admin/projects" className="block p-4 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 transition-colors">
              <div className="font-bold text-[#00FF88]">Kelola Portfolio</div>
              <div className="text-xs text-gray-400 mt-1">Tambah atau edit project</div>
            </Link>
            <Link href="/admin/blog" className="block p-4 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 transition-colors">
              <div className="font-bold text-[#0099FF]">Tulis Artikel Blog</div>
              <div className="text-xs text-gray-400 mt-1">Publikasi artikel baru</div>
            </Link>
            <Link href="/admin/profile" className="block p-4 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 transition-colors">
              <div className="font-bold text-purple-400">Update Profile</div>
              <div className="text-xs text-gray-400 mt-1">Edit bio & link sosial media</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
