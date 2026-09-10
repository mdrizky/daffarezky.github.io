'use client'

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import SocialLinks from "@/components/SocialLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import dynamic from "next/dynamic";
import type { Profile, Project, Service, ReasonsToHire, LearningJourney, Testimonial, Skill, BlogPost } from "@/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { projectHref } from "@/lib/mappers";

const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel"), { ssr: false });
const PartnerSlider = dynamic(() => import("@/components/PartnerSlider"), { ssr: false });

interface HomeClientProps {
  profile: Profile | null;
  projects: Project[];
  servicesData: Service[];
  stats: { projects: number; skills: number };
  reasons: ReasonsToHire[];
  milestones: LearningJourney[];
  currentProjects: Project[];
  testimonials: Testimonial[];
  partners: { id: string; name: string; logo_url?: string; website_url?: string }[];
  skills: Skill[];
  posts: BlogPost[];
}

export default function HomeClient({
  profile,
  projects,
  servicesData,
  stats,
  reasons,
  milestones,
  currentProjects,
  testimonials,
  partners,
  skills,
  posts,
}: HomeClientProps) {
  const { language } = useLanguage();
  const id = language === "id";

  const title = id
    ? profile?.title_id || "Web & Mobile Developer"
    : profile?.title_en || "Web & Mobile Developer";
  const bio = id ? profile?.bio_id : profile?.bio_en;
  const availability = id
    ? profile?.availability_status_id
    : profile?.availability_status_en;
  const waNumber = (profile?.wa || "").replace(/[^\d]/g, "");
  const waHref = waNumber ? `https://wa.me/${waNumber}` : "/kontak";

  return (
    <div className="flex flex-col gap-24 pb-28 md:gap-32">
      <section className="relative flex min-h-[88vh] items-center pt-32">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            {availability ? (
              <Badge className="w-fit">{availability}</Badge>
            ) : null}
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
              {profile?.name || "Daffa"} — {title}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-6xl">
              {id
                ? "Website, aplikasi Android, backend, dan integrasi AI."
                : "Websites, Android apps, backend systems, and AI integrations."}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {bio ||
                (id
                  ? "Saya membangun produk digital yang berguna dan menyelesaikan masalah nyata — untuk klien, tim, dan pengguna."
                  : "I build useful digital products that solve real problems — for clients, teams, and users.")}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button href="/projects">{id ? "Lihat proyek" : "View projects"}</Button>
              <Button href="/kontak" variant="secondary">
                Hire Me
              </Button>
              <Button href="/cv" variant="ghost">
                CV
              </Button>
            </div>
            <div className="mt-6">
              <SocialLinks />
            </div>
            <div className="mt-6 grid max-w-md grid-cols-3 gap-6 border-t border-gray-200 pt-6 dark:border-white/10">
              <div>
                <p className="font-heading text-2xl font-bold">{stats.projects}</p>
                <p className="text-sm text-gray-500">{id ? "Proyek" : "Projects"}</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{stats.skills}</p>
                <p className="text-sm text-gray-500">Skills</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{currentProjects.length}</p>
                <p className="text-sm text-gray-500">{id ? "Berjalan" : "Ongoing"}</p>
              </div>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-[280px] w-[280px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5 md:h-[400px] md:w-[400px]">
              <Image
                src={profile?.photo_url || "/foto.jpg"}
                alt={profile?.name || "Daffa"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {skills.length > 0 && (
        <section>
          <Container>
            <SectionHeader
              eyebrow={id ? "Teknologi" : "Stack"}
              title={id ? "Alat yang saya pakai" : "Tools I work with"}
            />
            <div className="flex flex-wrap justify-center gap-2">
              {skills.slice(0, 18).map((skill) => (
                <Badge key={skill.id}>{skill.name}</Badge>
              ))}
            </div>
          </Container>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <Container>
            <div className="mb-4 flex items-end justify-between gap-6">
              <SectionHeader
                align="left"
                eyebrow={id ? "Karya" : "Work"}
                title={id ? "Proyek unggulan" : "Featured projects"}
              />
              <Button href="/projects" variant="secondary" className="mb-12 hidden md:inline-flex">
                {id ? "Semua proyek" : "All projects"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {servicesData.length > 0 && (
        <section>
          <Container>
            <SectionHeader title={id ? "Yang bisa saya bangun" : "What I build"} />
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {servicesData.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section>
        <Container>
          <Card>
            <CardBody className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <SectionHeader
                  align="left"
                  title={id ? "Tentang" : "About"}
                  description={
                    id
                      ? profile?.vision_id || "Fokus pada produk digital yang cepat, jelas, dan bermanfaat."
                      : profile?.vision_en || "Focused on fast, clear, and useful digital products."
                  }
                />
                <Button href="/tentang" variant="secondary">
                  {id ? "Profil lengkap" : "Full profile"}
                </Button>
              </div>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {id ? profile?.focus_id || bio : profile?.focus_en || bio}
              </p>
            </CardBody>
          </Card>
        </Container>
      </section>

      {milestones.length > 0 && (
        <section>
          <Container>
            <SectionHeader title={id ? "Perjalanan belajar" : "Learning journey"} />
            <div className="relative mx-auto max-w-3xl space-y-10 border-l border-gray-200 pl-8 dark:border-white/10">
              {milestones.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[37px] top-1 h-3 w-3 rounded-full bg-gray-900 dark:bg-white" />
                  <p className="text-sm font-semibold text-gray-500">{item.year}</p>
                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {id ? item.title_id : item.title_en}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {id ? item.description_id : item.description_en}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {currentProjects.length > 0 && (
        <section>
          <Container>
            <SectionHeader title={id ? "Sedang dikerjakan" : "In progress"} />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {currentProjects.map((project) => (
                <Card key={project.id}>
                  <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                    <Image
                      src={project.image_url || "/og-image.jpg"}
                      alt={id ? project.title_id : project.title_en}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {id ? project.title_id : project.title_en}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {id ? project.description_id : project.description_en}
                    </p>
                    <Link href={projectHref(project)} className="mt-4 inline-block text-sm font-semibold">
                      {id ? "Studi kasus" : "Case study"} →
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {reasons.length > 0 && (
        <section>
          <Container>
            <SectionHeader title={id ? "Mengapa bekerja sama" : "Why hire me"} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {reasons.map((item) => (
                <Card key={item.id}>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {id ? item.title_id : item.title_en}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {id ? item.description_id : item.description_en}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {testimonials.length > 0 && (
        <section>
          <Container>
            <SectionHeader title={id ? "Testimoni" : "Testimonials"} />
            <TestimonialCarousel initialData={testimonials} />
          </Container>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <Container>
            <SectionHeader title={id ? "Tulisan terbaru" : "Latest writing"} />
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full transition hover:-translate-y-0.5">
                    <CardBody>
                      <p className="text-xs uppercase tracking-wide text-gray-500">{post.category}</p>
                      <h3 className="mt-2 font-heading text-lg font-bold text-gray-900 dark:text-white">
                        {id ? post.title_id : post.title_en}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                        {id ? post.excerpt_id : post.excerpt_en}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {partners.length > 0 && (
        <section>
          <Container>
            <PartnerSlider language={language} initialData={partners} />
          </Container>
        </section>
      )}

      <section>
        <Container>
          <Card>
            <CardBody className="p-10 text-center md:p-16">
              <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
                {id ? "Punya proyek yang perlu dibangun?" : "Have a product that needs to be built?"}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
                {id
                  ? "Kirim brief singkat. Saya balas dengan ruang lingkup, estimasi, dan apakah saya bisa membantu."
                  : "Send a short brief. I reply with scope, estimate, and whether I can help."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/kontak">{id ? "Kirim brief" : "Send a brief"}</Button>
                {waHref.startsWith("http") ? (
                  <Button href={waHref} variant="secondary">
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Container>
      </section>
    </div>
  );
}
