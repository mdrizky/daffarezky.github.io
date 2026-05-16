'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { FaUserShield, FaExclamationTriangle, FaImage, FaTrash, FaSave, FaCheckCircle } from 'react-icons/fa'
import { invalidateSiteLogoCache } from '@/components/SiteLogo'

export default function AdminSettings() {
  // ── Admin account ──────────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountLoading, setAccountLoading] = useState(false)
  const [accountError, setAccountError] = useState('')

  // ── Logo management ────────────────────────────────────────────
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUrlInput, setLogoUrlInput] = useState('')
  const [profileId, setProfileId] = useState<string | null>(null)
  const [logoLoading, setLogoLoading] = useState(true)
  const [logoSaving, setLogoSaving] = useState(false)
  const [logoSuccess, setLogoSuccess] = useState(false)
  const [logoError, setLogoError] = useState('')

  useEffect(() => {
    fetchLogo()
  }, [])

  const fetchLogo = async () => {
    try {
      const { data } = await supabase
        .from('profile')
        .select('id, logo_url')
        .limit(1)
        .single()

      if (data) {
        setProfileId(data.id)
        setLogoUrl(data.logo_url ?? null)
        setLogoUrlInput(data.logo_url ?? '')
      }
    } catch {
      // no profile row yet — that's fine
    } finally {
      setLogoLoading(false)
    }
  }

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLogoError('File harus berupa gambar (PNG, JPG, SVG, WebP).')
      return
    }
    // Validate file size (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Ukuran file maksimal 2 MB.')
      return
    }

    setLogoSaving(true)
    setLogoError('')

    try {
      const ext = file.name.split('.').pop()
      const filePath = `logo/site-logo-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      await saveLogo(urlData.publicUrl)
    } catch (err: any) {
      setLogoError(err.message || 'Gagal mengupload logo.')
    } finally {
      setLogoSaving(false)
    }
  }

  const handleLogoUrlSave = async () => {
    if (!logoUrlInput.trim()) {
      setLogoError('URL logo tidak boleh kosong.')
      return
    }
    setLogoSaving(true)
    setLogoError('')
    try {
      await saveLogo(logoUrlInput.trim())
    } catch (err: any) {
      setLogoError(err.message || 'Gagal menyimpan URL logo.')
    } finally {
      setLogoSaving(false)
    }
  }

  const handleRemoveLogo = async () => {
    if (!confirm('Hapus logo? Tampilan akan kembali ke inisial nama.')) return
    setLogoSaving(true)
    setLogoError('')
    try {
      await saveLogo(null)
      setLogoUrlInput('')
    } catch (err: any) {
      setLogoError(err.message || 'Gagal menghapus logo.')
    } finally {
      setLogoSaving(false)
    }
  }

  const saveLogo = async (url: string | null) => {
    if (!profileId) {
      throw new Error('Profile belum ditemukan. Buat profile terlebih dahulu di halaman Profile.')
    }

    const { error } = await supabase
      .from('profile')
      .update({ logo_url: url })
      .eq('id', profileId)

    if (error) throw error

    setLogoUrl(url)
    invalidateSiteLogoCache()
    setLogoSuccess(true)
    setTimeout(() => setLogoSuccess(false), 3000)
  }

  // ── Add admin account ──────────────────────────────────────────
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAccountLoading(true)
    setAccountError('')

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) throw error

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setAccountError('Email ini sudah terdaftar sebagai Admin.')
      } else {
        alert('✅ ADMIN BARU BERHASIL DITAMBAHKAN!\n\nPENTING: Sesi Anda saat ini telah tergantikan oleh akun baru tersebut. Silakan minta admin baru untuk mengecek emailnya dan melakukan verifikasi.\n\nUntuk kembali ke akun utama Anda, silakan Logout dan Login kembali.')
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      setAccountError(err.message || 'Gagal menambahkan admin baru.')
    } finally {
      setAccountLoading(false)
    }
  }

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white mb-2">Pengaturan</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola logo website dan akses administrator.</p>
      </div>

      {/* ── Logo Management ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
          <FaImage className="text-blue-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Logo Website</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Logo tampil di Navbar, Footer, dan Admin Sidebar di seluruh halaman.
            </p>
          </div>
        </div>

        {logoLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preview Logo</p>
              <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/10">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.3)] flex-shrink-0">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt="Site Logo"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00FF88] to-[#0099FF] text-white font-heading font-bold text-xl">
                      DR
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900 dark:text-white">Daffa Rizky</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {logoUrl ? '✅ Logo kustom aktif' : '⚪ Menggunakan inisial nama'}
                  </p>
                </div>
              </div>

              {logoUrl && (
                <button
                  onClick={handleRemoveLogo}
                  disabled={logoSaving}
                  className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  <FaTrash className="text-xs" />
                  Hapus logo, kembali ke inisial
                </button>
              )}
            </div>

            {/* Upload & URL */}
            <div className="space-y-5">
              {/* File upload */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Upload File Logo
                </p>
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <FaImage className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Klik untuk upload PNG / JPG / SVG / WebP
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">Maks. 2 MB</span>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoFileUpload}
                    disabled={logoSaving}
                  />
                </label>
              </div>

              {/* URL input */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Atau Paste URL Logo
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm transition-all"
                    disabled={logoSaving}
                  />
                  <button
                    onClick={handleLogoUrlSave}
                    disabled={logoSaving || !logoUrlInput.trim()}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm"
                  >
                    {logoSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaSave />
                    )}
                    Simpan
                  </button>
                </div>
              </div>

              {/* Feedback */}
              {logoSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-3">
                  <FaCheckCircle />
                  Logo berhasil disimpan! Refresh halaman untuk melihat perubahan.
                </div>
              )}
              {logoError && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
                  <FaExclamationTriangle />
                  {logoError}
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                <strong>Tips:</strong> Gunakan gambar persegi (1:1) dengan ukuran minimal 200×200px untuk hasil terbaik. Format PNG dengan background transparan sangat direkomendasikan.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Admin Account ────────────────────────────────────── */}
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

        {accountError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {accountError}
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
            disabled={accountLoading}
            className="flex w-full justify-center items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:hover:shadow-none"
          >
            {accountLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Daftarkan Admin Baru'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
