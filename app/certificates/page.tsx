'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/LanguageProvider"
import { PageSkeleton } from "@/components/ui/Skeleton"
import { Container } from "@/components/ui/Container"
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
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        <div className="text-left mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {language === 'id' ? 'Sertifikat' : 'Certificates'} <span className="text-gradient">{language === 'id' ? 'Keahlian' : 'Achievements'}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {language === 'id'
              ? 'Koleksi sertifikasi dan bukti kompetensi profesional saya di bidang teknologi dan pengembangan.'
              : 'Collection of my certifications and professional competencies in technology and development.'}
          </p>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayCerts.map((cert) => {
              const imageSrc = cert.image_url || (cert.file_url && isImage(cert.file_url) ? cert.file_url : null)
              return (
                <div 
                  key={cert.id} 
                  className="group bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                >
                  {/* Certificate Preview Image */}
                  <div className="relative aspect-[4/3] w-full bg-muted flex items-center justify-center overflow-hidden">
                    {imageSrc ? (
                      <Image 
                        src={imageSrc} 
                        alt={language === 'id' ? cert.title_id : cert.title_en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-foreground transition-all duration-300">
                        <FaCertificate className="text-5xl mb-2 opacity-50" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PDF Document</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                      <div className="bg-card border border-border p-3 rounded-full text-foreground shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <FaSearchPlus size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-xs font-semibold text-muted-foreground mb-2">
                        {cert.issuer}
                      </span>
                      <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {language === 'id' ? cert.title_id : cert.title_en}
                      </h2>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs font-medium text-muted-foreground">
                        {cert.date_issued}
                      </span>
                      <span className="text-primary font-semibold text-xs flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        {language === 'id' ? 'Detail' : 'Detail'} <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Certificate Detail Modal */}
        {selectedCert && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in"
            onClick={() => setSelectedCert(null)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
            
            <div 
              className="relative bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-border">
                <div>
                  <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-1 block">
                    {selectedCert.issuer}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {language === 'id' ? selectedCert.title_id : selectedCert.title_en}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-3 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  aria-label="Close modal"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-2/3">
                    <div className="bg-muted rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                      {selectedCert.file_url && isImage(selectedCert.file_url) ? (
                        <div className="relative w-full aspect-[4/3]">
                          <Image 
                            src={selectedCert.file_url} 
                            alt={language === 'id' ? selectedCert.title_id : selectedCert.title_en}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] flex flex-col items-center justify-center p-12 text-center">
                          <FaCertificate className="text-6xl text-muted-foreground mb-4 opacity-40" />
                          <p className="text-lg font-semibold text-muted-foreground">
                            {language === 'id' ? 'Sertifikat ini dalam format PDF atau Tautan' : 'This certificate is in PDF or link format'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {language === 'id' ? 'Informasi' : 'Information'}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{language === 'id' ? 'Penerbit' : 'Issuer'}</p>
                          <p className="font-semibold text-foreground">{selectedCert.issuer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{language === 'id' ? 'Tanggal Terbit' : 'Issue Date'}</p>
                          <p className="font-semibold text-foreground">{selectedCert.date_issued}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <a
                        href={selectedCert.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:opacity-90 transition-all active:scale-95"
                      >
                        <FaExternalLinkAlt size={14} />
                        {language === 'id' ? 'Buka Dokumen Asli' : 'Open Original Document'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
