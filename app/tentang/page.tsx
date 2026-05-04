import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { FaGraduationCap, FaBriefcase, FaFileDownload } from "react-icons/fa";
import type { Profile, Certificate } from "@/types";

export const revalidate = 3600;

export default async function TentangPage() {
  const supabase = await createClient();
  const { data: profileData } = await supabase.from("profile").select("*").single();
  const { data: certificatesData } = await supabase.from("certificates").select("*");

  const profile = profileData as Profile;
  const certificates = certificatesData as Certificate[] || [];

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Tentang <span className="text-gradient">Saya</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Mengenal lebih dekat siapa di balik layar, perjalanan, dan visi saya di dunia digital.
          </p>
        </div>

        {/* Profile Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass p-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-neon-blue)]/20 to-transparent mix-blend-overlay z-10"></div>
              <Image
                src={profile?.photo_url || "/foto.jpg"}
                alt="Daffa Rizky"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--color-neon-green)] blur-[64px] opacity-30 -z-10"></div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-3xl font-heading font-bold">
              Hi, saya <span className="text-white">Daffa Rizky</span> 👋
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              {profile?.bio ? (
                <p>{profile.bio}</p>
              ) : (
                <>
                  <p>
                    Saya adalah seorang siswa SMK jurusan Bisnis Digital yang memiliki passion mendalam terhadap teknologi, pengembangan website, dan strategi pemasaran di era modern.
                  </p>
                  <p>
                    Bagi saya, digital marketing bukan hanya tentang membuat iklan, melainkan memahami perilaku audiens, membangun brand identity yang kuat, dan menciptakan konversi melalui UI/UX yang tepat.
                  </p>
                </>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-xl mb-4 text-[var(--color-neon-blue)]">Mengapa Memilih Saya?</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Fokus pada ROI & Konversi",
                  "Desain Premium & Modern",
                  "Up-to-date dengan tren AI",
                  "Komunikasi & Delivery Cepat"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-[var(--color-neon-green)]">✦</span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Pendidikan */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 glass rounded-xl text-[var(--color-neon-green)]">
                <FaGraduationCap size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold">Pendidikan</h2>
            </div>
            
            <div className="relative border-l border-white/10 pl-8 pb-8">
              <div className="absolute w-4 h-4 rounded-full bg-[var(--color-neon-green)] -left-[8px] top-1 shadow-[0_0_10px_rgba(0,255,136,0.8)]"></div>
              <span className="text-[var(--color-neon-green)] text-sm font-bold tracking-wider">SEDANG BERJALAN</span>
              <h3 className="text-xl font-bold mt-2 mb-1">Sekolah Menengah Kejuruan (SMK)</h3>
              <p className="text-gray-400">Jurusan Bisnis Digital. Fokus pada Pemasaran Online, E-Commerce, dan Administrasi Bisnis.</p>
            </div>
          </div>

          {/* Learning Journey */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 glass rounded-xl text-[var(--color-neon-blue)]">
                <FaBriefcase size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold">Learning Journey</h2>
            </div>
            
            <div className="space-y-8">
              {[
                { year: "2024", title: "Branding & Positioning", desc: "Mempelajari dasar-dasar membangun identitas brand yang kuat." },
                { year: "2024", title: "Content & Funnel Strategy", desc: "Membuat alur akuisisi pelanggan dari konten organik hingga konversi." },
                { year: "2025", title: "KPI Dashboard & Analytics", desc: "Eksplorasi Looker Studio dan Google Analytics untuk tracking data." },
                { year: "2025", title: "SEO & Blog Strategy", desc: "Optimalisasi on-page SEO dan keyword research." },
                { year: "2026", title: "AI Workflow & Super App", desc: "Automasi menggunakan n8n, ChatGPT, dan integrasi AI ke dalam produk." }
              ].map((item, i) => (
                <div key={i} className="relative border-l border-white/10 pl-8">
                  <div className="absolute w-3 h-3 rounded-full bg-[var(--color-neon-blue)] -left-[6px] top-1.5"></div>
                  <span className="text-[var(--color-neon-blue)] text-sm font-bold">{item.year}</span>
                  <h3 className="text-lg font-bold mt-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sertifikat */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 text-center">Sertifikat & <span className="text-gradient">Penghargaan</span></h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(certificates.length > 0 ? certificates : [
              { id: "1", title: "Sertifikat Tasheel", issuer: "Tasheel", file_url: "#", date_issued: "2024" },
              { id: "2", title: "Surat Rekomendasi Tasheel", issuer: "Tasheel", file_url: "#", date_issued: "2024" },
              { id: "3", title: "Dicoding: Financial Literacy", issuer: "Dicoding", file_url: "#", date_issued: "2025" },
              { id: "4", title: "Sertifikat Kompetensi", issuer: "LSP", file_url: "#", date_issued: "2026" }
            ]).map((cert) => (
              <div key={cert.id} className="glass p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[var(--color-neon-green)]/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[var(--color-neon-green)] group-hover:scale-110 transition-transform">
                  <FaFileDownload size={24} />
                </div>
                <h3 className="font-bold mb-1">{cert.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{cert.issuer} • {cert.date_issued}</p>
                <a 
                  href={cert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-sm text-[var(--color-neon-blue)] hover:text-white transition-colors"
                >
                  Lihat PDF
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center glass p-12 rounded-3xl">
          <h2 className="text-3xl font-heading font-bold mb-4">Tertarik Bekerja Sama?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Jangan ragu untuk menghubungi saya jika Anda butuh bantuan dalam membangun produk digital atau merumuskan strategi bisnis Anda.
          </p>
          <Link href="/kontak" className="inline-block bg-gradient-neon text-[#0A0A0F] px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:scale-105 transition-transform">
            Hubungi Saya
          </Link>
        </div>
      </div>
    </div>
  );
}
