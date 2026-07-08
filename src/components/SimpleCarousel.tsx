import { useCallback, useEffect, useRef, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useLanguage } from "../context/Language";
import type { PortfolioItem } from "../entities/lib/projects";

type Props = {
  items: PortfolioItem[];
  autoPlayMs?: number;
};

export default function SimpleCarousel({ items, autoPlayMs = 3000 }: Props) {
  const { t } = useLanguage();

  const [current, setCurrent] = useState(0);
  const pausedRef = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const sliderRef = useRef<ReturnType<typeof useKeenSlider>[1] | null>(
    null
  );

  const [ref, slider] = useKeenSlider<HTMLDivElement>({
    loop: items.length > 1,
    slideChanged(s) {
      setCurrent(s.track.details.rel);
      restartProgress();
    },
  });

  useEffect(() => {
    // @ts-ignore
    sliderRef.current = slider;
  }, [slider]);

  const next = useCallback(() => {
    sliderRef.current?.current?.next();
    restartProgress();
  }, []);

  const prev = useCallback(() => {
    sliderRef.current?.current?.prev();
    restartProgress();
  }, []);

  const restartProgress = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    el.style.transition = "none";
    el.style.width = "0%";
    void el.offsetWidth;
    el.style.transition = `width ${autoPlayMs}ms linear`;
    el.style.width = "100%";

    timerRef.current = window.setTimeout(() => {
      if (!pausedRef.current) {
        sliderRef.current?.current?.next();
        restartProgress();
      }
    }, autoPlayMs);
  }, [autoPlayMs]);

  useEffect(() => {
    if (!slider.current || items.length <= 1) return;
    restartProgress();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [items.length, autoPlayMs, slider, restartProgress]);

  const onMouseEnter = () => (pausedRef.current = true);
  const onMouseLeave = () => {
    pausedRef.current = false;
  };

  const title = (i: number) => t?.(items[i]?.titleKey) ?? "";
  const details = (i: number) => t?.(items[i]?.shortDescription) ?? "";

  return (
    <section
      className="relative w-full min-h-[375px] md:min-h-[675px] flex items-center justify-center overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative z-10 w-full max-w-7xl">
        <div
          ref={ref}
          className="keen-slider rounded-t-none rounded-b-2xl overflow-hidden shadow-lg ring-1 ring-border/40 bg-card/10 backdrop-blur-md"
        >
          {items.map((it, i) => (
            <div key={it.id ?? i} className="keen-slider__slide">
              <img
                src={it.captures[0]}
                alt={it.alt || title(i)}
                className="w-full h-[min(64vw,520px)] object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-11 w-11 rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 text-slate-900 backdrop-blur-md shadow-lg disabled:opacity-40"
        >
          ‹
        </button>

        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-11 w-11 rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 text-slate-900 backdrop-blur-md shadow-lg disabled:opacity-40"
        >
          ›
        </button>

        <div className="absolute left-3 bottom-3 md:left-1/4 md:bottom-10 md:-translate-x-1/2 z-30 text-center px-3 md:px-4">
          <div className="bg-black/40 backdrop-blur-xl md:backdrop-blur-3xl
                  px-3 py-2 md:px-8 md:py-6 rounded-2xl border border-white/10 shadow-md md:shadow-2xl">
            <h3 className="text-white text-sm sm:text-base md:text-2xl font-semibold mb-1 md:mb-3 tracking-wide whitespace-pre-line">
              {title(current)}
            </h3>
            <p className="hidden md:block text-white/95 text-base md:text-lg leading-relaxed max-w-md mx-auto font-normal">
              {details(current)}
            </p>
          </div>
        </div>

        <div className="absolute left-1/4 bottom-6 -translate-x-1/2 z-30 w-40 hidden md:block">
          <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-white/90"
              style={{
                width: "0%",
                transition: `width ${autoPlayMs}ms linear`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}