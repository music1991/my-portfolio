import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../context/Language";
import { STACK_LIST, type Skill, type Stack } from "../entities/lib/stack";

type SkillItem = Skill & { label: string; description: string };
type Group = { id: Stack["id"]; area: Stack["area"]; label: string; skills: SkillItem[] };

const SkillIcon: React.FC<{ item: SkillItem }> = ({ item }) =>
  item.Icon ? (
    <div className="w-11 h-11 shrink-0 grid place-items-center rounded-lg bg-muted">
      <item.Icon className="w-6 h-6 text-accent" aria-hidden="true" />
    </div>
  ) : (
    <img
      src={`/images/tech-icons/${item.iconId ?? item.id}.webp`}
      alt=""
      width={44}
      height={44}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="w-11 h-11 shrink-0 object-contain"
      onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
    />
  );

const SkillCard: React.FC<{ item: SkillItem }> = ({ item }) => (
  <li className="w-64 shrink-0 rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:border-accent/60">
    <div className="flex items-center gap-3 mb-2">
      <SkillIcon item={item} />
      <h4 className="font-semibold text-card-foreground leading-tight">{item.label}</h4>
    </div>
    <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
  </li>
);

/**
 * Infinite horizontal marquee: the list is rendered three times and the
 * offset wraps every copy width, so the loop is seamless. It drifts on its
 * own and can be dragged left/right (mouse or touch); hover pauses it and
 * reduced motion turns off the drift.
 */
const SPEED = 30; // px per second

const SkillRow: React.FC<{ group: Group; reverse?: boolean }> = ({ group, reverse }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLUListElement>(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);
  const dragRef = useRef<{ x: number; offset: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!reduceMotion && !dragRef.current && !hoverRef.current) {
        offsetRef.current += (reverse ? 1 : -1) * SPEED * dt;
      }
      const width = copyRef.current?.offsetWidth ?? 0;
      // Keep the offset in (-width, 0]: shifting by one copy is invisible.
      const offset = width ? (((offsetRef.current % width) - width) % width) : offsetRef.current;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reverse]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, offset: offsetRef.current };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragRef.current) offsetRef.current = dragRef.current.offset + (e.clientX - dragRef.current.x);
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div>
      <h4 className="px-4 md:px-6 font-mono font-semibold text-xs tracking-widest uppercase text-accent mb-3">
        {group.label}
      </h4>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(e) => e.pointerType === "mouse" && (hoverRef.current = true)}
        onPointerLeave={() => (hoverRef.current = false)}
        className={`overflow-hidden select-none ${dragging ? "cursor-grabbing" : "cursor-grab"} [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]`}
        style={{ touchAction: "pan-y" }}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[0, 1, 2].map((copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? copyRef : undefined}
              className="flex gap-4 pr-4 py-1"
              aria-hidden={copy > 0 || undefined}
            >
              {group.skills.map((it) => (
                <SkillCard key={it.id} item={it} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();

  const groups = useMemo<Group[]>(
    () =>
      STACK_LIST.map((stack) => ({
        id: stack.id,
        area: stack.area,
        label: t(stack.labelKey),
        skills: stack.skills.map((skill) => ({
          ...skill,
          label: skill.nameKey ? t(skill.nameKey) : skill.name,
          description: t(skill.descriptionKey),
        })),
      })),
    [t]
  );

  const areas = [
    { id: "dev", title: t("skills.devTitle") },
    { id: "ai", title: t("skills.aiTitle") },
  ] as const;

  return (
    <section className="max-w-6xl mx-auto mt-20 md:mt-40">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
        {t("skills.title")}
      </h2>
      <p className="text-center font-mono text-xs text-muted-foreground mb-10 md:mb-12">
        {t("skills.hint")}
      </p>

      <div className="space-y-14">
        {areas.map((area) => (
          <div key={area.id}>
            <h3 className="px-4 md:px-6 text-xl font-bold text-foreground mb-6">{area.title}</h3>
            <div className="space-y-8">
              {groups
                .filter((g) => g.area === area.id)
                .map((g, i) => (
                  <SkillRow key={g.id} group={g} reverse={i % 2 === 1} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
