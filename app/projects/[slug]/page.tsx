import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import type { Project, ProjectImage, ProjectFeature, ProjectChallenge } from "@/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daffa-portfolio.vercel.app";

async function getProject(slug: string) {
  const supabase = await createClient();
  const bySlug = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (bySlug.data) return bySlug.data as Project;

  const byId = await supabase
    .from("projects")
    .select("*")
    .eq("id", slug)
    .eq("is_published", true)
    .maybeSingle();

  return (byId.data as Project | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };

  const title = project.title_id || project.title_en || "Project";
  const desc = project.overview_id || project.description_id || "";

  return {
    title: `${title} | Case Study`,
    description: desc,
    alternates: {
      canonical: `${siteUrl}/projects/${slug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `${siteUrl}/projects/${slug}`,
      type: "website",
      images: project.image_url ? [{ url: project.image_url, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const supabase = await createClient();
  const [imagesRes, featuresRes, challengesRes, technologiesRes] = await Promise.all([
    supabase.from("project_images").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_features").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_challenges").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_technologies").select("*").eq("project_id", project.id).order("sort_order"),
  ]);

  const images = (imagesRes.data || []) as ProjectImage[];
  const features = (featuresRes.data || []) as ProjectFeature[];
  const challenges = (challengesRes.data || []) as ProjectChallenge[];
  const technologies = (technologiesRes.data || []) as Array<{ id: string; name: string; sort_order: number }>;
  
  // Using Indonesian as default for SSR pages (unless language routing is added)
  const title = project.title_id || project.title_en;
  const overview = project.overview_id || project.description_id;
  const problem = project.problem_id || project.problem_en;
  const solution = project.solution_id || project.solution_en;
  const result = project.result_id || project.result_en;
  const architecture = project.architecture_id || project.architecture_en;
  const futurePlans = project.future_plans_id || project.future_plans_en;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 animate-fade-in">
          <FaArrowLeft /> Kembali ke Portfolio
        </Link>
        
        {/* Case Study Header */}
        <div className="max-w-4xl mb-12 animate-fade-in-up">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.category && <Badge variant="secondary">{project.category}</Badge>}
            {project.status && <Badge variant={project.status === 'Completed' ? 'default' : 'outline'}>{project.status}</Badge>}
            {project.year && <Badge variant="outline">{project.year}</Badge>}
          </div>
          
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-6xl lg:text-7xl leading-tight mb-6">
            {title}
          </h1>
          
          {overview && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {overview}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-t border-border pt-6">
            {project.role && (
              <div>
                <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Peran</span>
                <span className="font-semibold text-foreground text-lg">{project.role}</span>
              </div>
            )}
            
            {project.duration && (
              <div className="sm:ml-8 border-l border-border pl-6 sm:pl-8">
                <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Durasi</span>
                <span className="font-semibold text-foreground text-lg">{project.duration}</span>
              </div>
            )}
            
            <div className="flex gap-3 sm:ml-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border sm:pl-8 w-full sm:w-auto">
              {project.demo_url && (
                <Button href={project.demo_url} className="gap-2 flex-1 sm:flex-none">
                  <FaExternalLinkAlt /> Live Demo
                </Button>
              )}
              {project.github_url && (
                <Button href={project.github_url} variant="outline" className="gap-2 flex-1 sm:flex-none">
                  <FaGithub /> Source Code
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-20 w-full aspect-[21/9] overflow-hidden rounded-3xl border border-border shadow-2xl animate-fade-in group">
          <Image
            src={project.image_url || "/og-image.jpg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-16 animate-fade-in">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {problem && (
              <section className="space-y-4">
                <h2 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                  <span className="w-2 h-2 bg-destructive rounded-full"></span>
                  <span>Masalah</span>
                </h2>
                <div className="p-6 md:p-8 bg-destructive/5 border border-destructive/20 rounded-2xl">
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{problem}</p>
                </div>
              </section>
            )}

            {solution && (
              <section className="space-y-4">
                <h2 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                  <span className="w-2 h-2 bg-info rounded-full"></span>
                  <span>Solusi</span>
                </h2>
                <div className="p-6 md:p-8 bg-info/5 border border-info/20 rounded-2xl">
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{solution}</p>
                </div>
              </section>
            )}

            {architecture && (
              <section className="space-y-4">
                <h2 className="text-3xl font-heading font-bold text-foreground">Arsitektur Teknis</h2>
                <div className="p-6 md:p-8 bg-card border border-border rounded-2xl">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{architecture}</p>
                </div>
              </section>
            )}

            {features.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-foreground">Fitur Utama</h2>
                <div className="grid sm:grid-cols-2 gap-4 animate-stagger">
                  {features.map((f, idx) => (
                    <Card key={f.id} className="bg-background/50 border-border/50 hover:border-border/80 transition-all" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <CardContent className="p-6 flex items-start gap-4">
                        <FaCheckCircle className="text-success mt-1 text-xl shrink-0 flex-shrink-0" />
                        <p className="font-semibold text-foreground leading-relaxed">{f.feature_id}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {challenges.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-foreground">Tantangan & Pembelajaran</h2>
                <div className="space-y-6 animate-stagger">
                  {challenges.map((c, idx) => (
                    <div key={c.id} className="rounded-2xl border border-border bg-card hover:border-border/80 p-6 md:p-8 transition-all" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="flex gap-4">
                        <FaExclamationTriangle className="text-warning text-2xl shrink-0 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-foreground mb-3">{c.challenge_id}</h4>
                          {c.solution_id && (
                            <div className="pl-4 border-l-2 border-primary/30 pt-4">
                              <p className="font-semibold text-xs text-primary uppercase tracking-widest mb-2">Solusi</p>
                              <p className="text-muted-foreground leading-relaxed">{c.solution_id}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {images.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-foreground">Galeri Proyek</h2>
                <div className="grid gap-6 animate-stagger">
                  {images.map((img, idx) => (
                    <div key={img.id} className="relative aspect-video overflow-hidden rounded-2xl border border-border group" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <Image 
                        src={img.image_url} 
                        alt={img.caption_id || title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      {img.caption_id && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm font-semibold text-foreground">{img.caption_id}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {result && (
              <section className="space-y-4">
                <h2 className="text-3xl font-heading font-bold text-foreground">Hasil & Impact</h2>
                <div className="p-6 md:p-8 bg-success/5 border border-success/20 rounded-2xl">
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{result}</p>
                </div>
              </section>
            )}
            
            {futurePlans && (
              <section className="space-y-4">
                <h2 className="text-3xl font-heading font-bold text-foreground">Pengembangan Lanjutan</h2>
                <div className="p-6 md:p-8 bg-muted/50 rounded-2xl border border-border">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{futurePlans}</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Technologies */}
              {(project.tech_stack?.length > 0 || technologies.length > 0) && (
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-sm mb-4 text-foreground uppercase tracking-widest">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1 text-xs">{tech}</Badge>
                      ))}
                      {technologies.map((tech) => (
                        <Badge key={tech.id} variant="outline" className="px-3 py-1 text-xs">{tech.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Stats */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4 text-foreground uppercase tracking-widest">Info Proyek</h3>
                  <div className="space-y-4 text-sm">
                    {project.year && (
                      <div>
                        <span className="text-muted-foreground">Tahun</span>
                        <p className="font-semibold text-foreground">{project.year}</p>
                      </div>
                    )}
                    {project.status && (
                      <div>
                        <span className="text-muted-foreground">Status</span>
                        <p className="font-semibold text-foreground">{project.status}</p>
                      </div>
                    )}
                    {project.category && (
                      <div>
                        <span className="text-muted-foreground">Kategori</span>
                        <p className="font-semibold text-foreground">{project.category}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground border-none shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-lg font-heading">Ingin Proyek Serupa?</h3>
                  <p className="text-sm text-primary-foreground/80">Mari wujudkan ide Anda bersama saya</p>
                  <Button href="/kontak" variant="secondary" className="w-full">
                    Hubungi Saya
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
