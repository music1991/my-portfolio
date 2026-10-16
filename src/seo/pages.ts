import { LANGUAGES, OG_IMAGE, SITE_NAME, localizePath, parsePath } from './site'
import type { Language } from './site'

/**
 * SEO copy (title + description) for every page, in both languages.
 * Single source for the client (<Seo />) and the build (pre-rendered HTML + sitemap).
 * Aim for titles of 50–60 characters and descriptions of 120–155.
 */

interface PageCopy {
  title: string
  description: string
}

export interface PageMeta extends PageCopy {
  lang: Language
  /** Language-less path, e.g. "/about". */
  path: string
  /** Site-relative image path, e.g. "/preview.png". */
  image: string
  /** false → noindex, no canonical/hreflang, left out of the sitemap. */
  indexable: boolean
}

const STATIC_PAGES: Record<string, Record<Language, PageCopy>> = {
  '/': {
    es: {
      title: 'Sebastián Soraire | Ingeniero de Software React y Node.js',
      description:
        'Ingeniero en Sistemas de Información (UTN). Desarrollo apps web y mobile con React, React Native, Next.js y Node.js, automatizaciones con IA y MVPs.',
    },
    en: {
      title: 'Sebastián Soraire | Software Engineer, React & Node.js',
      description:
        'Information Systems Engineer (UTN). I build web and mobile apps with React, React Native, Next.js and Node.js, AI-powered automation and MVPs.',
    },
  },
  '/about': {
    es: {
      title: 'Sobre mí: experiencia y formación | Sebastián Soraire',
      description:
        'Más de seis años en IT: fintech, logística y software factories. Ingeniero de Software en 24 Studio y Pampa Solutions Tech y docente de IA en la UTN.',
    },
    en: {
      title: 'About Me: Experience and Education | Sebastián Soraire',
      description:
        'Six+ years in IT across fintech, logistics and software factories. Software Engineer at 24 Studio and Pampa Solutions Tech and AI lecturer at UTN.',
    },
  },
  '/contact': {
    es: {
      title: 'Contacto: contame tu proyecto | Sebastián Soraire',
      description:
        '¿Tenés una idea, un MVP o un producto para mejorar? Diseño y construyo apps web y mobile con React y React Native, enfocadas en performance y negocio.',
    },
    en: {
      title: 'Contact: Tell Me About Your Project | Sebastián Soraire',
      description:
        'Have an idea, an MVP or a product to improve? I design and build web and mobile apps with React and React Native, focused on performance and results.',
    },
  },
}

const NOT_FOUND: Record<Language, PageCopy> = {
  es: { title: `Página no encontrada | ${SITE_NAME}`, description: 'La página que buscás no existe.' },
  en: { title: `Page Not Found | ${SITE_NAME}`, description: 'The page you are looking for does not exist.' },
}

/** Meta for a language-less path in the given language. */
export const getMeta = (path: string, lang: Language): PageMeta => {
  const page = STATIC_PAGES[path]
  if (page) return { lang, path, ...page[lang], image: OG_IMAGE, indexable: true }
  return { lang, path, ...NOT_FOUND[lang], image: OG_IMAGE, indexable: false }
}

/** Meta for a full URL pathname ("/en/about"). */
export const getPageMeta = (pathname: string): PageMeta => {
  const { lang, path } = parsePath(pathname)
  return getMeta(path, lang)
}

/** Every page the build pre-renders, in every language. */
export const listPages = (): PageMeta[] =>
  LANGUAGES.flatMap(lang => Object.keys(STATIC_PAGES).map(path => getMeta(path, lang)))

/** URL pathname for a page, e.g. { path: "/about", lang: "en" } → "/en/about". */
export const pageUrlPath = (meta: Pick<PageMeta, 'path' | 'lang'>) => localizePath(meta.path, meta.lang)
