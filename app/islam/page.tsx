'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaBook, FaStar, FaMosque } from "react-icons/fa";
import type { Islamic } from "@/types";

export default function IslamPage() {
  const [islamicData, setIslamicData] = useState<Islamic[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchIslamicData = async () => {
      try {
        const { data } = await supabase
          .from("islamic")
          .select("*")
          .order("order_index", { ascending: true });
        
        if (data) setIslamicData(data);
      } catch (error) {
        console.error("Error fetching Islamic data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIslamicData();
  }, []);

  const t = {
    pageTitle: language === 'id' ? 'Islam' : 'Islam',
    pageDesc: language === 'id'
      ? 'Perjalanan spiritual dan nilai-nilai Islami yang membentuk kehidupan.'
      : 'Spiritual journey and Islamic values that shape life.',
    noData: language === 'id'
      ? 'Belum ada data Islam. Tambahkan melalui panel admin.'
      : 'No Islamic data yet. Add through admin panel.',
  };

  // Group by category
  const groupedData = islamicData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Islamic[]>);

  const categoryIcons: Record<string, any> = {
    'Quran': <FaBook />,
    'Hadith': <FaBook />,
    'Worship': <FaMosque />,
    'Values': <FaStar />,
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.pageTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t.pageDesc}
          </p>
        </div>

        {/* Content */}
        {islamicData.length > 0 ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {Object.entries(groupedData).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[var(--color-neon-green)] shadow-sm">
                    {categoryIcons[category] || <FaBook />}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                    {category}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-[var(--color-neon-green)]/50 transition-colors shadow-sm"
                    >
                      {item.featured && (
                        <div className="flex items-center gap-2 mb-4">
                          <FaStar className="text-yellow-500" />
                          <span className="text-xs font-bold text-yellow-500">Featured</span>
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        {language === 'id' ? item.title_id : item.title_en}
                      </h3>
                      
                      {item.subtitle_id && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {language === 'id' ? item.subtitle_id : item.subtitle_en}
                        </p>
                      )}
                      
                      {item.reference && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">
                          {item.reference}
                        </p>
                      )}
                      
                      {item.description_id && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {language === 'id' ? item.description_id : item.description_en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl">
            <p className="text-gray-500 dark:text-gray-400">{t.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
}
