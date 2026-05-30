'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaLightbulb, FaCode, FaFlask, FaRocket } from "react-icons/fa";
import type { Concept } from "@/types";

export default function KonsepPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const { data } = await supabase
          .from("concepts")
          .select("*")
          .order("order_index", { ascending: true });
        
        if (data) {
          setConcepts(data);
        }
      } catch (error) {
        console.error("Error fetching concepts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConcepts();
  }, []);

  const t = {
    pageTitle: language === 'id' ? 'Konsep' : 'Concepts',
    pageDesc: language === 'id'
      ? 'Ide eksplorasi dan konsep masa depan yang sedang dikembangkan atau ingin diwujudkan.'
      : 'Exploration ideas and future concepts being developed or want to be realized.',
    technology: language === 'id' ? 'Teknologi' : 'Technology',
    status: language === 'id' ? 'Status' : 'Status',
    noData: language === 'id'
      ? 'Belum ada data konsep. Tambahkan melalui panel admin.'
      : 'No concept data yet. Add through admin panel.',
  };

  const statusColors: Record<string, string> = {
    'Concept': 'bg-purple-500',
    'In Progress': 'bg-blue-500',
    'Planned': 'bg-yellow-500',
    'Completed': 'bg-green-500',
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
        {concepts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-[var(--color-neon-green)]/50 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                    <FaLightbulb size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[concept.status] || 'bg-gray-500'}`}>
                    {concept.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {language === 'id' ? concept.title_id : concept.title_en}
                </h3>
                
                {concept.subtitle_id && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {language === 'id' ? concept.subtitle_id : concept.subtitle_en}
                  </p>
                )}
                
                {concept.description_id && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {language === 'id' ? concept.description_id : concept.description_en}
                  </p>
                )}
                
                {concept.technology && concept.technology.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      {t.technology}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {concept.technology.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
