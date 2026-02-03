import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/Language";
import { LanguageSelector } from "../components/LanguajeSelector";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";

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
          isScrolled ? "h-16 bg-white/95 shadow-lg border-gray-200" : "h-20 bg-white/90 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <h2 
              className="text-xl font-bold text-gray-800 z-50"
            >
              {t("general.portfolio")}
            </h2>

            <div className="hidden md:flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item)}
                  className="flex items-center px-4 py-2 rounded-lg text-gray-800 hover:text-blue-700 font-semibold text-sm transform hover:-translate-y-0.5 transition-all"
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="z-50">
                <LanguageSelector />
              </div>
              
              <button
                className="md:hidden flex flex-col w-6 h-6 justify-center items-center space-y-1 z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span 
                  className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span 
                  className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div 
          className={`absolute top-0 right-0 w-64 h-full bg-white/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-24 px-6">
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item)}
                  className="text-left text-gray-800 hover:text-blue-700 font-semibold text-lg py-2 border-b border-gray-100 transition-all duration-200 hover:translate-x-2"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;