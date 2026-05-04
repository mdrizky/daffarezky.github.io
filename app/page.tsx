import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import SocialLinks from "@/components/SocialLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import type { Profile, Project, Service } from "@/types";

export const revalidate = 3600; // revalidate every hour

export default async function Home() {
  const supabase = await createClient();

  // Fetch Data
  const { data: profileData } = await supabase.from("profile").select("*").single();
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .limit(3);
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("price", { ascending: true })
    .limit(3);

  const profile = profileData as Profile;
  const projects = featuredProjects as Project[] || [];
  const servicesData = services as Service[] || [];

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* 1. Hero Section */}
      <section className="relative pt-40 min-h-screen flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-neon-green)]/20 rounded-full blur-[128px] -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-neon-blue)]/20 rounded-full blur-[128px] -z-10"></div>

        <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-[var(--color-neon-green)] font-bold tracking-wider uppercase">
              Halo, Saya Daffa Rizky 👋
            </h2>
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
              I'm a <br />
              <span className="text-gradient">
                Digital Business Strategist
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg">
              {profile?.bio || "Membantu brand dan bisnis bertransformasi di era digital melalui strategi yang tepat, desain yang memukau, dan eksekusi yang terukur."}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link href="/portfolio" className="rounded-full bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition-colors">
                Lihat Portfolio
              </Link>
              <Link href="/kontak" className="rounded-full bg-gradient-neon text-[#0A0A0F] px-8 py-3 font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 transition-all">
                Hire Me 🔥
              </Link>
              <a href="/cv.pdf" target="_blank" className="rounded-full glass px-8 py-3 font-bold hover:bg-white/10 transition-colors">
                Download CV
              </a>
            </div>

            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-widest font-bold">Connect With Me</p>
              <SocialLinks />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-heading font-bold text-white">4+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-white">10+</div>
                <div className="text-sm text-gray-400">Tools</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-white">∞</div>
                <div className="text-sm text-gray-400">Passion</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-neon-blue)]/30 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border-2 border-[var(--color-neon-green)]/30 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 rounded-full overflow-hidden bg-black/50 glass">
                <Image
                  src={profile?.photo_url || "/foto.jpg"}
                  alt="Daffa Rizky"
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
        <div className="glass rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-neon opacity-10 blur-3xl rounded-full"></div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Turning ideas into <span className="text-gradient">digital reality.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Sebagai seorang siswa SMK yang penuh semangat, saya berfokus pada pengembangan strategi bisnis digital, pembuatan website modern, dan eksekusi marketing yang berbasis data.
            </p>
            <Link href="/tentang" className="text-[var(--color-neon-blue)] font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Kenal Lebih Dekat <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects */}
      {projects.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Featured <span className="text-gradient">Projects</span></h2>
              <p className="text-gray-400">Karya terbaik yang pernah saya kerjakan.</p>
            </div>
            <Link href="/portfolio" className="hidden md:flex glass px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors">
              Lihat Semua
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/portfolio" className="glass px-6 py-3 rounded-full font-bold inline-block">
              Lihat Semua Projects
            </Link>
          </div>
        </section>
      )}

      {/* 4. Services Preview */}
      {servicesData.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Pilihan <span className="text-gradient">Layanan</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Tingkatkan visibilitas dan performa bisnis Anda dengan paket layanan yang disesuaikan untuk kebutuhan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/services" className="text-gray-400 hover:text-white transition-colors underline underline-offset-4">
              Lihat detail layanan lengkap
            </Link>
          </div>
        </section>
      )}

      {/* 5. Testimonials (Hardcoded) */}
      <section className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 text-center">Apa Kata <span className="text-gradient">Mereka</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Client A", role: "Business Owner", text: "Kerja sama dengan Daffa sangat memuaskan. Website jadi lebih cepat dan desainnya premium." },
            { name: "Client B", role: "Startup Founder", text: "Strategi digital yang diberikan sangat on-point. Sangat merekomendasikan jasa Daffa." },
            { name: "Client C", role: "Content Creator", text: "Dashboard analytics yang dibuat sangat membantu saya memantau KPI. Thanks Daffa!" }
          ].map((testi, i) => (
            <div key={i} className="glass p-8 rounded-2xl relative">
              <div className="text-4xl text-[var(--color-neon-blue)] opacity-50 absolute top-4 right-6 font-serif">"</div>
              <p className="text-gray-300 italic mb-6 relative z-10">{testi.text}</p>
              <div>
                <h4 className="font-bold text-white">{testi.name}</h4>
                <p className="text-xs text-[var(--color-neon-green)]">{testi.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="bg-gradient-to-br from-[#00FF88]/20 to-[#0099FF]/20 p-1 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>
          <div className="glass rounded-3xl p-12 md:p-20 text-center relative z-10 border-none bg-[#0A0A0F]/80">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Siap <span className="text-gradient">Berkolaborasi?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Mari diskusikan ide Anda dan wujudkan menjadi produk digital yang luar biasa.
            </p>
            <a
              href="https://wa.me/6281374936621?text=Halo%20Daffa,%20saya%20tertarik%20untuk%20berkolaborasi!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(37,211,102,0.4)]"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
