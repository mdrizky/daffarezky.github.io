'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { Container } from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  FaRocket,
  FaBolt,
  FaEye,
  FaCheckDouble,
  FaArrowRight,
  FaShieldAlt,
  FaCode
} from 'react-icons/fa'

export default function ProsesPage() {
  const { language } = useLanguage()
  const id = language === 'id'

  const steps = [
    {
      step: '01',
      day: id ? 'Hari ke-1' : 'Day 1',
      title: id ? 'Kickoff & AI Blueprint' : 'Kickoff & AI Blueprint',
      badge: id ? 'Tahap 1' : 'Phase 1',
      icon: <FaBolt className="text-amber-500 text-2xl" />,
      desc: id
        ? 'Kita bedah ide bisnis dan kebutuhan fitur Anda secara kilat. Saya langsung menggunakan AI-driven architecture tools untuk menyusun roadmap dan draf sistem hari itu juga.'
        : 'Rapid discovery of business goals and feature requirements. Utilizing AI-driven architecture tools to assemble roadmap and system draft on day one.',
      activities: id
        ? ['Konsultasi kilat & bedah ide', 'Penentuan tech stack modern', 'Penyusunan scope proyek & estimasi']
        : ['Quick discovery & concepting', 'Modern tech stack selection', 'Project scope & milestone estimation'],
    },
    {
      step: '02',
      day: id ? 'Hari ke-2 s.d. Hari ke-7' : 'Day 2 to Day 7',
      title: id ? 'Rapid Sprint & AI-Assisted Dev' : 'Rapid Sprint & AI-Assisted Dev',
      badge: id ? 'Tahap 2' : 'Phase 2',
      icon: <FaCode className="text-primary text-2xl" />,
      desc: id
        ? 'Memanfaatkan integrasi AI dalam coding environment (Laravel, Kotlin/Jetpack Compose, Database), saya membangun fondasi dan logika aplikasi 3x lebih cepat dibanding metode konvensional.'
        : 'Leveraging AI integration within the development environment (Next.js, Laravel, mobile engines, databases) to construct core logic 3x faster than traditional methods.',
      activities: id
        ? ['Pengembangan logika inti', 'Integrasi API & struktur Database', 'Standar clean code & security checks']
        : ['Core application logic', 'API & Database integration', 'Clean code & security standards'],
    },
    {
      step: '03',
      day: id ? 'Hari ke-8' : 'Day 8',
      title: id ? 'Live Preview & Real-Time Feedback' : 'Live Preview & Real-Time Feedback',
      badge: id ? 'Tahap 3' : 'Phase 3',
      icon: <FaEye className="text-blue-500 text-2xl" />,
      desc: id
        ? 'Tidak perlu menunggu berminggu-minggu untuk melihat hasil. Anda langsung mendapat akses live staging link untuk menguji aplikasi secara langsung dan memberikan catatan revisi instan.'
        : 'No waiting for weeks in the dark. You receive direct access to a private live staging link to interact with the application and provide instant feedback.',
      activities: id
        ? ['Akses staging link interaktif', 'Client review & walkthrough', 'Penyesuaian & revisi kilat']
        : ['Interactive staging link access', 'Client review walkthrough', 'Instant adjustments & polish'],
    },
    {
      step: '04',
      day: id ? 'Hari ke-9 s.d. Hari ke-10' : 'Day 9 to Day 10',
      title: id ? 'Deployment & Launch' : 'Deployment & Launch',
      badge: id ? 'Tahap 4' : 'Phase 4',
      icon: <FaRocket className="text-emerald-500 text-2xl" />,
      desc: id
        ? 'Aplikasi Anda dipublikasikan ke server produksi (Vercel/Railway/Cloud) dengan sistem keamanan dan monitoring optimal. Siap meluncur ke pasaran!'
        : 'Your product is deployed to production cloud infrastructure (Vercel/Railway/Cloud) with security hardening and monitoring. Ready to hit the market!',
      activities: id
        ? ['Final quality & performance testing', 'Deploy ke server produksi', 'Handover penuh & dokumentasi']
        : ['Final quality & performance testing', 'Production deployment', 'Full handover & guide documentation'],
    },
  ]

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background text-foreground transition-colors duration-300">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-16 animate-fade-in-up">
          <Badge variant="outline" className="mb-4">
            {id ? 'Alur Kerja Modern' : 'Modern Workflow'}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
            {id ? 'Proses Kolaborasi' : 'Collaboration Process'} <br />
            <span className="text-primary font-bold">(AI-Accelerated Workflow)</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {id
              ? 'Cara kerja saya dirancang untuk era modern: Cepat, transparan, dan menggunakan kekuatan AI untuk memangkas waktu pengerjaan tanpa mengurangi kualitas kode.'
              : 'Engineered for the modern era: Fast, transparent, and utilizing AI-driven workflows to slash turnaround time while upholding high code standards.'}
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="space-y-8 mb-20">
          {steps.map((step) => (
            <Card key={step.step} className="bg-card text-card-foreground border-border hover:border-primary/40 transition-all shadow-sm">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="font-bold text-xs">{step.badge}</Badge>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {step.day}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold font-heading text-foreground">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  {/* Description & Activities */}
                  <div className="lg:max-w-xl space-y-4">
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {step.desc}
                    </p>
                    
                    <div className="pt-2 border-t border-border/60">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                        {id ? 'Aktivitas Utama:' : 'Key Activities:'}
                      </p>
                      <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground">
                        {step.activities.map((act, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <FaCheckDouble className="text-primary text-xs shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Value Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl text-primary mb-2 flex justify-center"><FaBolt /></div>
              <h3 className="font-bold text-lg text-foreground">{id ? '3x Lebih Cepat' : '3x Faster Velocity'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {id ? 'Pengerjaan berbasis AI memangkas siklus koding konvensional berminggu-minggu menjadi beberapa hari saja.' : 'AI-assisted dev condenses traditional multi-week sprints into focused days.'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl text-primary mb-2 flex justify-center"><FaEye /></div>
              <h3 className="font-bold text-lg text-foreground">{id ? 'Transparansi Penuh' : 'Full Transparency'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {id ? 'Akses staging link interaktif untuk melihat progres nyata dan memberikan feedback langsung.' : 'Private staging links allow inspecting the real running build early on.'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl text-primary mb-2 flex justify-center"><FaShieldAlt /></div>
              <h3 className="font-bold text-lg text-foreground">{id ? 'Kualitas Produksi' : 'Production Grade'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {id ? 'Standard clean code, pengujian keamanan, dan optimasi performa tinggi untuk bisnis siap tumbuh.' : 'Strict clean code practices, security audits, and optimized performance.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-card/60 p-10 md:p-12 text-center space-y-6 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
            {id ? 'Siap Memulai Sprint Proyek Anda?' : 'Ready to Launch Your Project Sprint?'}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            {id
              ? 'Konsultasikan ide Anda hari ini dan dapatkan estimasi arsitektur serta timeline pengerjaan gratis.'
              : 'Consult your vision today and receive a complimentary system architecture blueprint and timeline.'}
          </p>
          <div className="pt-2">
            <Button href="/kontak" size="lg">
              {id ? 'Mulai Konsultasi Kilat' : 'Start Quick Consultation'}
              <FaArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
