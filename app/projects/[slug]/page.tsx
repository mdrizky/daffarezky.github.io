import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Project, ProjectImage, ProjectFeature, ProjectChallenge } from "@/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

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
  const title = project.title_id || project.title_en;
  const overview = project.overview_id || project.description_id;

  return (
    <div className="pt-32 pb-24">
      <Container>
        <Link href="/projects" className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white">
          ← Semua proyek
        </Link>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.category ? <Badge>{project.category}</Badge> : null}
          {project.status ? <Badge>{project.status}</Badge> : null}
          {project.year ? <Badge>{String(project.year)}</Badge> : null}
        </div>
        <h1 className="mt-4 font-heading text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          {title}
        </h1>
        {project.role ? (
          <p className="mt-3 text-gray-500">Peran: {project.role}</p>
        ) : null}

        <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10">
          <Image
            src={project.image_url || "/og-image.jpg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demo_url ? <Button href={project.demo_url}>Demo</Button> : null}
          {project.github_url ? (
            <Button href={project.github_url} variant="secondary">
              GitHub
            </Button>
          ) : null}
        </div>

        <article className="mt-16 space-y-12">
          {overview ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Overview</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400">{overview}</p>
            </section>
          ) : null}
          {project.problem_id ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Problem</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400">{project.problem_id}</p>
            </section>
          ) : null}
          {project.solution_id ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Solution</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400">{project.solution_id}</p>
            </section>
          ) : null}
          {features.length > 0 ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Features</h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {features.map((f) => (
                  <li key={f.id} className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    {f.feature_id}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {images.length > 0 ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Screenshots</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-video overflow-hidden rounded-2xl">
                    <Image src={img.image_url} alt={img.caption_id || title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {project.tech_stack?.length ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Technology</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </section>
          ) : null}
          {challenges.length > 0 ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Challenges</h2>
              <div className="mt-4 space-y-4">
                {challenges.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
                    <p className="font-semibold">{c.challenge_id}</p>
                    {c.solution_id ? (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{c.solution_id}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {project.result_id ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Result</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400">{project.result_id}</p>
            </section>
          ) : null}
          {project.future_plans_id ? (
            <section>
              <h2 className="font-heading text-2xl font-bold">Future plans</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400">{project.future_plans_id}</p>
            </section>
          ) : null}
        </article>
      </Container>
    </div>
  );
}
