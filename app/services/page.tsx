'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from("services")
          .select("*")
          .order("price", { ascending: true });

        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices([
            {
              id: "1",
              name_id: "Paket Basic",
              name_en: "Basic Package",
              price: "Rp 150.000",
              description_id: "Solusi cepat untuk memulai digital presence Anda.",
              description_en: "Quick solution to start your digital presence.",
              features_id: ["Analisis kompetitor (3 kompetitor)", "Riset keyword basic", "1 halaman copywriting", "Revisi 1x", "Delivery 3 hari"],
              features_en: ["Competitor analysis (3 competitors)", "Basic keyword research", "1 page copywriting", "1 revision", "3-day delivery"],
              is_popular: false
            },
            {
              id: "2",
              name_id: "Paket Standard",
              name_en: "Standard Package",
              price: "Rp 350.000",
              description_id: "Pilihan terbaik untuk membangun brand dan memulai campaign.",
              description_en: "Best choice to build your brand and launch campaigns.",
              features_id: ["Semua di Basic +", "Brand identity", "Konten IG (5 post)", "KPI dashboard setup", "Revisi 2x", "Delivery 5 hari"],
              features_en: ["Everything in Basic +", "Brand identity", "IG content (5 posts)", "KPI dashboard setup", "2 revisions", "5-day delivery"],
              is_popular: true
            },
            {
              id: "3",
              name_id: "Paket Premium",
              name_en: "Premium Package",
              price: "Rp 750.000",
              description_id: "Solusi lengkap end-to-end untuk pertumbuhan bisnis maksimal.",
              description_en: "Complete end-to-end solution for maximum business growth.",
              features_id: ["Semua di Standard +", "Landing page", "Strategi konten 1 bulan", "SEO on-page", "Konsultasi WA 2 minggu", "Revisi unlimited", "Delivery 10 hari"],
              features_en: ["Everything in Standard +", "Landing page", "1-month content strategy", "On-page SEO", "2-week WA consultation", "Unlimited revisions", "10-day delivery"],
              is_popular: false
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'id' ? 'Jasa & ' : 'Our '}<span className="text-gradient">{language === 'id' ? 'Layanan' : 'Services'}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'id'
              ? 'Pilih paket layanan yang sesuai dengan kebutuhan bisnis Anda. Saya siap membantu Anda mencapai target!'
              : 'Choose a service package that fits your business needs. I\'m ready to help you achieve your goals!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-24 text-center max-w-3xl mx-auto bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-10 rounded-3xl animate-in fade-in duration-700 delay-300 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'id' ? 'Punya Kebutuhan Spesifik?' : 'Have Specific Needs?'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {language === 'id'
              ? 'Jika Anda membutuhkan layanan yang tidak ada di paket atas, atau ingin proyek skala besar, mari kita diskusikan solusinya bersama.'
              : 'If you need services not listed above, or want a large-scale project, let\'s discuss the solution together.'}
          </p>
          <a
            href="https://wa.me/6281374936621?text=Halo%20Daffa,%20saya%20ingin%20konsultasi%20untuk%20kebutuhan%20custom%20bisnis%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            {language === 'id' ? 'Konsultasi Kebutuhan Custom' : 'Custom Consultation'}
          </a>
        </div>
      </div>
    </div>
  );
}
