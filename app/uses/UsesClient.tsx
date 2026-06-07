'use client'

import { useLanguage } from "@/components/LanguageProvider";
import { FaLaptop, FaCode, FaMobileAlt, FaTools } from "react-icons/fa";
import type { UsesItem } from "@/types";

export default function UsesClient({ items }: { items: UsesItem[] }) {
  const { language } = useLanguage();

  const t = {
    title: language === 'id' ? 'Setup & Alat' : 'Setup & Tools',
    subtitle: language === 'id' 
      ? 'Daftar perangkat keras, perangkat lunak, dan alat yang saya gunakan sehari-hari.' 
      : 'A list of hardware, software, and tools I use on a daily basis.',
    hardware: language === 'id' ? 'Perangkat Keras' : 'Hardware',
    software: language === 'id' ? 'Perangkat Lunak' : 'Software',
    apps: language === 'id' ? 'Aplikasi Harian' : 'Daily Apps',
    other: language === 'id' ? 'Lainnya' : 'Other',
  };

  const categories = [
    { key: 'Hardware', label: t.hardware, icon: <FaLaptop /> },
    { key: 'Software', label: t.software, icon: <FaCode /> },
    { key: 'Daily Apps', label: t.apps, icon: <FaMobileAlt /> },
    { key: 'Other', label: t.other, icon: <FaTools /> },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-16">
          {categories.map((cat) => {
            const catItems = items.filter(item => item.category === cat.key);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.key}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl">
                    {cat.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{cat.label}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {item.name}
                        </h3>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Link
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {language === 'id' ? item.description_id : item.description_en}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
