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
  const [imagesRes, featuresRes, challengesRes] = await Promise.all([
    supabase.from("project_images").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_features").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_challenges").select("*").eq("project_id", project.id).order("sort_order"),
  ]);

  const images = (imagesRes.data || []) as ProjectImage[];
  const features = (featuresRes.data || []) as ProjectFeature[];
  const challenges = (challengesRes.data || []) as ProjectChallenge[];
  
  // Using Indonesian as default for SSR pages (unless language routing is added)
  const title = project.title_id || project.title_en;
  const overview = project.overview_id || project.description_id;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8">
          <FaArrowLeft /> Kembali ke Portfolio
        </Link>
        
        {/* Case Study Header */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.category && <Badge variant="secondary">{project.category}</Badge>}
            {project.status && <Badge variant={project.status === 'Completed' ? 'default' : 'outline'}>{project.status}</Badge>}
            {project.year && <Badge variant="outline">{project.year}</Badge>}
          </div>
          
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-6xl leading-tight mb-6">
            {title}
          </h1>
          
          {overview && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {overview}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
            {project.role && (
              <div className="mr-8">
                <span className="block text-sm text-muted-foreground mb-1 uppercase tracking-widest font-bold">Peran</span>
                <span className="font-medium text-foreground">{project.role}</span>
              </div>
            )}
            
            <div className="flex gap-3 ml-auto">
              {project.demo_url && (
                <Button href={project.demo_url} className="gap-2">
                  <FaExternalLinkAlt /> Live Demo
                </Button>
              )}
              {project.github_url && (
                <Button href={project.github_url} variant="outline" className="gap-2">
                  <FaGithub /> Source Code
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mt-12 mb-20 w-full aspect-[21/9] overflow-hidden rounded-3xl border border-border shadow-2xl">
          <Image
            src={project.image_url || "/og-image.jpg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {project.problem_id && (
              <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                  <span className="w-8 h-1 bg-destructive rounded-full"></span> Problem
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mt-6">{project.problem_id}</p>
              </section>
            )}

            {project.solution_id && (
              <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                  <span className="w-8 h-1 bg-primary rounded-full"></span> Solution
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mt-6">{project.solution_id}</p>
              </section>
            )}

            {project.architecture_id && (
              <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-heading font-bold text-foreground">Architecture</h2>
                <div className="p-8 bg-muted/50 rounded-2xl border border-border mt-6">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.architecture_id}</p>
                </div>
              </section>
            )}

            {features.length > 0 && (
              <section>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((f) => (
                    <Card key={f.id} className="bg-background">
                      <CardContent className="p-6 flex items-start gap-4">
                        <FaCheckCircle className="text-primary mt-1 text-xl shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{f.feature_id}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {challenges.length > 0 && (
              <section>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Challenges & Learnings</h2>
                <div className="space-y-6">
                  {challenges.map((c) => (
                    <div key={c.id} className="rounded-2xl border border-border bg-card p-6 md:p-8">
                      <div className="flex gap-4">
                        <FaExclamationTriangle className="text-destructive text-2xl shrink-0" />
                        <div>
                          <h4 className="font-bold text-xl mb-3">{c.challenge_id}</h4>
                          {c.solution_id && (
                            <div className="pl-4 border-l-2 border-primary/30 mt-4">
                              <p className="font-semibold text-sm text-primary uppercase tracking-widest mb-1">How I solved it</p>
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
              <section>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Gallery</h2>
                <div className="grid gap-6">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-video overflow-hidden rounded-2xl border border-border group">
                      <Image src={img.image_url} alt={img.caption_id || title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      {img.caption_id && (
                        <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur p-4 border-t border-border translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-sm font-medium text-foreground text-center">{img.caption_id}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.result_id && (
              <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-heading font-bold text-foreground">The Impact</h2>
                <div className="p-8 bg-primary/10 rounded-2xl border border-primary/20 mt-6">
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{project.result_id}</p>
                </div>
              </section>
            )}
            
            {project.future_plans_id && (
              <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-heading font-bold text-foreground">Future Development</h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mt-6">{project.future_plans_id}</p>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {project.tech_stack?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-foreground uppercase tracking-widest">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="p-8 text-center">
                  <h3 className="font-bold text-2xl font-heading mb-4">Want a similar project?</h3>
                  <p className="mb-6 opacity-90">Let&apos;s build something great together.</p>
                  <Button href="/kontak" variant="secondary" className="w-full">
                    Start a Project
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
