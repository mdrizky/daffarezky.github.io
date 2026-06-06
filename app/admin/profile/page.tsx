'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaSave, FaImage, FaInstagram, FaGithub, FaLinkedin, FaTiktok, FaYoutube, FaWhatsapp, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaLightbulb, FaQuoteLeft } from 'react-icons/fa'
import { Profile } from '@/types'

export default function AdminProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '',
    title_id: '',
    title_en: '',
    bio_id: '',
    bio_en: '',
    photo_url: '',
    about_photo_url: '',
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
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setProfile(data)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${field}-${Math.random()}.${fileExt}`
      const filePath = `profile/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setProfile(prev => ({ ...prev, [field]: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengupload gambar')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (profileId) {
        const { error } = await supabase
          .from('profile')
          .update(profile)
          .eq('id', profileId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('profile')
          .insert([profile])
        if (error) throw error
      }
      
      alert('Profile berhasil disimpan!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Gagal menyimpan profile')
    } finally {
      setSaving(false)
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
    <div className="max-w-5xl pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Full Admin Control - Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola semua informasi portfolio Anda dari satu tempat.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Section */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Media & Foto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Photo */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Foto Beranda</label>
              <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={40} /></div>
                )}
              </div>
              <input type="file" id="photo_url" className="hidden" onChange={(e) => handleFileUpload(e, 'photo_url')} />
              <label htmlFor="photo_url" className="cursor-pointer inline-block px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg text-xs font-bold transition-colors">Ganti Foto Beranda</label>
            </div>

            {/* About Photo */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Foto Tentang</label>
              <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                {profile.about_photo_url ? (
                  <img src={profile.about_photo_url} alt="About" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={40} /></div>
                )}
              </div>
              <input type="file" id="about_photo_url" className="hidden" onChange={(e) => handleFileUpload(e, 'about_photo_url')} />
              <label htmlFor="about_photo_url" className="cursor-pointer inline-block px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg text-xs font-bold transition-colors">Ganti Foto Tentang</label>
            </div>

            {/* Logo */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Logo Site</label>
              <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-gray-100 dark:border-white/10 bg-gray-900 flex items-center justify-center">
                {profile.logo_url ? (
                  <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={40} /></div>
                )}
              </div>
              <input type="file" id="logo_url" className="hidden" onChange={(e) => handleFileUpload(e, 'logo_url')} />
              <label htmlFor="logo_url" className="cursor-pointer inline-block px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg text-xs font-bold transition-colors">Ganti Logo</label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Identitas Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tempat Lahir</label>
              <input type="text" name="birth_place" value={profile.birth_place} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tanggal Lahir</label>
              <input type="date" name="birth_date" value={profile.birth_date} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kota Saat Ini</label>
              <input type="text" name="current_city" value={profile.current_city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jam Kerja</label>
              <input type="text" name="work_hours" value={profile.work_hours} onChange={handleChange} placeholder="Contoh: 08:00 - 17:00" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status (ID)</label>
              <input type="text" name="availability_status_id" value={profile.availability_status_id} onChange={handleChange} placeholder="Contoh: Tersedia untuk Bekerja" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status (EN)</label>
              <input type="text" name="availability_status_en" value={profile.availability_status_en} onChange={handleChange} placeholder="Contoh: Available for Work" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Bio & Vision */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Bio, Visi & Kata-kata</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio (ID)</label>
                <textarea name="bio_id" rows={4} value={profile.bio_id} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio (EN)</label>
                <textarea name="bio_en" rows={4} value={profile.bio_en} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Visi (ID)</label>
                <textarea name="vision_id" rows={3} value={profile.vision_id} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Visi (EN)</label>
                <textarea name="vision_en" rows={3} value={profile.vision_en} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motto / Quote (ID)</label>
                <input type="text" name="motto_id" value={profile.motto_id} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motto / Quote (EN)</label>
                <input type="text" name="motto_en" value={profile.motto_en} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Statistik</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project Count</label>
              <input type="text" name="stats_projects" value={profile.stats_projects} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tools Count</label>
              <input type="text" name="stats_tools" value={profile.stats_tools} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Passion Stat</label>
              <input type="text" name="stats_passion" value={profile.stats_passion} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Kontak & Sosmed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaWhatsapp className="text-green-500" /> WhatsApp</label>
              <input type="text" name="wa" value={profile.wa} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaEnvelope className="text-red-500" /> Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaInstagram className="text-pink-500" /> Instagram</label>
              <input type="text" name="instagram" value={profile.instagram} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaGithub /> GitHub</label>
              <input type="text" name="github" value={profile.github} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><FaLinkedin className="text-blue-600" /> LinkedIn</label>
              <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
            Simpan Semua Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}
