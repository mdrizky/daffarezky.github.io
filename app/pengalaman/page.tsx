'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaBriefcase, FaUsers, FaAward, FaBook } from "react-icons/fa";
import type { Experience } from "@/types";

export default function PengalamanPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await supabase
          .from("experience")
          .select("*")
          .order("order_index", { ascending: true });
        
        if (data) {
          setExperiences(data);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const t = {
    pageTitle: language === 'id' ? 'Pengalaman' : 'Experience',
    pageDesc: language === 'id'
      ? 'Perjalanan kepemimpinan, organisasi, dan pengembangan diri yang membentuk karakter dan kemampuan.'
      : 'Leadership journey, organizational experience, and personal development that shapes character and abilities.',
    leadership: language === 'id' ? 'Kepemimpinan' : 'Leadership',
    religious: language === 'id' ? 'Keagamaan' : 'Religious',
    training: language === 'id' ? 'Pelatihan' : 'Training',
    achievement: language === 'id' ? 'Pencapaian' : 'Achievement',
    present: language === 'id' ? 'Sekarang' : 'Present',
    noData: language === 'id'
      ? 'Belum ada data pengalaman. Tambahkan melalui panel admin.'
      : 'No experience data yet. Add through admin panel.',
  };

  // Group experiences by category
  const groupedExperiences = experiences.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = [];
    acc[exp.category].push(exp);
    return acc;
  }, {} as Record<string, Experience[]>);

  const categoryIcons: Record<string, any> = {
    'Organisasi': <FaUsers />,
    'Freelance': <FaBriefcase />,
    'Kompetisi': <FaAward />,
    'Volunteer': <FaUsers />,
    'Magang': <FaBriefcase />,
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
        {experiences.length > 0 ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {Object.entries(groupedExperiences).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[var(--color-neon-green)] shadow-sm">
                    {categoryIcons[category] || <FaBriefcase />}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                    {category}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {items.map((exp) => (
                    <div
                      key={exp.id}
                      className="relative border-l border-gray-300 dark:border-white/10 pl-8 pb-6"
                    >
                      <div className={`absolute w-4 h-4 rounded-full -left-[8px] top-1 ${exp.is_current ? 'bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,136,0.8)]' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                      {exp.is_current && (
                        <span className="text-[var(--color-neon-green)] text-sm font-bold tracking-wider">
                          {t.present}
                        </span>
                      )}
                      
                      <h3 className="text-xl font-bold mt-2 mb-1 text-gray-900 dark:text-white">
                        {language === 'id' ? exp.title_id : exp.title_en}
                      </h3>
                      <p className="text-sm text-gray-900/60 dark:text-gray-400 mb-2 font-semibold">
                        {exp.organization} • {exp.role} • {exp.start_date} - {exp.is_current ? t.present : exp.end_date}
                      </p>
                      {exp.description_id && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {language === 'id' ? exp.description_id : exp.description_en}
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
