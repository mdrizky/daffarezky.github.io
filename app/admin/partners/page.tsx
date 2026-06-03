'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaTrash, FaSave, FaHandshake, FaLink, FaImage } from 'react-icons/fa'
import { Partner } from '@/types'

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    order_index: 0
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setPartners(data || [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert([newPartner])
        .select()
        .single()

      if (error) throw error
      setPartners([...partners, data])
      setShowAddModal(false)
      setNewPartner({ name: '', logo_url: '', website_url: '', order_index: partners.length + 1 })
    } catch (error) {
      console.error('Error adding partner:', error)
      alert('Gagal menambah partner')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Hapus partner ini?')) return
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id)
      if (error) throw error
      setPartners(partners.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting partner:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, id?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const ext = file.name.split('.').pop()
      const fileName = `partner-${Date.now()}.${ext}`
      const filePath = `partners/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      if (isNew) {
        setNewPartner(prev => ({ ...prev, logo_url: data.publicUrl }))
      } else if (id) {
        const { error: updateError } = await supabase
          .from('partners')
          .update({ logo_url: data.publicUrl })
          .eq('id', id)
        
        if (updateError) throw updateError
        setPartners(partners.map(p => p.id === id ? { ...p, logo_url: data.publicUrl } : p))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal upload logo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Kelola Partner</h1>
          <p className="text-gray-500 dark:text-gray-400">Daftar klien atau partner yang telah bekerja sama dengan Anda.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-neon text-[#0A0A0F] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
        >
          <FaPlus /> Tambah Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm group">
            <div className="relative aspect-video w-full mb-4 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5">
              {partner.logo_url ? (
                <img src={partner.logo_url} alt={partner.name} className="max-h-[80%] max-w-[80%] object-contain" />
              ) : (
                <FaHandshake className="text-4xl text-gray-300 dark:text-gray-700" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
            {partner.website_url && (
              <a href={partner.website_url} target="_blank" className="text-blue-500 text-sm flex items-center gap-2 mb-4 hover:underline">
                <FaLink /> Website
              </a>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDeletePartner(partner.id)}
                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#12121A] w-full max-w-md rounded-[32px] p-8 border border-gray-200 dark:border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tambah Partner Baru</h2>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nama Partner</label>
                <input
                  type="text"
                  required
                  value={newPartner.name}
                  onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Logo Partner</label>
                <input
                  type="file"
                  onChange={e => handleImageUpload(e, true)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-white/10 dark:file:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Website URL</label>
                <input
                  type="url"
                  value={newPartner.website_url}
                  onChange={e => setNewPartner({ ...newPartner, website_url: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-neon text-[#0A0A0F] font-bold disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
