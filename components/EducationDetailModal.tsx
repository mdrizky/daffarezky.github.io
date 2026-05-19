"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaTimes,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
} from "react-icons/fa";
import type { Education } from "@/types";
import { useLanguage } from "@/components/LanguageProvider";

interface EducationDetailModalProps {
  education: Education;
  onClose: () => void;
}

export default function EducationDetailModal({
  education,
  onClose,
}: EducationDetailModalProps) {
  const { language } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  const degree = language === "id" ? education.degree_id : education.degree_en;
  const description =
    language === "id" ? education.description_id : education.description_en;

  const period = education.is_current
    ? `${education.start_year} – ${language === "id" ? "Sekarang" : "Present"}`
    : `${education.start_year} – ${education.end_year}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0D0D14] border border-gray-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan gradient */}
        <div className="relative h-36 bg-gradient-to-br from-[#00FF88]/20 to-[#0099FF]/20 rounded-t-3xl overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/10 to-[#0099FF]/10" />
          {/* Logo sekolah jika ada */}
          {(education as any).logo_url && (
            <div className="absolute left-6 bottom-0 translate-y-1/2 w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-[#0D0D14] shadow-lg bg-white">
              <Image
                src={(education as any).logo_url}
                alt={education.institution}
                fill
                className="object-contain p-2"
              />
            </div>
          )}
          {/* Tombol tutup */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center text-gray-700 dark:text-white hover:bg-white/40 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Konten */}
        <div className={`p-6 pt-${(education as any).logo_url ? "14" : "6"}`}>
          {/* Status badge */}
          {education.is_current && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/25 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
              {language === "id" ? "Sedang Berjalan" : "In Progress"}
            </span>
          )}

          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">
            {education.institution}
          </h2>
          <p className="text-[var(--color-neon-blue)] font-semibold mb-4">{degree}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="text-[var(--color-neon-green)]" />
              <span>{period}</span>
            </div>
            {(education as any).location && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-[var(--color-neon-blue)]" />
                <span>{(education as any).location}</span>
              </div>
            )}
          </div>

          {/* Deskripsi */}
          {description && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaGraduationCap className="text-[var(--color-neon-blue)]" />
                {language === "id" ? "Tentang" : "About"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {description}
              </p>
            </div>
          )}

          {/* Pencapaian */}
          {(education as any).achievements && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaTrophy className="text-amber-500" />
                {language === "id" ? "Pencapaian" : "Achievements"}
              </h3>
              <ul className="space-y-2">
                {String((education as any).achievements)
                  .split("\n")
                  .filter(Boolean)
                  .map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span className="text-[var(--color-neon-green)] mt-0.5 flex-shrink-0">✦</span>
                      {item.trim()}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Galeri project / dokumentasi */}
          {(education as any).gallery && Array.isArray((education as any).gallery) && (education as any).gallery.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 hover:text-[var(--color-neon-blue)] transition-colors"
              >
                {language === "id" ? "Dokumentasi & Project" : "Documentation & Projects"}
                {showAll ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              {showAll && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(education as any).gallery.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group"
                    >
                      <Image
                        src={img}
                        alt={`Dokumentasi ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Link sertifikat */}
          {(education as any).certificate_url && (
            <a
              href={(education as any).certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-neon-blue)] hover:text-[var(--color-neon-green)] transition-colors"
            >
              <FaExternalLinkAlt size={12} />
              {language === "id" ? "Lihat Sertifikat" : "View Certificate"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
