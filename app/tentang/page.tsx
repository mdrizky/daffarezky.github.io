'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaGraduationCap, FaBriefcase, FaFileDownload } from "react-icons/fa";
import type { Profile, Certificate, Education } from "@/types";

export default function TentangPage() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, certsRes, eduRes] = await Promise.all([
          supabase.from("profile").select("*").single(),
          supabase.from("certificates").select("*"),
          supabase.from("education").select("*").order("start_year", { ascending: false }),
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        if (certsRes.data) setCertificates(certsRes.data);
        if (eduRes.data) setEducation(eduRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bio = profile
    ? (language === 'id' ? profile.bio_id : profile.bio_en)
    : null;

  const t = {
    pageTitle: language === 'id' ? 'Tentang' : 'About',
    pageTitleGrad: language === 'id' ? 'Saya' : 'Me',
    pageDesc: language === 'id'
      ? 'Mengenal lebih dekat siapa di balik layar, perjalanan, dan visi saya di dunia digital.'
      : 'Get to know the person behind the screen, the journey, and my vision in the digital world.',
    greeting: language === 'id' ? 'Hi, saya' : "Hi, I'm",
    whyMe: language === 'id' ? 'Mengapa Memilih Saya?' : 'Why Choose Me?',
    whyItems: language === 'id'
      ? ["Fokus pada ROI & Konversi", "Desain Premium & Modern", "Up-to-date dengan tren AI", "Komunikasi & Delivery Cepat"]
      : ["Focus on ROI & Conversion", "Premium & Modern Design", "Up-to-date with AI trends", "Fast Communication & Delivery"],
    defaultBio1: language === 'id'
      ? 'Saya adalah seorang siswa SMK jurusan Bisnis Digital yang memiliki passion mendalam terhadap teknologi, pengembangan website, dan strategi pemasaran di era modern.'
      : 'I am a vocational school student majoring in Digital Business with a deep passion for technology, web development, and modern marketing strategies.',
    defaultBio2: language === 'id'
      ? 'Bagi saya, digital marketing bukan hanya tentang membuat iklan, melainkan memahami perilaku audiens, membangun brand identity yang kuat, dan menciptakan konversi melalui UI/UX yang tepat.'
      : 'For me, digital marketing is not just about creating ads, but understanding audience behavior, building strong brand identity, and creating conversions through proper UI/UX.',
    education: language === 'id' ? 'Pendidikan' : 'Education',
    inProgress: language === 'id' ? 'SEDANG BERJALAN' : 'IN PROGRESS',
    learning: language === 'id' ? 'Perjalanan Belajar' : 'Learning Journey',
    certs: language === 'id' ? 'Sertifikat &' : 'Certificates &',
    certsGrad: language === 'id' ? 'Penghargaan' : 'Awards',
    viewPdf: language === 'id' ? 'Lihat PDF' : 'View PDF',
    ctaTitle: language === 'id' ? 'Tertarik Bekerja Sama?' : 'Interested in Working Together?',
    ctaDesc: language === 'id'
      ? 'Jangan ragu untuk menghubungi saya jika Anda butuh bantuan dalam membangun produk digital atau merumuskan strategi bisnis Anda.'
      : "Don't hesitate to reach out if you need help building digital products or formulating your business strategy.",
    ctaButton: language === 'id' ? 'Hubungi Saya' : 'Contact Me',
  };

  const learningJourney = language === 'id' ? [
    { year: "2024", title: "Branding & Positioning", desc: "Mempelajari dasar-dasar membangun identitas brand yang kuat." },
    { year: "2024", title: "Content & Funnel Strategy", desc: "Membuat alur akuisisi pelanggan dari konten organik hingga konversi." },
    { year: "2025", title: "KPI Dashboard & Analytics", desc: "Eksplorasi Looker Studio dan Google Analytics untuk tracking data." },
    { year: "2025", title: "SEO & Blog Strategy", desc: "Optimalisasi on-page SEO dan keyword research." },
    { year: "2026", title: "AI Workflow & Super App", desc: "Automasi menggunakan n8n, ChatGPT, dan integrasi AI ke dalam produk." }
  ] : [
    { year: "2024", title: "Branding & Positioning", desc: "Learning the fundamentals of building strong brand identity." },
    { year: "2024", title: "Content & Funnel Strategy", desc: "Creating customer acquisition funnels from organic content to conversion." },
    { year: "2025", title: "KPI Dashboard & Analytics", desc: "Exploring Looker Studio and Google Analytics for data tracking." },
    { year: "2025", title: "SEO & Blog Strategy", desc: "On-page SEO optimization and keyword research." },
    { year: "2026", title: "AI Workflow & Super App", desc: "Automation using n8n, ChatGPT, and AI integration into products." }
  ];

  const defaultCerts = [
    { id: "1", title_id: "Sertifikat Tasheel", title_en: "Tasheel Certificate", issuer: "Tasheel", file_url: "#", date_issued: "2024" },
    { id: "2", title_id: "Surat Rekomendasi Tasheel", title_en: "Tasheel Recommendation", issuer: "Tasheel", file_url: "#", date_issued: "2024" },
    { id: "3", title_id: "Dicoding: Financial Literacy", title_en: "Dicoding: Financial Literacy", issuer: "Dicoding", file_url: "#", date_issued: "2025" },
    { id: "4", title_id: "Sertifikat Kompetensi", title_en: "Competency Certificate", issuer: "LSP", file_url: "#", date_issued: "2026" }
  ];

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayCerts = certificates.length > 0 ? certificates : defaultCerts as Certificate[];

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.pageTitle} <span className="text-gradient">{t.pageTitleGrad}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t.pageDesc}
          </p>
        </div>

        {/* Profile Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-neon-blue)]/20 to-transparent mix-blend-overlay z-10"></div>
              <Image
                src={profile?.photo_url || "/foto.jpg"}
                alt="Daffa Rizky"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--color-neon-green)] blur-[64px] opacity-30 -z-10"></div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-3xl font-heading font-bold text-gray-700 dark:text-gray-300">
              {t.greeting} <span className="text-gray-900 dark:text-white">Daffa Rizky</span> 👋
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              {bio ? (
                <p>{bio}</p>
              ) : (
                <>
                  <p>{t.defaultBio1}</p>
                  <p>{t.defaultBio2}</p>
                </>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-xl mb-4 text-[var(--color-neon-blue)]">{t.whyMe}</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {t.whyItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-lg p-3 border border-gray-200 dark:border-white/10">
                    <span className="text-[var(--color-neon-green)]">✦</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Education from DB */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[var(--color-neon-green)] shadow-sm">
                <FaGraduationCap size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{t.education}</h2>
            </div>
            
            <div className="space-y-6">
              {education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="relative border-l border-gray-300 dark:border-white/10 pl-8 pb-4">
                    <div className={`absolute w-4 h-4 rounded-full -left-[8px] top-1 ${edu.is_current ? 'bg-[var(--color-neon-green)] shadow-[0_0_10px_rgba(0,255,136,0.8)]' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                    {edu.is_current && <span className="text-[var(--color-neon-green)] text-sm font-bold tracking-wider">{t.inProgress}</span>}
                    <h3 className="text-xl font-bold mt-1 mb-1 text-gray-900 dark:text-white">{edu.institution}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{language === 'id' ? edu.degree_id : edu.degree_en} • {edu.start_year} - {edu.is_current ? (language === 'id' ? 'Sekarang' : 'Present') : edu.end_year}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{language === 'id' ? edu.description_id : edu.description_en}</p>
                  </div>
                ))
              ) : (
                <div className="relative border-l border-gray-300 dark:border-white/10 pl-8 pb-8">
                  <div className="absolute w-4 h-4 rounded-full bg-[var(--color-neon-green)] -left-[8px] top-1 shadow-[0_0_10px_rgba(0,255,136,0.8)]"></div>
                  <span className="text-[var(--color-neon-green)] text-sm font-bold tracking-wider">{t.inProgress}</span>
                  <h3 className="text-xl font-bold mt-2 mb-1 text-gray-900 dark:text-white">{language === 'id' ? 'Sekolah Menengah Kejuruan (SMK)' : 'Vocational High School (SMK)'}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{language === 'id' ? 'Jurusan Bisnis Digital. Fokus pada Pemasaran Online, E-Commerce, dan Administrasi Bisnis.' : 'Digital Business Major. Focused on Online Marketing, E-Commerce, and Business Administration.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Journey */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[var(--color-neon-blue)] shadow-sm">
                <FaBriefcase size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{t.learning}</h2>
            </div>
            
            <div className="space-y-8">
              {learningJourney.map((item, i) => (
                <div key={i} className="relative border-l border-gray-300 dark:border-white/10 pl-8">
                  <div className="absolute w-3 h-3 rounded-full bg-[var(--color-neon-blue)] -left-[6px] top-1.5"></div>
                  <span className="text-[var(--color-neon-blue)] text-sm font-bold">{item.year}</span>
                  <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 text-center text-gray-900 dark:text-white">{t.certs} <span className="text-gradient">{t.certsGrad}</span></h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCerts.map((cert) => (
              <div key={cert.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[var(--color-neon-green)]/50 transition-colors shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 text-[var(--color-neon-green)] group-hover:scale-110 transition-transform">
                  <FaFileDownload size={24} />
                </div>
                <h3 className="font-bold mb-1 text-gray-900 dark:text-white">{language === 'id' ? cert.title_id : cert.title_en}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{cert.issuer} • {cert.date_issued}</p>
                <a 
                  href={cert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-sm text-[var(--color-neon-blue)] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t.viewPdf}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-12 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-heading font-bold mb-4 text-gray-900 dark:text-white">{t.ctaTitle}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            {t.ctaDesc}
          </p>
          <Link href="/kontak" className="inline-block bg-gradient-neon text-[#0A0A0F] px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:scale-105 transition-transform">
            {t.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
