'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaShieldAlt, FaUserLock, FaUserShield } from 'react-icons/fa'

type AdminUserRow = {
  id: string
  user_id: string
  role: 'super_admin' | 'editor'
  is_active: boolean
  created_at: string
}

export default function AdminUsers() {
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isSuper, setIsSuper] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ user_id: '', role: 'editor' })

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: me } = await supabase
            .from('admin_users')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle()
          setIsSuper(me?.role === 'super_admin')
        }
      } catch {
        /* not signed in */
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        if (data) setRows(data)
      } catch (error) {
        console.error('Error fetching admin users:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSuper) {
      alert('Hanya super admin yang dapat menambah admin.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('admin_users').insert({
        user_id: formData.user_id.trim(),
        role: formData.role,
        is_active: true,
      })
      if (error) throw error
      setFormData({ user_id: '', role: 'editor' })
      const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
      if (data) setRows(data)
    } catch (error) {
      console.error('Error adding admin user:', error)
      alert('Gagal menambah admin. Pastikan User ID valid dan belum terdaftar.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (row: AdminUserRow) => {
    if (!isSuper) return
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !row.is_active })
        .eq('id', row.id)
      if (error) throw error
      setRows(rows.map((r) => (r.id === row.id ? { ...r, is_active: !r.is_active } : r)))
    } catch (error) {
      console.error('Error toggling admin user:', error)
      alert('Gagal mengubah status admin.')
    }
  }

  const handleRoleChange = async (row: AdminUserRow, role: 'super_admin' | 'editor') => {
    if (!isSuper) return
    try {
      const { error } = await supabase.from('admin_users').update({ role }).eq('id', row.id)
      if (error) throw error
      setRows(rows.map((r) => (r.id === row.id ? { ...r, role } : r)))
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Gagal mengubah role admin.')
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
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Admin Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola akses panel admin. Hanya super admin yang dapat menambah / mengubah.
          </p>
        </div>
      </div>

      {!isSuper && (
        <div className="mb-6 px-5 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          Mode hanya-baca: Anda bukan super admin.
        </div>
      )}

      {isSuper && (
        <form onSubmit={handleAdd} className="mb-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaUserShield className="text-blue-500" /> Tambah Admin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="user_id"
              required
              value={formData.user_id}
              onChange={handleChange}
              placeholder="User UUID (dari Authentication → Users)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
            >
              <option value="editor">Editor</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              <FaPlus /> {saving ? 'Menyimpan...' : 'Tambah'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold text-sm">User UUID</th>
                <th className="p-4 font-semibold text-sm">Role</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">
                    <p>Belum ada admin. Tambahkan UUID akun Anda.</p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-300 max-w-[280px] truncate">
                      {row.user_id}
                    </td>
                    <td className="p-4">
                      {isSuper ? (
                        <select
                          value={row.role}
                          onChange={(e) => handleRoleChange(row, e.target.value as 'super_admin' | 'editor')}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-[#0A0A0F]"
                        >
                          <option value="editor">Editor</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`flex items-center gap-2 text-xs font-bold ${
                          row.role === 'super_admin' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {row.role === 'super_admin' ? <FaShieldAlt /> : <FaUserLock />}
                          {row.role === 'super_admin' ? 'Super Admin' : 'Editor'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        row.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {isSuper && (
                          <button
                            onClick={() => handleToggleActive(row)}
                            className={`p-2.5 rounded-xl transition-all border ${
                              row.is_active
                                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20'
                                : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20'
                            }`}
                            title={row.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {row.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        )}
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