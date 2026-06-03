'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaProjectDiagram, FaBlog, FaEnvelope, FaCogs, FaGraduationCap, FaTools, FaUserEdit, FaArrowRight, FaBriefcase, FaCertificate } from 'react-icons/fa'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    services: 0,
    skills: 0,
    education: 0,
    learning: 0,
    certificates: 0,
  })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()

    // Setup Supabase Realtime for Messages
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          // Update stats count
          setStats(prev => ({
            ...prev,
            messages: prev.messages + 1
          }))
          // Update recent messages
          setRecentMessages(prev => {
            const newArray = [payload.new, ...prev]
            return newArray.slice(0, 5) // keep only 5
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          // If a message was marked as read/unread, update the count accordingly.
          // Note: The stats count currently tracks total UNREAD messages.
          // Wait, actually the fetchDashboardData counts unread messages: .eq('is_read', false)
          const wasUnread = payload.old?.is_read === false
          const isNowUnread = payload.new.is_read === false

          if (wasUnread && !isNowUnread) {
            setStats(prev => ({ ...prev, messages: Math.max(0, prev.messages - 1) }))
          } else if (!wasUnread && isNowUnread) {
            setStats(prev => ({ ...prev, messages: prev.messages + 1 }))
          }

          setRecentMessages(prev => 
            prev.map(msg => msg.id === payload.new.id ? { ...msg, is_read: payload.new.is_read } : msg)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, blogsRes, messagesRes, servicesRes, skillsRes, educationRes, learning_journeyRes, certificatesRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase.from('learning_journey').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        projects: projectsRes.count || 0,
        blogs: blogsRes.count || 0,
        messages: messagesRes.count || 0,
        services: servicesRes.count || 0,
        skills: skillsRes.count || 0,
        education: educationRes.count || 0,
        learning: learning_journeyRes.count || 0,
        certificates: certificatesRes.count || 0,
      })

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
    { title: 'Portfolio', value: stats.projects, icon: FaProjectDiagram, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', href: '/admin/projects' },
    { title: 'Artikel Blog', value: stats.blogs, icon: FaBlog, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/20', href: '/admin/blog' },
    { title: 'Pesan', value: stats.messages, icon: FaEnvelope, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-yellow-500/10', border: 'border-amber-200 dark:border-yellow-500/20', href: '/admin/messages' },
    { title: 'Layanan', value: stats.services, icon: FaCogs, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/20', href: '/admin/services' },
    { title: 'Keahlian', value: stats.skills, icon: FaTools, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-500/20', href: '/admin/skills' },
    { title: 'Pengalaman', value: stats.learning, icon: FaBriefcase, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', href: '/admin/experience' },
  ]

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
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Selamat datang di panel admin. Berikut ringkasan data terbaru Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.href} className={`group bg-white dark:bg-white/5 border ${stat.border} rounded-2xl p-6 hover:shadow-lg dark:hover:bg-white/8 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} transition-transform group-hover:scale-110`}>
                <stat.icon className={`text-xl ${stat.color}`} />
              </div>
              <FaArrowRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform" />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-syne text-gray-900 dark:text-white">Pesan Terbaru</h2>
            <Link href="/admin/messages" className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
              Lihat Semua →
            </Link>
          </div>
          
          {recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl mb-3">📭</div>
              <p>Belum ada pesan masuk.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-xl border transition-colors ${
                  msg.is_read 
                    ? 'bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-white/5' 
                    : 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        {msg.name}
                        {!msg.is_read && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-full font-semibold">Baru</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold font-syne mb-6 text-gray-900 dark:text-white">Quick Links</h2>
          <div className="space-y-3">
            <Link href="/admin/projects" className="group block p-4 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5 transition-all">
              <div className="font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-2"><FaProjectDiagram /> Kelola Portfolio</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tambah atau edit project</div>
            </Link>
            <Link href="/admin/blog" className="group block p-4 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-green-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5 transition-all">
              <div className="font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 flex items-center gap-2"><FaBlog /> Tulis Artikel Blog</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Publikasi artikel baru</div>
            </Link>
            <Link href="/admin/profile" className="group block p-4 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-purple-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5 transition-all">
              <div className="font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 flex items-center gap-2"><FaUserEdit /> Update Profile</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Edit bio & link sosial media</div>
            </Link>
            <Link href="/admin/education" className="group block p-4 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-rose-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/5 transition-all">
              <div className="font-bold text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 flex items-center gap-2"><FaGraduationCap /> Pendidikan</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kelola riwayat pendidikan</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
