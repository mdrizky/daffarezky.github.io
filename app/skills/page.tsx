import { createClient } from "@/lib/supabase-server";
import SkillBadge from "@/components/SkillBadge";
import type { Skill } from "@/types";
import { 
  SiHtml5, SiCss as SiCss3, SiJavascript, SiReact, 
  SiGooglesheets, SiLooker, SiGoogleanalytics,
  SiCanva, SiFigma, SiNotion, SiTrello,
  SiOpenai, SiAnthropic, SiN8N
} from "react-icons/si";
import { FaBullseye, FaPenNib, FaSearchDollar, FaFilter, FaRobot } from "react-icons/fa";

export const revalidate = 3600;

export default async function SkillsPage() {
  const supabase = await createClient();
  const { data: skillsData } = await supabase.from("skills").select("*");

  // Fallback default skills data
  const defaultSkills = [
    { category: "Frontend", name: "HTML", level: "Advanced", icon: <SiHtml5 className="text-[#E34F26]" /> },
    { category: "Frontend", name: "CSS", level: "Advanced", icon: <SiCss3 className="text-[#1572B6]" /> },
    { category: "Frontend", name: "JavaScript", level: "Intermediate", icon: <SiJavascript className="text-[#F7DF1E]" /> },
    { category: "Frontend", name: "React basics", level: "Beginner", icon: <SiReact className="text-[#61DAFB]" /> },
    
    { category: "Analytics", name: "Google Sheets", level: "Advanced", icon: <SiGooglesheets className="text-[#34A853]" /> },
    { category: "Analytics", name: "Looker Studio", level: "Intermediate", icon: <SiLooker className="text-[#4285F4]" /> },
    { category: "Analytics", name: "Google Analytics", level: "Intermediate", icon: <SiGoogleanalytics className="text-[#E37400]" /> },
    
    { category: "Tools", name: "Canva", level: "Advanced", icon: <SiCanva className="text-[#00C4CC]" /> },
    { category: "Tools", name: "Figma (basic)", level: "Beginner", icon: <SiFigma className="text-[#F24E1E]" /> },
    { category: "Tools", name: "Notion", level: "Advanced", icon: <SiNotion className="text-white" /> },
    { category: "Tools", name: "Trello", level: "Intermediate", icon: <SiTrello className="text-[#0052CC]" /> },
    
    { category: "Marketing", name: "SEO basics", level: "Intermediate", icon: <FaSearchDollar className="text-[var(--color-neon-blue)]" /> },
    { category: "Marketing", name: "Content Strategy", level: "Advanced", icon: <FaBullseye className="text-[#FF0000]" /> },
    { category: "Marketing", name: "Copywriting", level: "Intermediate", icon: <FaPenNib className="text-[var(--color-neon-green)]" /> },
    { category: "Marketing", name: "Funnel Design", level: "Intermediate", icon: <FaFilter className="text-[#F24E1E]" /> },
    
    { category: "AI Tools", name: "ChatGPT", level: "Advanced", icon: <SiOpenai className="text-[#412991]" /> },
    { category: "AI Tools", name: "Claude AI", level: "Advanced", icon: <SiAnthropic className="text-[#D97757]" /> },
    { category: "AI Tools", name: "Midjourney", level: "Intermediate", icon: <FaRobot className="text-white" /> },
    { category: "AI Tools", name: "n8n basics", level: "Beginner", icon: <SiN8N className="text-[#FF6D5A]" /> },
  ];

  // Grouping function
  const groupSkills = (items: any[]) => {
    return items.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, any[]>);
  };

  const hasDbSkills = skillsData && skillsData.length > 0;
  const groupedSkills = groupSkills(hasDbSkills ? skillsData : defaultSkills);
  const categories = Object.keys(groupedSkills);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Skills & <span className="text-gradient">Tools</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Teknologi, platform, dan strategi yang saya gunakan untuk menciptakan solusi digital.
          </p>
        </div>

        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-heading font-bold mb-6 text-white border-b border-white/10 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedSkills[category].map((skill: any, idx: number) => (
                  <SkillBadge 
                    key={idx} 
                    skill={skill as Skill} 
                    icon={skill.icon} // Pass icon directly if from defaults
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
