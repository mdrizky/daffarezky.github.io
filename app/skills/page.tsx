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
import { FaBullseye, FaPenNib, FaSearchDollar, FaFilter, FaRobot, FaTools } from "react-icons/fa";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import CertificateCard from "@/components/CertificateCard";

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

        {/* Certificates Section (Tampilan Sertifikat Realistis seperti Permintaan) */}
        {(() => {
          const defaultCerts: Certificate[] = [
            { 
              id: "cert-dicoding-1", 
              title_id: "Dasar-Dasar Literasi Keuangan", 
              title_en: "Financial Literacy Fundamentals", 
              issuer: "Dicoding", 
              file_url: "/assets/certificates/Financial Literacy 101.pdf", 
              date_issued: "2025" 
            },
            { 
              id: "cert-tasheel-1", 
              title_id: "Sertifikat Tasheel", 
              title_en: "Tasheel Certification", 
              issuer: "Tasheel", 
              file_url: "/assets/certificates/sertifikat-tasheel.pdf", 
              date_issued: "2024" 
            },
            { 
              id: "cert-tasheel-2", 
              title_id: "Surat Rekomendasi Tasheel", 
              title_en: "Tasheel Recommendation Letter", 
              issuer: "Tasheel", 
              file_url: "/assets/certificates/surat-rekomendasi-tasheel.pdf", 
              date_issued: "2024" 
            },
            { 
              id: "cert-digitalent-1", 
              title_id: "AI Engineer For Milenial", 
              title_en: "AI Engineer For Milenial", 
              issuer: "Digitalent", 
              file_url: "/assets/certificates/ai-engineer-milenial.pdf", 
              date_issued: "2024" 
            },
            { 
              id: "cert-digitalent-2", 
              title_id: "Ethical Hacker For Dummies", 
              title_en: "Ethical Hacker For Dummies", 
              issuer: "Digitalent", 
              file_url: "/assets/certificates/ethical-hacker-dummies.pdf", 
              date_issued: "2024" 
            },
            { 
              id: "cert-digitalent-3", 
              title_id: "Pengenalan Produk Digital dan Desain Grafis", 
              title_en: "Introduction to Digital Products & Graphic Design", 
              issuer: "Digitalent", 
              file_url: "/assets/certificates/digital-products-graphic-design.pdf", 
              date_issued: "2024" 
            },
          ];

          const displayCerts = certificates.length > 0 ? certificates : defaultCerts;

          return (
            <div className="animate-fade-in pt-16 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                    {id ? 'Kompetensi & Lisensi' : 'Credentials & Licensing'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                    {id ? 'Sertifikasi Profesional' : 'Professional Certifications'}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  {id ? 'Klik pada kartu sertifikat untuk melihat pratinjau lengkap dan dokumen PDF aslinya.' : 'Click on any certificate to view high-res preview and original PDF.'}
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCerts.map((cert) => (
                  <CertificateCard 
                    key={cert.id} 
                    certificate={cert} 
                    language={language}
                    category={cert.issuer === 'Dicoding' ? 'Literasi Finansial & Tech' : 'Informatika & Pemrograman'} 
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </Container>
    </div>
  );
}
