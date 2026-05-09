import { ReactNode } from "react";
import type { Skill } from "@/types";

type SkillBadgeProps = {
  skill: Skill;
  icon?: ReactNode; // Using actual icon component if passed from parent
};

export default function SkillBadge({ skill, icon }: SkillBadgeProps) {
  const levelColors = {
    Beginner: "text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-600",
    Intermediate: "text-blue-600 border-blue-300 dark:text-[var(--color-neon-blue)] dark:border-[var(--color-neon-blue)]/50",
    Advanced: "text-green-600 border-green-300 dark:text-[var(--color-neon-green)] dark:border-[var(--color-neon-green)]/50",
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:shadow-md dark:hover:bg-white/10 hover:-translate-y-1 group">
      <div className="h-12 w-12 rounded-lg bg-gray-50 dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/5 flex items-center justify-center text-2xl group-hover:text-[var(--color-neon-green)] transition-colors text-gray-700 dark:text-white">
        {icon || <span>✨</span>}
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{skill.name}</h4>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border bg-gray-50 dark:bg-black/20 ${levelColors[skill.level]}`}>
          {skill.level}
        </span>
      </div>
    </div>
  );
}
