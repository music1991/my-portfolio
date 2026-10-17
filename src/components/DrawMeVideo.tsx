import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/Language";

type Cue = { start: number; end: number; text: string };

const toSeconds = (stamp: string) =>
  stamp.split(":").reduce((total, part) => total * 60 + parseFloat(part), 0);

/** Minimal WebVTT parser: enough for the plain "start --> end" + text cues we ship. */
const parseVtt = (source: string): Cue[] =>
  source
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .flatMap((block) => {
      const lines = block.split("\n");
      const timing = lines.findIndex((line) => line.includes("-->"));
      if (timing === -1) return [];
      const [start, end] = lines[timing].split("-->").map((s) => toSeconds(s.trim().split(" ")[0]));
      return [{ start, end, text: lines.slice(timing + 1).join("\n") }];
    });

/**
 * Muted, looping sketch video with handwritten subtitles.
 * The cues are read from the .vtt files and drawn by hand instead of using <track>:
 * mobile browsers (iOS Safari especially) render tracks natively even when hidden,
 * which doubled the subtitles, and native ::cue styling can't change the font anyway.
 */
export default function DrawMeVideo({ label }: { label: string }) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cues, setCues] = useState<Cue[]>([]);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/videos/draw-me.${language === "en" ? "en" : "es"}.vtt`)
      .then((res) => (res.ok ? res.text() : ""))
      .then((text) => !cancelled && setCues(parseVtt(text)))
      .catch(() => !cancelled && setCues([]));
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const t = video.currentTime;
      setCaption(cues.find((cue) => t >= cue.start && t < cue.end)?.text ?? "");
    };
    onTimeUpdate();
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [cues]);

  return (
    <figure
      className="relative block w-56 sm:w-64 mx-auto mb-6 md:float-right md:w-[34%] lg:w-[38%] md:ml-8 md:mb-4 md:mt-2
                 overflow-hidden rounded-2xl ring-1 ring-border bg-foreground/[0.03] shadow-sm"
    >
      <video
        ref={videoRef}
        poster="/videos/draw-me-poster.webp"
        aria-label={label}
        width={720}
        height={1280}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="block w-full h-auto select-none pointer-events-none"
      >
        <source src="/videos/draw-me.av1.mp4" type='video/mp4; codecs="av01.0.08M.10"' />
        <source src="/videos/draw-me.mp4" type="video/mp4" />
      </video>

      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-3">
        <AnimatePresence mode="wait">
          {caption && (
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 8, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -1.5 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-hand font-bold text-xl sm:text-2xl leading-tight text-center text-zinc-900
                         px-3.5 py-1 rounded-lg bg-white/90 shadow-md ring-1 ring-zinc-900/10"
            >
              {caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </figure>
  );
}
