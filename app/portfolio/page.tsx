import { createClient } from "@/lib/supabase-server";
import PortfolioClient from "./PortfolioClient";
import type { Project } from "@/types";

export const revalidate = 3600;

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projects = projectsData as Project[] || [];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Karya & <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Kumpulan project yang pernah saya kerjakan. Mulai dari website, desain branding, hingga dashboard analytics.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <PortfolioClient initialProjects={projects} />
        </div>
      </div>
    </div>
  );
}
