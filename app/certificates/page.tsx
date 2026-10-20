'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/LanguageProvider"
import { PageSkeleton } from "@/components/ui/Skeleton"
import { Container } from "@/components/ui/Container"
import type { Certificate } from "@/types"
import CertificateGallery from "@/components/CertificateGallery"

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

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {loading ? (
          <PageSkeleton />
        ) : (
          <CertificateGallery 
            certificates={certificates}
            language={language}
            showHeader={true}
          />
        )}
      </Container>
    </div>
  )
}
