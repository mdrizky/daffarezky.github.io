'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import { Container } from '@/components/ui/Container'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Timeline } from '@/components/ui/Timeline'
import type { Education } from '@/types'
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaAward } from 'react-icons/fa'

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

        if (error) throw error
        if (data) setEducation(data)
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
    pageDesc: id
      ? 'Perjalanan akademik dan pengembangan pengetahuan formal yang menjadi fondasi keahlian saya.'
      : 'Academic journey and formal education that shaped my expertise and skills.',
    institution: id ? 'Institusi' : 'Institution',
    degree: id ? 'Gelar' : 'Degree',
    field: id ? 'Bidang Studi' : 'Field of Study',
    location: id ? 'Lokasi' : 'Location',
    achievements: id ? 'Pencapaian' : 'Achievements',
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

  // Convert to timeline items
  const timelineItems = education.map((edu) => ({
    id: edu.id,
    title: id ? edu.degree_id : edu.degree_en,
    description: edu.institution,
    date: edu.is_current
      ? `${edu.start_year} - ${t.present}`
      : `${edu.start_year} - ${edu.end_year}`,
    status: edu.is_current ? ('current' as const) : ('completed' as const),
    icon: <FaGraduationCap className="w-4 h-4" />,
  }))

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t.pageDesc}</p>
        </div>

        {/* Content */}
        {education.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12 animate-fade-in">
            {/* Timeline Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <h2 className="text-2xl font-bold text-foreground mb-6">{id ? 'Riwayat' : 'Timeline'}</h2>
                <Timeline items={timelineItems} orientation="vertical" variant="compact" />
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-2 space-y-6">
              {education.map((edu) => (
                <Card key={edu.id} className="overflow-hidden hover:border-border/80 transition-all">
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-border">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2.5 bg-primary/10 rounded-lg text-primary flex-shrink-0 mt-1">
                            <FaGraduationCap className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground">
                              {id ? edu.degree_id : edu.degree_en}
                            </h3>
                            <p className="text-lg text-primary font-semibold mt-1">
                              {edu.institution}
                            </p>
                          </div>
                        </div>
                      </div>
                      {edu.is_current && (
                        <Badge variant="default" className="flex-shrink-0">
                          {t.present}
                        </Badge>
                      )}
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      {/* Duration */}
                      <div className="flex gap-3">
                        <FaCalendarAlt className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {id ? 'Periode' : 'Period'}
                          </p>
                          <p className="text-foreground font-medium">
                            {edu.start_year} -{' '}
                            {edu.is_current ? (
                              <span className="text-primary font-bold">{t.present}</span>
                            ) : (
                              edu.end_year
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      {edu.location && (
                        <div className="flex gap-3">
                          <FaMapMarkerAlt className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              {t.location}
                            </p>
                            <p className="text-foreground font-medium">{edu.location}</p>
                          </div>
                        </div>
                      )}

                      {/* Field of Study */}
                      {edu.field_of_study && (
                        <div className="flex gap-3">
                          <FaGraduationCap className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              {t.field}
                            </p>
                            <p className="text-foreground font-medium">{edu.field_of_study}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {(id ? edu.description_id : edu.description_en) && (
                      <div className="mb-8 pb-8 border-b border-border">
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                          {id ? 'Deskripsi' : 'Description'}
                        </h4>
                        <p className="text-foreground leading-relaxed">
                          {id ? edu.description_id : edu.description_en}
                        </p>
                      </div>
                    )}

                    {/* Achievement */}
                    {edu.achievement && (
                      <div className="mb-6">
                        <div className="flex items-start gap-3">
                          <FaAward className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                              {t.achievements}
                            </p>
                            <p className="text-foreground font-medium">{edu.achievement}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gallery */}
                    {edu.gallery && edu.gallery.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                          {id ? 'Galeri' : 'Gallery'}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {edu.gallery.map((image, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-border/80 transition-all"
                            >
                              <Image
                                src={image}
                                alt={`${edu.institution} gallery ${idx + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certificate */}
                    {edu.certificate_url && (
                      <div className="mt-8 pt-6 border-t border-border">
                        <a
                          href={edu.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all active:scale-95"
                        >
                          <FaAward className="w-4 h-4" />
                          {id ? 'Lihat Sertifikat' : 'View Certificate'}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl animate-fade-in">
            <FaGraduationCap className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t.noData}</p>
          </div>
        )}
      </Container>
    </div>
  )
}
