'use client';

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
}

const FALLBACK_PARTNERS: Partner[] = [];

export default function PartnerSlider({
  language = 'id',
  initialData,
  partners: propsPartners
}: {
  language?: 'id' | 'en',
  initialData?: Partner[],
  partners?: Partner[]
}) {
  const partners = propsPartners || (initialData && initialData.length > 0 ? initialData : FALLBACK_PARTNERS);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  if (!partners.length) return null;

  return (
    <div className="py-16">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          {language === 'id' ? 'Partner & ' : 'Partners & '}<span className="text-gradient">{language === 'id' ? 'Kolaborator' : 'Collaborators'}</span>
        </h3>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 touch-pan-y">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex-none w-[200px] sm:w-[240px]"
            >
              <a
                href={partner.website_url || '#'}
                target={partner.website_url ? '_blank' : undefined}
                rel={partner.website_url ? 'noopener noreferrer' : undefined}
                className="block bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-[var(--color-neon-green)]/50 transition-all duration-300 group"
              >
                <div className="w-full h-20 flex items-center justify-center mb-4 overflow-hidden">
                  <Image
                    src={partner.logo_url || "/logo.png"}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="object-contain max-h-20 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <p className="text-center text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {partner.name}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}