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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)] rounded-full">
            <span className="w-2 h-2 bg-[var(--color-neon-green)] rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-[var(--color-neon-green)]">{t.currentlyWorking}</span>
          </div>
        )}
      </div>
    </div>
  );
}
