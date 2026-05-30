'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa'
import { Project } from '@/types'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus project ini?')) return

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      setProjects(projects.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Gagal menghapus project')
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !currentFeatured })
        .eq('id', id)

      if (error) throw error
      setProjects(projects.map((p) => p.id === id ? { ...p, featured: !currentFeatured } : p))
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Gagal mengupdate status featured')
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola proyek-proyek yang ditampilkan di portfolio Anda.</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          <FaPlus /> Tambah Project
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold text-sm">Project (ID & EN)</th>
                <th className="p-4 font-semibold text-sm">Kategori</th>
                <th className="p-4 font-semibold text-sm">Progres</th>
                <th className="p-4 font-semibold text-sm text-center">Current</th>
                <th className="p-4 font-semibold text-sm text-center">Featured</th>
                <th className="p-4 font-semibold text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl">📁</div>
                      <p>Belum ada project. Silakan tambah project baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title_id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white mb-1">
                            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 px-1.5 py-0.5 rounded mr-2">ID</span>
                            {project.title_id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 px-1.5 py-0.5 rounded mr-2">EN</span>
                            {project.title_en}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 rounded-full border border-gray-200 dark:border-white/5">{project.category}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              project.progress === 100 ? 'bg-green-500' : 
                              project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {project.is_current && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 text-xs font-bold rounded-full">Active</span>
                      )}
                      {project.completion_date && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{project.completion_date}</div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleFeatured(project.id, project.featured)}
                        className={`text-xl p-2 rounded-full transition-all ${project.featured ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                      >
                        {project.featured ? <FaStar className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" /> : <FaRegStar />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/projects/${project.id}`}
                          className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
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
