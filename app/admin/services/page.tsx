'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { Service } from '@/types'

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Service>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true }) // simplest sort

      if (error) throw error
      if (data) setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (service: Service) => {
    setEditingId(service.id)
    setEditForm({
      ...service,
      features: service.features ? [...service.features] : []
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSave = async (id: string) => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('services')
        .update({
          name: editForm.name,
          price: editForm.price,
          description: editForm.description,
          features: editForm.features,
          is_popular: editForm.is_popular
        })
        .eq('id', id)

      if (error) throw error
      
      setServices(services.map(s => s.id === id ? { ...s, ...editForm } as Service : s))
      setEditingId(null)
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    if (!editForm.features) return
    const newFeatures = [...editForm.features]
    newFeatures[index] = value
    setEditForm({ ...editForm, features: newFeatures })
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
      <h1 className="text-3xl font-bold font-syne mb-8">Kelola Paket Jasa</h1>
      <p className="text-gray-400 mb-8">Kelola 3 paket jasa utama yang ditampilkan di halaman Services.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`bg-white/5 border rounded-xl p-6 ${
              service.is_popular ? 'border-[#00FF88]' : 'border-white/10'
            }`}
          >
            {editingId === service.id ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400">Nama Paket</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-1 mt-1 focus:border-[#00FF88] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Harga (Rp)</label>
                  <input
                    type="text"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-1 mt-1 focus:border-[#00FF88] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Deskripsi Singkat</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-1 mt-1 text-sm focus:border-[#00FF88] focus:outline-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">Fitur-fitur</label>
                  {editForm.features?.map((feature, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-1 mb-2 text-sm focus:border-[#00FF88] focus:outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={editForm.is_popular}
                    onChange={(e) => setEditForm({...editForm, is_popular: e.target.checked})}
                    className="rounded bg-black/20 border-white/10 text-[#00FF88] focus:ring-[#00FF88]"
                  />
                  <label className="text-xs text-gray-300">Tandai Paling Laku</label>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleSave(service.id)}
                    disabled={saving}
                    className="flex-1 flex justify-center items-center gap-2 bg-[#00FF88] text-black py-2 rounded font-bold text-sm hover:opacity-90"
                  >
                    <FaSave /> Simpan
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 bg-white/10 text-white rounded text-sm hover:bg-white/20"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{service.name}</h3>
                    <div className="text-2xl font-bold font-syne text-[#00FF88] mt-2">
                      {service.price}
                    </div>
                  </div>
                  {service.is_popular && (
                    <span className="bg-[#00FF88]/20 text-[#00FF88] text-xs px-2 py-1 rounded-full border border-[#00FF88]/30">
                      Popular
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-[#00FF88] mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => startEdit(service)}
                  className="w-full flex justify-center items-center gap-2 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors"
                >
                  <FaEdit /> Edit Paket
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
