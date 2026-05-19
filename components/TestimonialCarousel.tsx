"use client"

import React, { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"

type Testimonial = {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  avatar?: string
  rating?: number
}

export default function TestimonialCarousel({ className = "" }: { className?: string }) {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const autoRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const { data, error } = await supabase.from("testimonials").select("*")
      if (!mounted) return
      if (error) {
        setError(error.message)
        setItems([])
      } else {
        setItems((data || []) as Testimonial[])
      }
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || items.length === 0) return

    // autoplay: scroll by one card every 3.5s
    function startAuto() {
      stopAuto()
      autoRef.current = window.setInterval(() => {
        if (!el) return
        const cardWidth = el.querySelector("[data-card]")?.clientWidth || 300
        el.scrollBy({ left: cardWidth + 24, behavior: "smooth" })
      }, 3500)
    }

    function stopAuto() {
      if (autoRef.current) {
        window.clearInterval(autoRef.current)
        autoRef.current = null
      }
    }

    startAuto()

    el.addEventListener("mouseenter", stopAuto)
    el.addEventListener("mouseleave", startAuto)

    return () => {
      stopAuto()
      el.removeEventListener("mouseenter", stopAuto)
      el.removeEventListener("mouseleave", startAuto)
    }
  }, [items])

  if (loading) {
    return <div className="p-6">Memuat testimoni...</div>
  }

  if (error) {
    return <div className="p-6 text-red-400">Gagal memuat testimoni: {error}</div>
  }

  if (items.length === 0) {
    return <div className="p-6 text-zinc-400">Belum ada testimoni.</div>
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 touch-pan-x scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((t) => (
          <article
            key={t.id}
            data-card
            className="snap-start min-w-[280px] max-w-[420px] bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-md flex-shrink-0"
          >
            <p className="text-sm text-zinc-300 italic leading-relaxed">“{t.content}”</p>

            <div className="mt-4 flex items-center gap-3">
              <img src={t.avatar || "/avatar-placeholder.png"} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-xs text-zinc-400">{t.role || t.company}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
