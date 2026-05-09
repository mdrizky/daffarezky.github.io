"use client";

import { FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  const { language } = useLanguage();

  const name = language === 'id' ? service.name_id : service.name_en;
  const description = language === 'id' ? service.description_id : service.description_en;
  const features = language === 'id' ? service.features_id : service.features_en;

  const message = encodeURIComponent(`Halo Daffa, saya ingin order ${name}...`);
  const waUrl = `https://wa.me/6281374936621?text=${message}`;

  return (
    <div className={`bg-white dark:bg-white/5 backdrop-blur-md border rounded-2xl p-8 flex flex-col h-full relative transition-all duration-300 hover:-translate-y-2 ${
      service.is_popular 
        ? 'border-blue-400 dark:border-[var(--color-neon-blue)]/50 shadow-lg dark:shadow-[0_0_30px_rgba(0,153,255,0.15)]' 
        : 'border-gray-200 dark:border-white/10'
    }`}>
      {service.is_popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-neon text-[#0A0A0F] font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
          {language === 'id' ? 'Paling Laku' : 'Most Popular'}
        </div>
      )}
      
      <h3 className="text-2xl font-heading font-bold mb-2 text-gray-900 dark:text-white">{name}</h3>
      <div className="text-3xl font-bold text-[var(--color-neon-green)] mb-4">
        {service.price}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        {description}
      </p>

      <div className="flex-grow">
        <ul className="flex flex-col gap-3 mb-8">
          {features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <FaCheckCircle className="text-[var(--color-neon-blue)] mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-3 rounded-full font-bold text-center transition-all flex items-center justify-center gap-2 ${
          service.is_popular 
            ? 'bg-gradient-neon text-[#0A0A0F] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:scale-105' 
            : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
        }`}
      >
        Order via WhatsApp
      </a>
    </div>
  );
}
