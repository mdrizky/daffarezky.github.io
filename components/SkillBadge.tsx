import { ReactNode } from "react";
import type { Skill } from "@/types";

type SkillBadgeProps = {
  skill: Skill;
  icon?: ReactNode; // Using actual icon component if passed from parent
};

export default function SkillBadge({ skill, icon }: SkillBadgeProps) {
  const levelColors = {
    Beginner: "text-muted-foreground border-muted-foreground/30",
    Intermediate: "text-accent-foreground border-accent-foreground/30",
    Advanced: "text-primary border-primary/30",
  };

  return (
    <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <div className="h-12 w-12 rounded-lg bg-secondary border border-border flex items-center justify-center text-2xl group-hover:text-primary transition-colors text-foreground">
        {icon || <span>✨</span>}
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground">{skill.name}</h4>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border bg-secondary/50 ${levelColors[skill.level]}`}>
          {skill.level}
        </span>
      </div>
    </div>
  );
}
