"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWA() {
  const message = encodeURIComponent("Halo Daffa, saya ingin konsultasi");
  const waUrl = `https://wa.me/6281374936621?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
      <FaWhatsapp size={32} className="relative z-10" />
    </a>
  );
}
