"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types";
import { FaTimes } from "react-icons/fa";

export default function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { language } = useLanguage();

  const allLabel = language === 'id' ? 'Semua' : 'All';
  const categories = [allLabel, "Website", "Aplikasi Mobile", "Project IoT", "UI/UX"];

  const filteredProjects = filter === allLabel 
    ? initialProjects 
    : initialProjects.filter(p => p.category === filter);

  const getTitle = (p: Project) => language === 'id' ? p.title_id : p.title_en;
  const getDescription = (p: Project) => language === 'id' ? p.description_id : p.description_en;

  const getDemoLabel = (url: string | undefined) => {
    if (!url) return ''
    const isVideo = /youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm/i.test(url)
    return isVideo ? (language === 'id' ? 'Tonton Video Demo' : 'Watch Video Demo') : (language === 'id' ? 'Kunjungi Demo' : 'Visit Live Demo')
  }

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
                : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {language === 'id' ? 'Belum ada project di kategori ini.' : 'No projects in this category yet.'}
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
          <div className="bg-white dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative animate-in zoom-in-95 duration-300 shadow-2xl">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-black/50 p-2 rounded-full z-10"
            >
              <FaTimes size={20} />
            </button>

            <div className="h-64 sm:h-80 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0F] to-transparent z-10"></div>
              <img 
                src={selectedProject.image_url || "/og-image.jpg"} 
                alt={getTitle(selectedProject)}
                className="w-full h-full object-cover rounded-t-3xl"
              />
              <div className="absolute bottom-6 left-8 z-20">
                <span className="text-[var(--color-neon-blue)] font-bold text-sm tracking-wider uppercase mb-2 block">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">{getTitle(selectedProject)}</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-[var(--color-neon-green)]">
                  {language === 'id' ? 'Tujuan' : 'Objective'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'id' 
                    ? 'Membantu memecahkan masalah X dengan pendekatan Y untuk mencapai Z.'
                    : 'Helping solve problem X with approach Y to achieve Z.'}
                </p>

                <h3 className="text-[var(--color-neon-green)]">
                  {language === 'id' ? 'Target Audiens' : 'Target Audience'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'id'
                    ? 'Pengguna muda usia 18-25 tahun yang aktif di media sosial.'
                    : 'Young users aged 18-25 who are active on social media.'}
                </p>

                <h3 className="text-[var(--color-neon-green)]">
                  {language === 'id' ? 'Strategi & Eksekusi' : 'Strategy & Execution'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {getDescription(selectedProject)}
                </p>

                <h3 className="text-[var(--color-neon-green)]">
                  {language === 'id' ? 'Hasil Utama' : 'Key Results'}
                </h3>
                <ul>
                  <li className="text-gray-600 dark:text-gray-300">{language === 'id' ? 'Peningkatan konversi 25%' : '25% conversion increase'}</li>
                  <li className="text-gray-600 dark:text-gray-300">{language === 'id' ? 'Waktu muat website < 2 detik' : 'Website load time < 2 seconds'}</li>
                  <li className="text-gray-600 dark:text-gray-300">{language === 'id' ? 'Desain 100% responsif' : '100% responsive design'}</li>
                </ul>
              </div>

              <div className="mt-12 flex flex-wrap gap-4 border-t border-gray-200 dark:border-white/10 pt-8">
                {selectedProject.demo_url ? (
                  <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer" className="bg-gradient-neon text-[#0A0A0F] px-8 py-3 rounded-full font-bold">
                    {getDemoLabel(selectedProject.demo_url)}
                  </a>
                ) : (
                  <div className="px-8 py-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-sm font-semibold">
                    {language === 'id'
                      ? 'Demo belum tersedia. Gunakan link video jika belum ada hosting.'
                      : 'Demo not available yet. Use a video link when hosting is not ready.'}
                  </div>
                )}
                {selectedProject.github_url && (
                  <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                    {language === 'id' ? 'Lihat Kode' : 'View Source Code'}
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
