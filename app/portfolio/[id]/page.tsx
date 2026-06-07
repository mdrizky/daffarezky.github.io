'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaClock, FaCalendar, FaTachometerAlt } from "react-icons/fa";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single();
        
        if (data) setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  const t = {
    back: language === 'id' ? 'Kembali' : 'Back',
    viewDemo: language === 'id' ? 'Lihat Demo' : 'View Demo',
    viewCode: language === 'id' ? 'Lihat Kode' : 'View Code',
    progress: language === 'id' ? 'Progres' : 'Progress',
    startDate: language === 'id' ? 'Tanggal Mulai' : 'Start Date',
    completionDate: language === 'id' ? 'Tanggal Selesai' : 'Completion Date',
    estimatedHours: language === 'id' ? 'Estimasi Jam' : 'Estimated Hours',
    actualHours: language === 'id' ? 'Jam Aktual' : 'Actual Hours',
    difficulty: language === 'id' ? 'Kesulitan' : 'Difficulty',
    techStack: language === 'id' ? 'Tech Stack' : 'Tech Stack',
    currentlyWorking: language === 'id' ? 'Sedang Dikerjakan' : 'Currently Working',
    completed: language === 'id' ? 'Selesai' : 'Completed',
    inProgress: language === 'id' ? 'Dalam Pengerjaan' : 'In Progress',
    notStarted: language === 'id' ? 'Belum Dimulai' : 'Not Started',
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Project not found</p>
      </div>
    );
  }

  const getStatusColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = (progress: number) => {
    if (progress === 0) return t.notStarted;
    if (progress < 100) return t.inProgress;
    return t.completed;
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Back Button */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <FaArrowLeft /> {t.back}
        </Link>

        {/* Project Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/5">
            <Image
              src={project.image_url}
              alt={language === 'id' ? project.title_id : project.title_en}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'id' ? project.title_id : project.title_en}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {language === 'id' ? project.description_id : project.description_en}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.progress}</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className={`text-xs font-bold mt-1 inline-block ${getStatusColor(project.progress).replace('bg-', 'text-')}`}>
                {getStatusText(project.progress)}
              </span>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {project.start_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaCalendar className="text-[var(--color-neon-blue)]" />
                  <span>
                    <span className="font-bold">{t.startDate}:</span> {project.start_date}
                  </span>
                </div>
              )}
              {project.completion_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaCalendar className="text-[var(--color-neon-green)]" />
                  <span>
                    <span className="font-bold">{t.completionDate}:</span> {project.completion_date}
                  </span>
                </div>
              )}
              {project.estimated_hours && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaClock className="text-[var(--color-neon-blue)]" />
                  <span>
                    <span className="font-bold">{t.estimatedHours}:</span> {project.estimated_hours}
                  </span>
                </div>
              )}
              {project.actual_hours && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaTachometerAlt className="text-[var(--color-neon-green)]" />
                  <span>
                    <span className="font-bold">{t.actualHours}:</span> {project.actual_hours}
                  </span>
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.difficulty}:</span>
              <span className="ml-2 px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                {project.difficulty}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-neon text-[#0A0A0F] px-6 py-3 rounded-xl font-bold text-center shadow-[0_0_20px_rgba(0,153,255,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <FaExternalLinkAlt /> {t.viewDemo}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold text-center hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <FaGithub /> {t.viewCode}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Case Study Sections */}
        {(project.problem_id || project.problem_en) && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl transform group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-bold">01</span>
                {language === 'id' ? 'Masalah' : 'The Problem'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {language === 'id' ? project.problem_id : project.problem_en}
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl transform group-hover:scale-110 transition-transform">💡</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm font-bold">02</span>
                {language === 'id' ? 'Solusi' : 'The Solution'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {language === 'id' ? project.solution_id : project.solution_en}
              </p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl transform group-hover:scale-110 transition-transform">✅</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-bold">03</span>
                {language === 'id' ? 'Hasil' : 'The Result'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {language === 'id' ? project.result_id : project.result_en}
              </p>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6 text-gray-900 dark:text-white">{t.techStack}</h2>
          <div className="flex flex-wrap gap-3">
            {project.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Currently Working Badge */}
        {project.is_current && (
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)] rounded-full mb-6">
              <span className="w-2 h-2 bg-[var(--color-neon-green)] rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-[var(--color-neon-green)]">{t.currentlyWorking}</span>
            </div>
            
            {(project.current_features_id || project.current_features_en) && (
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {language === 'id' ? 'Fitur yang sedang dikembangkan:' : 'Features currently being developed:'}
                </h3>
                <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {language === 'id' ? project.current_features_id : project.current_features_en}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Flyer / CTA */}
        {(project.bottom_flyer_id || project.bottom_flyer_en) && (
          <div className="mt-20 relative rounded-[40px] overflow-hidden bg-gradient-to-r from-[var(--color-neon-blue)]/20 to-[var(--color-neon-green)]/20 border border-white/10 p-12 text-center">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-neon-blue)] blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--color-neon-green)] blur-[100px] opacity-30"></div>
            
            <p className="text-xl md:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-8 relative z-10">
              {language === 'id' ? project.bottom_flyer_id : project.bottom_flyer_en}
            </p>
            
            <Link 
              href="/kontak"
              className="inline-flex items-center gap-2 bg-gradient-neon text-[#0A0A0F] px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 transition-transform relative z-10"
            >
              {language === 'id' ? 'Tertarik dengan project ini?' : 'Interested in this project?'} <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
