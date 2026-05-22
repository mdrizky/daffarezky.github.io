'use client'

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import type { Profile, Education, Project, Skill, Certificate } from "@/types"

export default function CVPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const cvRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, eduRes, projRes, skillRes, certRes] = await Promise.all([
          supabase.from("profile").select("*").limit(1),
          supabase.from("education").select("*").order("start_year", { ascending: false }),
          supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(4),
          supabase.from("skills").select("*").order("category"),
          supabase.from("certificates").select("*").order("date_issued", { ascending: false }),
        ])

        if (profRes.data && profRes.data.length > 0) setProfile(profRes.data[0])
        if (eduRes.data) setEducation(eduRes.data)
        if (projRes.data) setProjects(projRes.data)
        if (skillRes.data) setSkills(skillRes.data)
        if (certRes.data) setCertificates(certRes.data)
      } catch (error) {
        console.error("Error fetching CV data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return
    setGenerating(true)

    try {
      // Dynamic import html2pdf.js (client only)
      const html2pdf = (await import('html2pdf.js')).default

      const options = {
        margin: 0,
        filename: `CV_${profile?.name?.replace(/\s+/g, '_') || 'Daffa_Rizky'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }

      await html2pdf().set(options).from(cvRef.current).save()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Gagal membuat PDF. Coba lagi.")
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat data CV...</p>
        </div>
      </div>
    )
  }

  if (!profile) return <div className="text-center mt-20 text-gray-600">Data tidak ditemukan.</div>

  return (
    <div className="min-h-screen bg-gray-200 py-10 print:py-0 print:bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Floating Download Button */}
      <div className="fixed bottom-8 right-8 print:hidden z-50 flex flex-col gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-2xl rounded-2xl px-7 py-4 font-bold flex items-center gap-3 transition-all hover:scale-105 disabled:scale-100 disabled:cursor-wait text-sm"
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download PDF
            </>
          )}
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-white text-gray-700 shadow-lg border border-gray-200 rounded-2xl px-7 py-3 font-semibold flex items-center gap-2 transition-all hover:bg-gray-50 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali
        </button>
      </div>

      {/* ============================================================ */}
      {/* CV CONTENT — this is what gets exported as PDF               */}
      {/* ============================================================ */}
      <div
        ref={cvRef}
        className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:m-0 overflow-hidden"
        style={{ color: '#1a1a1a', fontFamily: 'Inter, system-ui, sans-serif' }}
      >

        {/* ── HEADER ── */}
        <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '40px 48px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.2)', flexShrink: 0, background: '#fff' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo_url || "/foto.jpg"}
              alt={profile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              crossOrigin="anonymous"
            />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px', lineHeight: 1.2 }}>{profile.name}</h1>
            <h2 style={{ fontSize: '16px', color: '#60a5fa', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>{profile.title_id}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#cbd5e1' }}>
              <span>📞 {profile.wa || "-"}</span>
              <span>✉️ {profile.email || "-"}</span>
              {profile.linkedin && (
                <span>🔗 {profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
              )}
              {profile.github && (
                <span>🐙 {profile.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
              )}
            </div>
          </div>
        </header>

        {/* ── BODY 2 COLUMNS ── */}
        <div style={{ display: 'flex', minHeight: '800px' }}>

          {/* LEFT SIDEBAR */}
          <div style={{ width: '35%', background: '#f8fafc', padding: '36px 28px', borderRight: '1px solid #e2e8f0' }}>

            {/* Profile */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '14px', color: '#0f172a' }}>Profil</h3>
              <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.7, textAlign: 'justify' }}>
                {profile.bio_id}
              </p>
            </section>

            {/* Skills */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '14px', color: '#0f172a' }}>Skill &amp; Tools</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Array.from(new Set(skills.map(s => s.category))).map((category) => (
                  <div key={category}>
                    <h4 style={{ fontSize: '10px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {skills.filter(s => s.category === category).map(skill => (
                        <span key={skill.id} style={{ fontSize: '9px', background: '#e2e8f0', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '14px', color: '#0f172a' }}>Pendidikan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{edu.institution}</h4>
                    <p style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600, marginBottom: '2px' }}>{edu.degree_id}</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>{edu.start_year} – {edu.is_current ? 'Sekarang' : edu.end_year}</p>
                    {edu.description_id && (
                      <p style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.6, textAlign: 'justify' }}>
                        {edu.description_id.length > 120 ? edu.description_id.substring(0, 120) + '...' : edu.description_id}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT MAIN CONTENT */}
          <div style={{ width: '65%', padding: '36px 36px' }}>

            {/* Projects */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '20px', color: '#0f172a' }}>Proyek Unggulan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {projects.map(project => (
                  <div key={project.id} style={{ pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{project.title_id}</h4>
                      {project.demo_url && (
                        <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 500 }}>{project.demo_url.replace(/^https?:\/\//, '')}</span>
                      )}
                    </div>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>
                      Tech Stack: {project.tech_stack?.join(', ')}
                    </p>
                    <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.6, textAlign: 'justify' }}>
                      {project.description_id && project.description_id.length > 300
                        ? project.description_id.substring(0, 300) + '...'
                        : project.description_id}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certificates */}
            <section>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '20px', color: '#0f172a' }}>Sertifikasi &amp; Penghargaan</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                {certificates.map(cert => (
                  <div key={cert.id} style={{ paddingLeft: '12px', borderLeft: '3px solid #3b82f6', pageBreakInside: 'avoid' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '2px' }}>{cert.title_id}</h4>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>{cert.issuer}</p>
                    <p style={{ fontSize: '9px', color: '#94a3b8' }}>{cert.date_issued}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}
