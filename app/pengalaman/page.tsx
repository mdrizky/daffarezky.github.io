'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import { 
  FaBriefcase, 
  FaUsers, 
  FaAward, 
  FaGraduationCap, 
  FaLaptopCode, 
  FaCalendarAlt, 
  FaBuilding, 
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa'
import type { Experience } from '@/types'
import { Container } from '@/components/ui/Container'
import { PageSkeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

export default function PengalamanPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { language } = useLanguage()
  const id = language === 'id'

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .eq('is_published', true)
          .order('order_index', { ascending: true })

        if (error) throw error

        if (data) {
          // Stable sort: order_index ascending, then start_date descending
          const sorted = [...data].sort((a, b) => {
            if ((a.order_index ?? 0) !== (b.order_index ?? 0)) {
              return (a.order_index ?? 0) - (b.order_index ?? 0)
            }
            return String(b.start_date || '').localeCompare(String(a.start_date || ''))
          })
          setExperiences(sorted)
        }
      } catch (error) {
        console.error('Error fetching experiences:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(experiences.map((exp) => exp.category).filter(Boolean)))
    return cats
  }, [experiences])

  // Filtered items
  const filteredExperiences = useMemo(() => {
    if (selectedCategory === 'all') return experiences
    return experiences.filter((exp) => exp.category === selectedCategory)
  }, [experiences, selectedCategory])

  const t = {
    eyebrow: id ? 'REKAM JEJAK & PENGALAMAN' : 'TRACK RECORD & EXPERIENCE',
    pageTitle: id ? 'Pengalaman Profesional' : 'Professional Experience',
    pageDesc: id
      ? 'Perjalanan rekayasa web & mobile, kepemimpinan proyek, dan kontribusi nyata yang membangun etos kerja profesional.'
      : 'A track record of web & mobile engineering, project leadership, and impactful work that defines my professional ethos.',
    all: id ? 'Semua Pengalaman' : 'All Experiences',
    present: id ? 'Sekarang' : 'Present',
    activeBadge: id ? 'Aktif Berjalan' : 'Currently Active',
    noDataTitle: id ? 'Belum Ada Data Pengalaman' : 'No Experience Records Found',
    noDataDesc: id
      ? 'Data pengalaman belum tersedia atau sedang diperbarui melalui dashboard admin.'
      : 'Experience data is currently not available or being updated via the admin dashboard.',
    ctaTitle: id ? 'Siap Mewujudkan Proyek Anda?' : 'Ready to Build Your Next Project?',
    ctaDesc: id
      ? 'Tersedia untuk proyek freelance remote, pengembangan aplikasi web, landing page bisnis, dan integrasi API.'
      : 'Available for remote freelance projects, custom web apps, high-converting landing pages, and API integrations.',
    ctaButton: id ? 'Mulai Diskusi Proyek' : "Let's Discuss Your Project",
    portfolioButton: id ? 'Lihat Portofolio' : 'View Portfolio',
  }

  // Get relevant icon based on category or title
  const getExperienceIcon = (exp: Experience) => {
    const text = `${exp.category} ${exp.title_id} ${exp.role}`.toLowerCase()
    if (text.includes('developer') || text.includes('frontend') || text.includes('freelance') || text.includes('web') || text.includes('mobile')) {
      return <FaLaptopCode className="text-cyan-400" />
    }
    if (text.includes('tahfidz') || text.includes('pendidikan') || text.includes('pengajar') || text.includes('tutor') || text.includes('kuliah')) {
      return <FaGraduationCap className="text-emerald-400" />
    }
    if (text.includes('organisasi') || text.includes('media') || text.includes('komunitas')) {
      return <FaUsers className="text-amber-400" />
    }
    if (text.includes('kompetisi') || text.includes('juara') || text.includes('award')) {
      return <FaAward className="text-purple-400" />
    }
    return <FaBriefcase className="text-cyan-400" />
  }

  // Category badge style mapping
  const getCategoryBadgeClass = (category: string) => {
    const cat = (category || '').toLowerCase()
    if (cat.includes('freelance') || cat.includes('work') || cat.includes('kerja')) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    }
    if (cat.includes('pendidikan') || cat.includes('akademik')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    }
    if (cat.includes('organisasi') || cat.includes('leadership')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-sm">
            <span>{t.eyebrow}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground mb-4 tracking-tight">
            {t.pageTitle}
          </h1>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t.pageDesc}
          </p>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 pt-4">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
                }`}
              >
                {t.all} ({experiences.length})
              </button>

              {categories.map((cat) => {
                const count = experiences.filter((e) => e.category === cat).length
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Vertical Timeline Container */}
        {filteredExperiences.length > 0 ? (
          <div className="relative max-w-3xl mx-auto">
            {/* Subtle Gradient Vertical Line */}
            <div 
              className="absolute left-[20px] md:left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-400 via-cyan-500/50 to-cyan-500/10 pointer-events-none"
              aria-hidden="true"
            />

            <div className="space-y-6 md:space-y-8">
              {filteredExperiences.map((exp, index) => {
                const title = id ? exp.title_id : (exp.title_en || exp.title_id)
                const desc = id ? exp.description_id : (exp.description_en || exp.description_id)
                const period = exp.is_current
                  ? `${exp.start_date || ''} — ${t.present}`
                  : `${exp.start_date || ''} — ${exp.end_date || t.present}`

                return (
                  <div
                    key={exp.id}
                    className="relative group flex items-start gap-4 md:gap-6 animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    {/* Timeline Node Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-card dark:bg-zinc-900 border-2 border-border dark:border-zinc-800 shadow-md flex items-center justify-center text-base md:text-xl transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-cyan-500/20">
                        {getExperienceIcon(exp)}
                      </div>

                      {/* Active Pulse Dot on Icon */}
                      {exp.is_current && (
                        <span 
                          title={t.activeBadge}
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-background flex items-center justify-center shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </span>
                      )}
                    </div>

                    {/* Timeline Card */}
                    <div className="flex-1 min-w-0 bg-card/60 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-500/40 transition-all duration-300">
                      {/* Top Meta Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        {/* Period pill */}
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-400">
                          <FaCalendarAlt className="text-cyan-400 text-[11px]" />
                          <span>{period}</span>
                          {exp.is_current && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 ml-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              {t.present}
                            </span>
                          )}
                        </div>

                        {/* Category Tag */}
                        {exp.category && (
                          <span className={`text-[10px] md:text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadgeClass(exp.category)}`}>
                            {exp.category}
                          </span>
                        )}
                      </div>

                      {/* Position / Role Title */}
                      <h3 className="text-lg md:text-xl font-heading font-bold text-foreground group-hover:text-cyan-400 transition-colors duration-200">
                        {title}
                      </h3>

                      {/* Organization & Sub-role */}
                      {(exp.organization || exp.role) && (
                        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-cyan-500 dark:text-cyan-400/90 mt-1 flex-wrap">
                          {exp.organization && (
                            <span className="inline-flex items-center gap-1.5">
                              <FaBuilding className="text-zinc-400 text-[11px]" />
                              <span className="text-foreground/90 font-medium">{exp.organization}</span>
                            </span>
                          )}
                          {exp.organization && exp.role && (
                            <span className="text-muted-foreground/60">•</span>
                          )}
                          {exp.role && (
                            <span className="text-muted-foreground font-normal">{exp.role}</span>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {desc && (
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-3.5 pt-3 border-t border-border/50 dark:border-zinc-800/60">
                          {desc}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-card border border-border rounded-3xl max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl mx-auto mb-4 border border-cyan-500/20">
              <FaBriefcase />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{t.noDataTitle}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.noDataDesc}</p>
          </div>
        )}

        {/* Remote Freelance Call To Action Card */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card/80 to-cyan-950/20 border border-cyan-500/30 p-8 md:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
              <div className="max-w-md space-y-2">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                  {t.ctaTitle}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {t.ctaDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs md:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-105"
                >
                  <span>{t.ctaButton}</span>
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs md:text-sm font-semibold border border-border transition-colors"
                >
                  <span>{t.portfolioButton}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
