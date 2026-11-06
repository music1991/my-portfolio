import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { useLanguage } from "../context/Language";
import { SITE_URL } from "../seo/site";
import { SCHEDULE_QUERY_PARAM } from "../entities/lib/constants";

/** Copia al portapapeles el link que abre el modal de agenda (https://<sitio>/?agendar). */
export function CopyScheduleLinkButton() {
  const { t, localize } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const scheduleLink = `${SITE_URL}${localize("/")}?${SCHEDULE_QUERY_PARAM}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(scheduleLink);
    } catch {
      // Fallback para navegadores/contextos sin Clipboard API (ej. http).
      const input = document.createElement("textarea");
      input.value = scheduleLink;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const label = copied ? t("hero.schedule.shareCopied") : t("hero.schedule.shareTooltip");

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={copyLink}
        aria-label={label}
        className="inline-flex items-center justify-center w-11 h-11 border border-foreground/20 text-foreground/70 hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
      </button>
      <span
        role="tooltip"
        aria-live="polite"
        className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2.5 py-1.5 text-xs font-medium bg-foreground text-background shadow-lg transition-opacity duration-150 ${
          copied ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        }`}
      >
        {label}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </span>
    </div>
  );
}
