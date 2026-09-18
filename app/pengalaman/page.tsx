'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaBriefcase, FaUsers, FaAward } from "react-icons/fa";
import type { Experience } from "@/types";
import { Container } from "@/components/ui/Container";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export default function PengalamanPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const id = language === 'id';

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await supabase
          .from("experience")
          .select("*")
          .eq("is_published", true)
          .order("order_index", { ascending: true });
        
        if (data) {
          setExperiences(data);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const t = {
    pageTitle: id ? 'Pengalaman' : 'Experience',
    pageDesc: id
      ? 'Perjalanan kepemimpinan, organisasi, dan pengembangan diri yang membentuk karakter dan kemampuan.'
      : 'Leadership journey, organizational experience, and personal development that shapes character and abilities.',
    present: id ? 'Sekarang' : 'Present',
    noData: id
      ? 'Belum ada data pengalaman. Tambahkan melalui panel admin.'
      : 'No experience data yet. Add through admin panel.',
  };

  // Group experiences by category
  const groupedExperiences = experiences.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = [];
    acc[exp.category].push(exp);
    return acc;
  }, {} as Record<string, Experience[]>);

  const categoryIcons: Record<string, React.ReactNode> = {
    'Organisasi': <FaUsers />,
    'Freelance': <FaBriefcase />,
    'Kompetisi': <FaAward />,
    'Volunteer': <FaUsers />,
    'Magang': <FaBriefcase />,
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t.pageDesc}
          </p>
        </div>

        {/* Content */}
        {experiences.length > 0 ? (
          <div className="space-y-16 animate-fade-in max-w-4xl mx-auto">
            {Object.entries(groupedExperiences).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
                  <div className="p-3 bg-secondary rounded-xl text-primary shadow-sm border border-border">
                    {categoryIcons[category] || <FaBriefcase />}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                    {category}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {items.map((exp) => (
                    <Card key={exp.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                          <h3 className="text-xl font-bold text-foreground">
                            {id ? exp.title_id : exp.title_en}
                          </h3>
                          {exp.is_current && (
                            <div className="self-start shrink-0">
                              <Badge variant="default">{t.present}</Badge>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary mb-3">
                          {exp.organization} <span className="text-muted-foreground font-normal mx-2">•</span> <span className="text-muted-foreground font-normal">{exp.role}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          {exp.start_date} - {exp.is_current ? t.present : exp.end_date}
                        </p>
                        {(id ? exp.description_id : exp.description_en) && (
                          <p className="text-muted-foreground text-sm">
                            {id ? exp.description_id : exp.description_en}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-3xl">
            <p className="text-muted-foreground">{t.noData}</p>
          </div>
        )}
      </Container>
    </div>
  );
}
