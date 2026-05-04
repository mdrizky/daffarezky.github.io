import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div 
      className="glass rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:-translate-y-2 flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent z-10 opacity-60"></div>
        <Image
          src={project.image_url || "/og-image.jpg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 text-xs font-bold rounded-full bg-gradient-neon text-[#0A0A0F]">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-[var(--color-neon-blue)] text-xs font-semibold tracking-wider uppercase mb-2">
          {project.category}
        </span>
        <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-[var(--color-neon-green)] transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.slice(0, 4).map((tech, i) => (
            <span key={i} className="px-2 py-1 text-xs rounded-md bg-white/10 text-gray-300">
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 4 && (
            <span className="px-2 py-1 text-xs rounded-md bg-white/10 text-gray-300">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-auto">
          {project.demo_url && (
            <a 
              href={project.demo_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-[var(--color-neon-green)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt /> Demo
            </a>
          )}
          {project.github_url && (
            <a 
              href={project.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
