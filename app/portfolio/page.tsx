'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { PageSkeleton } from "@/components/ui/Skeleton";
import type { Project } from "@/types";

// Lazy load the heavy interactive client — it has a modal, filter logic, and images
const PortfolioClient = dynamic(() => import("./PortfolioClient"), {
  loading: () => <PageSkeleton />,
  ssr: false,
});

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (data) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'id' ? 'Karya & ' : 'Works & '}<span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'id'
              ? 'Kumpulan project yang pernah saya kerjakan. Mulai dari website, desain branding, hingga dashboard analytics.'
              : 'A collection of projects I have worked on. From websites and branding design, to analytics dashboards.'}
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {loading ? <PageSkeleton /> : <PortfolioClient initialProjects={projects} />}
        </div>
      </div>
    </div>
  );
}
