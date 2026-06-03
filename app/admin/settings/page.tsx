'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { FaShieldAlt, FaImage, FaTrash, FaSave, FaCheckCircle, FaExclamationTriangle, FaSearch } from 'react-icons/fa'

export default function AdminSettings() {
  // ── Logo management ────────────────────────────────────────────
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUrlInput, setLogoUrlInput] = useState('')
  const [profileId, setProfileId] = useState<string | null>(null)
  const [logoLoading, setLogoLoading] = useState(true)
  const [logoSaving, setLogoSaving] = useState(false)
  const [logoSuccess, setLogoSuccess] = useState(false)
  const [logoError, setLogoError] = useState('')

  // ── SEO & PIN Settings ─────────────────────────────────────────
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [siteTitle, setSiteTitle] = useState('')
  const [siteDescription, setSiteDescription] = useState('')
  const [adminPin, setAdminPin] = useState('')
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState(false)
  const [settingsError, setSettingsError] = useState('')

  useEffect(() => {
    fetchLogo()
    fetchSettings()
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
      // no profile row yet
    } finally {
      setLogoLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single()

      if (data) {
        setSettingsId(data.id)
        setSiteTitle(data.site_title || '')
        setSiteDescription(data.site_description || '')
        setAdminPin(data.admin_pin || '')
      }
    } catch {
      // no settings row yet
    } finally {
      setSettingsLoading(false)
    }
  }

  const saveLogo = async (newUrl: string | null) => {
    let currentId = profileId
    if (!currentId) {
      const { data, error: insertError } = await supabase
        .from('profile')
        .insert([{ logo_url: newUrl }])
        .select('id')
        .single()

      if (insertError) throw insertError
      currentId = data.id
      setProfileId(currentId)
    } else {
      const { error: updateError } = await supabase
        .from('profile')
        .update({ logo_url: newUrl })
        .eq('id', currentId)

      if (updateError) throw updateError
    }

    setLogoUrl(newUrl)
    setLogoUrlInput(newUrl || '')
    setLogoSuccess(true)
    setTimeout(() => setLogoSuccess(false), 3000)
  }

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setLogoError('File harus berupa gambar (PNG, JPG, SVG, WebP).')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Ukuran file maksimal 2 MB.')
      return
    }

    setLogoSaving(true)
    setLogoError('')

    try {
      const ext = file.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${ext}`
      const filePath = `profile/${fileName}`

      // Perbaikan: Pastikan bucket 'portfolio-images' sudah ada dan RLS-nya benar di Supabase
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        })

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError)
        throw new Error(`Gagal upload ke storage: ${uploadError.message}. Pastikan bucket 'portfolio-images' sudah ada.`)
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      await saveLogo(urlData.publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setLogoError(msg)
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setLogoError(msg || 'Gagal menyimpan URL logo.')
    } finally {
      setLogoSaving(false)
    }
  }

  const handleRemoveLogo = async () => {
    setLogoSaving(true)
    setLogoError('')
    try {
      await saveLogo(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setLogoError(msg || 'Gagal menghapus logo.')
    } finally {
      setLogoSaving(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsSuccess(false)

    try {
      if (adminPin.length !== 6 || isNaN(Number(adminPin))) {
        throw new Error('PIN Admin harus terdiri dari 6 angka.')
      }

      const payload = {
        site_title: siteTitle,
        site_description: siteDescription,
        admin_pin: adminPin
      }

      if (settingsId) {
        const { error } = await supabase.from('settings').update(payload).eq('id', settingsId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('settings').insert([payload]).select('id').single()
        if (error) throw error
        if (data) setSettingsId(data.id)
      }

      // Automatically update localStorage if PIN changes so admin isn't kicked out
      localStorage.setItem('admin_pin_auth', 'true')
      
      setSettingsSuccess(true)
      setTimeout(() => setSettingsSuccess(false), 3000)
    } catch (err: any) {
      setSettingsError(err.message || 'Gagal menyimpan pengaturan.')
    } finally {
      setSettingsSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Kelola logo website, SEO (Meta Tags), dan PIN akses admin.</p>
      </div>

      {/* ── Logo ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500">
            <FaImage className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Logo Website</h2>
        </div>

        {logoLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-black/20">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Preview Logo Saat Ini</p>
              <div className="w-32 h-32 relative bg-white dark:bg-black rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
                ) : (
                  <span className="text-4xl font-bold font-syne text-gray-300 dark:text-gray-700">
                    D.R
                  </span>
                )}
              </div>
              {logoUrl && (
                <button
                  onClick={handleRemoveLogo}
                  disabled={logoSaving}
                  className="mt-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 font-medium bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-lg"
                >
                  <FaTrash className="text-xs" />
                  Hapus Logo
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Upload File Baru
                </p>
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group"
                >
                  <FaImage className="text-3xl text-blue-400 group-hover:text-blue-500 transition-colors mb-2" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Klik untuk upload (PNG / JPG / SVG / WebP)
                  </span>
                  <span className="text-xs text-blue-500/70 dark:text-blue-400/70 mt-1">Maks. 2 MB</span>
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

              {logoSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-3 font-medium">
                  <FaCheckCircle className="flex-shrink-0" />
                  Logo berhasil disimpan! (Silakan refresh)
                </div>
              )}
              {logoError && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 font-medium">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {logoError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── SEO & Access ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-500">
            <FaSearch className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengaturan SEO & Keamanan</h2>
        </div>

        {settingsLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Judul Website (Title Tag)
                </label>
                <input
                  type="text"
                  required
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-white transition-all text-sm font-medium"
                  placeholder="Daffa Rizky | Web Developer"
                />
                <p className="text-xs text-gray-500">Maks. 60 karakter untuk hasil optimal di Google.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  PIN Admin (6 Angka) <FaShieldAlt className="inline text-blue-500 ml-1" />
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all text-sm font-mono tracking-widest font-bold"
                  placeholder="240708"
                />
                <p className="text-xs text-gray-500">Gunakan PIN ini untuk masuk ke halaman admin.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Deskripsi Website (Meta Description)
              </label>
              <textarea
                required
                rows={3}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-white transition-all text-sm font-medium resize-none custom-scrollbar"
                placeholder="Freelance Developer Indonesia..."
              />
              <p className="text-xs text-gray-500">Maks. 160 karakter. Mendeskripsikan secara singkat tentang diri Anda di hasil pencarian Google.</p>
            </div>

            {settingsSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-3 font-medium">
                <FaCheckCircle className="flex-shrink-0" />
                Pengaturan SEO dan PIN berhasil disimpan!
              </div>
            )}
            
            {settingsError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 font-medium">
                <FaExclamationTriangle className="flex-shrink-0" />
                {settingsError}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                type="submit"
                disabled={settingsSaving}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:hover:shadow-none"
              >
                {settingsSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FaSave />
                    Simpan Pengaturan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  )
}
