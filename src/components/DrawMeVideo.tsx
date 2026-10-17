import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/Language";

/**
 * Muted, looping sketch video with handwritten subtitles.
 * The <track> stays hidden: its cues are drawn by hand so they can use the Caveat font
 * (native ::cue styling can't reliably change fonts across browsers).
 */
export default function DrawMeVideo({ label }: { label: string }) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tracks = Array.from(video.textTracks);
    const active = tracks.find((tr) => tr.language === language) ?? tracks[0];
    tracks.forEach((tr) => {
      tr.mode = tr === active ? "hidden" : "disabled";
    });
    if (!active) return;

    const onCueChange = () => {
      const cue = active.activeCues?.[0] as VTTCue | undefined;
      setCaption(cue?.text ?? "");
    };
    onCueChange();
    active.addEventListener("cuechange", onCueChange);
    return () => active.removeEventListener("cuechange", onCueChange);
  }, [language]);

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
        <track kind="captions" src="/videos/draw-me.es.vtt" srcLang="es" label="Español" default={language === "es"} />
        <track kind="captions" src="/videos/draw-me.en.vtt" srcLang="en" label="English" default={language === "en"} />
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
