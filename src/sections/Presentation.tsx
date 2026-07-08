import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/Language";
import images from "../images.json";
import { Link } from "react-router-dom";

export default function Presentation() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl mx-auto font-sans text-foreground leading-relaxed px-6 md:px-20"
    >
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-accent bg-clip-text text-transparent">
        {t("aboutMe.title")}
      </h1>

      <p className="text-xl mb-6 text-muted-foreground whitespace-pre-line">
        {t("aboutMe.detail")}
      </p>

      <div className="p-6 bg-card rounded-xl border border-border border-l-8 border-l-accent flex items-center gap-4 mt-10 shadow-sm">
        <div className="flex-shrink-0">
          <div
            style={{ width: 120, height: 120 }}
            className="rounded-full overflow-hidden border-2 border-background shadow-lg"
          >
            <img
              src={images.profile.src}
              alt={images.profile.alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <p className="m-0 italic text-muted-foreground">
            {'"' + t("aboutMe.speak") + '"'}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 min-h-[44px] text-accent hover:text-indigo-500 font-medium text-lg transition-all duration-300 hover:translate-x-1"
        >
          {t("aboutMe.more")}
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}
