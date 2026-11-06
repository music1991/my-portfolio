import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/Language";

interface ScheduleCallModalProps {
  googleCalendarUrl: string;
  onClose: () => void;
}

export function ScheduleCallModal({ googleCalendarUrl, onClose }: ScheduleCallModalProps) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("hero.schedule.title")}
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-accent/40 shadow-2xl w-full max-w-2xl h-[85vh] max-h-[720px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background shrink-0">
          <h2 className="font-heading font-bold text-lg text-foreground">{t("hero.schedule.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("hero.schedule.close")}
            className="text-foreground/60 hover:text-accent transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-1 bg-white">
          {!isLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white">
              <div className="relative h-10 w-10">
                <span className="absolute inset-0 rounded-full border-[3px] border-black/10" />
                <span className="absolute inset-0 rounded-full border-[3px] border-accent border-t-transparent animate-spin" />
                <span className="absolute inset-[8px] rounded-full bg-accent/15 animate-pulse" />
              </div>
              <span className="text-sm text-neutral-500 tracking-wide">{t("hero.schedule.loading")}</span>
            </div>
          )}
          <iframe
            src={googleCalendarUrl}
            title={t("hero.schedule.title")}
            className="w-full h-full"
            style={{ border: 0 }}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
