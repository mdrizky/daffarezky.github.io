'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import SocialLinks from "@/components/SocialLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import type { Profile, Project, Service, Testimonial } from "@/types";

export default function Home() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, servicesRes, testimonialsRes] = await Promise.all([
          supabase.from("profile").select("*").limit(1),
          supabase.from("projects").select("*").eq("featured", true).limit(3),
          supabase.from("services").select("*").order("price", { ascending: true }).limit(3),
          supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3),
        ]);

        if (profileRes.data && profileRes.data.length > 0) setProfile(profileRes.data[0]);
        if (projectsRes.data) setProjects(projectsRes.data);
        if (servicesRes.data) setServicesData(servicesRes.data);
        if (testimonialsRes.data) setTestimonialsData(testimonialsRes.data);
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
    : (language === 'id'
        ? "Membantu brand dan bisnis bertransformasi di era digital melalui strategi yang tepat, desain yang memukau, dan eksekusi yang terukur."
        : "Helping brands and businesses transform in the digital era through precise strategies, stunning designs, and measurable execution.");

  const t = {
    greeting: language === 'id' ? 'Halo, Saya Daffa Rizky 👋' : 'Hi, I\'m Daffa Rizky 👋',
    heroTitle: language === 'id' ? "Saya seorang" : "I'm a",
    viewPortfolio: language === 'id' ? 'Lihat Portfolio' : 'View Portfolio',
    downloadCv: language === 'id' ? 'Download CV' : 'Download CV',
    connect: language === 'id' ? 'Terhubung Dengan Saya' : 'Connect With Me',
    projects: language === 'id' ? 'Proyek' : 'Projects',
    tools: language === 'id' ? 'Tools' : 'Tools',
    passion: language === 'id' ? 'Semangat' : 'Passion',
    aboutTitle1: language === 'id' ? 'Mengubah ide menjadi ' : 'Turning ideas into ',
    aboutTitle2: language === 'id' ? 'realitas digital.' : 'digital reality.',
    aboutDesc: language === 'id'
      ? 'Sebagai seorang siswa SMK yang penuh semangat, saya berfokus pada pengembangan strategi bisnis digital, pembuatan website modern, dan eksekusi marketing yang berbasis data.'
      : 'As an enthusiastic vocational student, I focus on developing digital business strategies, building modern websites, and executing data-driven marketing.',
    knowMore: language === 'id' ? 'Kenal Lebih Dekat' : 'Get to Know Me',
    featured: language === 'id' ? 'Proyek' : 'Projects',
    featuredTitle: language === 'id' ? 'Unggulan' : 'Featured',
    featuredDesc: language === 'id' ? 'Karya terbaik yang pernah saya kerjakan.' : 'Best works I have ever created.',
    viewAll: language === 'id' ? 'Lihat Semua' : 'View All',
    servicesTitle: language === 'id' ? 'Pilihan' : 'Available',
    servicesTitle2: language === 'id' ? 'Layanan' : 'Services',
    servicesDesc: language === 'id'
      ? 'Tingkatkan visibilitas dan performa bisnis Anda dengan paket layanan yang disesuaikan untuk kebutuhan Anda.'
      : 'Boost your business visibility and performance with tailored service packages for your needs.',
    servicesMore: language === 'id' ? 'Lihat detail layanan lengkap' : 'See full services details',
    testiTitle: language === 'id' ? 'Apa Kata' : 'What They',
    testiTitle2: language === 'id' ? 'Mereka' : 'Say',
    ctaTitle1: language === 'id' ? 'Siap ' : 'Ready to ',
    ctaTitle2: language === 'id' ? 'Berkolaborasi?' : 'Collaborate?',
    ctaDesc: language === 'id'
      ? 'Mari diskusikan ide Anda dan wujudkan menjadi produk digital yang luar biasa.'
      : "Let's discuss your ideas and turn them into remarkable digital products.",
    ctaButton: language === 'id' ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp',
  };

  const testimonials = language === 'id' ? [
    { name: "Client A", role: "Business Owner", text: "Kerja sama dengan Daffa sangat memuaskan. Website jadi lebih cepat dan desainnya premium." },
    { name: "Client B", role: "Startup Founder", text: "Strategi digital yang diberikan sangat on-point. Sangat merekomendasikan jasa Daffa." },
    { name: "Client C", role: "Content Creator", text: "Dashboard analytics yang dibuat sangat membantu saya memantau KPI. Thanks Daffa!" }
  ] : [
    { name: "Client A", role: "Business Owner", text: "Working with Daffa was very satisfying. The website became faster and the design is premium." },
    { name: "Client B", role: "Startup Founder", text: "The digital strategy provided was spot on. Highly recommend Daffa's services." },
    { name: "Client C", role: "Content Creator", text: "The analytics dashboard created really helps me monitor KPIs. Thanks Daffa!" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* 1. Hero Section */}
      <section className="relative pt-40 min-h-screen flex items-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-neon-green)]/20 rounded-full blur-[128px] -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-neon-blue)]/20 rounded-full blur-[128px] -z-10"></div>

        <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="text-[var(--color-neon-green)] font-bold tracking-widest uppercase text-sm mb-4 block animate-in fade-in slide-in-from-left-4 duration-500">
              {language === 'id' ? `Halo, Saya ${profile?.name || 'Daffa Rizky'} 👋` : `Hi, I'm ${profile?.name || 'Daffa Rizky'} 👋`}
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight text-gray-900 dark:text-white">
              {t.heroTitle} <br />
              <span className="text-gradient">
                {language === 'id' ? (profile?.title_id || 'Digital Business Strategist') : (profile?.title_en || 'Digital Business Strategist')}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-lg">
              {bio}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link href="/portfolio" className="rounded-full bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                {t.viewPortfolio}
              </Link>
              <Link href="/kontak" className="rounded-full bg-gradient-neon text-[#0A0A0F] px-8 py-3 font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 transition-all">
                Hire Me 🔥
              </Link>
              <a href="/cv.pdf" target="_blank" className="rounded-full border border-gray-300 dark:border-white/20 bg-white/50 dark:bg-transparent px-8 py-3 font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                {t.downloadCv}
              </a>
            </div>

            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-widest font-bold">{t.connect}</p>
              <SocialLinks />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <div>
                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {profile?.stats_projects || '4+'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.projects}</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {profile?.stats_tools || '10+'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.tools}</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {profile?.stats_passion || '∞'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.passion}</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-neon-blue)]/30 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border-2 border-[var(--color-neon-green)]/30 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 rounded-full overflow-hidden bg-gray-200/50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10">
                <Image
                  src={profile?.photo_url || "/foto.jpg"}
                  alt={profile?.name || "Daffa Rizky"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Snapshot */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-neon opacity-10 blur-3xl rounded-full"></div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              {t.aboutTitle1}<span className="text-gradient">{t.aboutTitle2}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              {t.aboutDesc}
            </p>
            <Link href="/tentang" className="text-[var(--color-neon-blue)] font-bold flex items-center gap-2 hover:gap-4 transition-all">
              {t.knowMore} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects */}
      {projects.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">{t.featuredTitle} <span className="text-gradient">{t.featured}</span></h2>
              <p className="text-gray-500 dark:text-gray-400">{t.featuredDesc}</p>
            </div>
            <Link href="/portfolio" className="hidden md:flex border border-gray-200 dark:border-white/20 bg-white dark:bg-transparent px-6 py-2 rounded-full font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              {t.viewAll}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/portfolio" className="border border-gray-200 dark:border-white/20 bg-white dark:bg-transparent px-6 py-3 rounded-full font-bold inline-block text-gray-700 dark:text-white">
              {t.viewAll} {t.featured}
            </Link>
          </div>
        </section>
      )}

      {/* 4. Services Preview */}
      {servicesData.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">{t.servicesTitle} <span className="text-gradient">{t.servicesTitle2}</span></h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.servicesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-4">
              {t.servicesMore}
            </Link>
          </div>
        </section>
      )}

      {/* 5. Testimonials */}
      <section className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 text-center text-gray-900 dark:text-white">{t.testiTitle} <span className="text-gradient">{t.testiTitle2}</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.length > 0 ? (
            testimonialsData.map((testi) => (
              <div key={testi.id} className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-8 rounded-2xl relative shadow-sm">
                <div className="text-4xl text-[var(--color-neon-blue)] opacity-50 absolute top-4 right-6 font-serif">"</div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6 relative z-10">
                  {language === 'id' ? testi.content_id : testi.content_en}
                </p>
                <div className="flex items-center gap-4">
                  {testi.avatar_url && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-white/10">
                      <img src={testi.avatar_url} alt={testi.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testi.name}</h4>
                    <p className="text-xs text-[var(--color-neon-green)]">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials.map((testi, i) => (
              <div key={i} className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-8 rounded-2xl relative shadow-sm">
                <div className="text-4xl text-[var(--color-neon-blue)] opacity-50 absolute top-4 right-6 font-serif">"</div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6 relative z-10">{testi.text}</p>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testi.name}</h4>
                  <p className="text-xs text-[var(--color-neon-green)]">{testi.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="bg-gradient-to-br from-[#00FF88]/20 to-[#0099FF]/20 p-1 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm -z-10"></div>
          <div className="bg-white/90 dark:bg-[#0A0A0F]/80 backdrop-blur-md rounded-3xl p-12 md:p-20 text-center relative z-10 border border-gray-200 dark:border-white/5">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              {t.ctaTitle1}<span className="text-gradient">{t.ctaTitle2}</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {t.ctaDesc}
            </p>
            <a
              href="https://wa.me/6281374936621?text=Halo%20Daffa,%20saya%20tertarik%20untuk%20berkolaborasi!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(37,211,102,0.4)]"
            >
              {t.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
