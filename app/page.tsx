'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import SocialLinks from "@/components/SocialLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import dynamic from 'next/dynamic'
import type { Profile, Project, Service } from "@/types";

const TestimonialCarousel = dynamic(() => import('@/components/TestimonialCarousel'), { ssr: false })
const PartnerSlider = dynamic(() => import('@/components/PartnerSlider'), { ssr: false })

export default function Home() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, servicesRes] = await Promise.all([
          supabase.from("profile").select("*").limit(1),
          supabase.from("projects").select("*").eq("featured", true).limit(3),
          supabase.from("services").select("*").order("price", { ascending: true }).limit(3),
        ]);

        if (profileRes.data && profileRes.data.length > 0) setProfile(profileRes.data[0]);
        if (projectsRes.data) setProjects(projectsRes.data);
        if (servicesRes.data) setServicesData(servicesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch current projects (is_current = true)
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchCurrentProjects = async () => {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("is_current", true)
          .limit(3);
        if (data) setCurrentProjects(data);
      } catch (error) {
        console.error("Error fetching current projects:", error);
      }
    };
    fetchCurrentProjects();
  }, []);

  const bio = language === 'id' 
    ? "Assalamualaikum......, saya Muhammad Daffa Rezky Adyra, Seorang Web & Mobile Developer muslim yang berfokus pada pengembangan website, aplikasi, dan solusi digital modern yang responsif, efisien, serta bermanfaat bagi pengguna. Saya memiliki ketertarikan yang besar terhadap teknologi, Internet of Things (IoT), dan inovasi yang mampu memberikan dampak nyata bagi masyarakat. Sebagai seorang muslim, saya meyakini bahwa teknologi bukan hanya alat untuk menciptakan kemajuan, tetapi juga sarana untuk menghadirkan manfaat, menebarkan kebaikan, dan menjadi bagian dari kontribusi positif bagi umat, bangsa, dan lingkungan sekitar. Oleh karena itu, saya terus berkomitmen untuk belajar, berkembang, dan berkarya dengan penuh integritas serta tanggung jawab."
    : "Greetings, I am Muhammad Daffa Rezky Adyra, a Muslim Web & Mobile Developer focused on developing modern, responsive, efficient, and useful digital solutions. I have a great interest in technology, Internet of Things (IoT), and innovations that can provide a real impact on society. As a Muslim, I believe that technology is not just a tool for progress, but also a means to bring benefits, spread goodness, and be part of a positive contribution to the ummah, nation, and environment. Therefore, I am committed to continuous learning, growing, and creating with full integrity and responsibility.";

  const t = {
    greeting: language === 'id' ? 'Freelance Web & Mobile Developer' : 'Freelance Web & Mobile Developer',
    heroTitle: language === 'id' ? "Membangun Solusi Digital" : "Building Modern",
    heroTitle2: language === 'id' ? "Modern dan Profesional" : "and Professional Digital Solutions",
    viewPortfolio: language === 'id' ? 'Lihat Karya Saya' : 'View My Work',
    downloadCv: language === 'id' ? 'Download CV' : 'Download CV',
    connect: language === 'id' ? 'Terhubung Dengan Saya' : 'Connect With Me',
    projects: language === 'id' ? 'Proyek' : 'Projects',
    tools: language === 'id' ? 'Teknologi' : 'Technologies',
    experience: language === 'id' ? 'Tahun Belajar' : 'Years Learning',
    aboutTitle1: language === 'id' ? 'Mengembangkan teknologi yang memberikan ' : 'Developing technology that provides ',
    aboutTitle2: language === 'id' ? 'manfaat bagi masyarakat dan umat.' : 'benefits for society and the ummah.',
    aboutDesc: language === 'id'
      ? 'Saya adalah Web & Mobile Developer yang berfokus pada pengembangan website, aplikasi, dan solusi digital modern. Saya senang membangun teknologi yang cepat, responsif, dan memberikan pengalaman terbaik bagi pengguna.'
      : 'I am a Web & Mobile Developer focused on developing websites, applications, and modern digital solutions. I enjoy building fast, responsive technology that provides the best user experience.',
    knowMore: language === 'id' ? 'Kenal Lebih Dekat' : 'Get to Know Me',
    featured: language === 'id' ? 'Proyek' : 'Projects',
    featuredTitle: language === 'id' ? 'Unggulan' : 'Featured',
    featuredDesc: language === 'id' ? 'Karya terbaik yang pernah saya kerjakan.' : 'Best works I have ever created.',
    viewAll: language === 'id' ? 'Lihat Semua' : 'View All',
    servicesTitle: language === 'id' ? 'Pilihan' : 'Available',
    servicesTitle2: language === 'id' ? 'Layanan' : 'Services',
    servicesDesc: language === 'id'
      ? 'Layanan development profesional untuk website, aplikasi mobile, dan solusi teknologi kustom dengan teknologi modern.'
      : 'Professional development services for websites, mobile apps, and custom tech solutions with modern technology.',
    servicesMore: language === 'id' ? 'Lihat detail layanan lengkap' : 'See full services details',
    testiTitle: language === 'id' ? 'Apa Kata' : 'What They',
    testiTitle2: language === 'id' ? 'Mereka' : 'Say',
    ctaTitle1: language === 'id' ? 'Mari Bangun Solusi Digital ' : 'Let\'s Build Digital Solutions ',
    ctaTitle2: language === 'id' ? 'yang Berdampak' : 'that Impact',
    ctaDesc: language === 'id'
      ? 'Mari diskusikan kebutuhan Anda dan bangun solusi digital yang modern, cepat, dan bermanfaat untuk mendukung pertumbuhan bisnis maupun organisasi Anda.'
      : "Let's discuss your needs and build modern, fast, and beneficial digital solutions to support the growth of your business or organization.",
    ctaButton: language === 'id' ? 'Mulai Konsultasi' : 'Start Consultation',
    currentProjects: language === 'id' ? 'Sedang Dikerjakan' : 'Currently Working',
    currentProjectsDesc: language === 'id' ? 'Project yang sedang saya kerjakan saat ini.' : 'Projects I am currently working on.',
    viewDetails: language === 'id' ? 'Lihat Detail' : 'View Details',
    progress: language === 'id' ? 'Progres' : 'Progress',
    valueTitle: language === 'id' ? 'Mengapa Bekerja Sama Dengan Saya?' : 'Why Work With Me?',
    value1: language === 'id' ? 'Website Responsif' : 'Responsive Website',
    value2: language === 'id' ? 'Optimasi SEO Dasar' : 'Basic SEO Optimization',
    value3: language === 'id' ? 'UI/UX Modern' : 'Modern UI/UX',
    value4: language === 'id' ? 'Performa Cepat' : 'Fast Performance',
    value5: language === 'id' ? 'Dukungan Setelah Proyek Selesai' : 'Post-Project Support',
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

  // Calculate years of learning dynamically
  const [yearsOfLearning, setYearsOfLearning] = useState(3);
  useEffect(() => {
    const baseYear = 2026;
    const baseYears = 3;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11, June is 5
    
    let years = baseYears + (currentYear - baseYear);
    if (currentMonth < 5) { // Before June
      years--;
    }
    setYearsOfLearning(Math.max(baseYears, years));
  }, []);

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
              {t.greeting}
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
              {t.heroTitle} <br />
              <span className="text-gradient">
                {t.heroTitle2}
              </span>
            </h1>
            <p className="text-muted dark:text-gray-400 text-lg md:text-xl max-w-lg">
              {bio}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link href="/portfolio" className="rounded-full bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                {t.viewPortfolio}
              </Link>
              <Link href="https://wa.me/628123456789" className="rounded-full bg-gradient-neon text-[#0A0A0F] px-8 py-3 font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 transition-all">
                Hubungi Saya
              </Link>
              <Link href="/cv" className="rounded-full border border-gray-300 dark:border-white/20 bg-white/50 dark:bg-transparent px-8 py-3 font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                {t.downloadCv}
              </Link>
            </div>

            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-widest font-bold">{t.connect}</p>
              <SocialLinks />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <div>
                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {profile?.stats_projects || '4'}+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.projects}</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {profile?.stats_tools || '10'}+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.tools}</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {yearsOfLearning}+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.experience}</div>
              </div>
            </div>
          </div>{/* end left column */}

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
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-gray-900 dark:text-white leading-tight">
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

      {/* 3. Value Proposition */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.valueTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { text: t.value1, icon: "✅" },
            { text: t.value2, icon: "✅" },
            { text: t.value3, icon: "✅" },
            { text: t.value4, icon: "✅" },
            { text: t.value5, icon: "✅" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-6 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-[var(--color-neon-green)]/50 transition-all group">
              <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Current Projects Section */}
      {currentProjects.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
                {t.currentProjects}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{t.currentProjectsDesc}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-neon-green)]/50 transition-colors shadow-sm">
                <div className="relative aspect-video">
                  <Image
                    src={project.image_url}
                    alt={language === 'id' ? project.title_id : project.title_en}
                    fill
                    className="object-cover"
                  />
                  {project.is_current && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--color-neon-green)] text-black text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                      {t.currentProjects}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {language === 'id' ? project.title_id : project.title_en}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {language === 'id' ? project.description_id : project.description_en}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.progress}</span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          project.progress === 100 ? 'bg-green-500' : 
                          project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/portfolio/${project.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-neon-blue)] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t.viewDetails} <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

      {/* 5. Testimonials — Embla Carousel */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {t.testiTitle} <span className="text-gradient">{t.testiTitle2}</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {language === 'id' ? 'Apa yang mereka katakan tentang pengalaman bekerja sama dengan saya.' : 'What they say about their experience working with me.'}
          </p>
        </div>
        <TestimonialCarousel />
      </section>

      {/* 6. Partner Slider */}
      <section className="container mx-auto px-6 md:px-12">
        <PartnerSlider language={language} />
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="relative rounded-[40px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-green)] opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-neon-green)] rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--color-neon-blue)] rounded-full blur-[120px] opacity-20"></div>
          
          <div className="relative backdrop-blur-3xl border border-white/10 p-12 md:p-24 text-center">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-gray-900 dark:text-white leading-tight">
              {t.ctaTitle1}<br />
              <span className="text-gradient">{t.ctaTitle2}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              {t.ctaDesc}
            </p>
            <Link 
              href="https://wa.me/628123456789"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-neon px-10 py-5 text-lg font-bold text-[#0A0A0F] shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-105 transition-all"
            >
              {t.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
