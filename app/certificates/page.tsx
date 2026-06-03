'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/LanguageProvider"
import { PageSkeleton } from "@/components/ui/Skeleton"
import type { Certificate } from "@/types"
import { FaExternalLinkAlt, FaTimes, FaCertificate, FaSearchPlus } from "react-icons/fa"

export default function CertificatesPage() {
  const { language } = useLanguage()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

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
    { id: "1", title_id: "Sertifikat Tasheel", title_en: "Tasheel Certificate", issuer: "Tasheel", file_url: "/logo.png", date_issued: "2024" },
    { id: "2", title_id: "Surat Rekomendasi Tasheel", title_en: "Tasheel Recommendation", issuer: "Tasheel", file_url: "/logo.png", date_issued: "2024" },
    { id: "3", title_id: "Dicoding: Financial Literacy", title_en: "Dicoding: Financial Literacy", issuer: "Dicoding", file_url: "/logo.png", date_issued: "2025" },
  ]

  const displayCerts = certificates.length > 0 ? certificates : defaultCerts

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0A0A0F] transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-left mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'id' ? 'Sertifikat' : 'Certificates'} <span className="text-gradient">{language === 'id' ? 'Keahlian' : 'Achievements'}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
            {language === 'id'
              ? 'Koleksi sertifikasi dan bukti kompetensi profesional saya di bidang teknologi dan pengembangan.'
              : 'Collection of my certifications and professional competencies in technology and development.'}
          </p>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayCerts.map((cert) => (
              <div 
                key={cert.id} 
                className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-[var(--color-neon-green)]/30 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedCert(cert)}
              >
                {/* Certificate Preview Image */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  {cert.file_url && isImage(cert.file_url) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={cert.file_url} 
                      alt={language === 'id' ? cert.title_id : cert.title_en}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--color-neon-green)]/40 group-hover:text-[var(--color-neon-green)] transition-all duration-500">
                      <FaCertificate className="text-6xl mb-3" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">PDF Document</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <FaSearchPlus size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                      {cert.issuer}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[var(--color-neon-blue)] transition-colors">
                      {language === 'id' ? cert.title_id : cert.title_en}
                    </h2>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {cert.date_issued}
                    </span>
                    <span className="text-[var(--color-neon-green)] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      {language === 'id' ? 'Detail' : 'Detail'} <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Detail Modal */}
        {selectedCert && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
            onClick={() => setSelectedCert(null)}
          >
            <div className="absolute inset-0 bg-[#0A0A0F]/90 backdrop-blur-xl"></div>
            
            <div 
              className="relative bg-white dark:bg-[#12121A] w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-8 md:p-10 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <div>
                  <span className="text-[var(--color-neon-green)] font-bold tracking-widest uppercase text-xs mb-2 block">
                    {selectedCert.issuer}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {language === 'id' ? selectedCert.title_id : selectedCert.title_en}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="w-full lg:w-2/3">
                    <div className="bg-gray-100 dark:bg-black/40 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-inner">
                      {selectedCert.file_url && isImage(selectedCert.file_url) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={selectedCert.file_url} 
                          alt={language === 'id' ? selectedCert.title_id : selectedCert.title_en}
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="aspect-[4/3] flex flex-col items-center justify-center p-12 text-center">
                          <FaCertificate className="text-8xl text-[var(--color-neon-green)] mb-6 opacity-40" />
                          <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                            {language === 'id' ? 'Sertifikat ini dalam format PDF atau Link' : 'This certificate is in PDF or Link format'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-widest text-sm opacity-60">
                        {language === 'id' ? 'Informasi' : 'Information'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">{language === 'id' ? 'Penerbit' : 'Issuer'}</p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedCert.issuer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">{language === 'id' ? 'Tanggal Terbit' : 'Issue Date'}</p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedCert.date_issued}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                      <a
                        href={selectedCert.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl bg-gradient-neon text-[#0A0A0F] font-bold text-lg shadow-lg hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <FaExternalLinkAlt />
                        {language === 'id' ? 'Buka Dokumen Asli' : 'Open Original Document'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
