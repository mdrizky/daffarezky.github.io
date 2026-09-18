"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types";

export default function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const { language } = useLanguage();
  const allLabel = language === 'id' ? 'Semua' : 'All';
  const [filter, setFilter] = useState(allLabel);

  const categories = [allLabel, "Web", "Mobile", "AI", "Backend", "Dashboard", "Other"];

  const categoryAliases: Record<string, string[]> = {
    Web: ['Web', 'Website'],
    Mobile: ['Mobile', 'Aplikasi Mobile'],
    AI: ['AI'],
    Backend: ['Backend', 'Backend/API'],
    Dashboard: ['Dashboard', 'Analytics'],
    Other: ['Other', 'Project IoT', 'UI/UX'],
  };

  const filteredProjects = (filter === allLabel || filter === 'Semua' || filter === 'All')
    ? initialProjects
    : initialProjects.filter((project) => {
        const accepted = categoryAliases[filter] || [filter];
        return accepted.includes(project.category) || project.categories?.some((category) => accepted.includes(category));
      });

  return (
    <>
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-12 justify-center">
        {categories.map((cat) => {
          const isActive = filter === cat || (cat === allLabel && (filter === 'Semua' || filter === 'All'));
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {language === 'id' ? 'Belum ada project di kategori ini.' : 'No projects in this category yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
            />
          ))}
        </div>
      )}
    </>
  );
}
