'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Certificate } from '@/types';
import { 
  FaExternalLinkAlt, 
  FaTimes, 
  FaAward, 
  FaCheckCircle,
  FaCalendarAlt,
  FaTag
} from 'react-icons/fa';
import { getCertificateCategory } from '@/lib/certificates-data';

interface CertificateCardProps {
  certificate: Certificate & {
    description_id?: string;
    description_en?: string;
  };
  language?: 'id' | 'en';
  category?: string;
}

export default function CertificateCard({
  certificate,
  language = 'id',
}: CertificateCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = language === 'id';

  const title = id ? certificate.title_id : (certificate.title_en || certificate.title_id);
  const issuer = certificate.issuer || 'Sertifikasi';
  const dateIssued = certificate.date_issued || '2024 - 2025';
  const fileUrl = certificate.file_url || certificate.image_url;
  const resolvedCategory = getCertificateCategory(certificate);
  const tags = certificate.tags || [];

  // Description fallback
  const description = id 
    ? (certificate.description_id || `Sertifikat pembelajaran dan kompetensi resmi dari ${issuer}.`)
    : (certificate.description_en || `Official learning and competency certification from ${issuer}.`);

  // Preferred preview image
  const previewImage = certificate.image_url || (
    certificate.file_url && certificate.file_url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)
      ? certificate.file_url
      : null
  );

  const isPdf = Boolean(fileUrl && fileUrl.toLowerCase().includes('.pdf'));

  // Keyboard accessibility for modal (ESC to close)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const isReligious = resolvedCategory === 'Keagamaan';

  return (
    <>
      <div 
        className="group flex flex-col bg-[#12141D] dark:bg-[#0D0F17] border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* Certificate Preview Image Container */}
        <div 
          onClick={() => {
            if (fileUrl && isPdf && typeof window !== 'undefined' && window.innerWidth < 640) {
              window.open(fileUrl, '_blank');
            } else {
              setIsOpen(true);
            }
          }}
          className="relative aspect-[16/10] w-full bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden mb-4 cursor-pointer group/img select-none"
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt={title}
              fill
              className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : isPdf && fileUrl ? (
            <div className="relative w-full h-full bg-zinc-950 overflow-hidden">
              <iframe
                src={`${fileUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                title={title}
                className="w-full h-full pointer-events-none border-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
            </div>
          ) : (
            <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
              <FaAward className="text-3xl text-cyan-400 mb-2" />
              <span className="text-xs font-bold text-zinc-300 line-clamp-1">{title}</span>
              <span className="text-[10px] text-zinc-500 mt-1">{issuer}</span>
            </div>
          )}

          {/* Top-Right Category Pill */}
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md shadow-md ${
              isReligious 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
            }`}>
              {resolvedCategory}
            </span>
          </div>

          {/* Issuer pill badge on bottom left of image */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-md bg-[#1F2430]/90 text-white font-extrabold text-[11px] uppercase tracking-wider border border-white/10 shadow-md">
              {issuer}
            </span>
          </div>

          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md text-cyan-400 text-xs font-semibold border border-cyan-500/40 shadow-xl flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
              <FaExternalLinkAlt size={11} />
              <span>{isPdf ? (id ? 'Buka Dokumen PDF' : 'Open PDF Document') : (id ? 'Klik untuk Pratinjau' : 'Click to Preview')}</span>
            </span>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="flex flex-col flex-1">
          {/* Metadata Row: Date & Tags */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2 gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <FaCalendarAlt className="text-[10px] text-zinc-400" />
              <span>{dateIssued}</span>
            </span>
            {tags.length > 0 && (
              <div className="flex items-center gap-1 overflow-hidden">
                {tags.slice(0, 2).map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 truncate"
                  >
                    <FaTag className="text-[8px] text-zinc-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <h3 
            className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-cyan-400 transition-colors leading-snug mb-1.5 line-clamp-1"
            title={title}
          >
            {title}
          </h3>
          
          <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex-1 py-2.5 px-4 bg-zinc-800/90 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-zinc-700/80 transition-all flex items-center justify-center gap-2 group-hover:border-cyan-500/40 group-hover:bg-zinc-800 active:scale-[0.98]"
            >
              <span>{id ? 'Lihat Sertifikat' : 'View Certificate'}</span>
            </button>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={id ? 'Buka Dokumen di Tab Baru' : 'Open Document in New Tab'}
                className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors flex items-center justify-center shrink-0 active:scale-[0.95]"
              >
                <FaExternalLinkAlt size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal Lightbox for Certificate Details */}
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-[#11131B] border border-zinc-800 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    isReligious 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {resolvedCategory}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {issuer}
                  </span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">{dateIssued}</span>
                </div>
                <h3 className="text-sm sm:text-lg font-bold font-heading text-white truncate">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 sm:p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                aria-label="Tutup"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body — Maximized preview area */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
              <div className="flex-1 min-h-0 p-3 sm:p-5">
                {previewImage ? (
                  <div className="relative w-full h-[62vh] sm:h-[72vh] rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-black flex items-center justify-center">
                    <Image
                      src={previewImage}
                      alt={title}
                      fill
                      className="object-contain p-2 sm:p-4"
                      priority
                      sizes="(max-width: 1024px) 95vw, 1000px"
                    />
                  </div>
                ) : isPdf && fileUrl ? (
                  <div className="w-full h-[62vh] sm:h-[72vh] rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950">
                    <iframe
                      src={`${fileUrl}#page=1&view=Fit&toolbar=0&navpanes=0`}
                      title={title}
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[50vh] bg-zinc-900 rounded-xl p-8 border border-zinc-800 flex flex-col items-center justify-center text-center">
                    <FaAward className="text-5xl text-cyan-400 mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                    <p className="text-sm text-zinc-400 max-w-md">{description}</p>
                  </div>
                )}
              </div>

              {/* Compact footer info + actions */}
              <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-3 shrink-0">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 text-sm flex-shrink-0" />
                    <span>{id ? 'Penerbit' : 'Issuer'}: <strong className="text-white">{issuer}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{id ? 'Kategori' : 'Category'}: <strong className="text-white">{resolvedCategory}</strong></span>
                    <span>•</span>
                    <span>{id ? 'Tanggal' : 'Date'}: <strong className="text-white">{dateIssued}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full justify-end">
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      <FaExternalLinkAlt size={12} />
                      <span>{id ? 'Buka Dokumen Asli (PDF/File)' : 'Open Original Document'}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm transition-colors active:scale-95"
                  >
                    {id ? 'Tutup' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
