"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Project } from "@/types";
import { projectHref } from "@/lib/mappers";

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { language } = useLanguage();

  const title = language === 'id' ? project.title_id : project.title_en;
  const description = language === 'id' ? project.description_id : project.description_en;
  const isVideoDemo = /youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm/i.test(project.demo_url || "")
  const demoLabel = isVideoDemo ? (language === 'id' ? 'Video Demo' : 'Video Demo') : (language === 'id' ? 'Demo' : 'Live Demo')

  return (
    <article className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full dark:hover:border-[var(--color-neon-blue)]/30 dark:hover:shadow-[0_0_20px_rgba(0,153,255,0.08)]">
      <Link href={projectHref(project)} onClick={onClick} className="block">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-60"></div>
        <Image
          src={project.image_url || "/og-image.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 text-xs font-bold rounded-full bg-gradient-neon text-white shadow-md">
            Featured
          </div>
        )}

        {/* Bottom Flyer Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#0A0A0F]/90 backdrop-blur-md p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-200 dark:border-white/10">
          <div className="text-[10px] font-black text-[var(--color-neon-green)] uppercase tracking-widest mb-1">
            {project.year} · {project.duration || (language === 'id' ? 'Selesai' : 'Completed')}
          </div>
          <p className="text-gray-900 dark:text-white text-[11px] font-medium line-clamp-1">
            {language === 'id' ? project.bottom_flyer_id : project.bottom_flyer_en}
          </p>
        </div>
      </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={projectHref(project)} onClick={onClick} className="block">
        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">
          {project.category}
        </span>
        <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-[var(--color-neon-green)] transition-colors text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-none flex-grow leading-relaxed">
          {description}
        </p>
        </Link>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.slice(0, 4).map((tech, i) => (
            <span key={i} className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 4 && (
            <span key="more" className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
          {project.demo_url && (
            <a 
              href={project.demo_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[var(--color-neon-green)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt /> {demoLabel}
            </a>
          )}
          {project.github_url && (
            <a 
              href={project.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub /> GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
