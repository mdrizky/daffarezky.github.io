"use client"

import React, { useState, useEffect } from "react"

type Education = {
  id: string
  school_name: string
  description?: string
  start_year: number
  end_year?: number
  location?: string
  achievements?: string
  image_url?: string
}

export default function EducationTimeline() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/education")
        const { data } = await res.json()
        setItems(data || [])
        if (data?.length > 0) setSelected(data[0].id)
      } catch (err) {
        console.error("Failed to load education:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const selectedItem = items.find((i) => i.id === selected)

  if (loading) {
    return <div className="p-4 text-zinc-400">Memuat riwayat pendidikan...</div>
  }

  if (items.length === 0) {
    return <div className="p-4 text-zinc-400">Belum ada riwayat pendidikan.</div>
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Timeline */}
      <div className="lg:col-span-1 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition ${
              selected === item.id
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-100"
                : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700"
            }`}
          >
            <div className="font-semibold text-sm">{item.school_name}</div>
            <div className="text-xs text-zinc-400">
              {item.start_year}
              {item.end_year && ` - ${item.end_year}`}
            </div>
          </button>
        ))}
      </div>

      {/* Detail */}
      {selectedItem && (
        <div className="lg:col-span-2 space-y-4">
          {selectedItem.image_url && (
            <img
              src={selectedItem.image_url}
              alt={selectedItem.school_name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div>
            <h3 className="text-2xl font-bold text-white">{selectedItem.school_name}</h3>
            {selectedItem.location && <p className="text-sm text-zinc-400 mt-1">{selectedItem.location}</p>}
            {selectedItem.description && (
              <p className="text-zinc-300 mt-4 leading-relaxed">{selectedItem.description}</p>
            )}
          </div>

          {selectedItem.achievements && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Pencapaian:</h4>
              <ul className="text-sm text-zinc-300 space-y-1 list-disc list-inside">
                {selectedItem.achievements.split("\n").map((a, i) => (
                  <li key={i}>{a.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-zinc-500">
            {selectedItem.start_year}
            {selectedItem.end_year && ` - ${selectedItem.end_year}`}
          </div>
        </div>
      )}
    </div>
  )
}
