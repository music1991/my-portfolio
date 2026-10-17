import en from '../locales/en.json'
import es from '../locales/es.json'
import { DATA } from '../entities/lib/projects'
import { escape } from './render'
import { localizePath } from './site'
import type { Language } from './site'

/**
 * Crawlable HTML for each page, built from the same locale files the app uses.
 * It goes inside <div id="root"> of the pre-rendered pages, so bots that don't run JS
 * (Bing, social previews, AI crawlers) read the real content. React replaces it on mount.
 */

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/ingeniero-soraire/',
  github: 'https://github.com/music1991',
  whatsapp: 'https://wa.me/5493815606434',
  cv: '/cv/Soraire_Sebastian_CV.pdf',
}

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'React Native', 'Next.js', 'HTML', 'Node.js', 'C#', 'Python', 'PHP',
  'SQL Server', 'PostgreSQL', 'Git', 'Vite', 'IA generativa / Generative AI', 'RAG', 'AI Agents', 'Scrum',
]

const UI: Record<Language, Record<string, string>> = {
  es: {
    services: 'Qué hago',
    skills: 'Stack tecnológico',
    projects: 'Proyectos destacados',
    experience: 'Experiencia profesional',
    education: 'Educación',
    languages: 'Idiomas',
    links: 'Encontrame en',
    cv: 'Descargar CV',
  },
  en: {
    services: 'What I do',
    skills: 'Tech stack',
    projects: 'Featured projects',
    experience: 'Professional experience',
    education: 'Education',
    languages: 'Languages',
    links: 'Find me on',
    cv: 'Download CV',
  },
}

const SERVICES: Record<Language, string[]> = {
  es: [
    'Desarrollo de aplicaciones web con React, Next.js y TypeScript.',
    'Aplicaciones móviles para iOS y Android con React Native.',
    'Backend y APIs REST con Node.js, integración de servicios externos.',
    'Arquitectura de software escalable y mantenible (clean architecture).',
    'MVPs para startups: de la idea al producto en producción.',
    'Automatización de procesos con Inteligencia Artificial, agentes y RAG.',
    'Capacitación en IA generativa y adopción responsable en organizaciones.',
  ],
  en: [
    'Web application development with React, Next.js and TypeScript.',
    'Mobile apps for iOS and Android with React Native.',
    'Backend and REST APIs with Node.js, third-party service integration.',
    'Scalable, maintainable software architecture (clean architecture).',
    'MVPs for startups: from idea to a product in production.',
    'Process automation with Artificial Intelligence, agents and RAG.',
    'Generative AI training and responsible adoption in organizations.',
  ],
}

type Dict = typeof es
const DICTS: Record<Language, Dict> = { es, en: en as Dict }

const pick = (dict: Dict, key: string): string => {
  const value = key.split('.').reduce<unknown>(
    (acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined),
    dict,
  )
  return typeof value === 'string' ? value : ''
}

const text = (value: string) => escape(value.replace(/\s*\n\s*/g, ' ').trim())
const paragraphs = (value: string) => value.split('\n').filter(Boolean).map(p => `<p>${escape(p)}</p>`).join('')
const list = (items: string[]) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`
const external = (href: string, label: string) => `<a href="${escape(href)}" rel="noopener">${escape(label)}</a>`

const nav = (lang: Language, d: Dict) =>
  `<nav><a href="${localizePath('/', lang)}">${escape(d.general.home)}</a> · ` +
  `<a href="${localizePath('/about', lang)}">${escape(d.aboutMe.text)}</a> · ` +
  `<a href="${localizePath('/contact', lang)}">${escape(d.general.contact)}</a> · ` +
  `<a href="${localizePath('/', lang === 'es' ? 'en' : 'es')}" hreflang="${lang === 'es' ? 'en' : 'es'}">${lang === 'es' ? 'English' : 'Español'}</a></nav>`

const linksSection = (ui: Record<string, string>) =>
  `<section><h2>${ui.links}</h2>${list([
    external(LINKS.linkedin, 'LinkedIn'),
    external(LINKS.github, 'GitHub'),
    external(LINKS.whatsapp, 'WhatsApp'),
    `<a href="${LINKS.cv}">${ui.cv}</a>`,
  ])}</section>`

const experienceSection = (d: Dict, ui: Record<string, string>, withDetails: boolean) =>
  `<section><h2>${ui.experience}</h2>${d.profile.experience.jobs
    .map(job => {
      const company = 'link' in job && job.link ? external(job.link, job.company) : escape(job.company)
      const details = withDetails ? list(job.details.map(text)) : ''
      const tech = 'tecnologies' in job && job.tecnologies ? `<p>${escape(job.tecnologies.join(', '))}</p>` : ''
      return `<article><h3>${escape(job.role)} — ${company}</h3><p>${escape(job.period)}</p>${details}${tech}</article>`
    })
    .join('')}</section>`

const home = (lang: Language, d: Dict) => {
  const ui = UI[lang]
  const projects = DATA.map(p => {
    const title = text(pick(d, p.titleKey))
    const heading = p.link ? external(p.link, title) : title
    return `<li><strong>${heading}</strong>: ${text(pick(d, p.shortDescription))} <small>(${escape(p.technologies.join(', '))})</small></li>`
  })

  return [
    `<h1>${escape(d.hero.name)}</h1>`,
    `<p>${escape(d.hero.tagline)}</p>`,
    `<p>${escape(d.hero.quote)}</p>`,
    `<section><h2>${ui.services}</h2>${list(SERVICES[lang].map(escape))}</section>`,
    `<section><h2>${ui.skills}</h2><p>${escape(SKILLS.join(', '))}</p></section>`,
    `<section id="projects"><h2>${ui.projects}</h2><ul>${projects.join('')}</ul></section>`,
    experienceSection(d, ui, false),
    linksSection(ui),
  ]
}

const about = (lang: Language, d: Dict) => {
  const ui = UI[lang]
  const education = d.profile.education.items.map(item => {
    const where = [item.institution, item.year].filter(Boolean).join(' · ')
    return `<strong>${escape(item.degree)}</strong>${where ? ` — ${escape(where)}` : ''}`
  })
  const languages = d.profile.languages.list.map(l => `${escape(l.name)}: ${escape(l.level)}`)

  return [
    `<h1>${escape(d.profile.header.title)} — Sebastián Soraire</h1>`,
    `<p>${escape(d.profile.header.subtitle)}</p>`,
    `<section><h2>${escape(d.profile.about.heading)}</h2>${paragraphs(d.profile.about.content)}</section>`,
    experienceSection(d, ui, true),
    `<section><h2>${ui.education}</h2>${list(education)}</section>`,
    `<section><h2>${ui.languages}</h2>${list(languages)}</section>`,
    linksSection(ui),
  ]
}

const contact = (lang: Language, d: Dict) => [
  `<h1>${escape(d.contact.hero.title)}</h1>`,
  `<p>${escape(d.contact.hero.subtitle)}</p>`,
  linksSection(UI[lang]),
]

const BUILDERS: Record<string, (lang: Language, d: Dict) => string[]> = {
  '/': home,
  '/about': about,
  '/contact': contact,
}

/** Static HTML for a page, or '' when the path has no crawlable content. */
export const renderPageContent = (path: string, lang: Language): string => {
  const build = BUILDERS[path]
  if (!build) return ''
  const d = DICTS[lang]
  return `<div class="seo-content">${nav(lang, d)}<main>${build(lang, d).join('')}</main></div>`
}
