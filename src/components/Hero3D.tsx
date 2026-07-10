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
          ref={(el) => {
            layersRef.current[0] = el;
          }}
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
          ref={(el) => {
            layersRef.current[1] = el;
          }}
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
