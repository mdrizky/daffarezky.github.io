'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import SkillBadge from "@/components/SkillBadge";
import type { Skill, Certificate } from "@/types";
import { 
  SiHtml5, SiCss as SiCss3, SiJavascript, SiReact, 
  SiGooglesheets, SiLooker, SiGoogleanalytics,
  SiCanva, SiFigma, SiNotion, SiTrello,
  SiOpenai, SiAnthropic, SiN8N, SiNextdotjs, SiLaravel, SiFlutter
} from "react-icons/si";
import { FaBullseye, FaPenNib, FaSearchDollar, FaFilter, FaRobot, FaTools, FaFileDownload } from "react-icons/fa";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function KeahlianPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const id = language === 'id';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, certsRes] = await Promise.all([
          supabase.from("skills").select("*").eq("is_published", true),
          supabase.from("certificates").select("*").eq("is_published", true)
        ]);
        
        if (skillsRes.data) setSkills(skillsRes.data);
        if (certsRes.data) setCertificates(certsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupSkills = (items: Skill[]) => {
    return items.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  };

  const getIconElement = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'html': return <SiHtml5 className="text-[#E34F26]" />;
      case 'css': return <SiCss3 className="text-[#1572B6]" />;
      case 'js':
      case 'javascript': return <SiJavascript className="text-[#F7DF1E]" />;
      case 'react': return <SiReact className="text-[#61DAFB]" />;
      case 'nextjs': return <SiNextdotjs className="text-foreground" />;
      case 'laravel': return <SiLaravel className="text-[#FF2D20]" />;
      case 'flutter': return <SiFlutter className="text-[#02569B]" />;
      case 'sheets': return <SiGooglesheets className="text-[#34A853]" />;
      case 'looker': return <SiLooker className="text-[#4285F4]" />;
      case 'analytics': return <SiGoogleanalytics className="text-[#E37400]" />;
      case 'canva': return <SiCanva className="text-[#00C4CC]" />;
      case 'figma': return <SiFigma className="text-[#F24E1E]" />;
      case 'notion': return <SiNotion className="text-foreground" />;
      case 'trello': return <SiTrello className="text-[#0052CC]" />;
      case 'seo': return <FaSearchDollar className="text-primary" />;
      case 'content': return <FaBullseye className="text-destructive" />;
      case 'copy': return <FaPenNib className="text-primary" />;
      case 'funnel': return <FaFilter className="text-destructive" />;
      case 'chatgpt': return <SiOpenai className="text-foreground" />;
      case 'claude': return <SiAnthropic className="text-[#D97757]" />;
      case 'midjourney': return <FaRobot className="text-foreground" />;
      case 'n8n': return <SiN8N className="text-[#FF6D5A]" />;
      default: return <FaTools className="text-muted-foreground" />;
    }
  };

  if (loading) return <PageSkeleton />;

  const groupedSkills = groupSkills(skills);
  const categories = Object.keys(groupedSkills);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-foreground">
            {id ? 'Keahlian & ' : 'Skills & '}<span className="text-muted-foreground">{id ? 'Sertifikasi' : 'Certifications'}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {id
              ? 'Teknologi, platform, dan sertifikasi profesional yang mendukung kompetensi saya.'
              : 'Technologies, platforms, and professional certifications that support my competence.'}
          </p>
        </div>

        {/* Skills Section */}
        <div className="space-y-16 mb-32 animate-fade-in">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-heading font-bold mb-8 text-foreground flex items-center gap-4">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedSkills[category].map((skill: Skill, idx: number) => (
                  <SkillBadge 
                    key={idx} 
                    skill={skill} 
                    icon={
                      (skill.icon.trim().startsWith('<svg') || skill.icon.trim().startsWith('<?xml')) ? (
                        <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" />
                      ) : (skill.icon.startsWith('http') || skill.icon.startsWith('/')) ? (
                        <Image src={skill.icon} alt={skill.name} width={24} height={24} className="w-6 h-6 object-contain" />
                      ) : (
                        getIconElement(skill.icon)
                      )
                    } 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div className="animate-fade-in pt-16 border-t border-border">
            <SectionHeader title={id ? 'Sertifikasi Profesional' : 'Professional Certifications'} />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-1 transition-all shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-inner">
                    <FaFileDownload size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground leading-tight">
                    {id ? cert.title_id : cert.title_en}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 font-medium">
                    {cert.issuer} • {cert.date_issued}
                  </p>
                  <Button 
                    href={cert.file_url}
                    variant="outline"
                    className="mt-auto w-full"
                  >
                    {id ? 'Lihat Bukti' : 'View Credential'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
