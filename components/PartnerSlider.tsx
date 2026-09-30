'use client';

import React from 'react';
import Image from 'next/image';
import { 
  SiGoogle, 
  SiGithub, 
  SiNextdotjs, 
  SiSupabase, 
  SiTailwindcss, 
  SiVercel, 
  SiLaravel, 
  SiFlutter 
} from 'react-icons/si';

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
}

// Curated default partner & technology logos
const DEFAULT_LOGOS = [
  {
    id: 'partner-dicoding',
    name: 'Dicoding Indonesia',
    website_url: 'https://www.dicoding.com',
    logo_url: undefined as string | undefined,
    logo_icon: (
      <span className="font-extrabold text-base tracking-tight text-[#2d3e50] dark:text-white flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-full bg-[#2d3e50] dark:bg-white inline-block"></span>
        dicoding
      </span>
    ),
  },
  {
    id: 'partner-google',
    name: 'Google Developers',
    website_url: 'https://developers.google.com',
    logo_url: undefined as string | undefined,
    logo_icon: <SiGoogle className="text-2xl text-[#4285F4]" />,
  },
  {
    id: 'partner-tasheel',
    name: 'Tasheel Global',
    website_url: 'https://tasheel.id',
    logo_url: undefined as string | undefined,
    logo_icon: (
      <span className="font-bold text-sm tracking-widest uppercase text-primary flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block"></span>
        TASHEEL
      </span>
    ),
  },
  {
    id: 'partner-github',
    name: 'GitHub',
    website_url: 'https://github.com',
    logo_url: undefined as string | undefined,
    logo_icon: <SiGithub className="text-2xl text-foreground" />,
  },
  {
    id: 'partner-nextjs',
    name: 'Next.js Vercel',
    website_url: 'https://nextjs.org',
    logo_url: undefined as string | undefined,
    logo_icon: <SiNextdotjs className="text-2xl text-foreground" />,
  },
  {
    id: 'partner-supabase',
    name: 'Supabase',
    website_url: 'https://supabase.com',
    logo_url: undefined as string | undefined,
    logo_icon: <SiSupabase className="text-2xl text-[#3ECF8E]" />,
  },
  {
    id: 'partner-tailwind',
    name: 'Tailwind CSS',
    website_url: 'https://tailwindcss.com',
    logo_url: undefined as string | undefined,
    logo_icon: <SiTailwindcss className="text-2xl text-[#38BDF8]" />,
  },
  {
    id: 'partner-vercel',
    name: 'Vercel',
    website_url: 'https://vercel.com',
    logo_url: undefined as string | undefined,
    logo_icon: <SiVercel className="text-2xl text-foreground" />,
  },
  {
    id: 'partner-laravel',
    name: 'Laravel',
    website_url: 'https://laravel.com',
    logo_url: undefined as string | undefined,
    logo_icon: <SiLaravel className="text-2xl text-[#FF2D20]" />,
  },
  {
    id: 'partner-flutter',
    name: 'Flutter',
    website_url: 'https://flutter.dev',
    logo_url: undefined as string | undefined,
    logo_icon: <SiFlutter className="text-2xl text-[#02569B]" />,
  },
];

export default function PartnerSlider({
  initialData,
  partners: propsPartners
}: {
  language?: 'id' | 'en';
  initialData?: Partner[];
  partners?: Partner[];
}) {
  const customPartners = (propsPartners && propsPartners.length > 0) 
    ? propsPartners 
    : (initialData && initialData.length > 0 ? initialData : []);

  // Merge custom partners from DB with default curated logos
  const activeList = [
    ...customPartners.map((p) => ({
      id: p.id,
      name: p.name,
      website_url: p.website_url || '#',
      logo_url: p.logo_url,
      logo_icon: null as React.ReactNode,
    })),
    ...DEFAULT_LOGOS,
  ];

  // Duplicate list to achieve continuous infinite marquee loop
  const marqueeList = [...activeList, ...activeList];

  return (
    <div className="w-full relative overflow-hidden py-4 select-none">
      <style jsx>{`
        @keyframes continuousScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-continuous-scroll {
          display: flex;
          width: max-content;
          animation: continuousScroll 32s linear infinite;
        }
        .animate-continuous-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Subtle edge fades for modern aesthetic */}
      <div className="absolute left-0 inset-y-0 w-16 md:w-28 bg-gradient-to-r from-card via-card/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 md:w-28 bg-gradient-to-l from-card via-card/80 to-transparent z-10 pointer-events-none" />

      {/* Auto-sliding Marquee Track (Otis Geser Sendiri & Hanya Menampilkan Logo) */}
      <div className="animate-continuous-scroll flex items-center gap-6 md:gap-8 py-2">
        {marqueeList.map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.website_url || '#'}
            target={item.website_url && item.website_url !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            title={item.name}
            className="flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-2xl bg-card/80 dark:bg-card/40 border border-border hover:border-primary/50 shadow-xs hover:shadow-md hover:scale-105 transition-all duration-300 group"
          >
            {item.logo_url ? (
              <div className="relative h-8 w-24 sm:w-28 flex items-center justify-center">
                <Image
                  src={item.logo_url}
                  alt={item.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  sizes="120px"
                />
              </div>
            ) : item.logo_icon ? (
              <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                {item.logo_icon}
              </div>
            ) : (
              <span className="text-sm font-bold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                {item.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}