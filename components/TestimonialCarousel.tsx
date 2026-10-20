"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaStar, FaQuoteLeft, FaTimes, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Testimonial } from "@/types";

interface TestimonialCarouselProps {
  initialData?: Testimonial[];
  testimonials?: Testimonial[];
}

function StarRating({ count = 5 }: { count?: number }) {
  const safeCount = Math.max(1, Math.min(5, count || 5));
  return (
    <div className="flex gap-1" aria-label={`Rating: ${safeCount} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < safeCount ? "text-amber-400" : "text-zinc-700"}
          size={13}
        />
      ))}
    </div>
  );
}

function getInitials(name?: string) {
  if (!name) return "DR";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const INITIAL_VISIBLE = 3;

export default function TestimonialCarousel({
  initialData,
  testimonials: propsTestimonials,
}: TestimonialCarouselProps) {
  const { language } = useLanguage();
  const id = language === "id";

  const rawList = propsTestimonials || initialData || [];
  const testimonials = rawList.filter((t) => t.is_published !== false);

  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Keyboard accessibility for modal (ESC to close)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedTestimonial(null);
    }
  }, []);

  useEffect(() => {
    if (selectedTestimonial) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTestimonial, handleKeyDown]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const visibleList = testimonials.slice(0, visibleCount);
  const hasMore = testimonials.length > visibleCount;
  const isExpanded = visibleCount > INITIAL_VISIBLE && testimonials.length > INITIAL_VISIBLE;

  return (
    <div className="w-full">
      {/* Compact Testimonial Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleList.map((t) => {
          const content = id
            ? t.content_id || t.content_en || ""
            : t.content_en || t.content_id || "";
          const clientName = t.name || (id ? "Klien Terverifikasi" : "Verified Client");
          const projectOrRole = t.role || (id ? "Proyek Digital" : "Digital Project");
          const rating = typeof t.rating === "number" ? t.rating : 5;

          return (
            <div
              key={t.id}
              className="group relative bg-[#12141D] dark:bg-[#0D0F17] border border-zinc-800/80 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Client Name, Role/Project, Quote Icon */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {t.avatar_url ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-zinc-700/80 bg-zinc-900">
                        <Image
                          src={t.avatar_url}
                          alt={clientName}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-transparent text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner">
                        {getInitials(clientName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold font-heading text-white truncate group-hover:text-cyan-400 transition-colors">
                        {clientName}
                      </h4>
                      <p className="text-xs text-cyan-400/90 truncate font-medium">
                        {projectOrRole}
                      </p>
                    </div>
                  </div>
                  <FaQuoteLeft className="text-zinc-700/70 group-hover:text-cyan-500/40 text-lg shrink-0 transition-colors" />
                </div>

                {/* Rating Stars */}
                <div className="mb-3">
                  <StarRating count={rating} />
                </div>

                {/* Comment snippet clamped to 3-4 lines */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-3 italic mb-4 font-normal">
                  &quot;{content}&quot;
                </p>
              </div>

              {/* Action row: Baca selengkapnya button */}
              <div className="pt-3 border-t border-zinc-800/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedTestimonial(t)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 group/btn focus:outline-none"
                  aria-label={`${id ? "Baca selengkapnya review dari" : "Read full review from"} ${clientName}`}
                >
                  <span>{id ? "Baca selengkapnya" : "Read full review"}</span>
                  <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <FaCheckCircle className="text-emerald-400/80 text-[10px]" />
                  <span>{id ? "Terverifikasi" : "Verified"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progressive loading: Lihat Semua Ulasan / Muat Lebih Banyak */}
      {testimonials.length > INITIAL_VISIBLE && (
        <div className="mt-8 flex justify-center gap-3">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(testimonials.length, prev + 3))}
              className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-cyan-500/40 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
            >
              <span>
                {id
                  ? `Lihat Semua Ulasan (${testimonials.length})`
                  : `View All Reviews (${testimonials.length})`}
              </span>
              <span>↓</span>
            </button>
          ) : isExpanded ? (
            <button
              type="button"
              onClick={() => setVisibleCount(INITIAL_VISIBLE)}
              className="px-6 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-medium transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>{id ? "Tampilkan Lebih Sedikit" : "Show Less"}</span>
              <span>↑</span>
            </button>
          ) : null}
        </div>
      )}

      {/* Modal / Detail Panel for Full Testimonial */}
      {selectedTestimonial && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#11131B] border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[85vh] animate-fade-in-up text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3.5 min-w-0">
                {selectedTestimonial.avatar_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-zinc-700 bg-zinc-900">
                    <Image
                      src={selectedTestimonial.avatar_url}
                      alt={selectedTestimonial.name || "Klien"}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-transparent text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-base shadow-inner">
                    {getInitials(selectedTestimonial.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-white truncate">
                    {selectedTestimonial.name || (id ? "Klien Terverifikasi" : "Verified Client")}
                  </h3>
                  <p className="text-xs text-cyan-400 font-medium truncate">
                    {selectedTestimonial.role || (id ? "Proyek Digital" : "Digital Project")}
                  </p>
                  <div className="mt-1">
                    <StarRating count={selectedTestimonial.rating || 5} />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTestimonial(null)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                aria-label={id ? "Tutup" : "Close"}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body: Full Unabridged Comment */}
            <div className="py-5">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 mb-2">
                <FaQuoteLeft className="text-cyan-400/40 text-xl mb-2" />
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-line italic">
                  &quot;
                  {id
                    ? selectedTestimonial.content_id || selectedTestimonial.content_en || ""
                    : selectedTestimonial.content_en || selectedTestimonial.content_id || ""}
                  &quot;
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <FaCheckCircle className="text-xs" />
                <span>{id ? "Ulasan Klien Terverifikasi" : "Verified Client Review"}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTestimonial(null)}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors active:scale-95"
              >
                {id ? "Tutup" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}