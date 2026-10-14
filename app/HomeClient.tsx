'use client'

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import SocialLinks from "@/components/SocialLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import BlogCard from "@/components/BlogCard";
import CertificateCard from "@/components/CertificateCard";
import { defaultCertificatesList } from "@/lib/certificates-data";
import dynamic from "next/dynamic";
import type { Profile, Project, Service, ReasonsToHire, Testimonial, BlogPost, FocusArea, Certificate } from "@/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  FaGraduationCap, 
  FaClock, 
  FaFileAlt, 
  FaArrowRight,
  FaCode,
  FaDatabase,
  FaBrain,
  FaLaptopCode,
  FaMobileAlt,
  FaServer,
  FaHeart,
  FaRobot
} from "react-icons/fa";

// Professional SVG icon renderer for focus areas
function renderFocusAreaIcon(iconName?: string, title?: string) {
  const key = `${iconName || ''} ${title || ''}`.toLowerCase();
  
  if (key.includes('code') || key.includes('web development') || key.includes('frontend')) {
    return <FaCode className="text-xl md:text-2xl text-cyan-400" />;
  }
  if (key.includes('database') || key.includes('backend') || key.includes('sql') || key.includes('supabase')) {
    return <FaDatabase className="text-xl md:text-2xl text-cyan-400" />;
  }
  if (key.includes('cpu') || key.includes('ai') || key.includes('otomasi') || key.includes('automation') || key.includes('brain')) {
    return <FaBrain className="text-xl md:text-2xl text-cyan-400" />;
  }
  if (key.includes('mobile') || key.includes('android') || key.includes('ios') || key.includes('aplikasi')) {
    return <FaMobileAlt className="text-xl md:text-2xl text-cyan-400" />;
  }
  if (key.includes('server') || key.includes('api') || key.includes('cloud')) {
    return <FaServer className="text-xl md:text-2xl text-cyan-400" />;
  }
  if (key.includes('heart') || key.includes('nilai') || key.includes('value')) {
    return <FaHeart className="text-xl md:text-2xl text-cyan-400" />;
  }
  if (key.includes('robot')) {
    return <FaRobot className="text-xl md:text-2xl text-cyan-400" />;
  }
  return <FaLaptopCode className="text-xl md:text-2xl text-cyan-400" />;
}

const defaultFocusSolutions: Partial<FocusArea>[] = [
  {
    id: 'sol-web',
    title_id: 'Web Development',
    title_en: 'Web Development',
    description_id: 'Membangun website modern, responsif, cepat, dan mudah digunakan untuk kebutuhan personal maupun bisnis.',
    description_en: 'Building modern, responsive, fast, and intuitive websites for personal and business needs.',
    icon: 'code',
  },
  {
    id: 'sol-backend',
    title_id: 'Back-End & Database',
    title_en: 'Back-End & Database',
    description_id: 'Mengembangkan API, sistem autentikasi aman, dan manajemen database terstruktur yang siap menampung skala pengguna.',
    description_en: 'Developing robust APIs, secure authentication systems, and structured databases ready to scale.',
    icon: 'database',
  },
  {
    id: 'sol-ai',
    title_id: 'Solusi AI & Otomasi Digital',
    title_en: 'AI Integration & Automation',
    description_id: 'Mengintegrasikan layanan AI modern (LLM) dan otomatisasi alur kerja untuk mempercepat efisiensi operasional bisnis.',
    description_en: 'Integrating modern AI models and workflow automations to accelerate operational efficiency.',
    icon: 'cpu',
  },
];

const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel"), { ssr: false });
const PartnerSlider = dynamic(() => import("@/components/PartnerSlider"), { ssr: false });

interface HomeClientProps {
  profile: Profile | null;
  projects: Project[];
  servicesData: Service[];
  stats: { projects: number; skills: number };
  reasons: ReasonsToHire[];
  testimonials: Testimonial[];
  partners: { id: string; name: string; logo_url?: string; website_url?: string }[];
  posts: BlogPost[];
  focusAreas: FocusArea[];
  certificates?: Certificate[];
}

export default function HomeClient({
  profile,
  projects,
  servicesData,
  stats,
  reasons,
  testimonials,
  partners,
  posts,
  focusAreas,
  certificates,
}: HomeClientProps) {
  const { language } = useLanguage();
  const id = language === "id";

  const title = id ? profile?.title_id || "Web & Mobile Developer" : profile?.title_en || "Web & Mobile Developer";
  const bio = id ? profile?.bio_id : profile?.bio_en;
  const availability = id ? profile?.availability_status_id : profile?.availability_status_en;

  // Filter blog posts: only show articles created/published within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentPosts = (posts || []).filter((post) => {
    const postDate = new Date(post.published_at || post.created_at);
    return postDate >= sevenDaysAgo;
  });

  return (
    <div className="flex flex-col pb-24">
      {/* 1. Hero Section - Refined & Well-Proportioned */}
      <section className="relative flex min-h-[85vh] items-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
        
        <Container className="grid items-center gap-10 lg:grid-cols-12">
          {/* Left Column - Content */}
          <div className="order-2 flex flex-col gap-5 lg:order-1 lg:col-span-7 animate-fade-in-up">
            {availability && (
              <Badge variant="secondary" className="w-fit">
                <span className="w-2 h-2 bg-success rounded-full mr-2 inline-block"></span>
                {availability}
              </Badge>
            )}
            
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {profile?.name || "Muhammad Daffa Rezky Adyra"} — {title}
            </p>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight text-foreground max-w-2xl">
              {id
                ? "Membangun identitas digital profesional dan terpercaya."
                : "Building professional and trustworthy digital identities."}
            </h1>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
              {bio || (id
                  ? "Saya membangun produk digital yang berguna dan menyelesaikan masalah nyata — untuk klien, tim, dan pengguna."
                  : "I build useful digital products that solve real problems — for clients, teams, and users.")}
            </p>

            {/* Action Buttons */}
            <div className="mt-2 flex flex-wrap gap-3">
              <Button href="/projects">{id ? "Lihat proyek" : "View projects"}</Button>
              <Button href="/kontak" variant="outline">{id ? "Hubungi Saya" : "Hire Me"}</Button>
              <Button href="/cv" variant="secondary" className="gap-2">
                <FaFileAlt className="text-xs" />
                {id ? "Lihat CV" : "View CV"}
              </Button>
            </div>

            {/* Quick Experience & Education Info Chips */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                <FaClock className="text-primary text-xs" />
                <span>{id ? "3+ Tahun Belajar IT" : "3+ Years Learning IT"}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                <FaGraduationCap className="text-primary text-xs" />
                <span>{id ? "Mahasiswa Semester 1" : "1st Semester Student"}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>

          {/* Right Column - Appropriately Sized Photo */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end animate-fade-in">
            <div className="relative aspect-square w-full max-w-[210px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[280px] overflow-hidden rounded-2xl border-2 border-border bg-muted shadow-md">
              <Image
                src={profile?.photo_url || "/logo.png"}
                alt={profile?.name || "Daffa Rizky"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Featured Projects - Fast & Focused */}
      <section className="section-padding">
        <Container>
          <SectionHeader
            eyebrow={id ? "Portfolio" : "Portfolio"}
            title={id ? "Proyek Unggulan" : "Featured Projects"}
            description={id ? "Koleksi karya digital terbaik yang telah saya selesaikan. Klik untuk membaca detail arsitektur, teknologi, dan solusinya." : "Best digital projects I've built. Click on any project to explore its case study."}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/projects" variant="outline">
              {id ? "Lihat Semua Proyek" : "View All Projects"}
              <span className="ml-2">→</span>
            </Button>
          </div>
        </Container>
      </section>

      {/* 3. What I Build — Premium Digital Solutions */}
      <section className="section-padding bg-card/30 dark:bg-zinc-950/40 border-y border-border/80">
        <Container>
          <SectionHeader
            eyebrow="MY EXPERTISE"
            title={id ? "Apa yang Saya Bangun" : "What I Build"}
            description={
              id
                ? "Solusi digital untuk membantu bisnis berkembang melalui teknologi yang modern, efisien, dan tepat guna."
                : "Digital solutions that help businesses grow through modern, efficient, and purposeful technology."
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {((focusAreas && focusAreas.length > 0) ? focusAreas : defaultFocusSolutions).map((area, index) => {
              const title = id ? area.title_id : (area.title_en || area.title_id);
              const desc = id ? area.description_id : (area.description_en || area.description_id);
              const stepNumber = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={area.id || index}
                  className="group relative bg-card/70 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Top Row: Icon Container + Number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan-400/40">
                        {renderFocusAreaIcon(area.icon, title)}
                      </div>
                      <span className="text-xs font-mono font-bold text-muted-foreground/40 group-hover:text-cyan-400/70 transition-colors">
                        {stepNumber}
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-2.5 group-hover:text-cyan-400 transition-colors duration-200">
                      {title}
                    </h3>

                    {/* Benefit Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Bottom Action: Contextual Link */}
                  <div className="mt-6 pt-4 border-t border-border/40 dark:border-zinc-800/60 flex items-center justify-between">
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-cyan-400 group-hover:text-cyan-400 transition-colors duration-200"
                    >
                      <span>{id ? "Lihat Studi Kasus" : "View Case Studies"}</span>
                      <FaArrowRight className="text-[10px] transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. About Summary */}
      <section className="section-padding">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <SectionHeader 
                align="left" 
                eyebrow={id ? "Tentang Saya" : "About Me"} 
                title={profile?.name || "Daffa Rezky"}
                description={id ? "Developer, problem solver, dan pembelajar cepat dengan passion mendalam di dunia teknologi digital." : "Developer, problem solver, and fast learner with passion for digital technology."}
              />
              <div className="text-muted-foreground max-w-lg space-y-4">
                <p className="leading-relaxed">{bio}</p>
                <div className="mt-8 grid grid-cols-2 gap-8 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-foreground font-heading">{stats.projects}+</h4>
                    <span className="text-sm text-muted-foreground">{id ? "Proyek Selesai" : "Completed Projects"}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-foreground font-heading">{stats.skills}+</h4>
                    <span className="text-sm text-muted-foreground">{id ? "Skill Dikuasai" : "Skills Mastered"}</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button href="/tentang" variant="outline">
                    {id ? "Baca Selengkapnya Tentang Saya →" : "Read More About Me →"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-md rounded-2xl overflow-hidden bg-muted border border-border shadow-md">
                <Image 
                  src={profile?.about_photo_url || profile?.photo_url || "/logo.png"} 
                  alt={id ? "Tentang Saya" : "About me"} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Services */}
      {servicesData && servicesData.length > 0 && (
        <section className="section-padding bg-card/40 border-y border-border">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Layanan" : "Services"} 
              title={id ? "Paket Layanan Utama" : "Core Services"}
              description={id ? "Solusi komprehensif mulai dari website kilat hingga aplikasi custom dan sistem cerdas." : "Comprehensive solutions from modern websites to custom systems."}
            />
            <div className="grid md:grid-cols-3 gap-8">
              {servicesData.map((service) => (
                <div key={service.id}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button href="/services" variant="outline">
                {id ? "Lihat Rincian Seluruh Layanan & Tips Harga →" : "View All Services & Pricing Tips →"}
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* 6. Why Hire Me */}
      {reasons && reasons.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Mengapa Saya" : "Why Me"} 
              title={id ? "Kenapa Memilih Saya?" : "Why Choose Me?"}
              description={id ? "Nilai lebih dan etos kerja yang saya tawarkan untuk kesuksesan proyek Anda." : "Values and work ethics I bring to your project's success."}
            />
            <div className="grid md:grid-cols-3 gap-8">
              {reasons.map((reason) => (
                <Card key={reason.id} className="h-full hover:border-primary/40 transition-all bg-card text-card-foreground border-border">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="text-4xl">{reason.icon || "💡"}</div>
                    <h3 className="font-bold text-lg text-foreground">{id ? reason.title_id : reason.title_en}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{id ? reason.description_id : reason.description_en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 7. Testimonials ("Apa Kata Mereka") */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-padding bg-card/30 border-t border-border overflow-hidden">
          <Container>
            <SectionHeader 
              eyebrow="Testimonials" 
              title={id ? "Apa Kata Mereka?" : "What People Say"}
              description={id ? "Umpan balik nyata dari klien dan mitra yang telah berkolaborasi dengan saya." : "Real feedback from clients and partners who have worked with me."}
            />
            <div>
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </Container>
        </section>
      )}

      {/* 8. Fitur Kontribusi / Partner Slider (Tepat di bawah "Apa Kata Mereka", Otomatis Bergeser Sendiri & Hanya Logo) */}
      <section className="border-b border-border bg-card/40 py-10 overflow-hidden">
        <Container>
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {id ? "Kontribusi & Kolaborasi" : "Contributions & Collaborations"}
            </span>
          </div>
          <PartnerSlider partners={partners} language={language} />
        </Container>
      </section>

      {/* 8.5 Sertifikasi Profesional (Tepat setelah Kontribusi & Kolaborasi) */}
      <section className="section-padding bg-card/20 border-b border-border">
        <Container>
          <SectionHeader
            eyebrow={id ? "Kredensial & Lisensi" : "Verified Credentials"}
            title={id ? "Sertifikasi Profesional" : "Professional Certifications"}
            description={
              id
                ? "Bukti kompetensi resmi, sertifikasi keahlian, dan penyelesaian program teknologi terverifikasi."
                : "Official competency credentials, verified tech certifications, and program completions."
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {((certificates && certificates.length > 0) ? certificates.slice(0, 3) : defaultCertificatesList.slice(0, 3)).map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} language={language} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/certificates" variant="outline">
              {id ? "Lihat Semua Sertifikat" : "View All Certificates"}
              <span className="ml-2">→</span>
            </Button>
          </div>
        </Container>
      </section>

      {/* 9. Blog Terbaru (Hanya maksimal 7 hari terakhir) */}
      {recentPosts.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader 
              eyebrow="Blog Terbaru" 
              title={id ? "Tulisan Terbaru (7 Hari Terakhir)" : "Latest Articles (Last 7 Days)"}
              description={id ? "Catatan teknis dan wawasan terbaru yang baru saja saya publikasikan." : "Fresh insights and tech notes published recently."}
            />
            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <div key={post.id}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button href="/blog" variant="outline">
                {id ? "Lihat Semua Artikel di Blog" : "View All Articles in Blog"}
                <span className="ml-2">→</span>
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* 10. Final Call To Action */}
      <section className="section-padding">
        <Container>
          <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-card/60 p-10 md:p-14 text-center space-y-6 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
              {id ? "Siap Memulai Proyek Digital Anda?" : "Ready to Start Your Digital Project?"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              {id 
                ? "Punya ide aplikasi, kebutuhan website UMKM, atau otomatisasi sistem? Mari kita diskusikan solusinya secara gratis." 
                : "Have an app idea, website need, or workflow automation in mind? Let's discuss the solution for free."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Button href="/kontak" size="lg">
                {id ? "Hubungi Saya Sekarang" : "Contact Me Now"}
                <FaArrowRight className="ml-2" />
              </Button>
              <Button href="/proses" variant="outline" size="lg">
                {id ? "Lihat Alur Kerja (AI Workflow)" : "View AI Workflow"}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
