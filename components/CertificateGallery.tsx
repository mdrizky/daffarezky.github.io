'use client';

import { useState, useMemo } from 'react';
import type { Certificate } from '@/types';
import CertificateCard from './CertificateCard';
import { defaultCertificatesList, getCertificateCategory } from '@/lib/certificates-data';
import { FaCertificate, FaLayerGroup, FaMosque, FaLaptopCode } from 'react-icons/fa';

interface CertificateGalleryProps {
  certificates?: Certificate[];
  language?: 'id' | 'en';
  showHeader?: boolean;
}

type FilterCategory = 'all' | 'keagamaan' | 'umum';

export default function CertificateGallery({
  certificates = [],
  language = 'id',
  showHeader = true,
}: CertificateGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const id = language === 'id';

  // Base list of certificates (DB published items or default list)
  const allCertificates = useMemo(() => {
    const list = (certificates && certificates.length > 0) ? certificates : defaultCertificatesList;
    return list.filter(item => item.is_published !== false);
  }, [certificates]);

  // Compute category counts
  const counts = useMemo(() => {
    let keagamaan = 0;
    let umum = 0;

    allCertificates.forEach(cert => {
      const cat = getCertificateCategory(cert);
      if (cat === 'Keagamaan') {
        keagamaan += 1;
      } else {
        umum += 1;
      }
    });

    return {
      all: allCertificates.length,
      keagamaan,
      umum,
    };
  }, [allCertificates]);

  // Filtered certificates based on selection
  const filteredCertificates = useMemo(() => {
    if (activeFilter === 'keagamaan') {
      return allCertificates.filter(cert => getCertificateCategory(cert) === 'Keagamaan');
    }
    if (activeFilter === 'umum') {
      return allCertificates.filter(cert => getCertificateCategory(cert) === 'Umum & Teknologi');
    }
    return allCertificates;
  }, [allCertificates, activeFilter]);

  return (
    <div className="w-full">
      {/* 1. Header Halaman */}
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
              CREDENTIALS & ACHIEVEMENTS
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight">
              {id ? 'Sertifikat & Pencapaian' : 'Certificates & Achievements'}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
            {id
              ? 'Dokumentasi perjalanan belajar, kompetensi, dan pencapaian di bidang agama maupun teknologi.'
              : 'A collection of learning milestones, professional skills, and achievements across Islamic studies and technology.'}
          </p>
        </div>
      )}

      {/* 2. Interactive Filter Pills (Matching Exact Design Spec) */}
      <div className="flex justify-start mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div 
          role="tablist"
          aria-label={id ? "Filter Kategori Sertifikat" : "Certificate Category Filter"}
          className="bg-zinc-950/90 dark:bg-black/70 p-1.5 rounded-full border border-zinc-800/90 inline-flex items-center gap-1.5 sm:gap-2 shadow-inner backdrop-blur-md"
        >
          {/* Tab: Semua */}
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm transition-all duration-200 select-none ${
              activeFilter === 'all'
                ? 'bg-cyan-400 text-black font-extrabold shadow-md shadow-cyan-400/25 scale-[1.02]'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium'
            }`}
          >
            <FaLayerGroup className={`text-xs ${activeFilter === 'all' ? 'text-black' : 'text-cyan-400'}`} />
            <span>{id ? 'Semua' : 'All'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
              activeFilter === 'all' ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {counts.all}
            </span>
          </button>

          {/* Tab: Keagamaan */}
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'keagamaan'}
            onClick={() => setActiveFilter('keagamaan')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm transition-all duration-200 select-none ${
              activeFilter === 'keagamaan'
                ? 'bg-cyan-400 text-black font-extrabold shadow-md shadow-cyan-400/25 scale-[1.02]'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium'
            }`}
          >
            <FaMosque className={`text-xs ${activeFilter === 'keagamaan' ? 'text-black' : 'text-emerald-400'}`} />
            <span>{id ? 'Keagamaan' : 'Islamic Studies'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
              activeFilter === 'keagamaan' ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {counts.keagamaan}
            </span>
          </button>

          {/* Tab: Umum & Teknologi */}
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'umum'}
            onClick={() => setActiveFilter('umum')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm transition-all duration-200 select-none ${
              activeFilter === 'umum'
                ? 'bg-cyan-400 text-black font-extrabold shadow-md shadow-cyan-400/25 scale-[1.02]'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium'
            }`}
          >
            <FaLaptopCode className={`text-xs ${activeFilter === 'umum' ? 'text-black' : 'text-cyan-400'}`} />
            <span>{id ? 'Umum & Teknologi' : 'General & Tech'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
              activeFilter === 'umum' ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {counts.umum}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Certificate Grid or Empty State */}
      {filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 animate-fade-in">
          {filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              language={language}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl animate-fade-in">
          <FaCertificate className="mx-auto text-4xl text-zinc-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">
            {id ? 'Belum ada sertifikat di kategori ini' : 'No certificates found in this category'}
          </h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            {id 
              ? 'Sertifikat baru pada kategori ini akan segera diperbarui melalui sistem kredensial.'
              : 'New certificates under this category will be updated soon through the credentials system.'}
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-cyan-400 border border-zinc-700 transition-colors"
          >
            {id ? 'Lihat Semua Kategori' : 'View All Categories'}
          </button>
        </div>
      )}
    </div>
  );
}
