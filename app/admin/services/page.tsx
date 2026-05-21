'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa'
import { Service } from '@/types'

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Service>>({})
  const [saving, setSaving] = useState(false)

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true })

      if (error) throw error
      if (data) setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const startEdit = (service: Service) => {
    setEditingId(service.id)
    setEditForm({
      ...service,
      features_id: service.features_id ? [...service.features_id] : [],
      features_en: service.features_en ? [...service.features_en] : [],
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
          name_id: editForm.name_id,
          name_en: editForm.name_en,
          price: editForm.price,
          description_id: editForm.description_id,
          description_en: editForm.description_en,
          features_id: editForm.features_id,
          features_en: editForm.features_en,
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

  const handleFeatureChange = (lang: 'id' | 'en', index: number, value: string) => {
    const key = `features_${lang}` as const
    const features = [...(editForm[key] || [])]
    features[index] = value
    setEditForm({ ...editForm, [key]: features })
  }

  const addFeature = (lang: 'id' | 'en') => {
    const key = `features_${lang}` as const
    const features = [...(editForm[key] || []), '']
    setEditForm({ ...editForm, [key]: features })
  }

  const removeFeature = (lang: 'id' | 'en', index: number) => {
    const key = `features_${lang}` as const
    const features = [...(editForm[key] || [])]
    features.splice(index, 1)
    setEditForm({ ...editForm, [key]: features })
  }

  const handleAddService = async () => {
    try {
      setSaving(true)
      const newService = {
        name_id: 'Paket Baru',
        name_en: 'New Package',
        price: 'Rp 0',
        description_id: 'Deskripsi paket',
        description_en: 'Package description',
        features_id: ['Fitur 1'],
        features_en: ['Feature 1'],
        is_popular: false,
      }
      const { data, error } = await supabase.from('services').insert([newService]).select()
      if (error) throw error
      if (data) setServices([...services, data[0]])
    } catch (error) {
      console.error('Error adding service:', error)
      alert('Gagal menambah paket')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus paket jasa ini?')) return
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Gagal menghapus paket')
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
          <h1 className="text-3xl font-bold font-syne text-gray-900 dark:text-white">Kelola Paket Jasa</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola paket jasa yang ditampilkan di halaman Services.</p>
        </div>
        <button
          onClick={handleAddService}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          <FaPlus /> Tambah Paket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`bg-white dark:bg-white/5 border rounded-2xl p-6 shadow-sm transition-all duration-300 ${
              service.is_popular ? 'border-blue-500 dark:border-[#00FF88] ring-1 ring-blue-500/20 dark:ring-[#00FF88]/20' : 'border-gray-200 dark:border-white/10'
            }`}
          >
            {editingId === service.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-blue-500 font-semibold">Nama (ID)</label>
                    <input type="text" value={editForm.name_id || ''} onChange={(e) => setEditForm({...editForm, name_id: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-gray-900 dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-purple-500 font-semibold">Name (EN)</label>
                    <input type="text" value={editForm.name_en || ''} onChange={(e) => setEditForm({...editForm, name_en: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-gray-900 dark:text-white text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Harga</label>
                  <input type="text" value={editForm.price || ''} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-gray-900 dark:text-white text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-blue-500 font-semibold">Deskripsi (ID)</label>
                    <textarea value={editForm.description_id || ''} onChange={(e) => setEditForm({...editForm, description_id: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-gray-900 dark:text-white" rows={2} />
                  </div>
                  <div>
                    <label className="text-xs text-purple-500 font-semibold">Description (EN)</label>
                    <textarea value={editForm.description_en || ''} onChange={(e) => setEditForm({...editForm, description_en: e.target.value})} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-gray-900 dark:text-white" rows={2} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-blue-500 font-semibold block mb-2">Fitur (ID)</label>
                  {editForm.features_id?.map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" value={feature} onChange={(e) => handleFeatureChange('id', idx, e.target.value)} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-gray-900 dark:text-white" />
                      <button onClick={() => removeFeature('id', idx)} className="text-red-400 hover:text-red-500 text-xs"><FaTrash /></button>
                    </div>
                  ))}
                  <button onClick={() => addFeature('id')} className="text-blue-500 text-xs font-semibold hover:underline">+ Tambah Fitur</button>
                </div>

                <div>
                  <label className="text-xs text-purple-500 font-semibold block mb-2">Features (EN)</label>
                  {editForm.features_en?.map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" value={feature} onChange={(e) => handleFeatureChange('en', idx, e.target.value)} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-gray-900 dark:text-white" />
                      <button onClick={() => removeFeature('en', idx)} className="text-red-400 hover:text-red-500 text-xs"><FaTrash /></button>
                    </div>
                  ))}
                  <button onClick={() => addFeature('en')} className="text-purple-500 text-xs font-semibold hover:underline">+ Add Feature</button>
                </div>

                <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10">
                  <input type="checkbox" id={`pop-${service.id}`} checked={editForm.is_popular || false} onChange={(e) => setEditForm({...editForm, is_popular: e.target.checked})} className="rounded border-gray-300 dark:border-white/10 text-blue-500 focus:ring-blue-500 w-4 h-4" />
                  <label htmlFor={`pop-${service.id}`} className="text-xs text-gray-700 dark:text-gray-300 font-semibold">Tandai Paling Laku</label>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
                  <button onClick={() => handleSave(service.id)} disabled={saving} className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all">
                    <FaSave /> Simpan
                  </button>
                  <button onClick={cancelEdit} className="px-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 px-1.5 py-0.5 rounded mr-1">ID</span>
                      {service.name_id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 px-1.5 py-0.5 rounded mr-1">EN</span>
                      {service.name_en}
                    </p>
                    <div className="text-2xl font-bold font-syne text-blue-600 dark:text-[#00FF88] mt-3">{service.price}</div>
                  </div>
                  {service.is_popular && (
                    <span className="bg-blue-100 text-blue-700 dark:bg-[#00FF88]/20 dark:text-[#00FF88] text-xs px-2.5 py-1 rounded-full border border-blue-200 dark:border-[#00FF88]/30 font-semibold">
                      Popular
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{service.description_id}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features_id?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 dark:text-[#00FF88] mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(service)}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 border border-gray-200 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300 font-medium text-sm"
                  >
                    <FaEdit /> Edit Paket
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2.5 border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
