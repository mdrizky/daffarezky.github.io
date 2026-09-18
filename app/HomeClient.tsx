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
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[90vh] items-center pt-32 pb-16">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 flex flex-col gap-6 lg:order-1 animate-fade-in-up">
            {availability && (
              <Badge variant="secondary" className="w-fit">{availability}</Badge>
            )}
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {profile?.name || "Daffa"} — {title}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl">
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
              <Button href="/kontak" variant="outline">Hire Me</Button>
            </div>
            <div className="mt-8">
              <SocialLinks />
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end animate-fade-in">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-full border-4 border-border bg-muted">
              {profile?.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.name || "Daffa"}
                  fill
                  className="object-cover"
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
        <section className="border-y border-border bg-muted/30 py-10 overflow-hidden">
          <Container>
            <PartnerSlider partners={partners} />
          </Container>
        </section>
      )}

      {/* 3. Featured Projects */}
      <section className="section-padding">
        <Container>
          <SectionHeader
            eyebrow={id ? "Portfolio" : "Portfolio"}
            title={id ? "Featured Projects" : "Featured Projects"}
            description={id ? "Beberapa proyek terbaik yang pernah saya bangun." : "Some of the best projects I've built."}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/projects" variant="outline">{id ? "Lihat Semua Proyek" : "View All Projects"}</Button>
          </div>
        </Container>
      </section>

      {/* 4. What I Build (Focus Areas) */}
      {focusAreas && focusAreas.length > 0 && (
        <section className="section-padding bg-muted/30">
          <Container>
            <SectionHeader
              eyebrow={id ? "Fokus" : "Focus"}
              title={id ? "Apa Yang Saya Bangun" : "What I Build"}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {focusAreas.map(area => (
                <Card key={area.id} className="bg-background">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-3 text-foreground">{id ? area.title_id : area.title_en}</h3>
                    <p className="text-muted-foreground">{id ? area.description_id : area.description_en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 5. About (Profile summary) */}
      <section className="section-padding">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader align="left" eyebrow={id ? "Tentang Saya" : "About Me"} title={profile?.name || "Daffa Rezky"} />
              <div className="prose dark:prose-invert text-muted-foreground">
                <p>{bio}</p>
                <div className="mt-8 flex gap-8">
                  <div>
                    <h4 className="text-3xl font-bold text-foreground">{stats.projects}+</h4>
                    <span className="text-sm text-muted-foreground">{id ? "Proyek Selesai" : "Completed Projects"}</span>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-foreground">{stats.skills}+</h4>
                    <span className="text-sm text-muted-foreground">{id ? "Skill Dikuasai" : "Skills Mastered"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              {profile?.about_photo_url && (
                <Image src={profile.about_photo_url} alt="About me" fill className="object-cover" />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Learning Journey */}
      {milestones && milestones.length > 0 && (
        <section className="section-padding bg-muted/30">
          <Container>
            <SectionHeader eyebrow={id ? "Perjalanan" : "Journey"} title={id ? "Learning Journey" : "Learning Journey"} />
            <div className="max-w-3xl mx-auto space-y-8">
              {milestones.map((m) => (
                <div key={m.id} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {m.year}
                    </div>
                    <div className="w-px h-full bg-border mt-4"></div>
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{id ? m.title_id : m.title_en}</h3>
                    <p className="text-muted-foreground">{id ? m.description_id : m.description_en}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 7. Education */}
      {education && education.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader eyebrow={id ? "Pendidikan" : "Education"} title={id ? "Latar Belakang Pendidikan" : "Educational Background"} />
            <div className="grid md:grid-cols-2 gap-6">
              {education.map(edu => (
                <Card key={edu.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-foreground">{edu.institution}</h3>
                      <Badge variant="outline">{edu.start_year} - {edu.is_current ? (id ? 'Sekarang' : 'Present') : edu.end_year}</Badge>
                    </div>
                    <p className="font-medium text-primary mb-2">{id ? edu.degree_id : edu.degree_en}</p>
                    <p className="text-sm text-muted-foreground">{id ? edu.description_id : edu.description_en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 8. Experience */}
      {experience && experience.length > 0 && (
        <section className="section-padding bg-muted/30">
          <Container>
            <SectionHeader eyebrow={id ? "Pengalaman" : "Experience"} title={id ? "Pengalaman Kerja" : "Work Experience"} />
            <div className="max-w-3xl mx-auto space-y-6">
              {experience.map(exp => (
                <Card key={exp.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-2">
                      <h3 className="font-bold text-lg text-foreground">{id ? exp.title_id : exp.title_en} <span className="text-muted-foreground font-normal">di {exp.organization}</span></h3>
                      <Badge variant="secondary">{exp.start_date} - {exp.is_current ? (id ? 'Sekarang' : 'Present') : exp.end_date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">{id ? exp.description_id : exp.description_en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. Skills */}
      <section className="section-padding">
        <Container>
          <SectionHeader eyebrow={id ? "Keahlian" : "Skills"} title={id ? "Teknologi & Alat" : "Technologies & Tools"} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map(skill => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </Container>
      </section>

      {/* 10. Services */}
      {servicesData && servicesData.length > 0 && (
        <section className="section-padding bg-muted/30">
          <Container>
            <SectionHeader eyebrow={id ? "Layanan" : "Services"} title={id ? "Apa Yang Bisa Saya Bantu?" : "How Can I Help You?"} />
            <div className="grid md:grid-cols-3 gap-8">
              {servicesData.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 11. Why Hire Me */}
      {reasons && reasons.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader eyebrow={id ? "Mengapa Saya" : "Why Me"} title={id ? "Kenapa Memilih Saya?" : "Why Choose Me?"} />
            <div className="grid md:grid-cols-3 gap-8">
              {reasons.map(reason => (
                <Card key={reason.id} className="bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{reason.icon || "💡"}</div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{id ? reason.title_id : reason.title_en}</h3>
                    <p className="text-sm text-muted-foreground">{id ? reason.description_id : reason.description_en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 12. Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-padding bg-muted/30 overflow-hidden">
          <Container>
            <SectionHeader eyebrow="Testimonials" title={id ? "Apa Kata Mereka?" : "What People Say"} />
            <TestimonialCarousel testimonials={testimonials} />
          </Container>
        </section>
      )}

      {/* 13. Blog */}
      {posts && posts.length > 0 && (
        <section className="section-padding">
          <Container>
            <SectionHeader eyebrow="Blog" title={id ? "Tulisan Terbaru" : "Latest Articles"} />
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button href="/blog" variant="outline">{id ? "Lihat Semua Artikel" : "View All Articles"}</Button>
            </div>
          </Container>
        </section>
      )}

      {/* 14. Final CTA */}
      <section className="section-padding">
        <Container>
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold font-heading">{id ? "Mari Bekerja Sama" : "Let's Work Together"}</h2>
              <p className="text-lg max-w-2xl mx-auto opacity-90">
                {id ? "Punya ide proyek atau butuh bantuan teknis? Jangan ragu untuk menghubungi saya." : "Have a project idea or need technical help? Don't hesitate to contact me."}
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button href="/kontak" variant="secondary" size="lg">Contact Me</Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
