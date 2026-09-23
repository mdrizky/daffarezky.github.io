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

        {/* 3. Learning Journey */}
        <section className="mb-24">
          <SectionHeader align="left" title={id ? 'Perjalanan Belajar' : 'Learning Journey'} />
          <div className="space-y-8 max-w-3xl">
            {milestones.map(m => (
              <div key={m.id} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <Badge variant="secondary" className="px-3 py-1 font-bold whitespace-nowrap">{m.year}</Badge>
                  <div className="w-px h-full bg-border mt-4"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{id ? m.title_id : m.title_en}</h3>
                  <p className="text-muted-foreground">{id ? m.description_id : m.description_en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Education */}
        <section>
          <SectionHeader align="left" title={id ? 'Pendidikan' : 'Education'} />
          <div className="grid md:grid-cols-2 gap-6">
            {education.map(edu => (
              <Card key={edu.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-foreground">{edu.institution}</h3>
                    <Badge variant="outline">{edu.start_year} - {edu.is_current ? (id ? 'Sekarang' : 'Present') : edu.end_year}</Badge>
                  </div>
                  <p className="font-medium text-primary mb-2">{id ? edu.degree_id : edu.degree_en}</p>
                  <p className="text-sm text-muted-foreground">{id ? edu.description_id : edu.description_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
