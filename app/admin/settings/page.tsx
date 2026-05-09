'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaUserShield, FaExclamationTriangle } from 'react-icons/fa'

export default function AdminSettings() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('Email ini sudah terdaftar sebagai Admin.')
      } else {
        alert('✅ ADMIN BARU BERHASIL DITAMBAHKAN!\n\nPENTING: Sesi Anda saat ini telah tergantikan oleh akun baru tersebut. Silakan minta admin baru untuk mengecek emailnya dan melakukan verifikasi.\n\nUntuk kembali ke akun utama Anda, silakan Logout dan Login kembali.')
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan admin baru.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white mb-2">Pengaturan Admin</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola akses administrator untuk website portfolio Anda.</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
          <FaUserShield className="text-blue-500 text-2xl" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tambah Admin Baru</h2>
        </div>

        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl flex gap-4">
          <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-500 text-xl flex-shrink-0 mt-1" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Perhatian:</strong> Karena sistem keamanan Supabase, mendaftarkan admin baru dari halaman ini akan otomatis mengeluarkan (logout) sesi Anda saat ini. Setelah pendaftaran berhasil, Anda perlu menekan tombol Logout di menu sebelah kiri dan Login kembali menggunakan akun utama Anda.
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAddAdmin} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Admin Baru</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password Sementara</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:hover:shadow-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Daftarkan Admin Baru'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
