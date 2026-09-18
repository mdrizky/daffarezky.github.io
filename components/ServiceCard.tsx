"use client";

import { FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

export default function ServiceCard({ service }: { service: Service }) {
  const { language } = useLanguage();

  const name = language === 'id' ? service.name_id : service.name_en;
  const description = language === 'id' ? service.description_id : service.description_en;
  const features = language === 'id' ? service.features_id : service.features_en;

  const message = encodeURIComponent(`Halo Daffa, saya ingin order ${name}...`);
  const waUrl = `https://wa.me/6281374936621?text=${message}`;

  return (
    <div className={cn(
      "bg-card border p-8 flex flex-col h-full relative transition-all duration-300 hover:-translate-y-2 rounded-xl",
      service.is_popular ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border shadow-sm"
    )}>
      {service.is_popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
          {language === 'id' ? 'Paling Laku' : 'Most Popular'}
        </div>
      )}
      
      <h3 className="text-2xl font-heading font-bold mb-2 text-foreground">{name}</h3>
      <div className="text-3xl font-bold text-primary mb-4">
        {service.price}
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        {description}
      </p>

      <div className="flex-grow">
        <ul className="flex flex-col gap-3 mb-8">
          {features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-medium text-foreground">
              <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "w-full py-3 rounded-md font-bold text-center transition-colors flex items-center justify-center gap-2",
          service.is_popular 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Order via WhatsApp
      </a>
    </div>
  );
}
