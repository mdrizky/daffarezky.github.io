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
        <div className="w-8 h-8 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-syne">Kelola Portfolio</h1>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00FF88] text-[#0A0A0F] font-bold rounded-lg hover:bg-[#00cc6a] transition-colors"
        >
          <FaPlus /> Tambah Project
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold">Project</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    Belum ada project. Silakan tambah project baru.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold">{project.title}</div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs bg-white/10 rounded-full">{project.category}</span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleFeatured(project.id, project.featured)}
                        className={`text-xl ${project.featured ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                      >
                        {project.featured ? <FaStar /> : <FaRegStar />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/projects/${project.id}`}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id)}
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
