'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

const partners = [
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Dicoding", logo: "https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
];

export default function PartnerSlider({ language }: { language: 'id' | 'en' }) {
  return (
    <div className="py-16">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          {language === 'id' ? 'Kolaborasi & ' : 'Trusted '}<span className="text-gradient">{language === 'id' ? 'Partner' : 'Partners'}</span>
        </h3>
      </div>
      
      <div className="partner-slider-container w-full overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          spaceBetween={20}
          slidesPerView={2}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="partnerSwiper flex items-center !py-4"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="partner-card flex items-center justify-center gap-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-4 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-white/20">
                <div className="relative w-10 h-10 flex-shrink-0 bg-white rounded-full p-2 flex items-center justify-center">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base whitespace-nowrap">
                  {partner.name}
                </span>
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
