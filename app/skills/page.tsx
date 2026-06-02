'use client'

import { useEffect, useState } from "react";
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

export default function KeahlianPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, certsRes] = await Promise.all([
          supabase.from("skills").select("*"),
          supabase.from("certificates").select("*")
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
      case 'nextjs': return <SiNextdotjs className="text-black dark:text-white" />;
      case 'laravel': return <SiLaravel className="text-[#FF2D20]" />;
      case 'flutter': return <SiFlutter className="text-[#02569B]" />;
      case 'sheets': return <SiGooglesheets className="text-[#34A853]" />;
      case 'looker': return <SiLooker className="text-[#4285F4]" />;
      case 'analytics': return <SiGoogleanalytics className="text-[#E37400]" />;
      case 'canva': return <SiCanva className="text-[#00C4CC]" />;
      case 'figma': return <SiFigma className="text-[#F24E1E]" />;
      case 'notion': return <SiNotion className="text-gray-900 dark:text-white" />;
      case 'trello': return <SiTrello className="text-[#0052CC]" />;
      case 'seo': return <FaSearchDollar className="text-[var(--color-neon-blue)]" />;
      case 'content': return <FaBullseye className="text-[#FF0000]" />;
      case 'copy': return <FaPenNib className="text-[var(--color-neon-green)]" />;
      case 'funnel': return <FaFilter className="text-[#F24E1E]" />;
      case 'chatgpt': return <SiOpenai className="text-[#412991] dark:text-white" />;
      case 'claude': return <SiAnthropic className="text-[#D97757]" />;
      case 'midjourney': return <FaRobot className="text-gray-900 dark:text-white" />;
      case 'n8n': return <SiN8N className="text-[#FF6D5A]" />;
      default: return <FaTools className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const groupedSkills = groupSkills(skills);
  const categories = Object.keys(groupedSkills);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0A0A0F] transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            {language === 'id' ? 'Keahlian & ' : 'Skills & '}<span className="text-gradient">{language === 'id' ? 'Sertifikasi' : 'Certifications'}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'id'
              ? 'Teknologi, platform, dan sertifikasi profesional yang mendukung kompetensi saya.'
              : 'Technologies, platforms, and professional certifications that support my competence.'}
          </p>
        </div>

        {/* Skills Section */}
        <div className="space-y-16 mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-heading font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-4">
                <span className="w-8 h-1 bg-gradient-neon rounded-full"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedSkills[category].map((skill: Skill, idx: number) => (
                  <SkillBadge 
                    key={idx} 
                    skill={skill} 
                    icon={
                      (skill.icon.trim().startsWith('<svg') || skill.icon.trim().startsWith('<?xml')) ? (
                        <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" />
                      ) : (skill.icon.startsWith('http') || skill.icon.startsWith('/')) ? (
                        <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />
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
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center text-gray-900 dark:text-white">
            {language === 'id' ? 'Sertifikasi ' : 'Professional '}<span className="text-gradient">{language === 'id' ? 'Profesional' : 'Certifications'}</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl flex flex-col items-center text-center group hover:border-[var(--color-neon-green)]/50 transition-all hover:-translate-y-2 shadow-sm">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 text-[var(--color-neon-green)] group-hover:scale-110 transition-transform shadow-inner">
                  <FaFileDownload size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white leading-tight">
                  {language === 'id' ? cert.title_id : cert.title_en}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                  {cert.issuer} • {cert.date_issued}
                </p>
                <a 
                  href={cert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto px-6 py-2 rounded-full border border-gray-200 dark:border-white/10 text-sm font-bold text-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)] hover:text-white transition-all"
                >
                  {language === 'id' ? 'Lihat PDF' : 'View PDF'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
