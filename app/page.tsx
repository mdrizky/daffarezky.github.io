import { createClient } from "@/lib/supabase-server";
import HomeClient from "./HomeClient";
import { mapTestimonial } from "@/lib/mappers";

export default async function Home() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <HomeClient
        profile={null}
        projects={[]}
        servicesData={[]}
        stats={{ projects: 0, skills: 0 }}
        reasons={[]}
        milestones={[]}
        currentProjects={[]}
        testimonials={[]}
        partners={[]}
        skills={[]}
        posts={[]}
        education={[]}
        experience={[]}
        focusAreas={[]}
      />
    )
  }

  const supabase = await createClient();

  const [
    profileRes,
    projectsRes,
    servicesRes,
    skillsCountRes,
    projectsCountRes,
    reasonsRes,
    milestonesRes,
    currentProjectsRes,
    testimonialsRes,
    partnersRes,
    skillsRes,
    postsRes,
    educationRes,
    experienceRes,
    focusAreasRes,
  ] = await Promise.all([
    supabase.from("profile").select("*").limit(1).single(),
    supabase.from("projects").select("*").eq("featured", true).eq("is_published", true).limit(3),
    supabase.from("services").select("*").eq("is_published", true).order("sort_order", { ascending: true }).limit(3),
    supabase.from("skills").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("reasons_to_hire").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    supabase.from("learning_journey").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    supabase.from("projects").select("*").eq("is_published", true).eq("status", "Ongoing").limit(3),
    supabase.from("testimonials").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6),
    supabase.from("partners").select("*").eq("is_published", true).order("order_index", { ascending: true }),
    supabase.from("skills").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    supabase.from("blog_posts").select("*").eq("is_published", true).eq("status", "published").order("published_at", { ascending: false }).limit(3),
    supabase.from("education").select("*").eq("is_published", true).order("start_year", { ascending: false }),
    supabase.from("experience").select("*").eq("is_published", true).order("order_index", { ascending: true }),
    supabase.from("focus_areas").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
  ]).catch(() => []);

  const testimonials = (testimonialsRes?.data || []).map((row: Record<string, unknown>) => mapTestimonial(row));

  return (
    <HomeClient
      profile={profileRes?.data || null}
      projects={projectsRes?.data || []}
      servicesData={servicesRes?.data || []}
      stats={{
        projects: projectsCountRes?.count || 0,
        skills: skillsCountRes?.count || 0
      }}
      reasons={reasonsRes?.data || []}
      milestones={milestonesRes?.data || []}
      currentProjects={currentProjectsRes?.data || []}
      testimonials={testimonials}
      partners={partnersRes?.data || []}
      skills={skillsRes?.data || []}
      posts={postsRes?.data || []}
      education={educationRes?.data || []}
      experience={experienceRes?.data || []}
      focusAreas={focusAreasRes?.data || []}
    />
  );
}
