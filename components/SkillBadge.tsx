import { ReactNode } from "react";
import type { Skill } from "@/types";

type SkillBadgeProps = {
  skill: Skill;
  icon?: ReactNode; // Using actual icon component if passed from parent
};

export default function SkillBadge({ skill, icon }: SkillBadgeProps) {
  const levelColors = {
    Beginner: "text-gray-400 border-gray-600",
    Intermediate: "text-[var(--color-neon-blue)] border-[var(--color-neon-blue)]/50",
    Advanced: "text-[var(--color-neon-green)] border-[var(--color-neon-green)]/50",
  };

  return (
    <div className="glass p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:bg-white/10 hover:scale-105 group">
      <div className="h-12 w-12 rounded-lg bg-[#0A0A0F] border border-white/5 flex items-center justify-center text-2xl group-hover:text-[var(--color-neon-green)] transition-colors">
        {icon || <span>✨</span>}
      </div>
      <div>
        <h4 className="font-bold text-sm">{skill.name}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full border bg-black/20 ${levelColors[skill.level]}`}>
          {skill.level}
        </span>
      </div>
    </div>
  );
}
