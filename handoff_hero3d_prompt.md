# Prompt para aplicar en mi-portfolio (Claude Code)

Pegá todo este mensaje tal cual en Claude Code, parado en la raíz del repo `my-portfolio`.

---

Necesito que apliques estos cambios EXACTOS a mi proyecto React + TypeScript + Tailwind (usa `@react-three/fiber`, `@react-three/drei`, `three`, `framer-motion`, que ya están en `package.json`). No cambies nada más de lo indicado. Los tokens de color viven en `src/index.css` como variables CSS (`--color-accent`, etc.) mapeadas en `tailwind.config.js` a `accent`, `background`, `card`, `border`, `muted-foreground`, etc. — usá esas clases, no colores hardcodeados salvo donde se indica `#0b0b0d` / `#2563eb` (fondo oscuro del hero y azul de la grilla 3D).

## 1. Crear `src/components/Hero3D.tsx`

```tsx
import { useRef, useMemo, type MouseEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/Language";
import images from "../images.json";

/**
 * Animated wireframe data-grid: a plane of points that gently undulates
 * (sine displacement) and drifts to follow the pointer, rendered behind
 * the hero copy. Colors are pulled from the design system's accent token.
 */
function WaveGrid({ pointer }: { pointer: { x: number; y: number } }) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const cols = 46;
  const rows = 26;
  const spacing = 0.32;

  const positions = useMemo(() => {
    const arr = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let j = 0; j < rows; j++) {
      for (let x = 0; x < cols; x++) {
        arr[i * 3] = (x - (cols - 1) / 2) * spacing;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (j - (rows - 1) / 2) * spacing;
        i++;
      }
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const geom = pointsRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (geom) {
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < posAttr.count; k++) {
        const x = posAttr.getX(k);
        const z = posAttr.getZ(k);
        posAttr.setY(k, Math.sin(x * 0.9 + t) * 0.28 + Math.cos(z * 0.9 + t * 0.8) * 0.28);
      }
      posAttr.needsUpdate = true;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.35 - groupRef.current.rotation.y) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#2563eb" size={0.045} transparent opacity={0.75} sizeAttenuation />
      </points>
    </group>
  );
}

function CameraRig({ pointer }: { pointer: { x: number; y: number } }) {
  useFrame(({ camera }) => {
    camera.position.y += (2.6 - pointer.y * 1.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3D() {
  const { t } = useLanguage();
  const pointer = useRef({ x: 0, y: 0 });
  const layersRef = useRef<Array<HTMLDivElement | null>>([]);
  const photoRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    pointer.current = { x, y };
    layersRef.current.forEach((el, i) => {
      if (!el) return;
      const depth = (i + 1) * 7;
      el.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  };

  const onMouseLeave = () => {
    pointer.current = { x: 0, y: 0 };
    layersRef.current.forEach((el) => {
      if (el) el.style.transform = "translate3d(0,0,0)";
    });
  };

  const onPhotoMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = photoRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${py * -14}deg) rotateY(${px * 14}deg)`;
  };
  const onPhotoLeave = () => {
    if (photoRef.current) photoRef.current.style.transform = "perspective(700px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative min-h-[860px] md:min-h-[900px] bg-[#0b0b0d] overflow-hidden grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] items-center gap-12 md:gap-5 px-6 md:px-14 pt-28 pb-16 md:pt-0 md:pb-0"
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 2.6, 7.5], fov: 50 }}>
          <WaveGrid pointer={pointer.current} />
          <CameraRig pointer={pointer.current} />
        </Canvas>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0b0d] pointer-events-none" />

      <div className="relative z-10 order-2 md:order-1">
        <motion.div
          ref={(el) => (layersRef.current[0] = el)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 mb-6 px-3 py-1.5 border border-accent/40 bg-accent/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-accent/90 uppercase">
            {t("hero.available")}
          </span>
        </motion.div>

        <motion.div
          ref={(el) => (layersRef.current[1] = el)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-mono text-[13px] tracking-[0.16em] text-accent mb-3.5 uppercase">
            {t("hero.kicker")}
          </p>
          <h1 className="font-heading font-extrabold text-white tracking-tight leading-[1.03] text-[40px] md:text-[52px] lg:text-[66px] mb-5">
            {t("hero.name")}
          </h1>
          <p className="font-heading font-medium text-white/75 text-lg md:text-xl mb-5">
            {t("hero.role")}
          </p>
          <p className="text-white/55 text-[15px] md:text-base leading-relaxed max-w-[520px] mb-9">
            {t("hero.tagline")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              {t("hero.ctaProjects")} <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {t("hero.ctaContact")}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 order-1 md:order-2 flex justify-center">
        <div
          ref={photoRef}
          onMouseMove={onPhotoMove}
          onMouseLeave={onPhotoLeave}
          className="relative w-[220px] h-[264px] md:w-[300px] md:h-[360px] border border-accent/40 p-3.5 bg-white/[0.04] backdrop-blur-sm transition-transform duration-150 ease-out animate-float-slow"
        >
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-accent" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-accent" />
          <div className="w-full h-full overflow-hidden">
            <img
              src={images.profile.src}
              alt={images.profile.alt}
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(0.15) contrast(1.05)" }}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute left-14 bottom-9 items-center gap-2.5 text-white/35 font-mono text-[11px] tracking-widest z-10">
        <div className="w-6 h-px bg-white/30 animate-pulse" />
        {t("hero.scroll")}
      </div>
    </div>
  );
}
```

## 2. Crear `src/components/SkillRing3D.tsx`

```tsx
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

    const onMove = (e: MouseEvent) => {
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
              ref={(el) => (itemRefs.current[i] = el)}
              onMouseEnter={() => (pausedRef.current = true)}
              onMouseLeave={() => (pausedRef.current = false)}
              className="absolute flex flex-col items-center gap-1.5 will-change-transform"
              style={{ top: "50%", left: "50%", width: 56, margin: "-42px 0 0 -28px" }}
            >
              <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-md grid place-items-center">
                <img
                  src={`/images/tech-icons/${skill.id}.png`}
                  alt={skill.name}
                  className="max-w-7 max-h-7 object-contain"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-card/90 px-1.5 rounded">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 3. Reemplazar completo `src/sections/Skills.tsx`

```tsx
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
```

> Nota: esta reescritura elimina intencionalmente `RoadmapItem`, `PulsingLine`, `SectionTitle`, `BlinkingCursor`, `JarvisHoverFrame` y los `useState` de hover que ya no se usan (el proyecto tiene `noUnusedLocals: true` en `tsconfig.app.json`, así que dejarlos sin usar rompe el build).

## 4. Editar `src/sections/Projects.tsx`

Reemplazá el bloque del `<article>` (dentro del `.map`) por este, agregando el tilt 3D on-hover. Todo lo demás del archivo queda igual:

```tsx
          return (
            <article
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item, idx)}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                const rx = (py - 0.5) * -10;
                const ry = (px - 0.5) * 10;
                el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
              }}
              style={{ transformStyle: "preserve-3d", transition: "transform 150ms ease" }}
              className={`relative group rounded-2xl overflow-hidden ${scale} hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
            >
```

(La versión original tenía `className="relative group rounded-2xl overflow-hidden transition-all duration-300 transform ${scale} hover:scale-110 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"` sin handlers de mouse ni `style`; sacá el `hover:scale-110` porque ahora la escala 3D la maneja el `transform` inline.)

## 5. Editar `src/pages/Home.tsx`

Cambiá el import y el uso del hero:

```diff
- import HeroSlider from '../components/HeroSlider';
+ import Hero3D from '../components/Hero3D';
```

```diff
        <section id="hero" className="w-full">
-         <HeroSlider />
+         <Hero3D />
        </section>
```

(`HeroSlider.tsx` puede quedar en el repo sin usar, o borrarlo si no lo necesitás en otro lado.)

## 6. Agregar claves de traducción

En `src/locales/es.json`, dentro del bloque `"aboutMe": { ... }` (justo después de `"more": "Más"` y antes de `"profile": {`), agregá:

```json
  "hero": {
    "kicker": "Portfolio — 2026",
    "available": "Disponible para nuevos proyectos",
    "name": "Sebastián Soraire",
    "role": "Analista de Sistemas · React JS & React Native",
    "tagline": "Construyo interfaces escalables y experiencias de producto con foco en performance y resultados de negocio.",
    "ctaProjects": "Ver proyectos",
    "ctaContact": "Hablemos",
    "scroll": "Desplazate"
  },
```

Y en el bloque `"skills": { "title": "Habilidades Técnicas", ... }` agregá justo después de `"title"`:

```json
    "dragHint": "arrastrá un anillo para girarlo",
```

En `src/locales/en.json`, mismo lugar (después de `"more": "More"`, antes de `"profile": {`):

```json
  "hero": {
    "kicker": "Portfolio — 2026",
    "available": "Available for new projects",
    "name": "Sebastián Soraire",
    "role": "Systems Analyst · React JS & React Native",
    "tagline": "I build scalable interfaces and product experiences focused on performance and business results.",
    "ctaProjects": "View projects",
    "ctaContact": "Let's talk",
    "scroll": "Scroll"
  },
```

Y en `"skills": { "title": "Skills", ... }`:

```json
    "dragHint": "drag a ring to spin it",
```

## 7. Verificar

- `npm run dev` y mirar `/` — el hero debe mostrar la grilla 3D animada de fondo (azul, reactiva al mouse), foto con marco técnico y tilt, y CTAs.
- Scrolleá a "Skills" en desktop (≥768px) — deben verse 3 anillos 3D girando, arrastrables con el mouse, que se pausan al pasar por un ícono.
- En "Proyectos", pasar el mouse sobre una card debe inclinarla en 3D (tilt).
- `npm run build` — debe compilar sin errores de TypeScript (el proyecto tiene `noUnusedLocals`/`noUnusedParameters` activados).
- Probar el toggle de idioma ES/EN — todo el hero y el hint de skills deben traducirse.

No toques `Contact.tsx` (ya tiene su propio formulario conectado a `VITE_CONTACT_API`, no forma parte de este cambio).
