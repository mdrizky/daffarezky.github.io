'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import type { Profile, Education, FocusArea, CoreValue, LearningJourney } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function TentangPage() {
  const { language } = useLanguage();
  const id = language === 'id';

  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [milestones, setMilestones] = useState<LearningJourney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, eduRes, focusRes, valuesRes, milestonesRes] = await Promise.all([
          supabase.from("profile").select("*").limit(1),
          supabase.from("education").select("*").eq("is_published", true).order("start_year", { ascending: false }),
          supabase.from("focus_areas").select("*").eq("is_published", true).order("sort_order"),
          supabase.from("core_values").select("*").eq("is_published", true).order("sort_order"),
          supabase.from("learning_journey").select("*").eq("is_published", true).order("year", { ascending: false }),
        ]);

        if (profileRes.data?.length) setProfile(profileRes.data[0]);
        if (eduRes.data) setEducation(eduRes.data);
        if (focusRes.data) setFocusAreas(focusRes.data);
        if (valuesRes.data) setCoreValues(valuesRes.data);
        if (milestonesRes.data) setMilestones(milestonesRes.data);
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
              <div className="space-y-6">
                {milestones.map((m, idx) => (
                  <div key={m.id} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <Badge variant="secondary" className="px-3 py-1 font-bold whitespace-nowrap bg-primary/10 text-primary border-primary/20">
                        {m.year}
                      </Badge>
                      {idx < milestones.length - 1 && (
                        <div className="w-0.5 flex-grow bg-border my-2 min-h-[40px]"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-lg font-bold text-foreground mb-1">{id ? m.title_id : m.title_en}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{id ? m.description_id : m.description_en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Pendidikan */}
            <div className="lg:col-span-6 space-y-8">
              <SectionHeader align="left" title={id ? 'Pendidikan' : 'Education'} eyebrow={id ? 'Akademik' : 'Academic'} />
              <div className="space-y-4">
                {education.map(edu => (
                  <Card key={edu.id} className="bg-card text-card-foreground border-border hover:border-primary/40 transition-all shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                      {/* Logo Sekolah */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
                        {edu.logo_url ? (
                          <Image
                            src={edu.logo_url}
                            alt={edu.institution}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="font-heading font-bold text-primary text-sm">
                            {edu.institution.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Info Sekolah: Nama, Tingkatan, Jurusan, Periode */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-base text-foreground truncate">{edu.institution}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground shrink-0 border border-border">
                            {edu.start_year} - {edu.is_current ? (id ? 'Sekarang' : 'Present') : edu.end_year}
                          </span>
                        </div>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {id ? edu.degree_id : edu.degree_en}
                          {edu.field_of_study ? ` • ${edu.field_of_study}` : ''}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
