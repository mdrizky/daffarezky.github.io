"use client";

import { FaCheckCircle, FaClock, FaUsers } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

export default function ServiceCard({ service }: { service: Service }) {
  const { language } = useLanguage();

  const name = language === 'id' ? service.name_id : service.name_en;
  const description = language === 'id' ? service.description_id : service.description_en;
  const features = language === 'id' ? service.features_id : service.features_en;
  const targetClient = language === 'id' ? (service.target_client_id || service.target_client_en) : (service.target_client_en || service.target_client_id);
  const badgeText = service.badge_text || (service.is_popular ? (language === 'id' ? 'Paling Laku / Best Seller' : 'Best Seller') : null);

  const message = encodeURIComponent(`Halo Daffa, saya ingin konsultasi & order: ${name}`);
  const waUrl = `https://wa.me/6281374936621?text=${message}`;

  return (
    <div className={cn(
      "bg-card text-card-foreground border p-6 md:p-8 flex flex-col h-full relative transition-all duration-300 hover:-translate-y-1.5 rounded-2xl",
      service.is_popular 
        ? "border-primary/60 shadow-lg ring-1 ring-primary/20 dark:border-primary/40" 
        : "border-border shadow-sm hover:border-border/80"
    )}>
      {badgeText && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold px-4 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm whitespace-nowrap">
          {badgeText}
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 text-foreground tracking-tight">{name}</h3>
        <div className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
          {service.price}
        </div>
        {service.timeline && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-foreground border border-border/60 mb-3">
            <FaClock className="text-primary text-xs shrink-0" />
            <span>{language === 'id' ? 'Estimasi:' : 'Estimated:'} {service.timeline}</span>
          </div>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {targetClient && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 mb-5 text-xs text-muted-foreground leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
            <FaUsers className="text-primary text-xs shrink-0" />
            <span>{language === 'id' ? 'Target Klien:' : 'Target Clients:'}</span>
          </div>
          <span>{targetClient}</span>
        </div>
      )}

      <div className="flex-grow">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {language === 'id' ? 'Fitur yang Didapat:' : 'Included Features:'}
        </div>
        <ul className="flex flex-col gap-2.5 mb-8">
          {features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-foreground/90">
              <FaCheckCircle className="text-primary mt-1 text-xs shrink-0" />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "w-full py-3 px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 text-sm shadow-sm",
          service.is_popular 
            ? "bg-primary text-primary-foreground hover:opacity-90" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
        )}
      >
        {language === 'id' ? 'Order via WhatsApp' : 'Order via WhatsApp'}
      </a>
    </div>
  );
}
