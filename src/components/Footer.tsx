import { useLanguage } from "../context/Language";
import { Mail, ArrowUp, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { mailTo } from "./Mail";

const LINKEDIN_URL = "https://www.linkedin.com/in/sebastian-soraire-developer/";
const WHATSAPP_URL = "https://wa.me/5493815606434";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.3c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.58.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-border bg-background mt-20">
      <div className="
        max-w-7xl mx-auto px-6 md:px-10 py-10
        flex flex-col md:flex-row items-center md:items-start
        justify-center md:justify-between gap-6
        text-center md:text-left
      ">
        <div className="order-1 md:order-2 flex items-center gap-2">
          <motion.a
            href={mailTo()}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center h-11 w-11 rounded-full text-accent hover:text-accent/80"
            aria-label="Email"
          >
            <Mail className="w-7 h-7" />
          </motion.a>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center h-11 w-11 rounded-full text-accent hover:text-accent/80"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-7 h-7" />
          </motion.a>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center h-11 w-11 rounded-full text-accent hover:text-accent/80"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="w-7 h-7" />
          </motion.a>
        </div>

        <div className="order-2 md:order-3">
          <button
            onClick={scrollTop}
            className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            {t("general.backToTop") ?? "Back to top"}
          </button>
        </div>

        <div className="order-3 md:order-1">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("general.portfolio")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            © {t("general.footer")}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-accent to-secondary opacity-60" />
    </footer>
  );
}
