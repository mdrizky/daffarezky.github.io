'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { Container } from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Timeline } from '@/components/ui/Timeline'
import {
  FaComments,
  FaLightbulb,
  FaCode,
  FaRocket,
  FaHeadset,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaFileContract,
} from 'react-icons/fa'

export default function ProsesPage() {
  const { language } = useLanguage()
  const id = language === 'id'

  const t = {
    pageTitle: id ? 'Proses Kolaborasi' : 'Collaboration Process',
    pageDesc: id
      ? 'Pendekatan sistematis saya dalam mengubah ide menjadi solusi digital yang impactful dan sustainable.'
      : 'My systematic approach to transforming ideas into impactful and sustainable digital solutions.',
    discover: id ? 'Penemuan' : 'Discovery',
    discoverDesc: id
      ? 'Kami mulai dengan memahami bisnis Anda secara mendalam, target audience, dan tujuan spesifik proyek.'
      : 'We start by understanding your business, target audience, and specific project goals.',
    strategize: id ? 'Strategi' : 'Strategy',
    strategizeDesc: id
      ? 'Merencanakan roadmap lengkap, teknologi yang tepat, dan deliverables yang jelas untuk kesuksesan proyek.'
      : 'Planning a complete roadmap, selecting the right technology, and defining clear deliverables.',
    design: id ? 'Desain' : 'Design',
    designDesc: id
      ? 'Membuat mockup dan prototype interaktif untuk visualisasi dan validasi sebelum development dimulai.'
      : 'Creating mockups and interactive prototypes for visualization and validation before development.',
    develop: id ? 'Pengembangan' : 'Development',
    developDesc: id
      ? 'Membangun solusi dengan clean code, best practices, dan regular updates untuk progress transparan.'
      : 'Building the solution with clean code, best practices, and regular progress updates.',
    launch: id ? 'Peluncuran' : 'Launch',
    launchDesc: id
      ? 'Testing menyeluruh, deployment, dan setup monitoring untuk memastikan kualitas dan performa optimal.'
      : 'Comprehensive testing, deployment, and monitoring setup for quality assurance.',
    support: id ? 'Dukungan' : 'Support',
    supportDesc: id
      ? 'Berkelanjutan support, maintenance, dan optimization untuk memaksimalkan ROI jangka panjang.'
      : 'Ongoing support, maintenance, and optimization to maximize long-term ROI.',
    commitment: id ? 'Komitmen Kami' : 'Our Commitment',
    duration: id ? 'Durasi' : 'Duration',
    contact: id ? 'Hubungi Kami' : 'Get In Touch',
    contactDesc: id
      ? 'Mari mulai proyek Anda hari ini. Hubungi saya untuk konsultasi gratis dan diskusi mendalam.'
      : 'Ready to start your project? Contact me for a free consultation and in-depth discussion.',
  }

  const processSteps = [
    {
      id: '1',
      title: t.discover,
      status: 'completed' as const,
      icon: <FaComments className="w-4 h-4" />,
      description: t.discoverDesc,
      duration: id ? '1-2 minggu' : '1-2 weeks',
      activities: [
        id ? 'Konsultasi mendalam' : 'In-depth consultation',
        id ? 'Analisis kebutuhan' : 'Requirements analysis',
        id ? 'Market research' : 'Market research',
        id ? 'Kompetitor analysis' : 'Competitor analysis',
      ],
    },
    {
      id: '2',
      title: t.strategize,
      status: 'completed' as const,
      icon: <FaLightbulb className="w-4 h-4" />,
      description: t.strategizeDesc,
      duration: id ? '1 minggu' : '1 week',
      activities: [
        id ? 'Proposal dan quote' : 'Proposal & quote',
        id ? 'Tech stack selection' : 'Tech stack selection',
        id ? 'Project timeline' : 'Project timeline',
        id ? 'Resource planning' : 'Resource planning',
      ],
    },
    {
      id: '3',
      title: t.design,
      status: 'completed' as const,
      icon: <FaLightbulb className="w-4 h-4" />,
      description: t.designDesc,
      duration: id ? '2-3 minggu' : '2-3 weeks',
      activities: [
        id ? 'UI/UX design' : 'UI/UX design',
        id ? 'Prototype creation' : 'Prototype creation',
        id ? 'Design review' : 'Design review',
        id ? 'Client feedback' : 'Client feedback',
      ],
    },
    {
      id: '4',
      title: t.develop,
      status: 'current' as const,
      icon: <FaCode className="w-4 h-4" />,
      description: t.developDesc,
      duration: id ? '4-12 minggu' : '4-12 weeks',
      activities: [
        id ? 'Development sprint' : 'Development sprints',
        id ? 'Code review' : 'Code review',
        id ? 'Testing & QA' : 'Testing & QA',
        id ? 'Weekly updates' : 'Weekly updates',
      ],
    },
    {
      id: '5',
      title: t.launch,
      status: 'upcoming' as const,
      icon: <FaRocket className="w-4 h-4" />,
      description: t.launchDesc,
      duration: id ? '1-2 minggu' : '1-2 weeks',
      activities: [
        id ? 'Final testing' : 'Final testing',
        id ? 'Deployment' : 'Deployment',
        id ? 'Monitoring setup' : 'Monitoring setup',
        id ? 'Documentation' : 'Documentation',
      ],
    },
    {
      id: '6',
      title: t.support,
      status: 'upcoming' as const,
      icon: <FaHeadset className="w-4 h-4" />,
      description: t.supportDesc,
      duration: id ? 'Berkelanjutan' : 'Ongoing',
      activities: [
        id ? 'Bug fixes' : 'Bug fixes',
        id ? 'Performance optimization' : 'Performance optimization',
        id ? 'Feature updates' : 'Feature updates',
        id ? 'Security patches' : 'Security patches',
      ],
    },
  ]

  const commitments = [
    {
      icon: <FaCheckCircle />,
      title: id ? 'Transparansi Total' : 'Total Transparency',
      description: id
        ? 'Komunikasi reguler dan laporan progres yang detail di setiap tahap development.'
        : 'Regular communication and detailed progress reports at each development stage.',
    },
    {
      icon: <FaClock />,
      title: id ? 'On-Time Delivery' : 'On-Time Delivery',
      description: id
        ? 'Komitmen untuk menyelesaikan proyek sesuai timeline yang telah disepakati.'
        : 'Commitment to completing projects on the agreed timeline.',
    },
    {
      icon: <FaUsers />,
      title: id ? 'Kolaborasi Aktif' : 'Active Collaboration',
      description: id
        ? 'Anda adalah bagian penting dari proses. Input dan feedback Anda sangat berharga.'
        : 'You are part of the process. Your input and feedback are invaluable.',
    },
    {
      icon: <FaFileContract />,
      title: id ? 'Quality Assurance' : 'Quality Assurance',
      description: id
        ? 'Testing menyeluruh dan standar industri tertinggi untuk hasil yang sempurna.'
        : 'Thorough testing and highest industry standards for perfect results.',
    },
  ]

  const timelineItems = processSteps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.duration,
    status: step.status,
    icon: step.icon,
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

        {/* Timeline Horizontal View */}
        <div className="mb-20 animate-fade-in overflow-x-auto">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex gap-3 min-w-min overflow-x-auto pb-4">
              {processSteps.map((step, idx) => (
                <div key={step.id} className="flex items-start gap-3 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-3 flex-shrink-0 ${
                        step.status === 'completed'
                          ? 'bg-success/10 border-success text-success'
                          : step.status === 'current'
                            ? 'bg-primary/10 border-primary text-primary animate-pulse-glow'
                            : 'bg-muted border-border text-muted-foreground'
                      }`}
                    >
                      {step.icon}
                    </div>
                    {idx < processSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-20 ${
                          step.status === 'completed'
                            ? 'bg-success'
                            : step.status === 'current'
                              ? 'bg-primary'
                              : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="w-32 pt-1">
                    <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{step.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="grid lg:grid-cols-2 gap-6 mb-20 animate-fade-in">
          {processSteps.map((step) => (
            <Card
              key={step.id}
              className={`overflow-hidden transition-all ${
                step.status === 'current' ? 'border-primary ring-1 ring-primary/20' : ''
              }`}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg text-xl flex-shrink-0 ${
                        step.status === 'completed'
                          ? 'bg-success/10 text-success'
                          : step.status === 'current'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      {step.status === 'current' && (
                        <Badge variant="default" className="mt-2">
                          {id ? 'Saat Ini' : 'Current Phase'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {step.duration}
                  </Badge>
                </div>

                <p className="text-foreground leading-relaxed mb-6">{step.description}</p>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    {id ? 'Aktivitas' : 'Activities'}
                  </h4>
                  <ul className="space-y-2">
                    {step.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <FaCheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Commitment Section */}
        <div className="mb-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t.commitment}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {commitments.map((commitment, idx) => (
              <Card key={idx} className="hover:border-border/80 transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg text-2xl flex-shrink-0">
                      {commitment.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{commitment.title}</h3>
                      <p className="text-muted-foreground">{commitment.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 bg-card border border-border rounded-3xl animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.contact}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">{t.contactDesc}</p>
          <a
            href="/kontak"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all active:scale-95"
          >
            {id ? 'Mulai Proyek Sekarang' : 'Start Your Project'}
            <span>→</span>
          </a>
        </div>
      </Container>
    </div>
  )
}
