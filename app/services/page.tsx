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
  FaQuestionCircle,
  FaLightbulb,
  FaPlusCircle,
  FaShieldAlt
} from "react-icons/fa";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const defaultSvc: Service[] = [
      {
        id: "1",
        name_id: "Paket Website Modern & Landing Page",
        name_en: "Modern Website & Landing Page Package",
        price: "Mulai dari Rp 1.500.000",
        timeline: "3 – 5 Hari",
        target_client_id: "UMKM, bisnis lokal, toko (seperti bisnis perhiasan/retail), atau personal branding yang ingin go-digital secara profesional.",
        target_client_en: "MSMEs, local businesses, retail shops, or personal branding looking to establish a professional digital presence.",
        description_id: "Sangat cepat berkat efisiensi AI. Website modern, estetik, dan responsif sempurna di semua perangkat.",
        description_en: "Ultra-fast execution driven by AI efficiency. Modern, aesthetic, and fully responsive across all devices.",
        features_id: [
          "Desain Landing Page / Company Profile yang modern, estetik, dan responsif (HP, tablet, PC)",
          "Struktur kode optimal menggunakan teknologi web modern (Next.js / Tailwind CSS)",
          "Optimasi kecepatan muat (Core Web Vitals) dan dasar SEO agar mudah terindeks Google",
          "Integrasi tombol aksi cepat (WhatsApp chat, formulir kontak, atau media sosial)",
          "Gratis setup domain/hosting awal (Vercel/Netlify/Cloud pilihan klien)",
          "Bonus: 1x sesi revisi minor setelah preview pertama"
        ],
        features_en: [
          "Modern, aesthetic, and responsive Landing Page / Company Profile design (mobile, tablet, PC)",
          "Clean code architecture with modern web tech (Next.js / Tailwind CSS)",
          "Core Web Vitals & basic SEO optimization for Google indexing",
          "Quick action integration (WhatsApp chat, contact form, or social links)",
          "Free initial domain/hosting deployment (Vercel/Netlify/Cloud)",
          "Bonus: 1x minor revision session after initial preview"
        ],
        is_popular: true,
        badge_text: "Paling Laku / Best Seller"
      },
      {
        id: "2",
        name_id: "Paket Aplikasi Web & Dashboard Admin",
        name_en: "Web App & Admin Dashboard Package",
        price: "Mulai dari Rp 3.500.000",
        timeline: "1 – 2 Minggu",
        target_client_id: "Bisnis yang membutuhkan sistem operasional internal, manajemen inventaris barang, portal pencatatan transaksi, atau manajemen data khusus.",
        target_client_en: "Businesses requiring internal operational systems, inventory management, transaction portals, or dedicated data workflows.",
        description_id: "Custom system terstruktur untuk mengelola operasional, database interaktif, dan visualisasi grafik.",
        description_en: "Custom structured system for operational control, interactive databases, and real-time visual analytics.",
        features_id: [
          "Sistem Otentikasi Aman (Login/Register berjenjang Role-Based Access Control Admin & Pengguna)",
          "Database Interaktif (CRUD lengkap kelola data produk, pesanan, atau user real-time)",
          "Dashboard Analitik dengan visualisasi grafik/tabel data interaktif",
          "Backend kuat dan aman (Laravel / Node.js / Database terstruktur)",
          "Fitur ekspor laporan penting (format Excel / PDF)",
          "Bonus: Akses live staging link eksklusif untuk memantau progres langsung"
        ],
        features_en: [
          "Secure Auth System (Role-Based Access Control for Admins & Users)",
          "Interactive Database (Full CRUD to manage products, orders, or users in real-time)",
          "Interactive Analytics Dashboard with data charts & tables",
          "Robust & secure backend (Laravel / Node.js / structured DB)",
          "Crucial report exports (Excel / PDF format)",
          "Bonus: Exclusive live staging link to track real-time dev progress"
        ],
        is_popular: false
      },
      {
        id: "3",
        name_id: "Paket Solusi AI & Integrasi Sistem Cerdas",
        name_en: "AI Solutions & Smart System Integration",
        price: "Mulai dari Rp 4.500.000+",
        timeline: "1 – 2 Minggu",
        target_client_id: "Perusahaan atau klien progresif yang ingin mengintegrasikan teknologi kecerdasan buatan, otomasi alur kerja, atau chatbot cerdas ke dalam sistem mereka.",
        target_client_en: "Forward-thinking companies looking to integrate AI technology, workflow automation, or intelligent chatbots.",
        description_id: "Next-gen solution dengan implementasi LLM, otomasi alur kerja digital, dan skrip scraping kilat.",
        description_en: "Next-gen solution featuring LLM integration, digital workflow automation, and fast data processing pipelines.",
        features_id: [
          "Integrasi API Kecerdasan Buatan (OpenAI GPT, Gemini API, atau Smart Chatbot RAG)",
          "Sistem otomasi alur kerja digital atau skrip web scraping otomatis untuk efisiensi data",
          "Pipeline pemrosesan data kilat dan aman",
          "Dokumentasi teknis lengkap dan panduan pengoperasian bagi admin klien",
          "Garansi pemeliharaan dan bug fixing pasca-peluncuran selama 1 bulan penuh"
        ],
        features_en: [
          "AI API Integration (OpenAI GPT, Gemini API, or RAG-based Smart Chatbot)",
          "Digital workflow automation or automated web scraping scripts for data efficiency",
          "Ultra-fast and secure data processing pipelines",
          "Comprehensive technical documentation and client admin user guide",
          "Full 1-month post-launch warranty and bug-fixing support"
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
          // Merge with default detailed metadata if missing
          const merged = data.map((item, idx) => ({
            ...defaultSvc[idx % defaultSvc.length],
            ...item
          }));
          setServices(merged);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Tips Rahasia Menakar Harga & Transparansi Kolaborasi */}
        <div className="mb-28 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <Badge variant="outline" className="mb-3">
              {language === 'id' ? 'Transparansi Biaya' : 'Cost Transparency'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
              {language === 'id' ? 'Tips Rahasia Programmer Menakar Harga & Kerjasama' : 'Pricing Principles & Collaboration Guidelines'}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'id'
                ? 'Pedoman transparan dalam penentuan nilai investasi proyek, efisiensi AI, penambahan add-on, dan skema pembayaran aman.'
                : 'Transparent guidelines on project investment, AI efficiency, optional add-ons, and secure payment milestones.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg mb-4">
                  <FaLightbulb />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {language === 'id' ? '1. Psikologi Angka & Nilai Bisnis' : '1. Business Value & AI Efficiency'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'id'
                    ? 'Harga sangat kompetitif untuk pasar Indonesia, namun tetap menguntungkan Anda karena waktu pengerjaan terpangkas jauh (hanya hitungan hari) berkat bantuan efisiensi AI modern.'
                    : 'Highly competitive pricing for the market while maintaining top-notch delivery speed (in days) using modern AI-assisted engineering.'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg mb-4">
                  <FaPlusCircle />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {language === 'id' ? '2. Sistem Add-on Tambahan' : '2. Flexible Add-on System'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'id'
                    ? 'Jika klien meminta fitur ekstra di luar paket utama (misalnya: integrasi payment gateway tambahan, multi-bahasa, dll), tetapkan biaya tambahan terpisah (misal: +Rp 300.000 s.d. Rp 500.000 per fitur tambahan).'
                    : 'If you need extra features beyond the primary package (e.g. payment gateway, multilingual), fixed add-on pricing applies (+Rp 300k - Rp 500k per feature).'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg mb-4">
                  <FaShieldAlt />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {language === 'id' ? '3. Skema Pembayaran Aman' : '3. Secure Milestone Payments'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'id'
                    ? 'Selalu terapkan sistem DP (Uang Muka) minimal 50% di awal sebelum penulisan kode dimulai, dan sisa 50% dilunasi setelah proyek selesai dan lolos uji coba di server staging.'
                    : '50% initial down payment prior to development kickoff, with final 50% released after completion and staging verification.'}
                </p>
              </div>
            </div>
          </div>
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
