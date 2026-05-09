'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import SkillBadge from "@/components/SkillBadge";
import type { Skill } from "@/types";
import { 
  SiHtml5, SiCss as SiCss3, SiJavascript, SiReact, 
  SiGooglesheets, SiLooker, SiGoogleanalytics,
  SiCanva, SiFigma, SiNotion, SiTrello,
  SiOpenai, SiAnthropic, SiN8N
} from "react-icons/si";
import { FaBullseye, FaPenNib, FaSearchDollar, FaFilter, FaRobot, FaTools } from "react-icons/fa";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await supabase.from("skills").select("*");
        
        if (data && data.length > 0) {
          setSkills(data);
        } else {
          // Fallback default skills data
          const defaultSkills = [
            { id: "1", category: "Frontend", name: "HTML", level: "Advanced", icon: "html" },
            { id: "2", category: "Frontend", name: "CSS", level: "Advanced", icon: "css" },
            { id: "3", category: "Frontend", name: "JavaScript", level: "Intermediate", icon: "js" },
            { id: "4", category: "Frontend", name: "React basics", level: "Beginner", icon: "react" },
            
            { id: "5", category: "Analytics", name: "Google Sheets", level: "Advanced", icon: "sheets" },
            { id: "6", category: "Analytics", name: "Looker Studio", level: "Intermediate", icon: "looker" },
            { id: "7", category: "Analytics", name: "Google Analytics", level: "Intermediate", icon: "analytics" },
            
            { id: "8", category: "Tools", name: "Canva", level: "Advanced", icon: "canva" },
            { id: "9", category: "Tools", name: "Figma (basic)", level: "Beginner", icon: "figma" },
            { id: "10", category: "Tools", name: "Notion", level: "Advanced", icon: "notion" },
            { id: "11", category: "Tools", name: "Trello", level: "Intermediate", icon: "trello" },
            
            { id: "12", category: "Marketing", name: "SEO basics", level: "Intermediate", icon: "seo" },
            { id: "13", category: "Marketing", name: "Content Strategy", level: "Advanced", icon: "content" },
            { id: "14", category: "Marketing", name: "Copywriting", level: "Intermediate", icon: "copy" },
            { id: "15", category: "Marketing", name: "Funnel Design", level: "Intermediate", icon: "funnel" },
            
            { id: "16", category: "AI Tools", name: "ChatGPT", level: "Advanced", icon: "chatgpt" },
            { id: "17", category: "AI Tools", name: "Claude AI", level: "Advanced", icon: "claude" },
            { id: "18", category: "AI Tools", name: "Midjourney", level: "Intermediate", icon: "midjourney" },
            { id: "19", category: "AI Tools", name: "n8n basics", level: "Beginner", icon: "n8n" },
          ];
          setSkills(defaultSkills as Skill[]);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Grouping function
  const groupSkills = (items: Skill[]) => {
    return items.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
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

  const getIconElement = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'html': return <SiHtml5 className="text-[#E34F26]" />;
      case 'css': return <SiCss3 className="text-[#1572B6]" />;
      case 'js':
      case 'javascript': return <SiJavascript className="text-[#F7DF1E]" />;
      case 'react': return <SiReact className="text-[#61DAFB]" />;
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

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            Skills & <span className="text-gradient">Tools</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'id'
              ? 'Teknologi, platform, dan strategi yang saya gunakan untuk menciptakan solusi digital.'
              : 'Technologies, platforms, and strategies I use to create digital solutions.'}
          </p>
        </div>

        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-heading font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedSkills[category].map((skill: Skill, idx: number) => (
                  <SkillBadge 
                    key={idx} 
                    skill={skill} 
                    icon={skill.icon.startsWith('<svg') ? (
                      <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-6 h-6" />
                    ) : (
                      getIconElement(skill.icon)
                    )} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
