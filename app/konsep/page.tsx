'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaLightbulb } from "react-icons/fa";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import type { Project } from "@/types";

export default function KonsepPage() {
  const [concepts, setConcepts] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "Concept")
          .eq("is_published", true)
          .order("sort_order", { ascending: true });

        if (data) {
          setConcepts(data);
        }
      } catch (error) {
        console.error("Error fetching concepts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConcepts();
  }, []);

  const t = {
    pageTitle: language === 'id' ? 'Konsep & Eksplorasi' : 'Concepts & R&D',
    pageDesc: language === 'id'
      ? 'Ide eksplorasi dan konsep masa depan yang sedang dikembangkan atau dalam tahap riset.'
      : 'Exploratory ideas and future concepts currently under development or research.',
    technology: language === 'id' ? 'Teknologi' : 'Technology',
    status: language === 'id' ? 'Konsep' : 'Concept',
    noData: language === 'id'
      ? 'Belum ada data konsep yang dipublikasikan.'
      : 'No concept data published yet.',
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen">
        <Container>
          <PageSkeleton />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background transition-colors duration-300">
      <Container>
        {/* Header */}
        <div className="text-left mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {t.pageDesc}
          </p>
        </div>

        {/* Content */}
        {concepts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {concepts.map((concept) => (
              <Card
                key={concept.id}
                className="hover:border-border/80 transition-all shadow-sm flex flex-col"
              >
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <FaLightbulb size={24} />
                    </div>
                    <Badge variant="secondary">
                      {t.status}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {language === 'id' ? concept.title_id : concept.title_en}
                  </h2>

                  {concept.description_id && (
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                      {language === 'id' ? concept.description_id : concept.description_en}
                    </p>
                  )}

                  {concept.tech_stack && concept.tech_stack.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        {t.technology}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {concept.tech_stack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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