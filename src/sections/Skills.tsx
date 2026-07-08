import React, { useMemo, useState } from "react";
import { useLanguage } from "../context/Language";
import JarvisHoverFrame from "../components/JarvisPanel";
import { STACK_LIST, type Skill, type Mode } from "../entities/lib/stack";

const BlinkingCursor: React.FC = () => (
  <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-0 cursor-blink align-middle" />
);

const SectionTitle: React.FC<{
  children: React.ReactNode;
  isVisible: boolean;
  showCursor?: boolean;
}> = ({ children, isVisible, showCursor = false }) => (
  <div
    className={[
      "flex items-center gap-3 transition-all duration-300",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
    ].join(" ")}
  >
    <span className="text-cyan-300 font-mono text-lg font-bold tracking-wider">
      {children}
      {showCursor && <BlinkingCursor />}
    </span>
  </div>
);

const PulsingLine: React.FC = () => (
  <div
    className="absolute left-0 right-0 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulseLine rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)]"
    style={{ filter: "blur(0.5px)", top: "40%" }}
  />
);

const RoadmapItem: React.FC<{
  item: Skill & { description: string };
  index: number;
  mode: Mode;
}> = ({ item, index, mode }) => {
  const showTop = mode === 2 ? true : mode === 0 ? false : index % 2 === 0;
  const base = index * 90;
  const dLine = 0 + base;
  const dText = 200 + base;

  const DescriptionBlock: React.FC<{
    children: React.ReactNode;
    position: "top" | "bottom";
  }> = ({ children, position }) => (
    <div
      className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none ${
        position === "top" ? "bottom-28" : "top-28"
      }`}
    >
      {position === "top" && (
        <>
          <div
            className="min-w-[12rem] sm:min-w-[14rem] max-w-[16rem] text-[11px] sm:text-xs font-medium leading-snug text-muted-foreground opacity-0 mb-3 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-normal text-center px-2"
            style={{ transitionDelay: `${dText}ms` }}
          >
            {children}
          </div>
          <div
            className="w-px h-0 bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:h-8 transition-[height] duration-300"
            style={{ transitionDelay: `${dLine}ms` }}
          />
        </>
      )}
      {position === "bottom" && (
        <>
          <div
            className="w-px h-0 bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:h-8 transition-[height] duration-300"
            style={{ transitionDelay: `${dLine}ms` }}
          />
          <div
            className="mt-2 min-w-[12rem] sm:min-w-[14rem] max-w-[16rem] text-[11px] sm:text-xs font-medium leading-snug text-muted-foreground opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-normal text-center px-2"
            style={{ transitionDelay: `${dText}ms` }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-start w-24 sm:w-28 group">
      {showTop && <DescriptionBlock position="top">{item.description}</DescriptionBlock>}

      {/* Ícono */}
      <div
        className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl grid place-items-center bg-card/70 border border-border shadow-sm transition-transform duration-300 group-hover:scale-105"
        title={item.name}
      >
        <img
          src={`/images/tech-icons/${item.id}.png`}
          className="w-10 h-10 object-contain"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      </div>

      <div
        className="mt-4 text-[11px] sm:text-xs font-medium text-muted-foreground opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap"
        style={{ transitionDelay: `${dText}ms` }}
      >
        {item.name}
      </div>

      {!showTop && <DescriptionBlock position="bottom">{item.description}</DescriptionBlock>}
    </div>
  );
};

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
  const [hoverFrontend, setHoverFrontend] = useState(false);
  const [hoverBackend, setHoverBackend] = useState(false);
  const [hoverDb, setHoverDb] = useState(false);

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
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-500 to-accent bg-clip-text text-transparent mb-8 md:mb-10">
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

      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-10 px-12 xl:px-36">
          <SectionTitle isVisible={!(hoverDb || hoverFrontend)} showCursor={hoverBackend}>
            {backendLabel}
          </SectionTitle>

          <SectionTitle isVisible={!(hoverBackend || hoverFrontend)} showCursor={hoverDb}>
            {databaseLabel}
          </SectionTitle>

          <SectionTitle isVisible={!(hoverBackend || hoverDb)} showCursor={hoverFrontend}>
            {frontendLabel}
          </SectionTitle>
        </div>

        <JarvisHoverFrame
          className={[
            "relative mx-auto max-w-5xl group px-12 transition-all duration-300",
            hoverFrontend || hoverDb ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0",
          ].join(" ")}
          onHoverChange={setHoverBackend}
        >
          <PulsingLine />
          <div className="relative flex items-center justify-between gap-6">
            {backSkills.map((it, idx) => (
              <RoadmapItem key={it.id} item={it as any} index={idx} mode={0} />
            ))}
          </div>
        </JarvisHoverFrame>

        <JarvisHoverFrame
          className={[
            "relative mx-auto max-w-5xl group px-12 transition-all duration-300",
            hoverBackend || hoverDb ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0",
          ].join(" ")}
          onHoverChange={setHoverFrontend}
        >
          <PulsingLine />
          <div className="relative flex items-center justify-between gap-6">
            {frontSkills.map((it, idx) => (
              <RoadmapItem key={it.id} item={it as any} index={idx} mode={1} />
            ))}
          </div>
        </JarvisHoverFrame>

        <JarvisHoverFrame
          className={[
            "relative mx-auto max-w-5xl group px-12 transition-all duration-300",
            hoverBackend || hoverFrontend ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0",
          ].join(" ")}
          onHoverChange={setHoverDb}
        >
          <PulsingLine />
          <div className="relative flex items-center justify-between gap-6">
            {dbSkills.map((it, idx) => (
              <RoadmapItem key={it.id} item={it as any} index={idx} mode={2} />
            ))}
          </div>
        </JarvisHoverFrame>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink { animation: blink 1s step-end infinite; }

        @keyframes pulseLine {
          0%, 100% { opacity: 0.4; box-shadow: 0 0 0 rgba(34,211,238,0.0); }
          50% { opacity: 1; box-shadow: 0 0 25px rgba(34,211,238,0.6); }
        }
        .animate-pulseLine { animation: pulseLine 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
};
