'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import { Container } from '@/components/ui/Container'
import { PageSkeleton } from '@/components/ui/Skeleton'
import type { Education } from '@/types'
import { FaGraduationCap } from 'react-icons/fa'

// Badge color mapping per education level
function getLevelBadge(level?: string): { bg: string; text: string; glow: string } {
  switch (level?.toUpperCase()) {
    case 'SD':
      return { bg: 'bg-green-500/20 border-green-500/40', text: 'text-green-400', glow: 'shadow-green-500/20' }
    case 'SMP':
      return { bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-400', glow: 'shadow-blue-500/20' }
    case 'SMA':
    case 'MA':
    case 'SMK':
      return { bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-400', glow: 'shadow-amber-500/20' }
    case 'KULIAH':
      return { bg: 'bg-cyan-500/20 border-cyan-500/40', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' }
    case 'TAHFIDZ':
    case 'PESANTREN':
      return { bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
    case 'KURSUS':
      return { bg: 'bg-purple-500/20 border-purple-500/40', text: 'text-purple-400', glow: 'shadow-purple-500/20' }
    default:
      return { bg: 'bg-zinc-500/20 border-zinc-500/40', text: 'text-zinc-400', glow: 'shadow-zinc-500/20' }
  }
}

export default function PendidikanPage() {
  const { language } = useLanguage()
  const id = language === 'id'

  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })

        if (error) {
          // Fallback without is_published filter
          const fallback = await supabase
            .from('education')
            .select('*')
            .order('start_year', { ascending: false })
          if (fallback.data) setEducation(fallback.data)
        } else if (data) {
          setEducation(data)
        }
      } catch (error) {
        console.error('Error fetching education:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  const t = {
    pageTitle: id ? 'Pendidikan' : 'Education',
    pageSubtitle: id ? 'Riwayat Akademik' : 'Academic History',
    pageDesc: id
      ? 'Perjalanan akademik dan pengembangan pengetahuan formal yang menjadi fondasi keahlian saya.'
      : 'Academic journey and formal education that shaped my expertise and skills.',
    present: id ? 'Sekarang' : 'Present',
    noData: id
      ? 'Belum ada data pendidikan yang dipublikasikan.'
      : 'No education data published yet.',
  }

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen">
        <Container>
          <PageSkeleton />
        </Container>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-3 block">
            {t.pageSubtitle}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-5 text-foreground">
            {id ? 'Riwayat ' : 'Education '}
            <span className="text-gradient">{id ? 'Pendidikan' : 'Journey'}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t.pageDesc}
          </p>
        </div>

        {/* Timeline Content */}
        {education.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-[39px] md:left-[55px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-500/60 via-cyan-500/20 to-transparent rounded-full" />

              {/* Timeline Items */}
              <div className="space-y-0">
                {education.map((edu, index) => {
                  const badge = getLevelBadge(edu.education_level)
                  const yearText = edu.is_current
                    ? `${edu.start_year} - ${t.present}`
                    : `${edu.start_year} - ${edu.end_year || '?'}`

                  return (
                    <div
                      key={edu.id}
                      className="relative group animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Timeline Item Container */}
                      <div className="flex items-start gap-5 md:gap-7 py-6 md:py-8">
                        {/* Circular Logo Container */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className={`
                            w-[80px] h-[80px] md:w-[112px] md:h-[112px]
                            rounded-full bg-white dark:bg-zinc-900
                            border-[3px] border-zinc-200 dark:border-zinc-700
                            group-hover:border-cyan-500/60
                            shadow-xl ${badge.glow}
                            flex items-center justify-center
                            overflow-hidden p-3 md:p-4
                            transition-all duration-500
                            group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-500/10
                          `}>
                            {edu.logo_url ? (
                              <Image
                                src={edu.logo_url}
                                alt={edu.institution}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain rounded-full"
                                unoptimized
                              />
                            ) : (
                              <FaGraduationCap className="text-2xl md:text-4xl text-zinc-400 dark:text-zinc-500" />
                            )}
                          </div>

                          {/* Glowing dot on timeline line */}
                          {edu.is_current && (
                            <div className="absolute -right-[9px] md:-right-[11px] top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1 md:pt-3">
                          {/* Year Range */}
                          <p className="text-sm md:text-base text-zinc-400 dark:text-zinc-500 font-medium mb-1 tracking-wide">
                            {yearText}
                          </p>

                          {/* Institution Name */}
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-extrabold text-foreground leading-tight mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                            {edu.institution}
                          </h3>

                          {/* Education Level Badge */}
                          {edu.education_level && (
                            <span className={`
                              inline-block px-4 py-1.5 rounded-lg
                              text-[11px] md:text-xs font-extrabold uppercase tracking-[0.15em]
                              border ${badge.bg} ${badge.text}
                              shadow-md ${badge.glow}
                              transition-all duration-300 group-hover:scale-105
                            `}>
                              {edu.education_level}
                            </span>
                          )}

                          {/* Degree / Jurusan */}
                          {(id ? edu.degree_id : edu.degree_en) && (
                            <p className="text-sm md:text-base text-zinc-400 dark:text-zinc-500 mt-3 font-medium">
                              {id ? edu.degree_id : edu.degree_en}
                            </p>
                          )}

                          {/* Description - appears on hover / always visible on mobile */}
                          {(id ? edu.description_id : edu.description_en) && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-600 mt-2 leading-relaxed max-w-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                              {id ? edu.description_id : edu.description_en}
                            </p>
                          )}

                          {/* Location */}
                          {edu.location && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-600 mt-2 flex items-center gap-1.5">
                              <span className="inline-block w-1 h-1 bg-zinc-400 rounded-full" />
                              {edu.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Separator line between items (not on last) */}
                      {index < education.length - 1 && (
                        <div className="ml-[80px] md:ml-[112px] pl-5 md:pl-7">
                          <div className="h-px bg-gradient-to-r from-zinc-800/50 via-zinc-800/20 to-transparent" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Timeline End Dot */}
              <div className="absolute left-[37px] md:left-[53px] bottom-0 w-[7px] h-[7px] bg-zinc-700 rounded-full border-2 border-zinc-600" />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl animate-fade-in max-w-xl mx-auto">
            <FaGraduationCap className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t.noData}</p>
          </div>
        )}
      </Container>
    </div>
  )
}
