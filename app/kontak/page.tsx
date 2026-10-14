import ContactForm from "./ContactForm";
import SocialMediaGrid from "@/components/SocialMediaGrid";
import { Container } from "@/components/ui/Container";
import { 
  FaEnvelope, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCode, 
  FaCheckCircle, 
  FaArrowRight 
} from "react-icons/fa";

export const metadata = {
  title: "Kontak & Diskusi Proyek | Daffa Rezky",
  description: "Hubungi Muhammad Daffa Rezky Adyra untuk mendiskusikan kebutuhan pengembangan website, aplikasi mobile, integrasi API, atau konsultasi teknologi.",
};

export default function KontakPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-sm">
            <span>KONSULTASI & KOLABORASI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-4">
            Mari Bicara Tentang Proyek Anda
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            Tersedia untuk proyek freelance remote, pengembangan aplikasi web & mobile, dashboard sistem, dan solusi digital yang terukur. Respons cepat dalam 1x24 jam kerja.
          </p>
        </div>

        {/* Main Grid: Left Communication Hub (5 cols) + Right Project Form (7 cols) */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Direct Channels, Availability & Working Cadence */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in">
            {/* Live Availability Status Card */}
            <div className="p-5 md:p-6 rounded-2xl bg-card/70 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800/80 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Status Ketersediaan
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                Menerima Proyek Freelance & Kontrak Baru
              </p>
              <div className="mt-3 pt-3 border-t border-border/50 dark:border-zinc-800 flex items-center gap-2 text-xs text-muted-foreground">
                <FaClock className="text-cyan-400" />
                <span>Zona Waktu: WIB (UTC+7) • Jember, Indonesia</span>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/6281374936621"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-card/60 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800/80 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium">WhatsApp Langsung</span>
                    <span className="block text-sm md:text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                      +62 813-7493-6621
                    </span>
                  </div>
                </div>
                <FaArrowRight className="text-xs text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </a>

              {/* Email Card */}
              <a
                href="mailto:daffarezky99@gmail.com"
                className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-card/60 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800/80 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                    <FaEnvelope />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs text-muted-foreground font-medium">Email Profesional</span>
                    <span className="block text-sm md:text-base font-bold text-foreground truncate group-hover:text-cyan-400 transition-colors">
                      daffarezky99@gmail.com
                    </span>
                  </div>
                </div>
                <FaArrowRight className="text-xs text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </a>
            </div>

            {/* Professional Workflow Commitments */}
            <div className="p-5 md:p-6 rounded-2xl bg-card/40 dark:bg-zinc-900/40 border border-border/60 dark:border-zinc-800/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Komitmen Kolaborasi
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-cyan-400 text-xs mt-1 shrink-0" />
                  <span><strong>Komunikasi Terbuka & Berkala:</strong> Update progress mingguan / sprint via WhatsApp & GitHub.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-cyan-400 text-xs mt-1 shrink-0" />
                  <span><strong>Milestone & Hasil Nyata:</strong> Pengerjaan berorientasi tahapan fungsional siap pakai.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-cyan-400 text-xs mt-1 shrink-0" />
                  <span><strong>Kode Bersih & Terdokumentasi:</strong> Mudah dirawat, scalable, dan transparan.</span>
                </li>
              </ul>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                Koneksi & Media Sosial
              </span>
              <SocialMediaGrid />
            </div>
          </div>

          {/* Right Column: Premium Project Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 animate-fade-in">
            <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-card/70 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800/80 shadow-xl backdrop-blur-md">
              <div className="mb-6 pb-4 border-b border-border/60 dark:border-zinc-800">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground mb-1">
                  Kirim Pesan / Brief Proyek
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Ceritakan ide, kebutuhan fitur, atau pertanyaan Anda. Saya akan mempelajari brief dan membalas dengan estimasi solusi.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
