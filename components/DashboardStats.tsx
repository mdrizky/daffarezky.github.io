import React from "react"
import CountUpClient from "./CountUpClient"
import { createClient } from "../lib/supabase-server"

type Stat = {
  key: string
  label: string
  value: number
  suffix?: string
  icon?: React.ReactNode
}

export default async function DashboardStats() {
  const supabase = await createClient()

  try {
    const tables = {
      projects: "projects",
      skills: "skills",
      messages: "messages",
      blogs: "blog_posts",
      testimonials: "testimonials",
      learningJourney: "learning_journey",
      education: "education",
    }

    // helper to get counts using head:true and count: 'exact'
    async function getCount(tableName: string) {
      const res = await supabase.from(tableName).select("*", { head: true, count: "exact" })
      // @ts-ignore
      return res.count ?? 0
    }

    const [projects, skills, messages, blogs, testimonials, learningJourney, education] = await Promise.all([
      getCount(tables.projects),
      getCount(tables.skills),
      getCount(tables.messages),
      getCount(tables.blogs),
      getCount(tables.testimonials),
      getCount(tables.learningJourney),
      getCount(tables.education),
    ])

    const stats: Stat[] = [
      {
        key: "projects",
        label: "Projects Uploaded",
        value: Number(projects),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 7V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 3h4v4h-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        key: "skills",
        label: "Skills",
        value: Number(skills),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 7l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        key: "messages",
        label: "Client Messages",
        value: Number(messages),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        key: "blogs",
        label: "Blog Posts",
        value: Number(blogs),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2L6 6v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        key: "testimonials",
        label: "Testimonials",
        value: Number(testimonials),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        key: "learningJourney",
        label: "Learning Journey",
        value: Number(learningJourney),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        key: "education",
        label: "Education History",
        value: Number(education),
        icon: (
          <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 6l9 4 9-4-9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 8.5v6a2.5 2.5 0 0 1-2.5 2.5H5.5A2.5 2.5 0 0 1 3 14.5v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ]

    return (
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.key} className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-xl p-5 flex items-center gap-4 shadow-md">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-lg flex items-center justify-center">
                {s.icon}
              </div>

              <div className="flex-1">
                <div className="text-xs text-zinc-300">{s.label}</div>
                <div className="text-2xl font-bold text-white mt-1">
                  <CountUpClient end={s.value} duration={1200} className="inline-block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  } catch (error) {
    console.error("DashboardStats error:", error)
    return (
      <div className="p-6 bg-zinc-900/40 border border-red-600 rounded-lg">
        <p className="text-red-400">Gagal memuat statistik. Coba lagi nanti.</p>
      </div>
    )
  }
}
