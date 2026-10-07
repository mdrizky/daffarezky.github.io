"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FloatingWA() {
  const [waNumber, setWaNumber] = useState("6281374936621");

  useEffect(() => {
    const fetchWA = async () => {
      try {
        const { data } = await supabase
          .from("profile")
          .select("wa")
          .limit(1)
          .single();

        if (data?.wa) {
          // Normalize: strip +, spaces, dashes
          const normalized = data.wa.replace(/[\s\-\+]/g, "");
          // Ensure it starts with country code (e.g. 62 for Indonesia)
          setWaNumber(normalized.startsWith("0") ? `62${normalized.slice(1)}` : normalized);
        }
      } catch {
        // Fallback to default
      }
    };
    fetchWA();
  }, []);

  const message = encodeURIComponent("Halo Daffa, saya ingin konsultasi");
  const waUrl = `https://wa.me/${waNumber}?text=${message}`;

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
