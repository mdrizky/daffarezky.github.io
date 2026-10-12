'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/LanguageProvider"
import { PageSkeleton } from "@/components/ui/Skeleton"
import { Container } from "@/components/ui/Container"
import type { Certificate } from "@/types"
import CertificateCard from "@/components/CertificateCard"
import { defaultCertificatesList } from "@/lib/certificates-data"

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
          .eq("is_published", true)
          .order("date_issued", { ascending: false })

        if (error) {
          // If RLS or error, try fetching without is_published filter
          const fallback = await supabase
            .from("certificates")
            .select("*")
            .order("date_issued", { ascending: false })
          if (fallback.data && fallback.data.length > 0) {
            setCertificates(fallback.data)
          }
        } else if (data && data.length > 0) {
          setCertificates(data)
        }
      } catch (error) {
        console.error("Error loading certificates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  // If DB items exist, merge with defaults or use DB items
  const displayCerts = certificates.length > 0 ? certificates : defaultCertificatesList

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        <div className="text-left mb-14 animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
            {language === 'id' ? 'Kompetensi & Lisensi' : 'Verified Credentials'}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 text-white">
            {language === 'id' ? 'Sertifikat' : 'Certificates'} <span className="text-cyan-400">{language === 'id' ? 'Kompetensi' : 'Competency'}</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-base leading-relaxed">
            {language === 'id'
              ? 'Koleksi sertifikasi dan bukti kompetensi profesional saya di bidang teknologi, pemrograman, dan literasi digital.'
              : 'Collection of my certifications and professional competencies in technology, programming, and digital literacy.'}
          </p>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCerts.map((cert) => (
              <CertificateCard 
                key={cert.id} 
                certificate={cert} 
                language={language}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
