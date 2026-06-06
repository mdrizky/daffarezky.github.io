'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import type { Profile, Education, Skill, Concept, FocusArea, CoreValue, Quote, ActiveProject, FutureConcept } from "@/types";
import SkillBadge from "@/components/SkillBadge";
import { FaHammer, FaCheckSquare } from "react-icons/fa";

export default function TentangPage() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [futureConcepts, setFutureConcepts] = useState<FutureConcept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, eduRes, skillRes, focusRes, valuesRes, quotesRes, activeRes, futureRes] = await Promise.all([
          supabase.from("profile").select("*").limit(1),
          supabase.from("education").select("*").order("start_year", { ascending: false }),
          supabase.from("skills").select("*").order("name"),
          supabase.from("focus_areas").select("*").order("sort_order"),
          supabase.from("core_values").select("*").order("sort_order"),
          supabase.from("quotes").select("*").order("sort_order"),
          supabase.from("active_projects").select("*").order("sort_order"),
          supabase.from("future_concepts").select("*").order("sort_order"),
        ]);

        if (profileRes.data && profileRes.data.length > 0) setProfile(profileRes.data[0]);
        if (eduRes.data) setEducation(eduRes.data);
        if (skillRes.data) setSkills(skillRes.data);
        if (focusRes.data) setFocusAreas(focusRes.data);
        if (valuesRes.data) setCoreValues(valuesRes.data);
        if (quotesRes.data) setQuotes(quotesRes.data);
        if (activeRes.data) setActiveProjects(activeRes.data);
        if (futureRes.data) setFutureConcepts(futureRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    educationTitle: language === 'id' ? 'Pendidikan' : 'Education',
    skillsTitle: language === 'id' ? 'Keahlian' : 'Skills',
    ongoingTitle: language === 'id' ? 'Ide & Karya Sedang Dibangun' : 'Ongoing Ideas & Works',
    conceptsTitle: language === 'id' ? 'Konsep Masa Depan' : 'Future Concepts',
    birthInfo: language === 'id' ? 'Informasi Pribadi' : 'Personal Information',
    born: language === 'id' ? 'Lahir' : 'Born',
    location: language === 'id' ? 'Lokasi' : 'Location',
  };

  const introduction = language === 'id' 
    ? (profile?.bio_id || "Assalamu'alaikum. Saya Muhammad Daffa Rezky Adyra, seorang pengembang web dan mobile yang memiliki ketertarikan besar pada teknologi, inovasi digital, Internet of Things (IoT), dan pengembangan solusi yang memberikan manfaat bagi masyarakat.")
    : (profile?.bio_en || "Assalamu'alaikum. I am Muhammad Daffa Rezky Adyra, a web and mobile developer who has a great interest in technology, digital innovation, Internet of Things (IoT), and developing solutions that benefit society.");

  const vision = language === 'id'
    ? (profile?.vision_id || "Menjadi profesional di bidang teknologi yang tidak hanya unggul secara teknis, tetapi juga menjunjung tinggi nilai-nilai Islam, integritas, dan kebermanfaatan dalam setiap karya yang dibangun.")
    : (profile?.vision_en || "To be a professional in the field of technology who is not only technically excellent but also upholds Islamic values, integrity, and usefulness in every work built.");

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
        <div className="text-left mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.pageTitle} <span className="text-gradient">{t.pageTitleGrad}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
            {t.pageDesc}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-32">
          {/* 1. Perkenalan Diri & Personal Info */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="w-full md:w-2/5">
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl mb-8">
                  <Image
                    src={profile?.about_photo_url || profile?.photo_url || "/foto.jpg"}
                    alt={profile?.name || "Daffa Rizky"}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Birth Info */}
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">
                    {t.birthInfo}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{t.born}</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{t.location}</span>
                      <span className="text-gray-900 dark:text-white font-bold">{profile?.birth_place || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-3/5">
                <h2 className="text-4xl font-heading font-bold mb-8 text-gray-900 dark:text-white inline-block relative">
                  {t.perkenalan}
                  <div className="absolute -bottom-2 left-0 w-20 h-1.5 bg-gradient-neon rounded-full"></div>
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                  {introduction}
                </p>
                
                {/* Visi Section inside intro area for flow */}
                <div className="mt-12 p-8 bg-gradient-to-br from-[var(--color-neon-blue)]/10 to-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)]/20 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-green)] blur-[80px] opacity-20"></div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="text-2xl">✨</span> {t.visi}
                  </h3>
                  <p className="text-lg text-gray-800 dark:text-gray-200 italic leading-relaxed">
                    "{vision}"
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Pendidikan */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-heading font-bold mb-12 text-gray-900 dark:text-white border-l-4 border-[var(--color-neon-green)] pl-6">
              {t.educationTitle}
            </h2>
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col md:flex-row gap-8 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] hover:border-[var(--color-neon-green)]/30 transition-all shadow-sm group">
                  <div className="w-20 h-20 flex-shrink-0 relative bg-white rounded-2xl p-2 border border-gray-100 dark:border-white/5 shadow-inner flex items-center justify-center">
                    {edu.logo_url ? (
                      <Image src={edu.logo_url} alt={edu.institution} fill className="object-contain p-2" />
                    ) : (
                      <span className="text-3xl">🎓</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[var(--color-neon-green)] transition-colors">
                          {edu.institution}
                        </h3>
                        <p className="text-lg font-medium text-[var(--color-neon-blue)]">
                          {language === 'id' ? edu.degree_id : edu.degree_en}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300">
                        {edu.start_year} — {edu.is_current ? (language === 'id' ? 'Sekarang' : 'Present') : edu.end_year}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {language === 'id' ? edu.description_id : edu.description_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Keahlian */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-heading font-bold mb-12 text-gray-900 dark:text-white border-l-4 border-[var(--color-neon-blue)] pl-6">
              {t.skillsTitle}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {skills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} />
              ))}
            </div>
          </section>

          {/* 4. Fokus & Nilai (Grid) */}
          <div className="grid lg:grid-cols-2 gap-12">
            {focusAreas.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-3xl font-heading font-bold mb-10 text-gray-900 dark:text-white">
                  {t.fokus}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {focusAreas.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-[var(--color-neon-green)]/50 transition-all shadow-sm">
                      <span className="text-4xl">🌐</span>
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">{language === 'id' ? item.title_id : item.title_en}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'id' ? item.description_id : item.description_en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {coreValues.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-3xl font-heading font-bold mb-10 text-gray-900 dark:text-white">
                  {t.nilai}
                </h2>
                <div className="space-y-4">
                  {coreValues.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm">
                      <span className="text-3xl">✨</span>
                      <div>
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200 block">{language === 'id' ? item.title_id : item.title_en}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'id' ? item.description_id : item.description_en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 5. Ongoing Ideas & Works */}
          {activeProjects.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-3xl font-heading font-bold mb-12 text-gray-900 dark:text-white border-l-4 border-[var(--color-neon-green)] pl-6">
                {t.ongoingTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {activeProjects.map((item) => (
                  <div key={item.id} className="p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 px-6 py-2 bg-[var(--color-neon-green)] text-black font-bold text-xs rounded-bl-2xl uppercase tracking-widest">
                      {language === 'id' ? item.status_id : item.status_en}
                    </div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-[var(--color-neon-green)] transition-colors">
                        {language === 'id' ? item.name_id : item.name_en}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {language === 'id' ? item.description_id : item.description_en}
                      </p>

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between text-[10px] font-black mb-2 tracking-tighter">
                          <span className="text-gray-400 uppercase">PROGRES PENGERJAAN</span>
                          <span className="text-[var(--color-neon-green)]">{item.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-neon h-full transition-all duration-1000" style={{ width: `${item.progress_percent}%` }} />
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FaHammer className="text-[var(--color-neon-green)]" /> Fitur / Features</p>
                        <ul className="grid grid-cols-1 gap-2">
                          {(language === 'id' ? item.features_id : item.features_en)?.map((f, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                              <FaCheckSquare className="mt-1 text-[var(--color-neon-blue)] shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {item.estimated_completion && (
                      <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-[10px] font-bold text-gray-400">
                        ESTIMASI SELESAI: {item.estimated_completion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. Future Concepts */}
          {futureConcepts.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-3xl font-heading font-bold mb-12 text-gray-900 dark:text-white border-l-4 border-[var(--color-neon-blue)] pl-6">
                {t.conceptsTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {futureConcepts.map((item) => (
                  <div key={item.id} className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl hover:border-[var(--color-neon-blue)]/30 transition-all shadow-sm">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">{item.category}</span>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {language === 'id' ? item.title_id : item.title_en}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-4">
                      {language === 'id' ? item.description_id : item.description_en}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.tags?.map((tag, i) => (
                        <span key={i} className="text-[8px] px-2 py-0.5 bg-blue-500/5 text-blue-500 rounded-md font-bold">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* 7. Perjalanan Belajar */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-heading font-bold mb-12 text-gray-900 dark:text-white border-l-4 border-[var(--color-neon-green)] pl-6">
              {t.perjalanan}
            </h2>
            <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-10 md:p-16 rounded-[40px] font-medium shadow-sm">
              {language === 'id' 
                ? "Perjalanan saya di dunia teknologi dimulai dari rasa ingin tahu terhadap cara kerja website dan aplikasi. Seiring waktu, saya mulai mempelajari pemrograman, pengembangan web, IoT, dan berbagai teknologi modern lainnya melalui proyek nyata, pembelajaran mandiri, komunitas, serta berbagai program pelatihan dan sertifikasi."
                : "My journey in the tech world started with a curiosity about how websites and applications work. Over time, I began learning programming, web development, IoT, and various other modern technologies through real projects, self-learning, communities, and various training and certification programs."
              }
            </div>
          </section>

          {/* 8. Quote Islami */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-left pb-20">
            <div className="max-w-4xl space-y-8">
              <div className="text-7xl text-[var(--color-neon-green)] opacity-30 font-serif h-8">"</div>
              <p className="text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                {quote.text}
              </p>
              <div className="flex items-center gap-6">
                <div className="h-[2px] w-16 bg-gradient-neon"></div>
                <span className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase text-lg">{quote.ref}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
