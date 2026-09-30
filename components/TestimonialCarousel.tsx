"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import type { Testimonial } from "@/types";

// Fallback data jika Supabase kosong
const FALLBACK: Testimonial[] = [];

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

function getInitials(name?: string) {
  if (!name) return "DR";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

interface TestimonialCarouselProps {
  initialData?: Testimonial[];
  testimonials?: Testimonial[];
}

export default function TestimonialCarousel({ initialData, testimonials: propsTestimonials }: TestimonialCarouselProps) {
  const { language } = useLanguage();
  const rawList = propsTestimonials || initialData;
  const [testimonials] = useState<Testimonial[]>(rawList && rawList.length > 0 ? rawList : FALLBACK);
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

  if (!testimonials.length) return null;

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
                <div className="h-full bg-card text-card-foreground border border-border rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
                  {/* Quote icon */}
                  <FaQuoteLeft className="text-primary/30 text-3xl" />

                  {/* Stars */}
                  <StarRating count={5} />

                  {/* Content */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow italic">
                    &quot;{content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {t.avatar_url ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border">
                        <Image
                          src={t.avatar_url}
                          alt={t.name || "Testimonial Avatar"}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {getInitials(t.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.name || "Anonymous"}</p>
                      {t.role && (
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all shadow-md z-10"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all shadow-md z-10"
            aria-label="Next testimonial"
          >
            <FaChevronRight size={14} />
          </button>
        </>
      )}

      {/* Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === selectedIndex
                  ? "bg-[var(--color-neon-blue)] w-6"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}