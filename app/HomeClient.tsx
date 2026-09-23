'use client'

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import SocialLinks from "@/components/SocialLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import BlogCard from "@/components/BlogCard";
import SkillBadge from "@/components/SkillBadge";
import dynamic from "next/dynamic";
import type { Profile, Project, Service, ReasonsToHire, LearningJourney, Testimonial, Skill, BlogPost, Education, Experience, FocusArea } from "@/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel"), { ssr: false });
const PartnerSlider = dynamic(() => import("@/components/PartnerSlider"), { ssr: false });

interface HomeClientProps {
  profile: Profile | null;
  projects: Project[];
  servicesData: Service[];
  stats: { projects: number; skills: number };
  reasons: ReasonsToHire[];
  milestones: LearningJourney[];
  currentProjects?: Project[];
  testimonials: Testimonial[];
  partners: { id: string; name: string; logo_url?: string; website_url?: string }[];
  skills: Skill[];
  posts: BlogPost[];
  education: Education[];
  experience: Experience[];
  focusAreas: FocusArea[];
}

export default function HomeClient({
  profile,
  projects,
  servicesData,
  stats,
  reasons,
  milestones,
  testimonials,
  partners,
  skills,
  posts,
  education,
  experience,
  focusAreas,
}: HomeClientProps) {
  const { language } = useLanguage();
  const id = language === "id";

  const title = id ? profile?.title_id || "Web & Mobile Developer" : profile?.title_en || "Web & Mobile Developer";
  const bio = id ? profile?.bio_id : profile?.bio_en;
  const availability = id ? profile?.availability_status_id : profile?.availability_status_en;

  return (
    <div className="flex flex-col pb-24">
      {/* 1. Hero Section - Premium */}
      <section className="relative flex min-h-[90vh] items-center pt-32 pb-16 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
        
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 flex flex-col gap-6 lg:order-1 animate-fade-in-up">
            {availability && (
              <Badge variant="secondary" className="w-fit animate-bounce-subtle">
                <span className="w-2 h-2 bg-success rounded-full mr-2 inline-block"></span>
                {availability}
              </Badge>
            )}
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {profile?.name || "Daffa"} — {title}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              {id
                ? "Membangun identitas digital profesional dan terpercaya."
                : "Building professional and trustworthy digital identities."}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {bio || (id
                  ? "Saya membangun produk digital yang berguna dan menyelesaikan masalah nyata — untuk klien, tim, dan pengguna."
                  : "I build useful digital products that solve real problems — for clients, teams, and users.")}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Button href="/projects">{id ? "Lihat proyek" : "View projects"}</Button>
              <Button href="/kontak" variant="outline">{id ? "Hubungi Saya" : "Hire Me"}</Button>
            </div>
            <div className="mt-8">
              <SocialLinks />
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end animate-fade-in">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border-4 border-border bg-muted shadow-2xl">
              {profile?.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.name || "Daffa"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Tech Stack / Partners Slider */}
      {partners && partners.length > 0 && (
        <section className="border-y border-border bg-gradient-to-r from-card via-card/50 to-card py-12 overflow-hidden">
          <Container>
            <div className="mb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                {id ? 'Dipercaya oleh' : 'Trusted by'}
              </p>
            </div>
            <PartnerSlider partners={partners} />
          </Container>
        </section>
      )}

      {/* 3. Featured Projects - Enhanced */}
      <section className="section-padding">
        <Container>
          <SectionHeader
            eyebrow={id ? "Portfolio" : "Portfolio"}
            title={id ? "Proyek Unggulan" : "Featured Projects"}
            description={id ? "Koleksi terbaik dari solusi digital yang telah saya ciptakan dan hasilkan untuk klien berbeda." : "Best collection of digital solutions I've created and delivered for various clients."}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger">
            {projects.map((project) => (
              <div key={project.id} className="animate-fade-in-up">
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

      {/* 4. What I Build (Focus Areas) - Enhanced */}
      {focusAreas && focusAreas.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-background via-card/30 to-background">
          <Container>
            <SectionHeader
              eyebrow={id ? "Fokus" : "Focus"}
              title={id ? "Apa Yang Saya Bangun" : "What I Build"}
              description={id ? "Spesialisasi dalam solusi teknologi yang scalable, modern, dan user-centric." : "Specializing in scalable, modern, and user-centric technology solutions."}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-stagger">
              {focusAreas.map((area, idx) => (
                <div key={area.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-border/80 transition-all h-full">
                    <CardContent className="p-8">
                      {area.icon && <div className="text-4xl mb-4">{area.icon}</div>}
                      <h3 className="text-xl font-bold mb-3 text-foreground">{id ? area.title_id : area.title_en}</h3>
                      <p className="text-muted-foreground leading-relaxed">{id ? area.description_id : area.description_en}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 5. About (Profile summary) - Enhanced */}
      <section className="section-padding">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div className="order-2 md:order-1">
              <SectionHeader 
                align="left" 
                eyebrow={id ? "Tentang Saya" : "About Me"} 
                title={profile?.name || "Daffa Rezky"}
                description={id ? "Developer, designer, dan problem solver dengan passion untuk teknologi dan inovasi." : "Developer, designer, and problem solver with passion for technology and innovation."}
              />
              <div className="prose dark:prose-invert text-muted-foreground max-w-lg">
                <p className="leading-relaxed">{bio}</p>
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-foreground font-heading">{stats.projects}+</h4>
                    <span className="text-sm text-muted-foreground">{id ? "Proyek Selesai" : "Completed Projects"}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-foreground font-heading">{stats.skills}+</h4>
                    <span className="text-sm text-muted-foreground">{id ? "Skill Dikuasai" : "Skills Mastered"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
                {profile?.about_photo_url && (
                  <Image 
                    src={profile.about_photo_url} 
                    alt={id ? "Tentang Saya" : "About me"} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-500" 
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Learning Journey - Enhanced */}
      {milestones && milestones.length > 0 && (
        <section className="section-padding bg-card/50">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Perjalanan" : "Journey"} 
              title={id ? "Learning Journey" : "Learning Journey"}
              description={id ? "Evolusi berkelanjutan dalam pembelajaran dan pengembangan skill." : "Continuous evolution in learning and skill development."}
            />
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="space-y-8">
                {milestones.map((m, idx) => (
                  <div key={m.id} className="flex gap-6 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-primary shadow-sm">
                        {m.year}
                      </div>
                      {idx < milestones.length - 1 && (
                        <div className="w-0.5 h-24 bg-gradient-to-b from-primary/50 to-transparent mt-4"></div>
                      )}
                    </div>
                    <div className="pb-8 pt-2">
                      <h3 className="text-lg font-bold text-foreground">{id ? m.title_id : m.title_en}</h3>
                      <p className="text-muted-foreground mt-1">{id ? m.description_id : m.description_en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 7. Education - Enhanced */}
      {education && education.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Pendidikan" : "Education"} 
              title={id ? "Latar Belakang Pendidikan" : "Educational Background"}
              description={id ? "Institusi akademik dan pengalaman belajar formal." : "Academic institutions and formal learning experiences."}
            />
            <div className="grid md:grid-cols-2 gap-6 animate-stagger">
              {education.map((edu, idx) => (
                <div key={edu.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <Card className="h-full hover:border-border/80 transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <h3 className="font-bold text-lg text-foreground line-clamp-2">{edu.institution}</h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          {edu.start_year} - {edu.is_current ? (id ? 'Sekarang' : 'Present') : edu.end_year}
                        </Badge>
                      </div>
                      <p className="font-semibold text-primary mb-2">{id ? edu.degree_id : edu.degree_en}</p>
                      {edu.field_of_study && (
                        <p className="text-xs text-muted-foreground mb-3">{id ? 'Bidang: ' : 'Field: '}{edu.field_of_study}</p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed">{id ? edu.description_id : edu.description_en}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 8. Experience - Enhanced */}
      {experience && experience.length > 0 && (
        <section className="section-padding bg-card/50">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Pengalaman" : "Experience"} 
              title={id ? "Pengalaman Kerja" : "Work Experience"}
              description={id ? "Pengalaman profesional yang membentuk keahlian dan perspektif saya." : "Professional experience that shaped my expertise and perspective."}
            />
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              {experience.map((exp, idx) => (
                <Card key={exp.id} className="hover:border-border/80 transition-all" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground">{id ? exp.title_id : exp.title_en}</h3>
                        <p className="text-sm text-primary font-semibold mt-1">{exp.organization} • {exp.role}</p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0 whitespace-nowrap">
                        {exp.start_date} - {exp.is_current ? (id ? 'Sekarang' : 'Present') : exp.end_date}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{id ? exp.description_id : exp.description_en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. Skills - Enhanced */}
      <section className="section-padding">
        <Container>
          <SectionHeader 
            eyebrow={id ? "Keahlian" : "Skills"} 
            title={id ? "Teknologi & Alat" : "Technologies & Tools"}
            description={id ? "Tools dan teknologi yang saya kuasai untuk membangun solusi terbaik." : "Technologies and tools I master to build exceptional solutions."}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-stagger">
            {skills.map((skill, idx) => (
              <div key={skill.id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 4) * 0.05}s` }}>
                <SkillBadge skill={skill} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 10. Services - Enhanced */}
      {servicesData && servicesData.length > 0 && (
        <section className="section-padding bg-card/50">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Layanan" : "Services"} 
              title={id ? "Apa Yang Bisa Saya Bantu?" : "How Can I Help You?"}
              description={id ? "Layanan komprehensif untuk kebutuhan digital Anda." : "Comprehensive services for your digital needs."}
            />
            <div className="grid md:grid-cols-3 gap-8 animate-stagger">
              {servicesData.map((service, idx) => (
                <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 11. Why Hire Me - Enhanced */}
      {reasons && reasons.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader 
              eyebrow={id ? "Mengapa Saya" : "Why Me"} 
              title={id ? "Kenapa Memilih Saya?" : "Why Choose Me?"}
              description={id ? "Alasan spesifik yang membuat saya pilihan terbaik untuk proyek Anda." : "Specific reasons why I'm the best choice for your project."}
            />
            <div className="grid md:grid-cols-3 gap-8 animate-stagger">
              {reasons.map((reason, idx) => (
                <div key={reason.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <Card className="h-full hover:border-border/80 transition-all bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="text-5xl">{reason.icon || "💡"}</div>
                      <h3 className="font-bold text-lg text-foreground">{id ? reason.title_id : reason.title_en}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{id ? reason.description_id : reason.description_en}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 12. Testimonials - Enhanced */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-padding bg-card/50 overflow-hidden">
          <Container>
            <SectionHeader 
              eyebrow="Testimonials" 
              title={id ? "Apa Kata Mereka?" : "What People Say"}
              description={id ? "Testimoni dari klien dan mitra yang telah bekerja sama dengan saya." : "Testimonials from clients and partners I've worked with."}
            />
            <div className="animate-fade-in">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </Container>
        </section>
      )}

      {/* 13. Blog - Enhanced */}
      {posts && posts.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader 
              eyebrow="Blog" 
              title={id ? "Tulisan Terbaru" : "Latest Articles"}
              description={id ? "Insights, tips, dan pembelajaran dari pengalaman saya di industri teknologi." : "Insights, tips, and learnings from my experience in the tech industry."}
            />
            <div className="grid md:grid-cols-3 gap-8 animate-stagger">
              {posts.map((post, idx) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button href="/blog" variant="outline">
                {id ? "Lihat Semua Artikel" : "View All Articles"}
                <span className="ml-2">→</span>
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* 14. Final CTA - Premium */}
      <section className="section-padding">
        <Container>
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80"></div>
            
            <Card className="bg-transparent border-none relative z-10">
              <CardContent className="p-12 md:p-16 text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-foreground">
                  {id ? "Siap untuk Memulai Proyek?" : "Ready to Start Your Project?"}
                </h2>
                <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                  {id 
                    ? "Punya ide, pertanyaan, atau ingin berkolaborasi? Mari kita ciptakan sesuatu yang luar biasa bersama." 
                    : "Have an idea, questions, or want to collaborate? Let's create something amazing together."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Button 
                    href="/kontak" 
                    variant="secondary" 
                    size="lg"
                    className="font-semibold"
                  >
                    {id ? "Hubungi Saya Sekarang" : "Contact Me Now"}
                    <span className="ml-2">→</span>
                  </Button>
                  <Button 
                    href="/proses" 
                    variant="outline" 
                    size="lg"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    {id ? "Lihat Proses" : "View Process"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
