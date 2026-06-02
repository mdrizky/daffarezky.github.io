'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import type { Profile } from "@/types";

export default function TentangPage() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from("profile").select("*").limit(1);
        if (data && data.length > 0) setProfile(data[0]);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const t = {
    pageTitle: language === 'id' ? 'Tentang' : 'About',
    pageTitleGrad: language === 'id' ? 'Saya' : 'Me',
    pageDesc: language === 'id'
      ? 'Mengenal lebih dekat siapa di balik layar, perjalanan, dan visi saya di dunia digital.'
      : 'Get to know the person behind the screen, the journey, and my vision in the digital world.',
    perkenalan: language === 'id' ? 'Perkenalan Diri' : 'Introduction',
    visi: language === 'id' ? 'Visi Pribadi' : 'Personal Vision',
    fokus: language === 'id' ? 'Fokus Pengembangan' : 'Development Focus',
    nilai: language === 'id' ? 'Nilai yang Saya Pegang' : 'My Values',
    perjalanan: language === 'id' ? 'Perjalanan Belajar' : 'Learning Journey',
    quote: language === 'id' ? 'Quote Islami' : 'Islamic Quote',
  };

  const introduction = language === 'id' 
    ? "Assalamu'alaikum. Saya Muhammad Daffa Rezky Adyra, seorang pengembang web dan mobile yang memiliki ketertarikan besar pada teknologi, inovasi digital, Internet of Things (IoT), dan pengembangan solusi yang memberikan manfaat bagi masyarakat. Saya percaya bahwa teknologi bukan hanya alat, tetapi sarana untuk menciptakan perubahan positif dan kebermanfaatan yang lebih luas."
    : "Assalamu'alaikum. I am Muhammad Daffa Rezky Adyra, a web and mobile developer who has a great interest in technology, digital innovation, Internet of Things (IoT), and developing solutions that benefit society. I believe that technology is not just a tool, but a means to create positive change and broader usefulness.";

  const vision = language === 'id'
    ? "Menjadi profesional di bidang teknologi yang tidak hanya unggul secara teknis, tetapi juga menjunjung tinggi nilai-nilai Islam, integritas, dan kebermanfaatan dalam setiap karya yang dibangun."
    : "To be a professional in the field of technology who is not only technically excellent but also upholds Islamic values, integrity, and usefulness in every work built.";

  const focusItems = [
    { title: "Web Development", icon: "🌐" },
    { title: "Mobile Development", icon: "📱" },
    { title: "Artificial Intelligence", icon: "🤖" },
    { title: "Internet of Things (IoT)", icon: "📡" },
    { title: "UI/UX Design", icon: "🎨" },
    { title: "Cloud Computing", icon: "☁️" },
  ];

  const valueItems = language === 'id' ? [
    { title: "Islam sebagai landasan hidup", icon: "🕌" },
    { title: "Belajar sepanjang hayat", icon: "💡" },
    { title: "Kolaborasi dan komunikasi", icon: "🤝" },
    { title: "Inovasi dan kebermanfaatan", icon: "🚀" },
    { title: "Konsistensi dalam berkarya", icon: "🎯" },
  ] : [
    { title: "Islam as the foundation of life", icon: "🕌" },
    { title: "Lifelong learning", icon: "💡" },
    { title: "Collaboration and communication", icon: "🤝" },
    { title: "Innovation and usefulness", icon: "🚀" },
    { title: "Consistency in working", icon: "🎯" },
  ];

  const quote = language === 'id'
    ? { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.", ref: "Hadits Riwayat Ahmad" }
    : { text: "The best of humans are those who are most beneficial to others.", ref: "Hadith Narrated by Ahmad" };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0A0A0F] transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            {t.pageTitle} <span className="text-gradient">{t.pageTitleGrad}</span>
          </h1>
          <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t.pageDesc}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-32">
          {/* 1. Perkenalan Diri */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl">
                  <Image
                    src={profile?.photo_url || "/foto.jpg"}
                    alt={profile?.name || "Daffa Rizky"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-heading font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
                  {t.perkenalan}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {introduction}
                </p>
              </div>
            </div>
          </section>

          {/* 2. Visi Pribadi */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-gradient-to-br from-[#00FF88]/5 to-[#0099FF]/5 border border-gray-200 dark:border-white/10 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-green)] blur-[100px] opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-neon-blue)] blur-[100px] opacity-10"></div>
              <h2 className="text-3xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
                {t.visi}
              </h2>
              <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 italic leading-relaxed max-w-3xl mx-auto">
                "{vision}"
              </p>
            </div>
          </section>

          {/* 3. Fokus Pengembangan */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-heading font-bold mb-10 text-center text-gray-900 dark:text-white">
              {t.fokus}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {focusItems.map((item, i) => (
                <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-[var(--color-neon-green)]/50 transition-all hover:-translate-y-1 group">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-center">{item.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Nilai yang Saya Pegang */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-heading font-bold mb-10 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
              {t.nilai}
            </h2>
            <div className="space-y-4">
              {valueItems.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{item.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Perjalanan Belajar */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-heading font-bold mb-10 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">
              {t.perjalanan}
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl font-medium">
              {language === 'id' 
                ? "Perjalanan saya di dunia teknologi dimulai dari rasa ingin tahu terhadap cara kerja website dan aplikasi. Seiring waktu, saya mulai mempelajari pemrograman, pengembangan web, IoT, dan berbagai teknologi modern lainnya melalui proyek nyata, pembelajaran mandiri, komunitas, serta berbagai program pelatihan dan sertifikasi."
                : "My journey in the tech world started with a curiosity about how websites and applications work. Over time, I began learning programming, web development, IoT, and various other modern technologies through real projects, self-learning, communities, and various training and certification programs."
              }
            </div>
          </section>

          {/* 6. Quote Islami */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center pb-20">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-5xl text-[var(--color-neon-green)] opacity-50 font-serif">"</div>
              <p className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                {quote.text}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-gray-300 dark:bg-white/20"></div>
                <span className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase text-sm">{quote.ref}</span>
                <div className="h-[1px] w-12 bg-gray-300 dark:bg-white/20"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
