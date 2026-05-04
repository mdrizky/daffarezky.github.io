"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types";
import { FaTimes } from "react-icons/fa";

export default function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["Semua", "Website", "Branding", "Analytics", "Mobile"];

  const filteredProjects = filter === "Semua" 
    ? initialProjects 
    : initialProjects.filter(p => p.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === cat 
                ? "bg-gradient-neon text-[#0A0A0F] shadow-[0_0_15px_rgba(0,255,136,0.3)]" 
                : "glass text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Belum ada project di kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      )}

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-black/50 p-2 rounded-full z-10"
            >
              <FaTimes size={20} />
            </button>

            <div className="h-64 sm:h-80 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent z-10"></div>
              {/* Using img tag here to easily bypass Next/Image domain config if needed, or stick to img for simpler modal */}
              <img 
                src={selectedProject.image_url || "/og-image.jpg"} 
                alt={selectedProject.title}
                className="w-full h-full object-cover rounded-t-3xl"
              />
              <div className="absolute bottom-6 left-8 z-20">
                <span className="text-[var(--color-neon-blue)] font-bold text-sm tracking-wider uppercase mb-2 block">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold">{selectedProject.title}</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-[var(--color-neon-green)]">Objective</h3>
                <p>Membantu memecahkan masalah X dengan pendekatan Y untuk mencapai Z.</p>

                <h3 className="text-[var(--color-neon-green)]">Target Audience</h3>
                <p>Pengguna muda usia 18-25 tahun yang aktif di media sosial.</p>

                <h3 className="text-[var(--color-neon-green)]">Strategy & Execution</h3>
                <p>
                  {selectedProject.description}
                </p>

                <h3 className="text-[var(--color-neon-green)]">Key Results</h3>
                <ul>
                  <li>Peningkatan konversi 25%</li>
                  <li>Waktu muat website &lt; 2 detik</li>
                  <li>Desain 100% responsif</li>
                </ul>
              </div>

              <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8">
                {selectedProject.demo_url && (
                  <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer" className="bg-gradient-neon text-[#0A0A0F] px-8 py-3 rounded-full font-bold">
                    Visit Live Demo
                  </a>
                )}
                {selectedProject.github_url && (
                  <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="glass px-8 py-3 rounded-full font-bold hover:bg-white/10">
                    View Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
