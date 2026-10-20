'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import type { Profile, Education, FocusArea, CoreValue, LearningJourney } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { PageSkeleton } from "@/components/ui/Skeleton";
import EducationTimeline from "@/components/EducationTimeline";
import { FaRocket, FaShieldAlt, FaCloudUploadAlt, FaGlobe, FaCode, FaProjectDiagram, FaTools, FaClock, FaGraduationCap, FaCertificate, FaLaptopCode, FaStar } from "react-icons/fa";

function getMilestoneIcon(title: string) {
  const t = (title || '').toLowerCase();
  if (t.includes('keamanan') || t.includes('security')) return <FaShieldAlt className="text-cyan-400" />;
  if (t.includes('hosting') || t.includes('deploy') || t.includes('cloud')) return <FaCloudUploadAlt className="text-blue-400" />;
  if (t.includes('inggris') || t.includes('english') || t.includes('komunikasi')) return <FaGlobe className="text-emerald-400" />;
  if (t.includes('web') || t.includes('code') || t.includes('frontend')) return <FaCode className="text-purple-400" />;
  return <FaRocket className="text-cyan-400" />;
}

export default function TentangPage() {
  const { language } = useLanguage();
  const id = language === 'id';

  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [milestones, setMilestones] = useState<LearningJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({ projects: 0, skills: 0, certificates: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, eduRes, focusRes, valuesRes, milestonesRes, projectsCountRes, skillsCountRes, certsCountRes] = await Promise.all([
          supabase.from("profile").select("*").limit(1),
          supabase.from("education").select("*").eq("is_published", true).order("start_year", { ascending: false }),
          supabase.from("focus_areas").select("*").eq("is_published", true).order("sort_order"),
          supabase.from("core_values").select("*").eq("is_published", true).order("sort_order"),
          supabase.from("learning_journey").select("*").eq("is_published", true).order("year", { ascending: false }),
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_published", true),
          supabase.from("skills").select("*", { count: "exact", head: true }).eq("is_published", true),
          supabase.from("certificates").select("*", { count: "exact", head: true }).eq("is_published", true),
        ]);

        if (profileRes.data?.length) setProfile(profileRes.data[0]);
        if (eduRes.data) setEducation(eduRes.data);
        if (focusRes.data) setFocusAreas(focusRes.data);
        if (valuesRes.data) setCoreValues(valuesRes.data);
        if (milestonesRes.data) setMilestones(milestonesRes.data);
        setStatsData({
          projects: projectsCountRes?.count || 0,
          skills: skillsCountRes?.count || 0,
          certificates: certsCountRes?.count || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const introduction = id 
    ? (profile?.bio_id || "Assalamu'alaikum. Saya Muhammad Daffa Rezky Adyra, seorang pengembang web dan mobile...")
    : (profile?.bio_en || "Assalamu'alaikum. I am Muhammad Daffa Rezky Adyra, a web and mobile developer...");

  const vision = id
    ? (profile?.vision_id || "Menjadi profesional di bidang teknologi...")
    : (profile?.vision_en || "To be a professional in the field of technology...");

  if (loading) return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <PageSkeleton />
      </Container>
    </div>
  );

  // Stats configuration
  const statsItems = [
    {
      icon: <FaProjectDiagram className="text-cyan-400" />,
      value: `${statsData.projects}+`,
      label: id ? 'Proyek Selesai' : 'Projects Completed',
    },
    {
      icon: <FaTools className="text-emerald-400" />,
      value: `${statsData.skills}+`,
      label: id ? 'Skill Dikuasai' : 'Skills Mastered',
    },
    {
      icon: <FaCertificate className="text-amber-400" />,
      value: `${statsData.certificates}+`,
      label: id ? 'Sertifikat Diperoleh' : 'Certificates Earned',
    },
    {
      icon: <FaClock className="text-purple-400" />,
      value: '3+',
      label: id ? 'Tahun Belajar IT' : 'Years Learning IT',
    },
    {
      icon: <FaGraduationCap className="text-blue-400" />,
      value: id ? 'Semester 1' : '1st Sem',
      label: id ? 'Kuliah S1' : 'Undergraduate',
    },
    {
      icon: <FaStar className="text-yellow-400" />,
      value: '100%',
      label: id ? 'Dedikasi Penuh' : 'Full Dedication',
    },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {/* Header */}
        <div className="mb-20 max-w-2xl animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">
            {id ? 'Tentang' : 'About'} <span className="text-muted-foreground">{id ? 'Saya' : 'Me'}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {id ? 'Mengenal lebih dekat siapa di balik layar, perjalanan, dan visi saya di dunia digital.' : 'Get to know the person behind the screen, the journey, and my vision in the digital world.'}
          </p>
        </div>

        {/* Stats Strip — Compact overview */}
        <section className="mb-20 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statsItems.map((stat, idx) => (
              <div 
                key={idx} 
                className="group relative bg-card/60 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800/70 rounded-2xl p-5 text-center hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex justify-center mb-3 text-xl">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground mb-1 group-hover:text-cyan-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 1. Perkenalan & Vision */}
        <section className="mb-24 animate-fade-in">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
                <Image
                  src={profile?.about_photo_url || profile?.photo_url || "/og-image.jpg"}
                  alt={profile?.name || "Daffa Rizky"}
                  fill
                  className="object-cover"
                />
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg border-b border-border pb-3">{id ? 'Informasi Pribadi' : 'Personal Info'}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{id ? 'Lahir' : 'Born'}</span>
                    <span className="font-medium text-foreground">
                      {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString(id ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{id ? 'Lokasi' : 'Location'}</span>
                    <span className="font-medium text-foreground">{profile?.birth_place || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{id ? 'Fokus' : 'Focus'}</span>
                    <span className="font-medium text-foreground">Web & Mobile Dev</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{id ? 'Semester' : 'Semester'}</span>
                    <span className="font-medium text-foreground">{id ? 'Semester 1' : '1st Semester'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-7 space-y-12 pt-4">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
                  {id ? 'Perkenalan Diri' : 'Introduction'}
                </h2>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed">
                  {introduction}
                </div>
              </div>
              
              {/* Quick Stats inside intro section */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-4 rounded-2xl bg-secondary/40 border border-border/60">
                  <div className="flex justify-center mb-2"><FaLaptopCode className="text-cyan-400 text-lg" /></div>
                  <div className="text-2xl font-heading font-extrabold text-foreground">{statsData.projects}+</div>
                  <div className="text-[11px] text-muted-foreground font-medium">{id ? 'Proyek' : 'Projects'}</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-secondary/40 border border-border/60">
                  <div className="flex justify-center mb-2"><FaTools className="text-emerald-400 text-lg" /></div>
                  <div className="text-2xl font-heading font-extrabold text-foreground">{statsData.skills}+</div>
                  <div className="text-[11px] text-muted-foreground font-medium">{id ? 'Keahlian' : 'Skills'}</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-secondary/40 border border-border/60">
                  <div className="flex justify-center mb-2"><FaClock className="text-purple-400 text-lg" /></div>
                  <div className="text-2xl font-heading font-extrabold text-foreground">3+</div>
                  <div className="text-[11px] text-muted-foreground font-medium">{id ? 'Tahun IT' : 'Years IT'}</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-secondary/50 border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  ✨ {id ? 'Visi Pribadi' : 'Personal Vision'}
                </h3>
                <p className="text-lg italic text-muted-foreground leading-relaxed">
                  &quot;{vision}&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Focus & Values */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <SectionHeader align="left" title={id ? 'Fokus Pengembangan' : 'Development Focus'} />
              <div className="space-y-4">
                {focusAreas.map(area => (
                  <Card key={area.id}>
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2">{id ? area.title_id : area.title_en}</h4>
                      <p className="text-muted-foreground text-sm">{id ? area.description_id : area.description_en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader align="left" title={id ? 'Nilai yang Saya Pegang' : 'My Values'} />
              <div className="space-y-4">
                {coreValues.map(val => (
                  <Card key={val.id} className="bg-secondary/20">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                        ✨ {id ? val.title_id : val.title_en}
                      </h4>
                      <p className="text-muted-foreground text-sm">{id ? val.description_id : val.description_en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Perjalanan Belajar (Kiri) & Pendidikan (Kanan) */}
        <section className="mb-24">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Kolom Kiri: Perjalanan Belajar */}
            <div className="lg:col-span-6 space-y-8">
              <SectionHeader align="left" title={id ? 'Perjalanan Belajar' : 'Learning Journey'} eyebrow={id ? 'Evolusi' : 'Evolution'} />
              
              <div className="relative">
                {milestones.length > 1 && (
                  <div 
                    className="absolute left-[21px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-400 via-cyan-500/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                <div className="space-y-5">
                  {milestones.map((m, idx) => {
                    const title = id ? m.title_id : (m.title_en || m.title_id);
                    const desc = id ? m.description_id : (m.description_en || m.description_id);

                    return (
                      <div key={m.id} className="relative group flex items-start gap-4">
                        {/* Node Icon */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-11 h-11 rounded-xl bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 shadow-sm flex items-center justify-center text-base transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-cyan-500/20">
                            {getMilestoneIcon(title)}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 min-w-0 bg-card/60 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                              {m.year}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/60">
                              #{(idx + 1).toString().padStart(2, '0')}
                            </span>
                          </div>

                          <h3 className="text-base font-heading font-bold text-foreground group-hover:text-cyan-400 transition-colors leading-snug">
                            {title}
                          </h3>

                          {desc && (
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                              {desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Pendidikan */}
            <div className="lg:col-span-6 space-y-8">
              <SectionHeader align="left" title={id ? 'Pendidikan' : 'Education'} eyebrow={id ? 'Akademik' : 'Academic'} />
              <EducationTimeline items={education} id={id} />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
