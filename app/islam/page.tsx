'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { FaBook, FaStar, FaMosque } from "react-icons/fa";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import type { Islamic } from "@/types";

export default function IslamPage() {
  const [islamicData, setIslamicData] = useState<Islamic[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchIslamicData = async () => {
      try {
        const { data } = await supabase
          .from("islamic")
          .select("*")
          .order("order_index", { ascending: true });
        
        if (data) setIslamicData(data);
      } catch (error) {
        console.error("Error fetching Islamic data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIslamicData();
  }, []);

  const t = {
    pageTitle: language === 'id' ? 'Islam' : 'Islamic Insights',
    pageDesc: language === 'id'
      ? 'Perjalanan spiritual dan nilai-nilai Islami yang membentuk kehidupan dan etos kerja.'
      : 'Spiritual journey and Islamic values that shape life and professional ethics.',
    noData: language === 'id'
      ? 'Belum ada data Islam yang dipublikasikan.'
      : 'No Islamic insights published yet.',
  };

  // Group by category
  const groupedData = islamicData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Islamic[]>);

  const categoryIcons: Record<string, React.ReactNode> = {
    'Quran': <FaBook />,
    'Hadith': <FaBook />,
    'Worship': <FaMosque />,
    'Values': <FaStar />,
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
        {islamicData.length > 0 ? (
          <div className="space-y-16 animate-fade-in">
            {Object.entries(groupedData).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
                  <div className="p-3 bg-secondary rounded-xl text-primary shadow-sm border border-border">
                    {categoryIcons[category] || <FaBook />}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                    {category}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:border-border/80 transition-all shadow-sm">
                      <CardContent className="p-6 flex flex-col h-full">
                        {item.featured && (
                          <div className="mb-3">
                            <Badge variant="default" className="gap-1.5 inline-flex items-center">
                              <FaStar size={10} /> Unggulan
                            </Badge>
                          </div>
                        )}
                        
                        <h3 className="text-xl font-bold mb-2 text-foreground">
                          {language === 'id' ? item.title_id : item.title_en}
                        </h3>
                        
                        {item.subtitle_id && (
                          <p className="text-sm font-medium text-primary mb-3">
                            {language === 'id' ? item.subtitle_id : item.subtitle_en}
                          </p>
                        )}
                        
                        {item.reference && (
                          <p className="text-xs text-muted-foreground mb-4 italic">
                            {item.reference}
                          </p>
                        )}
                        
                        {item.description_id && (
                          <p className="text-muted-foreground text-sm leading-relaxed mt-auto">
                            {language === 'id' ? item.description_id : item.description_en}
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
