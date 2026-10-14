'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FaSave, 
  FaImage, 
  FaInstagram, 
  FaGithub, 
  FaLinkedin, 
  FaWhatsapp, 
  FaEnvelope, 
  FaCloudUploadAlt,
  FaCheck,
  FaLink,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa'
import { Profile } from '@/types'

export default function AdminProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '',
    title_id: '',
    title_en: '',
    bio_id: '',
    bio_en: '',
    footer_bio_id: '',
    footer_bio_en: '',
    photo_url: '',
    about_photo_url: '',
    logo_url: '',
    wa: '',
    email: '',
    instagram: '',
    github: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
    stats_projects: '0',
    stats_tools: '0',
    stats_passion: '∞',
    birth_date: '',
    birth_place: '',
    current_city: '',
    vision_id: '',
    vision_en: '',
    motto_id: '',
    motto_en: '',
    focus_id: '',
    focus_en: '',
    values_id: '',
    values_en: '',
    availability_status_id: '',
    availability_status_en: '',
    work_hours: ''
  })
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        // Format birth_date if present
        const formattedData = {
          ...data,
          birth_date: data.birth_date ? String(data.birth_date).split('T')[0] : ''
        }
        setProfile(formattedData)
        setProfileId(data.id)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  // Upload handler with INSTANT AUTO-SAVE to database
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'photo_url' | 'about_photo_url' | 'logo_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    try {
      const fileExt = file.name.split('.').pop() || 'png'
      const cleanFileName = `${field}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      
      // Upload to storage
      const filePath = `profile/${cleanFileName}`
      let finalPath = filePath

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        })

      if (uploadError) {
        // Fallback to general/ folder if profile/ is restricted
        const fallbackPath = `general/${cleanFileName}`
        const { error: fallbackError } = await supabase.storage
          .from('portfolio-images')
          .upload(fallbackPath, file, { upsert: true })

        if (fallbackError) {
          throw new Error(uploadError.message || fallbackError.message)
        }
        finalPath = fallbackPath
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(finalPath)

      const newPublicUrl = urlData.publicUrl

      // 1. Update React state immediately
      setProfile(prev => ({ ...prev, [field]: newPublicUrl }))

      // 2. AUTO-SAVE IMMEDIATELY TO SUPABASE DATABASE
      let activeId = profileId
      if (!activeId) {
        const { data: existing } = await supabase.from('profile').select('id').limit(1).maybeSingle()
        if (existing?.id) {
          activeId = existing.id
          setProfileId(existing.id)
        }
      }

      if (activeId) {
        const { error: updateError } = await supabase
          .from('profile')
          .update({ 
            [field]: newPublicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeId)

        if (updateError) throw updateError
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('profile')
          .insert([{
            [field]: newPublicUrl,
            name: profile.name || 'Muhammad Daffa Rezky Adyra',
            email: profile.email || 'daffarezky99@gmail.com',
            updated_at: new Date().toISOString()
          }])
          .select('id')
          .single()

        if (insertError) throw insertError
        if (inserted?.id) setProfileId(inserted.id)
      }

      setSaveSuccessMsg(`Gambar ${field === 'photo_url' ? 'Foto Beranda' : field === 'about_photo_url' ? 'Foto Tentang' : 'Logo Site'} berhasil diupload dan disimpan ke database!`)
      setTimeout(() => setSaveSuccessMsg(null), 4000)
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error uploading image:', error)
      alert(`Gagal mengupload gambar: ${errorMsg}\n\nTip: Pastikan Anda sudah menjalankan script SQL FINAL_DATABASE_SETUP.sql di Supabase SQL Editor.`)
    } finally {
      setUploadingField(null)
      e.target.value = ''
    }
  }

  // Save single image URL manually
  const handleSaveImageUrl = async (field: 'photo_url' | 'about_photo_url' | 'logo_url') => {
    const url = profile[field]?.trim()
    if (!url) return

    setSaving(true)
    try {
      let activeId = profileId
      if (!activeId) {
        const { data: existing } = await supabase.from('profile').select('id').limit(1).maybeSingle()
        if (existing?.id) {
          activeId = existing.id
          setProfileId(existing.id)
        }
      }

      if (activeId) {
        const { error } = await supabase
          .from('profile')
          .update({ 
            [field]: url,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeId)

        if (error) throw error
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('profile')
          .insert([{
            [field]: url,
            name: profile.name || 'Muhammad Daffa Rezky Adyra',
            email: profile.email || 'daffarezky99@gmail.com',
            updated_at: new Date().toISOString()
          }])
          .select('id')
          .single()

        if (insertError) throw insertError
        if (inserted?.id) setProfileId(inserted.id)
      }

      setSaveSuccessMsg(`URL ${field === 'photo_url' ? 'Foto Beranda' : field === 'about_photo_url' ? 'Foto Tentang' : 'Logo Site'} berhasil disimpan ke database!`)
      setTimeout(() => setSaveSuccessMsg(null), 3000)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
      alert(`Gagal menyimpan URL: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  // Full form submit handler with proper data sanitization
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Data sanitization
      const payload: Record<string, unknown> = { ...profile }
      delete payload.id
      delete payload.created_at

      // Clean birth_date (PostgreSQL DATE cannot receive empty string)
      if (!payload.birth_date || payload.birth_date === '' || typeof payload.birth_date !== 'string') {
        payload.birth_date = null
      } else {
        payload.birth_date = String(payload.birth_date).split('T')[0]
      }

      payload.updated_at = new Date().toISOString()

      let activeId = profileId
      if (!activeId) {
        const { data: existing } = await supabase.from('profile').select('id').limit(1).maybeSingle()
        if (existing?.id) {
          activeId = existing.id
          setProfileId(existing.id)
        }
      }

      if (activeId) {
        const { error } = await supabase
          .from('profile')
          .update(payload)
          .eq('id', activeId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('profile')
          .insert([payload])
          .select('id')
          .single()
        if (error) throw error
        if (data) setProfileId(data.id)
      }
      
      setSaveSuccessMsg('Seluruh data profile berhasil disimpan ke database!')
      setTimeout(() => setSaveSuccessMsg(null), 4000)
      alert('Profile berhasil disimpan!')
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error saving profile:', error)
      alert(`Gagal menyimpan profile: ${errorMsg}\n\nPeriksa izin database atau jalankan FINAL_DATABASE_SETUP.sql di Supabase.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl pb-20 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white mb-2">Profil & Identitas Situs</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Kelola foto beranda, foto tentang, logo situs, biodata, dan kontak. Foto yang diupload akan otomatis tersimpan langsung ke database.
        </p>
      </div>

      {saveSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <FaCheck className="text-emerald-500" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Section */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 text-gray-900 dark:text-white flex items-center justify-between">
            <span>Media & Foto</span>
            <span className="text-xs font-normal text-cyan-500">Auto-save aktif</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Profile Photo (Foto Beranda) */}
            <div className="text-center flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Foto Beranda (Hero)</label>
              <div className="relative aspect-square w-full max-w-[200px] mb-4 rounded-full overflow-hidden border-4 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-black/30 shadow-md">
                {uploadingField === 'photo_url' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-white">
                    <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs font-bold">Mengupload...</span>
                  </div>
                ) : profile.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photo_url} alt="Foto Beranda" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage size={44} /></div>
                )}
              </div>

              <input 
                type="file" 
                id="photo_url" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'photo_url')} 
                disabled={uploadingField !== null}
              />
              <label 
                htmlFor="photo_url" 
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 hover:scale-105"
              >
                <FaCloudUploadAlt />
                <span>Ganti Foto Beranda</span>
              </label>

              {/* Direct URL input */}
              <div className="w-full mt-3 flex items-center gap-1.5">
                <input
                  type="url"
                  name="photo_url"
                  placeholder="Atau tempel URL foto..."
                  value={profile.photo_url || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-800 dark:text-zinc-200 outline-none"
                />
                <button
                  type="button"
                  title="Simpan URL langsung"
                  onClick={() => handleSaveImageUrl('photo_url')}
                  className="px-2.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg text-xs font-bold text-gray-800 dark:text-white"
                >
                  <FaLink />
                </button>
              </div>
            </div>

            {/* 2. About Photo (Foto Tentang) */}
            <div className="text-center flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Foto Tentang (About)</label>
              <div className="relative aspect-square w-full max-w-[200px] mb-4 rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-black/30 shadow-md">
                {uploadingField === 'about_photo_url' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-white">
                    <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs font-bold">Mengupload...</span>
                  </div>
                ) : profile.about_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.about_photo_url} alt="Foto Tentang" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage size={44} /></div>
                )}
              </div>

              <input 
                type="file" 
                id="about_photo_url" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'about_photo_url')} 
                disabled={uploadingField !== null}
              />
              <label 
                htmlFor="about_photo_url" 
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 hover:scale-105"
              >
                <FaCloudUploadAlt />
                <span>Ganti Foto Tentang</span>
              </label>

              {/* Direct URL input */}
              <div className="w-full mt-3 flex items-center gap-1.5">
                <input
                  type="url"
                  name="about_photo_url"
                  placeholder="Atau tempel URL foto..."
                  value={profile.about_photo_url || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-800 dark:text-zinc-200 outline-none"
                />
                <button
                  type="button"
                  title="Simpan URL langsung"
                  onClick={() => handleSaveImageUrl('about_photo_url')}
                  className="px-2.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg text-xs font-bold text-gray-800 dark:text-white"
                >
                  <FaLink />
                </button>
              </div>
            </div>

            {/* 3. Logo Site (Logo Situs) */}
            <div className="text-center flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Logo Site (Navbar/Header)</label>
              <div className="relative aspect-square w-full max-w-[200px] mb-4 rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-zinc-700 bg-gray-900 flex items-center justify-center shadow-md p-3">
                {uploadingField === 'logo_url' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-white">
                    <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs font-bold">Mengupload...</span>
                  </div>
                ) : profile.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.logo_url} alt="Logo Site" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage size={44} /></div>
                )}
              </div>

              <input 
                type="file" 
                id="logo_url" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'logo_url')} 
                disabled={uploadingField !== null}
              />
              <label 
                htmlFor="logo_url" 
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 hover:scale-105"
              >
                <FaCloudUploadAlt />
                <span>Ganti Logo Site</span>
              </label>

              {/* Direct URL input */}
              <div className="w-full mt-3 flex items-center gap-1.5">
                <input
                  type="url"
                  name="logo_url"
                  placeholder="Atau tempel URL logo..."
                  value={profile.logo_url || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-800 dark:text-zinc-200 outline-none"
                />
                <button
                  type="button"
                  title="Simpan URL langsung"
                  onClick={() => handleSaveImageUrl('logo_url')}
                  className="px-2.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg text-xs font-bold text-gray-800 dark:text-white"
                >
                  <FaLink />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 text-gray-900 dark:text-white">Identitas Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
              <input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gelar / Title (ID)</label>
              <input type="text" name="title_id" value={profile.title_id || ''} onChange={handleChange} placeholder="Web & Mobile Developer" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title (EN)</label>
              <input type="text" name="title_en" value={profile.title_en || ''} onChange={handleChange} placeholder="Web & Mobile Developer" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tempat Lahir</label>
              <input type="text" name="birth_place" value={profile.birth_place || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tanggal Lahir</label>
              <input type="date" name="birth_date" value={profile.birth_date || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kota Saat Ini</label>
              <input type="text" name="current_city" value={profile.current_city || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jam Kerja</label>
              <input type="text" name="work_hours" value={profile.work_hours || ''} onChange={handleChange} placeholder="Contoh: 08:00 - 17:00" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status Ketersediaan (ID)</label>
              <input type="text" name="availability_status_id" value={profile.availability_status_id || ''} onChange={handleChange} placeholder="Tersedia untuk proyek freelance terpilih" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Availability Status (EN)</label>
              <input type="text" name="availability_status_en" value={profile.availability_status_en || ''} onChange={handleChange} placeholder="Available for selected freelance projects" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Bio, Vision, Motto */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 text-gray-900 dark:text-white">Bio, Visi & Nilai</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio Singkat (ID)</label>
                <textarea name="bio_id" rows={4} value={profile.bio_id || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Short Bio (EN)</label>
                <textarea name="bio_en" rows={4} value={profile.bio_en || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Visi (ID)</label>
                <textarea name="vision_id" rows={3} value={profile.vision_id || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vision (EN)</label>
                <textarea name="vision_en" rows={3} value={profile.vision_en || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motto / Quote (ID)</label>
                <input type="text" name="motto_id" value={profile.motto_id || ''} onChange={handleChange} placeholder="Teknologi • Inovasi • Kebermanfaatan" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
                <span className="text-xs text-muted-foreground mt-1 block">Tampil di footer dan kutipan utama situs (Bahasa Indonesia).</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motto / Quote (EN)</label>
                <input type="text" name="motto_en" value={profile.motto_en || ''} onChange={handleChange} placeholder="Technology • Innovation • Benefit" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
                <span className="text-xs text-muted-foreground mt-1 block">Tampil di footer dan kutipan utama situs (Bahasa Inggris).</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-zinc-800">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Teks Bio Footer (ID)</label>
                <textarea 
                  name="footer_bio_id" 
                  rows={3} 
                  value={profile.footer_bio_id || ''} 
                  onChange={handleChange} 
                  placeholder="Web & Mobile Developer yang berfokus pada pengembangan teknologi, inovasi digital, dan solusi yang memberikan dampak positif bagi masyarakat." 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" 
                />
                <span className="text-xs text-muted-foreground mt-1 block">Teks deskripsi ringkas di bawah logo pada footer website pengguna (ID).</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Footer Bio Text (EN)</label>
                <textarea 
                  name="footer_bio_en" 
                  rows={3} 
                  value={profile.footer_bio_en || ''} 
                  onChange={handleChange} 
                  placeholder="Web & Mobile Developer focused on technology development, digital innovation, and solutions that provide a positive impact on society." 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" 
                />
                <span className="text-xs text-muted-foreground mt-1 block">Teks deskripsi ringkas di bawah logo pada footer website pengguna (EN).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 text-gray-900 dark:text-white">Statistik Angka</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jumlah Proyek</label>
              <input type="text" name="stats_projects" value={profile.stats_projects || '0'} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jumlah Tools / Teknologi</label>
              <input type="text" name="stats_tools" value={profile.stats_tools || '0'} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Passion Stat</label>
              <input type="text" name="stats_passion" value={profile.stats_passion || '∞'} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 text-gray-900 dark:text-white">Kontak & Media Sosial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaWhatsapp className="text-emerald-500" /> WhatsApp (Nomor HP)</label>
              <input type="text" name="wa" value={profile.wa || ''} onChange={handleChange} placeholder="08xxxxxxxxxx" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaEnvelope className="text-red-500" /> Email</label>
              <input type="email" name="email" value={profile.email || ''} onChange={handleChange} placeholder="daffarezky99@gmail.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaInstagram className="text-pink-500" /> Instagram</label>
              <input type="text" name="instagram" value={profile.instagram || ''} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaGithub /> GitHub</label>
              <input type="text" name="github" value={profile.github || ''} onChange={handleChange} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaLinkedin className="text-blue-500" /> LinkedIn</label>
              <input type="text" name="linkedin" value={profile.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaTiktok className="text-zinc-900 dark:text-white" /> TikTok</label>
              <input type="text" name="tiktok" value={profile.tiktok || ''} onChange={handleChange} placeholder="https://tiktok.com/@... atau username" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaYoutube className="text-red-500" /> YouTube</label>
              <input type="text" name="youtube" value={profile.youtube || ''} onChange={handleChange} placeholder="https://youtube.com/@... atau channel URL" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploadingField !== null}
            className="flex items-center gap-3 px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  )
}
