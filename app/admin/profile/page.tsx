'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaSave, FaImage, FaInstagram, FaGithub, FaLinkedin, FaTiktok, FaYoutube, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
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
    wa: '',
    email: '',
    instagram: '',
    github: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
    stats_projects: '4+',
    stats_tools: '10+',
    stats_passion: '∞'
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

      if (error && error.code !== 'PGRST116') throw error // Ignore no rows error
      
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `profile-${Math.random()}.${fileExt}`
      const filePath = `profile/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setProfile(prev => ({ ...prev, photo_url: data.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengupload foto')
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
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white mb-2">Update Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola informasi pribadi, bio, dan tautan sosial media Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Informasi Pribadi & Bio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Foto Profile</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-4 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                {profile.photo_url ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 dark:border-white/10 shadow-lg">
                    <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                      <FaImage className="text-2xl" />
                    </div>
                    <p className="text-sm font-medium">Belum ada foto</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-block px-5 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Upload Foto
                </label>
              </div>
              <input
                  type="text"
                  name="photo_url"
                  value={profile.photo_url || ''}
                  onChange={handleChange}
                  className="w-full mt-4 px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm"
                  placeholder="Atau paste URL foto"
                />
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={profile.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title / Profesi <span className="text-blue-500">(ID)</span></label>
                  <input
                    type="text"
                    name="title_id"
                    required
                    value={profile.title_id || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white transition-all"
                    placeholder="Misal: Bisnis Strategis"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title / Profession <span className="text-purple-500">(EN)</span></label>
                  <input
                    type="text"
                    name="title_en"
                    required
                    value={profile.title_en || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all"
                    placeholder="E.g: Digital Business Strategist"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio Singkat <span className="text-blue-500">(ID)</span></label>
                <textarea
                  name="bio_id"
                  required
                  value={profile.bio_id || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white text-sm transition-all"
                  placeholder="Ceritakan singkat tentang diri Anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Short Bio <span className="text-purple-500">(EN)</span></label>
                <textarea
                  name="bio_en"
                  required
                  value={profile.bio_en || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white text-sm transition-all"
                  placeholder="Tell briefly about yourself..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Home Page Stats */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Statistik Beranda</h2>
          <p className="text-sm text-gray-500 mb-6 italic">Sesuaikan angka statistik yang muncul di halaman depan.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jumlah Proyek</label>
              <input
                type="text"
                name="stats_projects"
                value={profile.stats_projects || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="Misal: 4+"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jumlah Tools</label>
              <input
                type="text"
                name="stats_tools"
                value={profile.stats_tools || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="Misal: 10+"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Passion / Lainnya</label>
              <input
                type="text"
                name="stats_passion"
                value={profile.stats_passion || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="Misal: ∞"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Media */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">Kontak & Sosial Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaWhatsapp className="text-[#25D366] text-lg" /> WhatsApp
              </label>
              <input
                type="text"
                name="wa"
                value={profile.wa || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900 dark:text-white"
                placeholder="628xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-gray-500 dark:text-gray-400 text-lg" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/50 text-gray-900 dark:text-white"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaInstagram className="text-pink-500 text-lg" /> Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={profile.instagram || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-gray-900 dark:text-white"
                placeholder="Username IG atau URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaGithub className="text-gray-900 dark:text-white text-lg" /> GitHub
              </label>
              <input
                type="url"
                name="github"
                value={profile.github || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/50 text-gray-900 dark:text-white"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaLinkedin className="text-[#0A66C2] text-lg" /> LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaTiktok className="text-black dark:text-white text-lg" /> TikTok
              </label>
              <input
                type="text"
                name="tiktok"
                value={profile.tiktok || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/50 text-gray-900 dark:text-white"
                placeholder="Username TikTok atau URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaYoutube className="text-[#FF0000] text-lg" /> YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={profile.youtube || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-900 dark:text-white"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:hover:shadow-none"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave />
            )}
            Simpan Perubahan Profile
          </button>
        </div>
      </form>
    </div>
  )
}
