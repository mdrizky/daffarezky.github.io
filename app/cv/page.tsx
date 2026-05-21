'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import type { Profile, Education, Project, Skill, Certificate } from "@/types"

export default function CVPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!profile) return <div className="text-center mt-20">Data tidak ditemukan.</div>

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-200 py-10 print:py-0 print:bg-white text-gray-900 font-sans">
      
      {/* Floating Action Button for Print */}
      <div className="fixed bottom-10 right-10 print:hidden z-50">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-6 py-4 font-bold flex items-center gap-2 transition-transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Download PDF
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-2xl print:shadow-none print:w-full print:m-0 overflow-hidden">
        
        {/* Header section */}
        <header className="bg-gray-900 text-white px-10 py-12 flex items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 flex-shrink-0 bg-white">
            <Image 
              src={profile.photo_url || "/foto.jpg"} 
              alt={profile.name} 
              width={128} 
              height={128} 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-1">{profile.name}</h1>
            <h2 className="text-xl text-blue-400 font-medium tracking-widest uppercase mb-4">{profile.title_id}</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
              <span className="flex items-center gap-2">📞 {profile.wa || "-"}</span>
              <span className="flex items-center gap-2">✉️ {profile.email || "-"}</span>
              <span className="flex items-center gap-2">🔗 linkedin.com/in/{profile.linkedin?.replace('https://linkedin.com/in/', '') || profile.name.toLowerCase().replace(/\s/g, '')}</span>
              <span className="flex items-center gap-2">🐙 github.com/{profile.github?.replace('https://github.com/', '') || "-"}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3">
          
          {/* Left Column */}
          <div className="col-span-1 bg-gray-50 px-8 py-10 border-r border-gray-200">
            
            <section className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-2 mb-4">Profil</h3>
              <p className="text-sm text-gray-700 leading-relaxed text-justify">
                {profile.bio_id}
              </p>
            </section>
            
            <section className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-2 mb-4">Skill & Tools</h3>
              <div className="flex flex-col gap-3">
                {Array.from(new Set(skills.map(s => s.category))).map((category) => (
                  <div key={category}>
                    <h4 className="text-xs font-bold text-gray-800 mb-1">{category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {skills.filter(s => s.category === category).map(skill => (
                        <span key={skill.id} className="text-[11px] bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-2 mb-4">Pendidikan</h3>
              <div className="flex flex-col gap-5">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="text-sm font-bold text-gray-900">{edu.institution}</h4>
                    <p className="text-xs text-blue-600 font-semibold mb-1">{edu.degree_id}</p>
                    <p className="text-xs text-gray-500 mb-2">{edu.start_year} - {edu.is_current ? 'Sekarang' : edu.end_year}</p>
                    {edu.description_id && (
                      <p className="text-xs text-gray-700 leading-relaxed text-justify line-clamp-3">
                        {edu.description_id}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="col-span-2 px-10 py-10">
            
            <section className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-2 mb-6">Proyek Unggulan</h3>
              <div className="flex flex-col gap-6">
                {projects.map(project => (
                  <div key={project.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-base font-bold text-gray-900">{project.title_id}</h4>
                      {project.demo_url && (
                        <span className="text-xs text-blue-600 font-medium">Link: {project.demo_url.replace(/^https?:\/\//, '')}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Tech Stack: {project.tech_stack?.join(', ')}</p>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">
                      {project.description_id}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-2 mb-6">Sertifikasi & Penghargaan</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {certificates.map(cert => (
                  <div key={cert.id} className="relative pl-3 border-l-2 border-blue-500">
                    <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">{cert.title_id}</h4>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-400">{cert.date_issued}</p>
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
