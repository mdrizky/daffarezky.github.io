import { createClient } from "@/lib/supabase-server";
import HomeClient from "./HomeClient";

export default async function Home() {
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
    partnersRes
  ] = await Promise.all([
    supabase.from("profile").select("*").limit(1).single(),
    supabase.from("projects").select("*").eq("featured", true).limit(3),
    supabase.from("services").select("*").order("price", { ascending: true }).limit(3),
    supabase.from("skills").select("*", { count: 'exact', head: true }),
    supabase.from("projects").select("*", { count: 'exact', head: true }),
    supabase.from("reasons_to_hire").select("*").order("sort_order", { ascending: true }),
    supabase.from("journey_milestones").select("*").order("sort_order", { ascending: true }),
    supabase.from("projects").select("*").eq("is_current", true).limit(3),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(6),
    supabase.from("partners").select("*").order("order_index", { ascending: true }),
  ]);

  return (
    <HomeClient
      profile={profileRes.data}
      projects={projectsRes.data || []}
      servicesData={servicesRes.data || []}
      stats={{
        projects: projectsCountRes.count || 0,
        skills: skillsCountRes.count || 0
      }}
      reasons={reasonsRes.data || []}
      milestones={milestonesRes.data || []}
      currentProjects={currentProjectsRes.data || []}
      testimonials={testimonialsRes.data || []}
      partners={partnersRes.data || []}
    />
  );
}
