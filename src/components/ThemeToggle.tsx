import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/Theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className="relative grid place-items-center h-11 w-11 rounded-full border border-border bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="grid place-items-center"
        >
          {isDark ? (
            <Moon className="w-5 h-5" strokeWidth={1.75} />
          ) : (
            <Sun className="w-5 h-5" strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
