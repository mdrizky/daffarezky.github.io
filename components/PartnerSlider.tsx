'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

const partners = [
  { name: "ArchipelagoStrite", description: "Business Partner", logo: "https://via.placeholder.com/150?text=Archipelago" },
  { name: "RM Puncak Rayo", description: "Food & Beverage", logo: "https://via.placeholder.com/150?text=Puncak+Rayo" },
  { name: "Komunitas IT", description: "Tech Community", logo: "https://via.placeholder.com/150?text=IT+Community" },
  { name: "Sekolah", description: "Education Institution", logo: "https://via.placeholder.com/150?text=School" },
  { name: "Organisasi", description: "Organization Hub", logo: "https://via.placeholder.com/150?text=Org" },
  { name: "Microsoft", description: "Development Ecosystem", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "AWS", description: "Cloud Infrastructure", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Vercel", description: "Deployment Platform", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "Cisco", description: "Networking & Security", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { name: "Dicoding", description: "Learning Platform", logo: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png" },
];

export default function PartnerSlider({ language }: { language: 'id' | 'en' }) {
  return (
    <div className="py-16">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          {language === 'id' ? 'Partner & ' : 'Partners & '}<span className="text-gradient">{language === 'id' ? 'Kolaborator' : 'Collaborators'}</span>
        </h3>
      </div>
      
      <div className="partner-slider-container w-full overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          spaceBetween={30}
          slidesPerView={1.5}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            640: { slidesPerView: 2.5 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="partnerSwiper flex items-center !py-8"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="partner-card flex items-center gap-5 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-8 py-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[var(--color-neon-green)]/50 group">
                <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-xl p-3 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                  <Image 
                    src={partner.logo} 
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
                    {partner.description}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .partnerSwiper .swiper-wrapper {
          -webkit-transition-timing-function: linear !important;
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
}
