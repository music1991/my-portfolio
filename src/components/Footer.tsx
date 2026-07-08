import { useLanguage } from "../context/Language";
import { Mail, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { mailTo } from "./Mail";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-border bg-background mt-20">
      <div className="
        max-w-7xl mx-auto px-6 md:px-10 py-10
        flex flex-col md:flex-row items-center md:items-start
        justify-center md:justify-between gap-6
        text-center md:text-left
      ">
        <div className="order-1 md:order-2">
          <motion.a
            href={mailTo()}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center h-11 w-11 rounded-full text-accent hover:text-accent/80"
          >
            <Mail className="w-7 h-7" />
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-accent bg-clip-text text-transparent">
            {t("general.portfolio")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            © {year} Soraire Sebastián
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-accent to-indigo-400 opacity-60" />
    </footer>
  );
}
