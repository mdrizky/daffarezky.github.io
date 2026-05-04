import { createClient } from "@/lib/supabase-server";
import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@/types";

export const revalidate = 3600;

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: servicesData } = await supabase
    .from("services")
    .select("*")
    .order("price", { ascending: true });

  // Default services mapping based on user request if DB is empty
  const defaultServices: Service[] = [
    {
      id: "1",
      name: "Paket Basic",
      price: "Rp 150.000",
      description: "Solusi cepat untuk memulai digital presence Anda.",
      features: [
        "Analisis kompetitor (3 kompetitor)",
        "Riset keyword basic",
        "1 halaman copywriting",
        "Revisi 1x",
        "Delivery 3 hari"
      ],
      is_popular: false
    },
    {
      id: "2",
      name: "Paket Standard",
      price: "Rp 350.000",
      description: "Pilihan terbaik untuk membangun brand dan memulai campaign.",
      features: [
        "Semua di Basic +",
        "Brand identity (logo + color palette + fonts)",
        "Konten IG (5 post siap upload)",
        "KPI dashboard setup (Google Sheets)",
        "Revisi 2x",
        "Delivery 5 hari"
      ],
      is_popular: true
    },
    {
      id: "3",
      name: "Paket Premium",
      price: "Rp 750.000",
      description: "Solusi lengkap end-to-end untuk pertumbuhan bisnis maksimal.",
      features: [
        "Semua di Standard +",
        "Landing page (1 halaman)",
        "Strategi konten 1 bulan",
        "SEO on-page optimization",
        "WhatsApp consultation 2 minggu",
        "Revisi unlimited",
        "Delivery 10 hari"
      ],
      is_popular: false
    }
  ];

  const services = (servicesData && servicesData.length > 0) ? servicesData as Service[] : defaultServices;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Jasa & <span className="text-gradient">Layanan</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Pilih paket layanan yang sesuai dengan kebutuhan bisnis Anda. Saya siap membantu Anda mencapai target!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-24 text-center max-w-3xl mx-auto glass p-10 rounded-3xl animate-in fade-in duration-700 delay-300">
          <h3 className="text-2xl font-bold mb-4">Punya Kebutuhan Spesifik?</h3>
          <p className="text-gray-400 mb-8">
            Jika Anda membutuhkan layanan yang tidak ada di paket atas, atau ingin proyek skala besar, mari kita diskusikan solusinya bersama.
          </p>
          <a
            href="https://wa.me/6281374936621?text=Halo%20Daffa,%20saya%20ingin%20konsultasi%20untuk%20kebutuhan%20custom%20bisnis%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Konsultasi Kebutuhan Custom
          </a>
        </div>
      </div>
    </div>
  );
}
