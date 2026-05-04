import ContactForm from "./ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { FaClock, FaGift, FaUserCheck } from "react-icons/fa";

export const metadata = {
  title: "Kontak | Daffa Rizky",
  description: "Hubungi Daffa Rizky untuk mendiskusikan project, kolaborasi, atau sekadar menyapa.",
};

export default function KontakPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column - Info */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Ada Project? <br />
              <span className="text-gradient">Let's Talk! 🔥</span>
            </h1>
            <p className="text-gray-400 text-lg mb-12">
              Jangan ragu untuk menghubungi saya. Saya selalu terbuka untuk mendiskusikan project baru, ide kreatif, atau peluang kolaborasi.
            </p>

            <div className="flex flex-col gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-[var(--color-neon-green)]">
                  <FaClock size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Balas dalam 2 jam</h4>
                  <p className="text-sm text-gray-500">Fast response pada jam kerja</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-[var(--color-neon-blue)]">
                  <FaGift size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Konsultasi Gratis</h4>
                  <p className="text-sm text-gray-500">Diskusi awal tanpa biaya</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white">
                  <FaUserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Slot Terbatas</h4>
                  <p className="text-sm text-gray-500">Hanya menerima 2-3 project per bulan</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">Atau hubungi via sosmed:</h3>
              <SocialLinks variant="with-label" className="flex-col !items-start gap-4" />
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="glass p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-blue)] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
              <h3 className="text-2xl font-bold mb-8">Kirim Pesan Langsung</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
