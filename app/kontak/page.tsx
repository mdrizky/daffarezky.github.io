import ContactForm from "./ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { FaClock, FaGift, FaUserCheck, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "Kontak | Daffa Rizky",
  description: "Hubungi Daffa Rizky untuk mendiskusikan project, kolaborasi, atau sekadar menyapa.",
};

export default function KontakPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
          {/* Left Column - Info */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge variant="outline" className="mb-4">Hubungi Saya</Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
              Ada Proyek? <br />
              <span className="text-gradient">Mari Berkolaborasi! 🔥</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Saya selalu terbuka untuk mendiskusikan ide produk baru, transformasi web modern, konsultasi teknis, atau penawaran kerja sama profesional.
            </p>

            <div className="space-y-4 mb-10">
              <Card className="bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Respon Cepat</h4>
                    <p className="text-sm text-muted-foreground">Rata-rata balasan dalam waktu &lt; 2 jam kerja</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                    <FaGift />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Konsultasi Awal Gratis</h4>
                    <p className="text-sm text-muted-foreground">Diskusi ide arsitektur dan estimasi biaya tanpa ikatan</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                    <FaUserCheck />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Kualitas Prioritas</h4>
                    <p className="text-sm text-muted-foreground">Hanya menerima 2–3 proyek pilihan per bulan untuk fokus penuh</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Direct Channels */}
            <div className="mb-10 space-y-3">
              <h3 className="font-bold text-base text-foreground uppercase tracking-wider text-xs">Jalur Cepat Langsung</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/6281374936621"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-semibold text-sm hover:bg-[#25D366]/20 transition-colors"
                >
                  <FaWhatsapp /> +62 813-7493-6621
                </a>
                <a
                  href="mailto:daffarezky99@gmail.com"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-semibold text-sm hover:bg-primary/20 transition-colors"
                >
                  <FaEnvelope /> daffarezky99@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-foreground">Sosial Media:</h3>
              <SocialLinks variant="with-label" className="flex-col !items-start gap-3" />
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <Card className="p-6 md:p-10 shadow-xl bg-card border-border">
              <h3 className="text-2xl font-bold font-heading mb-2 text-foreground">Kirim Pesan Langsung</h3>
              <p className="text-muted-foreground text-sm mb-8">
                Isi form di bawah ini dan pesan akan langsung diteruskan ke inbox & notifikasi saya.
              </p>
              <ContactForm />
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
