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
    title: '',
    bio: '',
    photo_url: '',
    wa: '',
    email: '',
    instagram: '',
    github: '',
    linkedin: '',
    tiktok: '',
    youtube: ''
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
        <div className="w-8 h-8 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold font-syne mb-8">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Informasi Pribadi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Foto Profile</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:bg-white/5 transition-colors">
                {profile.photo_url ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/10">
                    <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FaImage className="text-4xl mb-2" />
                    <p className="text-sm">Belum ada foto</p>
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
                  className="cursor-pointer inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                >
                  Upload Foto
                </label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title / Profesi</label>
                <input
                  type="text"
                  name="title"
                  value={profile.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                  placeholder="Misal: Digital Business Strategist"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio Singkat</label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white text-sm"
                  placeholder="Ceritakan singkat tentang diri Anda..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Kontak & Sosial Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaWhatsapp className="text-[#25D366]" /> WhatsApp
              </label>
              <input
                type="text"
                name="wa"
                value={profile.wa || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="628xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaInstagram className="text-pink-500" /> Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={profile.instagram || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="Username IG atau URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaGithub className="text-white" /> GitHub
              </label>
              <input
                type="url"
                name="github"
                value={profile.github || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaLinkedin className="text-[#0A66C2]" /> LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaTiktok className="text-white" /> TikTok
              </label>
              <input
                type="text"
                name="tiktok"
                value={profile.tiktok || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="Username TikTok atau URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaYoutube className="text-[#FF0000]" /> YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={profile.youtube || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#00FF88] text-white"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00FF88] to-[#0099FF] text-[#0A0A0F] font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}
