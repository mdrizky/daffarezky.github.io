'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import ServiceCard from "@/components/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/Skeleton";
import type { Service } from "@/types";
import { 
  FaComments, 
  FaDraftingCompass, 
  FaCode, 
  FaRocket, 
  FaHeadset, 
  FaCheckCircle, 
  FaQuestionCircle 
} from "react-icons/fa";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const defaultSvc: Service[] = [
      {
        id: "1",
        name_id: "Pengembangan Website Modern",
        name_en: "Modern Website Development",
        price: "Mulai dari Rp 1.500.000",
        description_id: "Website responsif, cepat, dan SEO-friendly menggunakan Next.js & Tailwind CSS.",
        description_en: "Responsive, ultra-fast, and SEO-optimized website built with Next.js & Tailwind CSS.",
        features_id: [
          "Landing Page & Company Profile",
          "Arsitektur Komponen Modern",
          "Optimasi Core Web Vitals & SEO",
          "Integrasi CMS / Supabase Backend",
          "Mobile & Tablet Responsive"
        ],
        features_en: [
          "Landing Page & Company Profile",
          "Modern Component Architecture",
          "Core Web Vitals & SEO Optimization",
          "Supabase / Headless CMS Integration",
          "Full Mobile & Tablet Responsiveness"
        ],
        is_popular: true
      },
      {
        id: "2",
        name_id: "Aplikasi Web & Dashboard Admin",
        name_en: "Web Applications & Admin Dashboards",
        price: "Mulai dari Rp 3.500.000",
        description_id: "Sistem aplikasi web interaktif, manajemen data internal, portal pengguna, dan dashboard analitik.",
        description_en: "Interactive web applications, internal data portals, user dashboards, and custom analytics tools.",
        features_id: [
          "Authentication & Role-Based Access Control",
          "CRUD Database Interaktif",
          "Visualisasi Data & Charts",
          "Integrasi REST / GraphQL API",
          "Export Data (PDF/Excel) & Notifikasi"
        ],
        features_en: [
          "Authentication & Role-Based Access Control",
          "Interactive Database CRUD",
          "Data Visualization & Charts",
          "REST / GraphQL API Integration",
          "Export Data (PDF/Excel) & Notifications"
        ],
        is_popular: false
      },
      {
        id: "3",
        name_id: "Solusi AI & Otomasi Sistem",
        name_en: "AI Solutions & System Automation",
        price: "Mulai dari Rp 4.500.000",
        description_id: "Integrasi kecerdasan buatan (LLM, computer vision) dan otomasi alur kerja digital.",
        description_en: "Integration of artificial intelligence (LLM, vision models) and intelligent workflow automation.",
        features_id: [
          "Integrasi OpenAI / Gemini API",
          "Chatbot Cerdas Berbasis Dokumen (RAG)",
          "Otomasi Bot & Web Scraping",
          "Pipeline Pemrosesan Data Cepat",
          "Monitoring & Maintenance Dukungan"
        ],
        features_en: [
          "OpenAI / Gemini API Integration",
          "Intelligent RAG Document Assistants",
          "Automation Bots & Scraping Pipelines",
          "High-performance Data Workflows",
          "Monitoring & Ongoing Support"
        ],
        is_popular: false
      }
    ];

    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from("services")
          .select("*")
          .order("sort_order", { ascending: true });

        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(defaultSvc);
        }
      } catch {
        setServices(defaultSvc);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const workflowSteps = [
    {
      step: "01",
      icon: FaComments,
      title_id: "Konsultasi & Penemuan",
      title_en: "Discovery & Consultation",
      desc_id: "Diskusi mendalam mengenai kebutuhan bisnis, target audiens, anggaran, dan timeline pengerjaan proyek.",
      desc_en: "In-depth discussion about business goals, target audience, budget, and project milestones."
    },
    {
      step: "02",
      icon: FaDraftingCompass,
      title_id: "Desain Arsitektur & UI/UX",
      title_en: "Architecture & UI/UX Design",
      desc_id: "Merancang wireframe, desain visual interaktif, skema database, dan flow pengguna yang efisien.",
      desc_en: "Crafting wireframes, interactive UI prototypes, database schemas, and intuitive user journeys."
    },
    {
      step: "03",
      icon: FaCode,
      title_id: "Pengembangan & Integrasi",
      title_en: "Development & Integration",
      desc_id: "Menulis kode bersih dengan stack teknologi modern, performa tinggi, aman, dan modular.",
      desc_en: "Writing clean, modular code with modern tech stacks focused on speed, security, and scalability."
    },
    {
      step: "04",
      icon: FaRocket,
      title_id: "Pengujian & Peluncuran",
      title_en: "Testing & Deployment",
      desc_id: "Quality assurance menyeluruh, optimasi performa dan SEO, lalu live deployment ke server produksi.",
      desc_en: "Rigorous QA testing, performance and SEO optimization, followed by production deployment."
    },
    {
      step: "05",
      icon: FaHeadset,
      title_id: "Dukungan & Pemeliharaan",
      title_en: "Support & Maintenance",
      desc_id: "Serah terima dokumentasi lengkap, panduan penggunaan, serta garansi revisi dan dukungan teknis.",
      desc_en: "Handover with comprehensive documentation, user guidelines, and dedicated maintenance support."
    }
  ];

  const faqs = [
    {
      q_id: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan satu project?",
      q_en: "How long does it take to complete a project?",
      a_id: "Untuk landing page atau company profile biasanya memakan waktu 3–7 hari kerja. Aplikasi web atau dashboard interaktif berkisar antara 2–4 minggu tergantung kompleksitas fitur.",
      a_en: "Landing pages and portfolios typically take 3–7 business days. Full web applications or dashboards take 2–4 weeks depending on feature complexity."
    },
    {
      q_id: "Bagaimana sistem pembayaran untuk pengerjaan freelance?",
      q_en: "What is the payment structure for projects?",
      a_id: "Skema standar menggunakan DP 50% di awal sebagai tanda komitmen, dan pelunasan 50% setelah proyek selesai diuji dan siap diluncurkan.",
      a_en: "Standard payment is 50% upfront deposit to initiate development, and the remaining 50% upon final review before production release."
    },
    {
      q_id: "Apakah website yang dibuat ramah SEO dan cepat diakses?",
      q_en: "Will the website be SEO-optimized and fast?",
      a_id: "Ya! Semua website dibangun menggunakan Next.js dengan arsitektur server-side rendering, meta tags lengkap, skor Core Web Vitals tinggi, dan gambar teroptimasi.",
      a_en: "Absolutely! All websites leverage Next.js SSR/SSG, complete OpenGraph meta tags, top Core Web Vitals scores, and responsive image compression."
    },
    {
      q_id: "Bisakah saya mengelola konten sendiri setelah website jadi?",
      q_en: "Can I manage website content myself after launch?",
      a_id: "Tentu! Proyek dapat diintegrasikan dengan sistem CMS atau dashboard admin Supabase yang mudah digunakan bahkan tanpa latar belakang teknis.",
      a_en: "Yes! Projects can be integrated with Supabase dashboard or custom CMS allowing you to update content effortlessly without coding."
    }
  ];

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen">
        <Container>
          <PageSkeleton />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">
            {language === 'id' ? 'Layanan Profesional' : 'Professional Services'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
            {language === 'id' ? 'Layanan & ' : 'Services & '}<span className="text-gradient">{language === 'id' ? 'Solusi Digital' : 'Digital Solutions'}</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {language === 'id'
              ? 'Membantu bisnis, UMKM, dan personal membangun identitas digital berkualitas tinggi dengan teknologi web terkini.'
              : 'Helping businesses, startups, and individuals build high-impact digital products powered by modern web tech.'}
          </p>
        </div>

        {/* Pricing & Service Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-28">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Process Section */}
        <div className="mb-28">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3">
              {language === 'id' ? 'Alur Kerja' : 'Workflow'}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              {language === 'id' ? 'Proses ' : 'How I '}<span className="text-gradient">{language === 'id' ? 'Kerja Sama' : 'Work'}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-4 text-base">
              {language === 'id'
                ? 'Langkah transparan dan terstruktur dari awal konsep hingga produk siap digunakan.'
                : 'A transparent, structured methodology from initial ideation to production launch.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
                  <div className="absolute top-3 right-4 text-3xl font-black text-muted/30 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </div>
                  <CardContent className="p-6 pt-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                      <Icon />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      {language === 'id' ? step.title_id : step.title_en}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'id' ? step.desc_id : step.desc_en}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Why Work With Me */}
        <div className="mb-28 bg-card border border-border rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="outline" className="mb-3">
                {language === 'id' ? 'Nilai Unggulan' : 'Core Values'}
              </Badge>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {language === 'id' ? 'Kenapa Memilih Bekerja Sama Dengan Saya?' : 'Why Partner With Me?'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'id'
                  ? 'Kombinasi kemampuan rekayasa perangkat lunak, perhatian terhadap estetika visual, serta komunikasi langsung tanpa perantara.'
                  : 'Combining software engineering precision with aesthetic visual design and clear, direct communication.'}
              </p>
              <Button href="/tentang" variant="outline">
                {language === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More About Me'}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title_id: 'Kode Bersih & Modern', title_en: 'Clean & Modern Code', desc_id: 'Mengikuti best practice industri untuk performa maksimal.', desc_en: 'Adheres to modern architecture and best coding standards.' },
                { title_id: 'Desain Responsif', title_en: 'Pixel Perfect & Responsive', desc_id: 'Tampilan sempurna di layar smartphone, tablet, hingga desktop.', desc_en: 'Flawless presentation on mobile, tablet, and desktop screens.' },
                { title_id: 'Komunikasi Proaktif', title_en: 'Proactive Communication', desc_id: 'Update progres berkala dan tanggap terhadap pertanyaan Anda.', desc_en: 'Regular milestone updates and prompt responsiveness.' },
                { title_id: 'Dukungan Pasca Rilis', title_en: 'Post-Launch Support', desc_id: 'Bantuan pemecahan kendala teknis setelah website online.', desc_en: 'Technical assistance and warranty after going live.' }
              ].map((val, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2 font-bold text-foreground">
                    <FaCheckCircle className="text-primary text-sm shrink-0" />
                    <span className="text-sm">{language === 'id' ? val.title_id : val.title_en}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'id' ? val.desc_id : val.desc_en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">FAQ</Badge>
            <h2 className="text-3xl font-heading font-bold text-foreground">
              {language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-start gap-3">
                  <FaQuestionCircle className="text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      {language === 'id' ? faq.q_id : faq.q_en}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'id' ? faq.a_id : faq.a_en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Project CTA */}
        <div className="text-center max-w-3xl mx-auto bg-card border border-border p-10 md:p-14 rounded-3xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-foreground">
            {language === 'id' ? 'Punya Kebutuhan atau Ide Proyek Khusus?' : 'Have a Custom Requirement or Unique Idea?'}
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            {language === 'id'
              ? 'Jika Anda membutuhkan layanan khusus di luar paket standar, mari kita diskusikan solusinya secara santai.'
              : 'If you need custom development beyond the standard packages, let’s talk and find the best tailored solution.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              href="https://wa.me/6281374936621?text=Halo%20Daffa,%20saya%20ingin%20konsultasi%20untuk%20kebutuhan%20custom%20bisnis%20saya"
              className="px-8 py-3"
            >
              {language === 'id' ? 'Konsultasi via WhatsApp' : 'Consult via WhatsApp'}
            </Button>
            <Button
              href="/kontak"
              variant="outline"
              className="px-8 py-3"
            >
              {language === 'id' ? 'Kirim Brief Proyek' : 'Send Project Brief'}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
