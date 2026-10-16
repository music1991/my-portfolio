import React, { createContext, useContext, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../locales/en.json';
import es from '../locales/es.json';
import { localizePath, parsePath, type Language } from '../seo/site';

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tObj: <T = unknown>(key: string) => T;
  /** Language-less path ("/about") → path in the current language ("/en/about"). */
  localize: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function pick(obj: any, path: string) {
  return path.split('.').reduce((acc: any, k) => (acc ? acc[k] : undefined), obj);
}

/** The language comes from the URL ("/en/..." → English, otherwise Spanish), so each one is indexable. */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: language, path } = parsePath(location.pathname);

  const setLanguage = (lang: Language) => {
    if (lang !== language) navigate(localizePath(path, lang) + location.hash);
  };

  const getDict = () => (language === 'en' ? en : es);

  const t = (key: string): string => {
    const v = pick(getDict(), key);
    return typeof v === 'string' ? v : key;
  };
  const tObj = <T = unknown>(key: string): T => {
    return pick(getDict(), key) as T;
  };
  const localize = (to: string) => localizePath(to, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tObj, localize }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
