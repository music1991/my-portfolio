import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/Language";
import { LanguageSelector } from "../components/LanguajeSelector";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const navbarHeight = 80;
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const goToSectionOnHome = (sectionId: string) => {
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 50);
    }
  };

  const handleNavItemClick = (item: any) => {
    if (item.to) {
       if (item.to === "/" && location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(item.to);
      }
    } else if (item.section) {
      goToSectionOnHome(item.section);
    } else if (item.url) {
      if (item.newTab) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else {
        window.open(item.url, "_blank");
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 0, title: t("general.home"), to: "/"}, 
    { id: 1, title: t("projects.text"), section: "projects" }, 
    // { id: 2, title: "CV", url: "/cv/Soraire_Sebastian_CV.pdf", newTab: true },
    { id: 3, title: "LinkedIn", url: "https://www.linkedin.com/in/sebastian-soraire-developer/" },
    { id: 4, title: "GitHub", url: "https://github.com/music1991" },
    { id: 5, title: t('aboutMe.text'), section: 'about' },
    { id: 6, title: t("general.contact"), to: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
          isScrolled ? "h-16 bg-background/95 shadow-lg border-border" : "h-20 bg-background/80 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-accent bg-clip-text text-transparent z-50">
              {t("general.portfolio")}
            </h2>

            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavItemClick(item)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center px-4 py-2 rounded-lg text-foreground hover:text-accent font-semibold text-sm transition-colors cursor-pointer"
                >
                  {item.title}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />

              <div className="z-50 hidden sm:block">
                <LanguageSelector />
              </div>

              <button
                className="md:hidden flex flex-col w-11 h-11 justify-center items-center space-y-1 z-50 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute top-0 right-0 w-64 h-full bg-card/95 backdrop-blur-md shadow-xl"
            >
              <div className="flex flex-col h-full pt-24 px-6">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item, i) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavItemClick(item)}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.25 }}
                      whileTap={{ scale: 0.97 }}
                      className="min-h-[44px] text-left text-card-foreground hover:text-accent font-semibold text-lg py-2 border-b border-border transition-colors cursor-pointer"
                    >
                      {item.title}
                    </motion.button>
                  ))}
                  <div className="pt-4 sm:hidden">
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;