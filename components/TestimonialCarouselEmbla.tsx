"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Testimonial = {
  id: string | number
  author: string
  role?: string
  content: string
  avatar?: string
}

export default function TestimonialCarouselEmbla() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false }, [Autoplay()])
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(10)
        if (error) {
          console.error('Failed loading testimonials', error)
          return
        }
        if (mounted && data) {
          setItems(data as Testimonial[])
        }
      } catch (e) {
        console.error(e)
      }
    })()
    return () => { mounted = false }
  }, [supabase])

  // autoplay control when hovering
  useEffect(() => {
    if (!emblaApi) return
    const node = emblaApi.slideNodes ? emblaApi.containerNode() : null
    if (!node) return
    const onEnter = () => emblaApi && emblaApi.pluginOptions && emblaApi.plugins && emblaApi.plugins.forEach((p: any) => p.pause && p.pause())
    const onLeave = () => emblaApi && emblaApi.pluginOptions && emblaApi.plugins && emblaApi.plugins.forEach((p: any) => p.play && p.play())
    node.addEventListener('mouseenter', onEnter)
    node.addEventListener('mouseleave', onLeave)
    return () => {
      node.removeEventListener('mouseenter', onEnter)
      node.removeEventListener('mouseleave', onLeave)
    }
  }, [emblaApi])

  if (!items || items.length === 0) return null

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {items.map((t) => (
          <div key={t.id} className="min-w-[280px] max-w-xs bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                {t.avatar ? <Image src={t.avatar} alt={t.author} width={48} height={48} className="object-cover" /> : <div className="w-full h-full bg-zinc-700" />}
              </div>
              <div>
                <div className="font-semibold text-white">{t.author}</div>
                {t.role && <div className="text-sm text-zinc-400">{t.role}</div>}
              </div>
            </div>

            <p className="mt-4 text-zinc-200 text-sm">{t.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
