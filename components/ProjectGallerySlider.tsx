'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpand, 
  FaTimes, 
  FaImages 
} from 'react-icons/fa';

export interface GalleryImage {
  id?: string;
  image_url: string;
  caption_id?: string;
  caption_en?: string;
}

interface ProjectGallerySliderProps {
  images: GalleryImage[];
  title: string;
}

export default function ProjectGallerySlider({ images, title }: ProjectGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // If no images provided, return null or fallback
  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex] || images[0];
  const hasMultiple = images.length > 1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentCaption = currentImage.caption_id || currentImage.caption_en;

  return (
    <div className="w-full mb-12 space-y-4">
      {/* Main Image Slider Viewport */}
      <div 
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-3xl border border-border bg-muted/40 shadow-xl group cursor-pointer select-none"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={currentImage.image_url}
          alt={currentCaption || `${title} - Screenshot ${currentIndex + 1}`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-[1.02]"
          priority={currentIndex === 0}
          sizes="(max-width: 1200px) 100vw, 1200px"
        />

        {/* Gradient shadow overlay for controls & caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Counter Badge & Zoom button */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
          {hasMultiple && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-sm pointer-events-auto">
              <FaImages className="text-primary text-xs" />
              <span>{currentIndex + 1} / {images.length}</span>
            </span>
          )}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="ml-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 hover:scale-105 transition-all border border-white/10 shadow-sm pointer-events-auto"
            title="Perbesar Gambar (Fullscreen)"
          >
            <FaExpand size={13} />
          </button>
        </div>

        {/* Navigation Arrows (Left & Right) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-primary hover:text-primary-foreground border border-white/10 flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-lg active:scale-95 z-10"
              aria-label="Foto Sebelumnya"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-primary hover:text-primary-foreground border border-white/10 flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-lg active:scale-95 z-10"
              aria-label="Foto Selanjutnya"
            >
              <FaChevronRight size={16} />
            </button>
          </>
        )}

        {/* Caption bar at the bottom */}
        {currentCaption && (
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <p className="text-white text-sm md:text-base font-medium drop-shadow-sm">
              {currentCaption}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Strip (if multiple photos) */}
      {hasMultiple && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                idx === currentIndex
                  ? 'border-primary ring-2 ring-primary/40 scale-105 shadow-md'
                  : 'border-border/60 opacity-60 hover:opacity-100 hover:border-border'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="absolute top-4 inset-x-4 md:inset-x-8 flex items-center justify-between z-20 text-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {currentIndex + 1} / {images.length}
              </span>
              <span className="text-sm text-gray-300 font-medium truncate max-w-xs md:max-w-md">
                {currentCaption || title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Large Image */}
          <div 
            className="relative w-full max-w-6xl max-h-[80vh] aspect-[16/9] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.image_url}
              alt={currentCaption || title}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>

          {/* Lightbox Navigation Buttons */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20"
                aria-label="Sebelumnya"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20"
                aria-label="Selanjutnya"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
