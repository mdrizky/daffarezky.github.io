'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/LanguageProvider"
import { PageSkeleton } from "@/components/ui/Skeleton"
import { Container } from "@/components/ui/Container"
import type { Certificate } from "@/types"
import CertificateCard from "@/components/CertificateCard"

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
    { 
      id: "cert-dicoding-1", 
      title_id: "Dasar-Dasar Literasi Keuangan", 
      title_en: "Financial Literacy Fundamentals", 
      issuer: "Dicoding", 
      file_url: "/assets/certificates/Financial Literacy 101.pdf", 
      date_issued: "2025" 
    },
    { 
      id: "cert-tasheel-1", 
      title_id: "Sertifikat Tasheel", 
      title_en: "Tasheel Certification", 
      issuer: "Tasheel", 
      file_url: "/assets/certificates/sertifikat-tasheel.pdf", 
      date_issued: "2024" 
    },
    { 
      id: "cert-tasheel-2", 
      title_id: "Surat Rekomendasi Tasheel", 
      title_en: "Tasheel Recommendation Letter", 
      issuer: "Tasheel", 
      file_url: "/assets/certificates/surat-rekomendasi-tasheel.pdf", 
      date_issued: "2024" 
    },
    { 
      id: "cert-digitalent-1", 
      title_id: "AI Engineer For Milenial", 
      title_en: "AI Engineer For Milenial", 
      issuer: "Digitalent", 
      file_url: "/assets/certificates/ai-engineer-milenial.pdf", 
      date_issued: "2024" 
    },
    { 
      id: "cert-digitalent-2", 
      title_id: "Ethical Hacker For Dummies", 
      title_en: "Ethical Hacker For Dummies", 
      issuer: "Digitalent", 
      file_url: "/assets/certificates/ethical-hacker-dummies.pdf", 
      date_issued: "2024" 
    },
    { 
      id: "cert-digitalent-3", 
      title_id: "Pengenalan Produk Digital dan Desain Grafis", 
      title_en: "Introduction to Digital Products & Graphic Design", 
      issuer: "Digitalent", 
      file_url: "/assets/certificates/digital-products-graphic-design.pdf", 
      date_issued: "2024" 
    },
  ]

  const displayCerts = certificates.length > 0 ? certificates : defaultCerts

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        <div className="text-left mb-16 animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
            {language === 'id' ? 'Kompetensi & Lisensi' : 'Verified Credentials'}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {language === 'id' ? 'Sertifikat' : 'Certificates'} <span className="text-gradient">{language === 'id' ? 'Keahlian' : 'Achievements'}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {language === 'id'
              ? 'Koleksi sertifikasi dan bukti kompetensi profesional saya di bidang teknologi, pemrograman, dan literasi digital.'
              : 'Collection of my certifications and professional competencies in technology, programming, and digital literacy.'}
          </p>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCerts.map((cert) => (
              <CertificateCard 
                key={cert.id} 
                certificate={cert} 
                language={language}
                category={cert.issuer === 'Dicoding' ? 'Literasi Finansial & Tech' : 'Informatika & Pemrograman'}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
