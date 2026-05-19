'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/LanguageProvider"
import { PageSkeleton } from "@/components/ui/Skeleton"
import type { Certificate } from "@/types"

export default function CertificatesPage() {
  const { language } = useLanguage()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("date_issued", { ascending: false })

        if (error) throw error
        if (data) setCertificates(data)
      } catch (error) {
        console.error("Error loading certificates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  const defaultCerts: Certificate[] = [
    { id: "1", title_id: "Sertifikat Tasheel", title_en: "Tasheel Certificate", issuer: "Tasheel", file_url: "#", date_issued: "2024" },
    { id: "2", title_id: "Surat Rekomendasi Tasheel", title_en: "Tasheel Recommendation", issuer: "Tasheel", file_url: "#", date_issued: "2024" },
    { id: "3", title_id: "Dicoding: Financial Literacy", title_en: "Dicoding: Financial Literacy", issuer: "Dicoding", file_url: "#", date_issued: "2025" },
    { id: "4", title_id: "Sertifikat Kompetensi", title_en: "Competency Certificate", issuer: "LSP", file_url: "#", date_issued: "2026" },
  ]

  const displayCerts = certificates.length > 0 ? certificates : defaultCerts

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'id' ? 'Halaman' : 'Page'} <span className="text-gradient">{language === 'id' ? 'Sertifikat' : 'Certificates'}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'id'
              ? 'Semua sertifikat dan bukti kompetensi yang dapat ditampilkan di portfolio.'
              : 'All certificates and achievements available in the portfolio.'}
          </p>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCerts.map((cert) => (
              <div key={cert.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] mb-5">
                  <span className="text-2xl">🏅</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'id' ? cert.title_id : cert.title_en}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {cert.issuer} • {cert.date_issued}
                </p>
                <div className="mt-auto">
                  <Link
                    href={cert.file_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-3 rounded-2xl bg-gradient-neon text-[#0A0A0F] font-semibold transition-all hover:opacity-90"
                  >
                    {language === 'id' ? 'Lihat Sertifikat' : 'View Certificate'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          {language === 'id'
            ? 'Jika sertifikat belum tersedia, tambahkan di admin. File bisa berupa PDF atau gambar dan akan ditampilkan di halaman khusus ini.'
            : 'If certificates are not yet available, add them in the admin panel. Files can be PDF or images and will appear on this dedicated page.'}
        </div>
      </div>
    </div>
  )
}
