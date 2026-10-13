'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { Education } from '@/types'
import { FaGraduationCap, FaExternalLinkAlt, FaMapMarkerAlt } from 'react-icons/fa'

interface EducationTimelineProps {
  items: Education[]
  id?: boolean
  className?: string
}

// Function to resolve education level with auto-inference fallback
export function resolveEducationLevel(edu: Education): string {
  if (edu.education_level && edu.education_level.trim()) {
    return edu.education_level.trim().toUpperCase()
  }
  const text = `${edu.institution} ${edu.degree_id || ''} ${edu.field_of_study || ''}`.toUpperCase()
  if (
    text.includes('IMSYA') ||
    text.includes('INSTITUT') ||
    text.includes('UNIVERSITAS') ||
    text.includes('KULIAH') ||
    text.includes('STDI') ||
    text.includes('POLITEKNIK') ||
    text.includes('SARJANA') ||
    text.includes('S1') ||
    text.includes('D3')
  ) {
    return 'KULIAH'
  }
  if (
    text.includes('SMA') ||
    text.includes('SMK') ||
    text.includes("MA'HAD") ||
    text.includes('MAHAD') ||
    text.includes('ALIYAH') ||
    text.includes('SLTA')
  ) {
    return 'SMA'
  }
  if (
    text.includes('SMP') ||
    text.includes('MTS') ||
    text.includes('SLTP') ||
    text.includes('TSANAWIYAH')
  ) {
    return 'SMP'
  }
  if (
    text.includes('TAHFIDZ') ||
    text.includes('PESANTREN') ||
    text.includes('PONDOK')
  ) {
    return 'TAHFIDZ'
  }
  if (
    text.includes('SD') ||
    text.includes('MI') ||
    text.includes('IBTIDAIYAH') ||
    text.includes('DASAR')
  ) {
    return 'SD'
  }
  if (
    text.includes('KURSUS') ||
    text.includes('BOOTCAMP') ||
    text.includes('SERTIFIKASI')
  ) {
    return 'KURSUS'
  }
  return 'PENDIDIKAN'
}

// Badge color mapping
export function getLevelBadge(level: string): {
  bg: string
  text: string
  border: string
  glow: string
} {
  switch (level.toUpperCase()) {
    case 'KULIAH':
    case 'UNIVERSITAS':
    case 'PERGURUAN TINGGI':
    case 'D3':
    case 'S1':
    case 'S2':
    case 'S3':
      return {
        bg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
        text: 'text-cyan-500 dark:text-cyan-400',
        border: 'border-cyan-500/40',
        glow: 'shadow-cyan-500/20',
      }
    case 'SMA':
    case 'SMK':
    case 'MA':
    case 'SLTA':
      return {
        bg: 'bg-amber-500/15 dark:bg-amber-500/20',
        text: 'text-amber-500 dark:text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-amber-500/20',
      }
    case 'SMP':
    case 'MTS':
    case 'SLTP':
      return {
        bg: 'bg-blue-500/15 dark:bg-blue-500/20',
        text: 'text-blue-500 dark:text-blue-400',
        border: 'border-blue-500/40',
        glow: 'shadow-blue-500/20',
      }
    case 'TAHFIDZ':
    case 'PESANTREN':
    case 'PONDOK':
      return {
        bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
        text: 'text-emerald-500 dark:text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/20',
      }
    case 'SD':
    case 'MI':
      return {
        bg: 'bg-green-500/15 dark:bg-green-500/20',
        text: 'text-green-500 dark:text-green-400',
        border: 'border-green-500/40',
        glow: 'shadow-green-500/20',
      }
    case 'KURSUS':
    case 'BOOTCAMP':
    case 'SERTIFIKASI':
      return {
        bg: 'bg-purple-500/15 dark:bg-purple-500/20',
        text: 'text-purple-500 dark:text-purple-400',
        border: 'border-purple-500/40',
        glow: 'shadow-purple-500/20',
      }
    default:
      return {
        bg: 'bg-zinc-500/15 dark:bg-zinc-500/20',
        text: 'text-zinc-400 dark:text-zinc-400',
        border: 'border-zinc-500/40',
        glow: 'shadow-zinc-500/20',
      }
  }
}

export default function EducationTimeline({
  items,
  id = true,
  className = '',
}: EducationTimelineProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-3xl bg-secondary/30 border border-border">
        <FaGraduationCap className="text-4xl text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          {id ? 'Belum ada data pendidikan.' : 'No education data available.'}
        </p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical Cyan Gradient Timeline Line */}
      {items.length > 1 && (
        <div
          className="absolute left-[39px] md:left-[55px] top-10 md:top-14 bottom-10 md:bottom-14 w-[2px] md:w-[3px] bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.4)] pointer-events-none z-0"
        />
      )}

      {/* Timeline items list */}
      <div className="space-y-8 md:space-y-10">
        {items.map((edu, index) => {
          const level = resolveEducationLevel(edu)
          const badge = getLevelBadge(level)
          const yearText = edu.is_current
            ? `${edu.start_year} - ${id ? 'Sekarang' : 'Present'}`
            : `${edu.start_year} - ${edu.end_year || (id ? 'Selesai' : 'Completed')}`

          const hasImageError = imageErrors[edu.id]

          return (
            <div
              key={edu.id}
              className="relative group flex items-start gap-5 md:gap-7 animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Circular Logo Container (80px mobile / 112px desktop) */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`
                    w-[80px] h-[80px] md:w-[112px] md:h-[112px]
                    rounded-full bg-white text-zinc-900
                    border-2 md:border-[3px] border-zinc-200 dark:border-zinc-700
                    shadow-xl dark:shadow-2xl dark:shadow-black/70
                    flex items-center justify-center
                    overflow-hidden p-2.5 md:p-3.5
                    transition-all duration-500 ease-out
                    group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-cyan-500/25 group-hover:shadow-2xl
                  `}
                >
                  {edu.logo_url && !hasImageError ? (
                    <Image
                      src={edu.logo_url}
                      alt={edu.institution}
                      width={112}
                      height={112}
                      className="w-full h-full object-contain rounded-full transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [edu.id]: true }))
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center">
                      <FaGraduationCap className="text-2xl md:text-4xl text-cyan-600 dark:text-cyan-600 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-[10px] md:text-xs font-bold text-zinc-600 mt-0.5 truncate max-w-[65px] md:max-w-[85px]">
                        {edu.institution.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Glowing status dot if currently active */}
                {edu.is_current && (
                  <div
                    title={id ? 'Sedang Ditempuh' : 'In Progress'}
                    className="absolute -bottom-1 -right-1 md:bottom-0 md:right-0 w-4 h-4 md:w-5 md:h-5 bg-cyan-400 border-2 border-white dark:border-zinc-950 rounded-full shadow-lg shadow-cyan-400/50 flex items-center justify-center animate-pulse"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Text Information Column */}
              <div className="flex-1 min-w-0 pt-1 md:pt-2">
                {/* Year Range (above institution name) */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-zinc-400 dark:text-zinc-500">
                    {yearText}
                  </span>
                  {edu.is_current && (
                    <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      {id ? 'Sedang Ditempuh' : 'In Progress'}
                    </span>
                  )}
                </div>

                {/* Institution Name (Bold, large, cyan on hover) */}
                <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-extrabold text-foreground group-hover:text-cyan-400 transition-colors duration-300 leading-snug tracking-tight">
                  {edu.institution}
                </h3>

                {/* Education Level Badge (Colored per level) */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`
                      inline-flex items-center px-3.5 py-1 rounded-md
                      text-[11px] md:text-xs font-black uppercase tracking-[0.16em]
                      border ${badge.bg} ${badge.text} ${badge.border}
                      shadow-sm ${badge.glow}
                      transition-all duration-300 group-hover:scale-105
                    `}
                  >
                    {level}
                  </span>

                  {edu.field_of_study && (
                    <span className="text-xs md:text-sm text-muted-foreground/80 font-medium">
                      • {edu.field_of_study}
                    </span>
                  )}
                </div>

                {/* Degree / Program */}
                {(id ? edu.degree_id : edu.degree_en) && (
                  <p className="text-sm md:text-base font-semibold text-foreground/90 mt-2">
                    {id ? edu.degree_id : edu.degree_en}
                  </p>
                )}

                {/* Description (Subtle by default, brightens up on hover) */}
                {(id ? edu.description_id : edu.description_en) && (
                  <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 leading-relaxed mt-2 max-w-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    {id ? edu.description_id : edu.description_en}
                  </p>
                )}

                {/* Location */}
                {edu.location && (
                  <div className="mt-2 text-xs text-muted-foreground/70 flex items-center gap-1.5 opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                    <FaMapMarkerAlt className="text-cyan-400 text-[11px]" />
                    <span>{edu.location}</span>
                  </div>
                )}

                {/* Certificate Link if available */}
                {edu.certificate_url && (
                  <a
                    href={edu.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-2.5 underline decoration-cyan-400/40 hover:decoration-cyan-400"
                  >
                    <FaExternalLinkAlt className="text-[10px]" />
                    <span>{id ? 'Lihat Ijazah / Sertifikat' : 'View Certificate'}</span>
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
