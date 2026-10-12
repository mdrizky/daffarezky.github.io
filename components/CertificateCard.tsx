'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Certificate } from '@/types';
import { 
  FaExternalLinkAlt, 
  FaFilePdf, 
  FaTimes, 
  FaAward, 
  FaCheckCircle,
  FaDownload
} from 'react-icons/fa';

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

  return (
    <>
      <div 
        className="group flex flex-col bg-[#12141D] dark:bg-[#0D0F17] border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* Certificate Preview Image Container (Similar to friend's portfolio) */}
        <div 
          onClick={() => setIsOpen(true)}
          className="relative aspect-[16/10] w-full bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden mb-4 cursor-pointer group/img"
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt={title}
              fill
              className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
              <FaAward className="text-3xl text-cyan-400 mb-2" />
              <span className="text-xs font-bold text-zinc-300 line-clamp-1">{title}</span>
              <span className="text-[10px] text-zinc-500 mt-1">{issuer}</span>
            </div>
          )}

          {/* Issuer pill badge on bottom left of image, exactly like friend's site */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 rounded-md bg-[#1F2430]/90 text-white font-extrabold text-[11px] uppercase tracking-wider border border-white/10 shadow-md">
              {issuer}
            </span>
          </div>

          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-cyan-400 text-xs font-semibold border border-cyan-500/30 shadow-lg">
              {id ? 'Klik untuk Pratinjau' : 'Click to Preview'}
            </span>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="flex flex-col flex-1">
          <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-cyan-400 transition-colors leading-snug mb-1 line-clamp-1">
            {title}
          </h3>
          
          <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full py-2.5 px-4 bg-zinc-800/90 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-zinc-700/80 transition-all flex items-center justify-center gap-2 group-hover:border-cyan-500/40 group-hover:bg-zinc-800"
            >
              <span>{id ? 'Lihat Sertifikat' : 'View Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Lightbox for Certificate Details */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-[#11131B] border border-zinc-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                    {issuer}
                  </span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">{dateIssued}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
              {previewImage ? (
                <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] max-h-[55vh] rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-black">
                  <Image
                    src={previewImage}
                    alt={title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] bg-zinc-900 rounded-xl p-8 border border-zinc-800 flex flex-col items-center justify-center text-center">
                  <FaAward className="text-5xl text-cyan-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                  <p className="text-sm text-zinc-400 max-w-md">{description}</p>
                </div>
              )}

              {/* Information Row */}
              <div className="w-full mt-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400 text-sm flex-shrink-0" />
                  <span>{id ? 'Terverifikasi Resmi' : 'Officially Verified'}: <strong className="text-white">{issuer}</strong></span>
                </div>
                <div>
                  <span>{id ? 'Waktu Penerbitan' : 'Date of Issuance'}: <strong className="text-white">{dateIssued}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-5 w-full justify-end">
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <FaExternalLinkAlt size={12} />
                    <span>{id ? 'Buka Dokumen Asli (PDF/File)' : 'Open Original Document'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  {id ? 'Tutup' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
