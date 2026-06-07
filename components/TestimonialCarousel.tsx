"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import type { Testimonial } from "@/types";

// Fallback data jika Supabase kosong
const FALLBACK: Testimonial[] = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    role: "Business Owner",
    content_id: "Kerja sama dengan Daffa sangat memuaskan. Website jadi lebih cepat dan desainnya premium banget. Highly recommended!",
    content_en: "Working with Daffa was very satisfying. The website became faster and the design is premium. Highly recommended!",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Siti Rahayu",
    role: "Startup Founder",
    content_id: "Strategi digital yang diberikan sangat on-point. Konversi naik 40% dalam sebulan. Sangat merekomendasikan jasa Daffa.",
    content_en: "The digital strategy provided was spot on. Conversions increased 40% in a month. Highly recommend Daffa&apos;s services.",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Budi Santoso",
    role: "Content Creator",
    content_id: "Dashboard analytics yang dibuat sangat membantu saya memantau KPI. Tampilan modern dan mudah digunakan. Thanks Daffa!",
    content_en: "The analytics dashboard created really helps me monitor KPIs. Modern look and easy to use. Thanks Daffa!",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Dewi Lestari",
    role: "E-Commerce Owner",
    content_id: "Website toko online saya jadi jauh lebih profesional. Penjualan meningkat signifikan setelah redesign. Terima kasih Daffa!",
    content_en: "My online store website became much more professional. Sales increased significantly after the redesign. Thank you Daffa!",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < count ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}
          size={14}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

interface TestimonialCarouselProps {
  initialData?: Testimonial[];
}

export default function TestimonialCarousel({ initialData }: TestimonialCarouselProps) {
  const { language } = useLanguage();
  const [testimonials] = useState<Testimonial[]>(initialData && initialData.length > 0 ? initialData : FALLBACK);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const raf = requestAnimationFrame(() => onSelect());
    emblaApi.on("select", onSelect);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 touch-pan-y">
          {testimonials.map((t) => {
            const content = language === "id" ? t.content_id : t.content_en;
            return (
              <div
                key={t.id}
                className="flex-none w-[85%] sm:w-[48%] lg:w-[31%] min-w-0"
              >
                <div className="h-full bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden group hover:border-[var(--color-neon-blue)]/40 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,153,255,0.1)]">
                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Quote icon */}
                  <FaQuoteLeft className="text-[var(--color-neon-blue)] opacity-30 text-3xl" />

                  {/* Stars */}
                  <StarRating count={5} />

                  {/* Content */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow italic">
                    "{content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                    {t.avatar_url ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--color-neon-green)]/30">
                        <Image
                          src={t.avatar_url}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-[#00FF88] to-[#0099FF] flex items-center justify-center text-[#0A0A0F] font-bold text-sm">
                        {getInitials(t.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-[var(--color-neon-green)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8">
        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === selectedIndex
                  ? "w-6 h-2 bg-gradient-to-r from-[#00FF88] to-[#0099FF]"
                  : "w-2 h-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-3">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/20 hover:text-[var(--color-neon-blue)] transition-all"
            aria-label="Previous"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={scrollNext}
            className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/20 hover:text-[var(--color-neon-blue)] transition-all"
            aria-label="Next"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
