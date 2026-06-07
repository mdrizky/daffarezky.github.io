'use client';

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import { useCallback, useEffect, useState } from "react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
}

const FALLBACK_PARTNERS = [
  { name: "ArchipelagoStrite", description: "Business Partner", logo_url: "https://via.placeholder.com/150?text=Archipelago" },
  { name: "RM Puncak Rayo", description: "Food & Beverage", logo_url: "https://via.placeholder.com/150?text=Puncak+Rayo" },
  { name: "Komunitas IT", description: "Tech Community", logo_url: "https://via.placeholder.com/150?text=IT+Community" },
  { name: "Sekolah", description: "Education Institution", logo_url: "https://via.placeholder.com/150?text=School" },
  { name: "Organisasi", description: "Organization Hub", logo_url: "https://via.placeholder.com/150?text=Org" },
  { name: "Microsoft", description: "Development Ecosystem", logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "AWS", description: "Cloud Infrastructure", logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Vercel", description: "Deployment Platform", logo_url: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "Cisco", description: "Networking & Security", logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { name: "Dicoding", description: "Learning Platform", logo_url: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png" },
];

export default function PartnerSlider({ language, initialData }: { language: 'id' | 'en', initialData?: any[] }) {
  const partners = initialData && initialData.length > 0 ? initialData : FALLBACK_PARTNERS;
  
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <div className="py-16">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          {language === 'id' ? 'Partner & ' : 'Partners & '}<span className="text-gradient">{language === 'id' ? 'Kolaborator' : 'Collaborators'}</span>
        </h3>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 touch-pan-y">
          {partners.map((partner, index) => (
            <div key={index} className="flex-none w-[70%] sm:w-[45%] md:w-[30%] lg:w-[22%] min-w-0">
              <div className="flex items-center gap-5 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-8 py-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[var(--color-neon-green)]/50 group">
                <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-xl p-3 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                  <Image 
                    src={partner.logo_url || partner.logo} 
                    alt={partner.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-white text-base md:text-lg whitespace-nowrap">
                    {partner.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {partner.description || (language === 'id' ? 'Partner Bisnis' : 'Business Partner')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
