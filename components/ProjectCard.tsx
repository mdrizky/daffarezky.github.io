"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaTools, FaClock } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Project } from "@/types";
import { projectHref } from "@/lib/mappers";
import { Badge } from "@/components/ui/Badge";

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { language } = useLanguage();
  const id = language === 'id';

  const title = id ? project.title_id : project.title_en;
  
  // Format status cleanly for Indonesian / English
  const getStatusDisplay = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("selesai") || s === "completed") {
      return {
        label: id ? "Selesai 100%" : "Completed 100%",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: <FaCheckCircle className="text-xs mr-1" />
      };
    }
    if (s.includes("pengembangan") || s === "ongoing" || s.includes("dev")) {
      return {
        label: id ? "Tahap Pengembangan (Siap Pakai)" : "In Development (Ready)",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: <FaTools className="text-xs mr-1" />
      };
    }
    return {
      label: status || (id ? "Aktif" : "Active"),
      className: "bg-primary/10 text-primary border-primary/20",
      icon: <FaClock className="text-xs mr-1" />
    };
  };

  const statusInfo = getStatusDisplay(project.status);

  return (
    <Link 
      href={projectHref(project)} 
      onClick={onClick} 
      className="group flex flex-col h-full bg-card text-card-foreground border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* 1. Gambar dari project */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={project.image_url || "/og-image.jpg"}
          alt={title || "Project Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm ${statusInfo.className}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>

        {project.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="text-xs font-bold shadow-sm">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* 2 & 3. Nama project & Jenis (Category) */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            {project.category || (id ? "Website" : "Website")}
          </span>
          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
          <span>{id ? "Lihat Detail Proyek" : "View Case Study"}</span>
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
