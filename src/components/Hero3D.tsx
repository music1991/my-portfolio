// useEffect was only used by the theme-based photo swap (commented out below)
// import { lazy, Suspense, useRef, useState, useEffect, type MouseEvent } from "react";
import { lazy, Suspense, useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/Language";
import { useTheme } from "../context/Theme";
import images from "../images.json";
import { HERO_PHOTO } from "../entities/lib/images";

const HeroGrid = lazy(() => import("./HeroGrid"));

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** Skip the decorative 3D background on slow/metered connections and for reduced-motion users. */
const shouldRenderGrid = () => {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const PROFILE_PHOTO = HERO_PHOTO;

// Previous behavior: the photo changed with the theme.
// const PROFILE_PHOTO_LIGHT = "/images/photo-white.webp";
// const PROFILE_PHOTO_DARK = "/images/photo-black.webp";

export default function Hero3D() {
  const { t, localize } = useLanguage();
  const { theme } = useTheme();
  const [showGrid] = useState(shouldRenderGrid);
  const pointer = useRef({ x: 0, y: 0 });
  const layersRef = useRef<Array<HTMLDivElement | null>>([]);
  const photoRef = useRef<HTMLDivElement | null>(null);

  // const targetPhotoSrc = theme === "light" ? PROFILE_PHOTO_LIGHT : PROFILE_PHOTO_DARK;
  // const [photoSrc, setPhotoSrc] = useState(targetPhotoSrc);
  // const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // useEffect(() => {
  //   if (targetPhotoSrc === photoSrc) return;
  //   let cancelled = false;
  //   setIsPhotoLoading(true);
  //   const img = new Image();
  //   img.onload = () => {
  //     if (cancelled) return;
  //     setPhotoSrc(targetPhotoSrc);
  //     setIsPhotoLoading(false);
  //   };
  //   img.onerror = () => {
  //     if (!cancelled) setIsPhotoLoading(false);
  //   };
  //   img.src = targetPhotoSrc;
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [targetPhotoSrc, photoSrc]);

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
      className="relative min-h-[860px] md:min-h-[900px] bg-background overflow-hidden flex items-center"
    >
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: "radial-gradient(65% 65% at 50% 45%, black 35%, transparent 100%)",
          maskImage: "radial-gradient(65% 65% at 50% 45%, black 35%, transparent 100%)",
        }}
      >
        {showGrid && (
          <Suspense fallback={null}>
            <HeroGrid pointer={pointer} theme={theme} />
          </Suspense>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] items-center gap-12 md:gap-5 pt-28 pb-16 md:pt-0 md:pb-0">
        <div className="order-2 md:order-1">
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
            <span className="font-mono text-xs tracking-widest text-accent uppercase">
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
            <h1 className="font-heading font-extrabold text-foreground tracking-tight leading-[1.05] text-[34px] md:text-[44px] lg:text-[54px] mb-6">
              {t("hero.name")}
            </h1>
            <p className="text-foreground/80 text-[15px] md:text-base leading-relaxed max-w-[520px] mb-6">
              {t("hero.tagline")}
            </p>
            <p className="rounded-lg border border-border border-l-2 border-l-accent pl-6 py-3 pr-4 bg-card/70 backdrop-blur-sm italic text-foreground/70 dark:text-foreground/85 text-sm md:text-[15px] leading-relaxed max-w-[480px] mb-9">
              {'"' + t("hero.quote") + '"'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] pl-7 pr-6 py-3 bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
              >
                {t("hero.ctaProjects")}
              </a>
              <Link
                to={localize("/contact")}
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 border border-foreground/20 text-foreground font-semibold text-sm hover:border-accent hover:text-accent transition-colors"
              >
                {t("hero.ctaContact")}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="order-1 md:order-2 flex flex-col items-center gap-5">
          <div
            ref={photoRef}
            onMouseMove={onPhotoMove}
            onMouseLeave={onPhotoLeave}
            className="relative w-[300px] h-[400px] md:w-[450px] md:h-[600px] border border-accent/40 p-3.5 bg-foreground/[0.04] backdrop-blur-sm transition-transform duration-150 ease-out animate-float-slow"
          >
            <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-accent" />
            <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-accent" />
            <div className="w-full h-full overflow-hidden relative">
              <img
                src={PROFILE_PHOTO}
                alt={images.profile.alt}
                width={450}
                height={600}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-opacity duration-300 ease-out"
                style={{
                  filter: "grayscale(0.15) contrast(1.05)",
                  // opacity: isPhotoLoading ? 0.4 : 1,
                }}
              />
              {/* {isPhotoLoading && (
                <div className="absolute inset-0 animate-pulse bg-foreground/10" />
              )} */}
            </div>
          </div>

          <Link
            to={localize("/about")}
            className="inline-flex items-center gap-2 min-h-[44px] text-foreground/70 hover:text-accent font-medium text-sm transition-all duration-300 hover:translate-x-1"
          >
            {t("aboutMe.more")}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
