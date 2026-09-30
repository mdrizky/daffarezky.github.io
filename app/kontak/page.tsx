import ContactForm from "./ContactForm";
import SocialMediaGrid from "@/components/SocialMediaGrid";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { FaClock, FaGift, FaUserCheck, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "Kontak | Daffa Rizky",
  description: "Hubungi Daffa Rizky untuk mendiskusikan project, kolaborasi, konsultasi web & aplikasi, atau sekadar bertukar ide.",
};

export default function KontakPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="mb-4">Hubungi Saya</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground tracking-tight">
            Ada Proyek? <br />
            <span className="text-gradient">Mari Berkolaborasi! 🔥</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Saya selalu terbuka untuk mendiskusikan ide produk baru, pembuatan website UMKM hingga sistem perusahaan, otomatisasi kerja, atau konsultasi teknologi.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contacts, Value Props & Social Media Hub */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
            {/* Direct Quick Channels */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Jalur Cepat Langsung</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tersedia untuk Diskusi
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="https://wa.me/6281374936621"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-semibold text-sm hover:bg-[#25D366]/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                    <FaWhatsapp />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-normal opacity-80 text-foreground">WhatsApp Chat</span>
                    <span className="truncate block font-bold">+62 813-7493-6621</span>
                  </div>
                </a>

                <a
                  href="mailto:daffarezky99@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-semibold text-sm hover:bg-primary/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                    <FaEnvelope />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-normal opacity-80 text-foreground">Email Pribadi</span>
                    <span className="truncate block font-bold text-xs sm:text-sm">daffarezky99@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media Grid Section (Rapih & Terstruktur) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">Sosial Media & Jaringan</h3>
                  <p className="text-xs text-muted-foreground">Kunjungi akun media sosial saya untuk melihat karya, postingan, dan update terbaru.</p>
                </div>
              </div>
              <SocialMediaGrid />
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Card className="bg-card/60 border-border/80">
                <CardContent className="p-4 flex flex-col items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                    <FaClock />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Respon Cepat</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Balasan dalam waktu &lt; 2 jam kerja.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-border/80">
                <CardContent className="p-4 flex flex-col items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                    <FaGift />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Konsultasi Gratis</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Estimasi biaya & solusi tanpa komitmen.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-border/80">
                <CardContent className="p-4 flex flex-col items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                    <FaUserCheck />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Fokus Kualitas</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Pengerjaan detail dan transparan.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-6 duration-700">
            <Card className="p-6 md:p-8 shadow-xl bg-card border-border sticky top-28">
              <h3 className="text-2xl font-bold font-heading mb-2 text-foreground">Kirim Pesan Langsung</h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-6 leading-relaxed">
                Punya pertanyaan atau ingin mengajukan proyek? Tulis pesan di bawah dan saya akan langsung membalas ke email/WhatsApp Anda.
              </p>
              <ContactForm />
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
