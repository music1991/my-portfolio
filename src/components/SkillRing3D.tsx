import { useEffect, useRef, type MouseEvent } from "react";
import type { Skill } from "../entities/lib/stack";

type Props = {
  label: string;
  skills: (Skill & { description: string })[];
  speed?: number;
  startAngle?: number;
};

/**
 * A CSS 3D orbiting ring: each skill icon is placed around a circle in 3D
 * space (translateZ/translateX per angle) and the whole ring keeps
 * spinning. Depth (z) drives scale + opacity so icons recede convincingly.
 * Drag horizontally to spin manually; hover an icon to pause the ring.
 */
export default function SkillRing3D({ label, skills, speed = 0.15, startAngle = 0 }: Props) {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const angleRef = useRef(startAngle);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(startAngle);
  const rafRef = useRef<number | null>(null);

  const radius = 96;

  const applyRing = () => {
    const n = skills.length;
    if (!n) return;
    const base = angleRef.current;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const angle = base + i * (360 / n);
      const rad = (angle * Math.PI) / 180;
      const x = radius * Math.sin(rad);
      const z = radius * Math.cos(rad);
      const t = (z + radius) / (2 * radius);
      const scale = 0.6 + t * 0.55;
      const opacity = 0.38 + t * 0.62;
      el.style.transform = `translate3d(${x}px, 0px, ${z}px) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(Math.round(z + radius));
    });
  };

  useEffect(() => {
    const loop = () => {
      if (!draggingRef.current && !pausedRef.current) {
        angleRef.current += speed;
      }
      applyRing();
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    const onMove = (e: globalThis.MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      angleRef.current = dragStartAngleRef.current + dx * 0.5;
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills.length, speed]);

  const startDrag = (e: MouseEvent) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = angleRef.current;
    e.preventDefault();
  };

  return (
    <div className="bg-card border border-border p-6 pt-7 pb-9 flex flex-col items-center rounded-xl">
      <h3 className="font-mono font-semibold text-xs tracking-widest uppercase text-accent mb-5">
        {label}
      </h3>
      <div
        onMouseDown={startDrag}
        className="relative cursor-grab active:cursor-grabbing"
        style={{ width: 230, height: 230, perspective: 950, touchAction: "none" }}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {skills.map((skill, i) => (
            <div
              key={skill.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onMouseEnter={() => (pausedRef.current = true)}
              onMouseLeave={() => (pausedRef.current = false)}
              className="absolute flex flex-col items-center gap-1.5 will-change-transform"
              style={{ top: "50%", left: "50%", width: 64, margin: "-46px 0 0 -32px" }}
            >
              <div className="w-16 h-16 grid place-items-center">
                <img
                  src={`/images/tech-icons/${skill.id}.png`}
                  alt={skill.name}
                  className="max-w-11 max-h-11 object-contain"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap bg-card/90 px-1.5 rounded">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
