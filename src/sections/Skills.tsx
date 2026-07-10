import React, { useMemo } from "react";
import { useLanguage } from "../context/Language";
import SkillRing3D from "../components/SkillRing3D";
import { STACK_LIST, type Skill } from "../entities/lib/stack";

const SkillMini: React.FC<{ item: Skill }> = ({ item }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-12 rounded-xl grid place-items-center bg-card/70 border border-border shadow-sm">
      <img
        src={`/images/tech-icons/${item.id}.png`}
        className="w-8 h-8 object-contain"
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
      />
    </div>
    <span className="text-[11px] sm:text-xs text-muted-foreground text-center whitespace-normal leading-snug">
      {item.name}
    </span>
  </div>
);

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();

  const groups = useMemo(
    () =>
      STACK_LIST.map((stack) => ({
        id: stack.id,
        label: t?.(stack.labelKey) ?? stack.id,
        skills: stack.skills.map((skill) => ({
          ...skill,
          description: t?.(skill.descriptionKey) ?? `Description for ${skill.name}`,
        })),
      })),
    [t]
  );

  const frontSkills = useMemo(() => groups.find((g) => g.id === "frontend")?.skills || [], [groups]);
  const backSkills = useMemo(() => groups.find((g) => g.id === "backend")?.skills || [], [groups]);
  const dbSkills = useMemo(() => groups.find((g) => g.id === "database")?.skills || [], [groups]);

  const frontendLabel = t?.("skills.frontend") ?? "Front-End";
  const backendLabel = t?.("skills.backend") ?? "Back-End";
  const databaseLabel = t?.("skills.database") ?? "Database & Dev Tools";

  return (
    <section className="max-w-6xl mx-auto mt-20 md:mt-40">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8 md:mb-10">
        {t?.("skills.title") ?? "Technical Skills"}
      </h2>

      <div className="md:hidden px-4 space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            {frontendLabel}
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {frontSkills.map((it) => (
              <SkillMini key={it.id} item={it} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            {backendLabel}
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {backSkills.map((it) => (
              <SkillMini key={it.id} item={it} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            {databaseLabel}
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {dbSkills.map((it) => (
              <SkillMini key={it.id} item={it} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block px-6">
        <p className="text-center font-mono text-xs text-muted-foreground mb-8">
          // {t?.("skills.dragHint") ?? "arrastrá un anillo para girarlo"}
        </p>
        <div className="grid grid-cols-3 gap-0.5 max-w-5xl mx-auto bg-border">
          <SkillRing3D label={frontendLabel} skills={frontSkills} speed={0.15} startAngle={0} />
          <SkillRing3D label={backendLabel} skills={backSkills} speed={-0.12} startAngle={70} />
          <SkillRing3D label={databaseLabel} skills={dbSkills} speed={0.19} startAngle={150} />
        </div>
      </div>
    </section>
  );
};
