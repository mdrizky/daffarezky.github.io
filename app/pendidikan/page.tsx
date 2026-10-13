'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import { Container } from '@/components/ui/Container'
import { PageSkeleton } from '@/components/ui/Skeleton'
import EducationTimeline from '@/components/EducationTimeline'
import type { Education } from '@/types'
import { FaGraduationCap } from 'react-icons/fa'

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
          .order('start_year', { ascending: false })

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
            <span className="text-cyan-400 dark:text-cyan-400">
              {id ? 'Pendidikan' : 'Journey'}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t.pageDesc}
          </p>
        </div>

        {/* Timeline Content */}
        {education.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <EducationTimeline items={education} id={id} />
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
