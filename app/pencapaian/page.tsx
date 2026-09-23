'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'
import { Container } from '@/components/ui/Container'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import type { Achievement } from '@/types'
import {
  FaAward,
  FaTrophy,
  FaCertificate,
  FaMedal,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaDownload,
  FaTimes,
} from 'react-icons/fa'

type AchievementCategory = 'Competition' | 'Certification' | 'Exhibition' | 'Hackathon' | 'Award' | 'Course' | 'Other'

const categoryConfig: Record<AchievementCategory, { icon: React.ReactNode; color: string; label: string }> = {
  Competition: { icon: <FaTrophy />, color: 'text-warning', label: 'Kompetisi' },
  Certification: { icon: <FaCertificate />, color: 'text-info', label: 'Sertifikasi' },
  Exhibition: { icon: <FaMedal />, color: 'text-success', label: 'Pameran' },
  Hackathon: { icon: <FaMedal />, color: 'text-primary', label: 'Hackathon' },
  Award: { icon: <FaAward />, color: 'text-destructive', label: 'Penghargaan' },
  Course: { icon: <FaCertificate />, color: 'text-info', label: 'Kursus' },
  Other: { icon: <FaAward />, color: 'text-muted-foreground', label: 'Lainnya' },
}

export default function PencapaianPage() {
  const { language } = useLanguage()
  const id = language === 'id'

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [filterCategory, setFilterCategory] = useState<AchievementCategory | 'All'>('All')

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('is_published', true)
          .order('achieved_on', { ascending: false })

        if (error) throw error
        if (data) setAchievements(data)
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const t = {
    pageTitle: id ? 'Pencapaian' : 'Achievements',
    pageDesc: id
      ? 'Koleksi pencapaian, penghargaan, dan sertifikasi yang membuktikan komitmen dan keahlian saya.'
      : 'Collection of achievements, awards, and certifications that demonstrate my commitment and expertise.',
    featured: id ? 'Unggulan' : 'Featured',
    allCategories: id ? 'Semua' : 'All',
    category: id ? 'Kategori' : 'Category',
    organization: id ? 'Organisasi' : 'Organization',
    date: id ? 'Tanggal' : 'Date',
    viewDetails: id ? 'Lihat Detail' : 'View Details',
    viewCertificate: id ? 'Lihat Sertifikat' : 'View Certificate',
    viewCredential: id ? 'Lihat Kredensial' : 'View Credential',
    noData: id ? 'Belum ada pencapaian yang dipublikasikan.' : 'No achievements published yet.',
  }

  // Get unique categories
  const categories = Array.from(new Set(achievements.map((a) => a.category as AchievementCategory)))

  // Filter achievements
  const filtered =
    filterCategory === 'All' ? achievements : achievements.filter((a) => a.category === filterCategory)

  // Featured achievements
  const featured = filtered.filter((a) => a.featured)
  const others = filtered.filter((a) => !a.featured)

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
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t.pageDesc}</p>
        </div>

        {achievements.length > 0 ? (
          <div className="animate-fade-in">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              <button
                onClick={() => setFilterCategory('All')}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  filterCategory === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-accent'
                }`}
              >
                {t.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                    filterCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-accent'
                  }`}
                >
                  <span className="text-lg">{categoryConfig[cat as AchievementCategory]?.icon}</span>
                  {id
                    ? categoryConfig[cat as AchievementCategory]?.label
                    : cat}
                </button>
              ))}
            </div>

            {/* Featured Section */}
            {featured.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                  <FaTrophy className="text-warning" />
                  {t.featured}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map((achievement) => {
                    const config = categoryConfig[achievement.category as AchievementCategory]
                    return (
                      <Card
                        key={achievement.id}
                        className="overflow-hidden hover:border-border/80 transition-all group cursor-pointer"
                        onClick={() => setSelectedAchievement(achievement)}
                      >
                        <CardContent className="p-6">
                          {achievement.image_url && (
                            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={achievement.image_url}
                                alt={id ? achievement.title_id : achievement.title_en}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div
                              className={`p-2.5 bg-muted rounded-lg text-lg flex-shrink-0 ${config?.color}`}
                            >
                              {config?.icon}
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0">
                              {id ? config?.label : achievement.category}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                            {id ? achievement.title_id : achievement.title_en}
                          </h3>

                          {achievement.organization && (
                            <p className="text-sm text-primary font-semibold mb-2">
                              {achievement.organization}
                            </p>
                          )}

                          {achievement.achieved_on && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              {new Date(achievement.achieved_on).toLocaleDateString(id ? 'id-ID' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All Achievements Grid */}
            {others.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  {id ? 'Semua Pencapaian' : 'All Achievements'}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {others.map((achievement) => {
                    const config = categoryConfig[achievement.category as AchievementCategory]
                    return (
                      <Card
                        key={achievement.id}
                        className="overflow-hidden hover:border-border/80 transition-all group cursor-pointer"
                        onClick={() => setSelectedAchievement(achievement)}
                      >
                        <CardContent className="p-6">
                          {achievement.image_url && (
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={achievement.image_url}
                                alt={id ? achievement.title_id : achievement.title_en}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          <div className="flex items-start gap-2 mb-2">
                            <div className={`text-xl flex-shrink-0 ${config?.color}`}>
                              {config?.icon}
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0 text-xs">
                              {id ? config?.label : achievement.category}
                            </Badge>
                          </div>

                          <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">
                            {id ? achievement.title_id : achievement.title_en}
                          </h3>

                          {achievement.organization && (
                            <p className="text-xs text-primary font-semibold mb-2">{achievement.organization}</p>
                          )}

                          {achievement.achieved_on && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(achievement.achieved_on).toLocaleDateString(id ? 'id-ID' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                              })}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl animate-fade-in">
            <FaAward className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t.noData}</p>
          </div>
        )}
      </Container>

      {/* Achievement Detail Modal */}
      <Modal
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        title={selectedAchievement ? (id ? selectedAchievement.title_id : selectedAchievement.title_en) : ''}
        size="lg"
      >
        {selectedAchievement && (
          <div className="space-y-6">
            {/* Image */}
            {selectedAchievement.image_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                <Image
                  src={selectedAchievement.image_url}
                  alt={id ? selectedAchievement.title_id : selectedAchievement.title_en}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {selectedAchievement.organization && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {t.organization}
                  </p>
                  <p className="text-foreground font-medium">{selectedAchievement.organization}</p>
                </div>
              )}
              {selectedAchievement.achieved_on && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {t.date}
                  </p>
                  <p className="text-foreground font-medium">
                    {new Date(selectedAchievement.achieved_on).toLocaleDateString(id ? 'id-ID' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {(id ? selectedAchievement.description_id : selectedAchievement.description_en) && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {id ? 'Deskripsi' : 'Description'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {id ? selectedAchievement.description_id : selectedAchievement.description_en}
                </p>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              {selectedAchievement.certificate_url && (
                <a
                  href={selectedAchievement.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all"
                >
                  <FaDownload className="w-4 h-4" />
                  {t.viewCertificate}
                </a>
              )}
              {selectedAchievement.credential_url && (
                <a
                  href={selectedAchievement.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-all"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  {t.viewCredential}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
