'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Certificate } from '@/types';
import { 
  FaExternalLinkAlt, 
  FaFilePdf, 
  FaTimes, 
  FaAward, 
  FaQrcode, 
  FaCheckCircle 
} from 'react-icons/fa';

interface CertificateCardProps {
  certificate: Certificate;
  language?: 'id' | 'en';
  category?: string;
}

export default function CertificateCard({
  certificate,
  language = 'id',
  category = 'Informatika & Pemrograman'
}: CertificateCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = language === 'id';

  const title = id ? certificate.title_id : (certificate.title_en || certificate.title_id);
  const issuer = certificate.issuer || 'Sertifikasi';
  const dateIssued = certificate.date_issued || '2024 - 2025';
  const fileUrl = certificate.file_url || certificate.image_url;

  const isImage = (url?: string) => {
    if (!url) return false;
    return Boolean(url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i));
  };

  const hasDirectImage = certificate.image_url && isImage(certificate.image_url);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group flex flex-col bg-card border border-border/80 hover:border-primary/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      >
        {/* Visual Certificate Preview Container */}
        <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-zinc-900 border-b border-border/60 overflow-hidden flex items-center justify-center p-2.5">
          {hasDirectImage ? (
            <Image
              src={certificate.image_url!}
              alt={title}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            /* High-fidelity Realistic Certificate Paper Simulation (Matches Screenshot Example) */
            <div className="relative w-full h-full bg-white text-zinc-900 rounded-lg shadow-sm border border-zinc-200 p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-primary/40 pointer-events-none" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-primary/40 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-primary/40 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-primary/40 pointer-events-none" />

              {/* Certificate Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                    <FaAward />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">
                    {issuer}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-400">
                  VERIFIED • {dateIssued}
                </span>
              </div>

              {/* Certificate Body */}
              <div className="text-center my-auto py-1">
                <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-semibold mb-0.5">
                  SERTIFIKAT KOMPETENSI
                </p>
                <h4 className="text-xs sm:text-sm font-black font-heading text-zinc-900 line-clamp-1 leading-snug">
                  {title}
                </h4>
                <p className="text-[9px] text-zinc-500 font-medium mt-0.5">
                  Diberikan kepada: <span className="font-bold text-zinc-800">Muhammad Daffa Rezky</span>
                </p>
              </div>

              {/* Certificate Footer with Simulated QR & Signature */}
              <div className="flex items-end justify-between pt-1 border-t border-zinc-100 text-[8px] text-zinc-400">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-zinc-100 border border-zinc-300 rounded flex items-center justify-center text-zinc-600">
                    <FaQrcode size={12} />
                  </div>
                  <span className="text-[8px] font-mono">ID: {certificate.id?.slice(0, 8) || 'CERT'}</span>
                </div>
                <div className="text-right">
                  <div className="w-12 border-b border-zinc-300 mb-0.5" />
                  <span className="text-[8px] uppercase font-semibold text-zinc-500">Official Sign</span>
                </div>
              </div>
            </div>
          )}

          {/* Issuer Badge (Top Right Pill - exactly like the user reference screenshot) */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 rounded-full bg-black/75 dark:bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
              {issuer}
            </span>
          </div>

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-background/90 text-foreground text-xs font-semibold shadow-md border border-border">
              {id ? 'Klik untuk Lihat' : 'Click to View'}
            </span>
          </div>
        </div>

        {/* Certificate Info (Below the Image) */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium mb-4">
            {category}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <FaCheckCircle className="text-emerald-500 text-[10px]" /> {issuer}
            </span>
            <span className="font-medium text-foreground">
              {dateIssued}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Lightbox for Certificate Details */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-card border border-border w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                  {issuer} • {dateIssued}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-heading text-foreground">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex flex-col items-center justify-center">
              {hasDirectImage ? (
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image
                    src={certificate.image_url!}
                    alt={title}
                    fill
                    className="object-contain bg-muted"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] bg-white text-zinc-900 rounded-2xl p-8 border border-zinc-300 shadow-xl flex flex-col justify-between relative">
                  <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3">
                    <div className="flex items-center gap-2">
                      <FaAward className="text-2xl text-primary" />
                      <span className="font-black text-lg uppercase tracking-wider text-zinc-800">{issuer}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-zinc-500">TERVERIFIKASI RESMI</span>
                  </div>

                  <div className="text-center py-6">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">SERTIFIKAT KELULUSAN & KOMPETENSI</p>
                    <h2 className="text-xl md:text-2xl font-black font-heading text-zinc-950 mb-2">{title}</h2>
                    <p className="text-sm text-zinc-600">Diberikan kepada:</p>
                    <p className="text-lg font-bold text-zinc-900 mt-1">Muhammad Daffa Rezky Adyra</p>
                  </div>

                  <div className="flex items-end justify-between border-t-2 border-zinc-100 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-100 border border-zinc-300 rounded-lg flex items-center justify-center">
                        <FaQrcode size={24} className="text-zinc-700" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-bold text-zinc-600">NO: CERT-{certificate.id?.slice(0, 8) || '2025'}</p>
                        <p className="text-[10px] text-zinc-500">Diterbitkan: {dateIssued}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 border-b border-zinc-400 mb-1" />
                      <span className="text-xs font-bold text-zinc-600">Verifikator Resmi</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-6 w-full justify-center">
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow hover:opacity-90 transition-all"
                  >
                    <FaFilePdf /> {id ? 'Buka Dokumen PDF Asli' : 'Open Original PDF'}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
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
