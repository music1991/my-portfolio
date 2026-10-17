import type { PageMeta } from './pages'
import { pageUrlPath } from './pages'
import { DEFAULT_LANGUAGE, LANGUAGES, OG_LOCALE, SITE_NAME, TAB_TITLE, absoluteUrl } from './site'

/** Marks every tag this module owns, so <Seo /> can swap them on navigation. */
export const SEO_ATTR = 'data-seo'

export const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  `<meta ${attr}="${key}" content="${escape(content)}" ${SEO_ATTR} />`

const link = (rel: string, href: string, hreflang?: string) =>
  `<link rel="${rel}"${hreflang ? ` hreflang="${hreflang}"` : ''} href="${escape(href)}" ${SEO_ATTR} />`

/** The <head> tags for one page: title, description, canonical, hreflang, Open Graph, Twitter, robots. */
export const renderSeoTags = (page: PageMeta): string => {
  const url = absoluteUrl(pageUrlPath(page))
  const image = absoluteUrl(page.image)
  const tags = [
    `<title ${SEO_ATTR}>${escape(TAB_TITLE)}</title>`,
    meta('name', 'description', page.description),
  ]

  if (page.indexable) {
    tags.push(meta('name', 'robots', 'index, follow, max-image-preview:large'))
    tags.push(link('canonical', url))
    for (const lang of LANGUAGES) {
      tags.push(link('alternate', absoluteUrl(pageUrlPath({ path: page.path, lang })), lang))
    }
    tags.push(link('alternate', absoluteUrl(pageUrlPath({ path: page.path, lang: DEFAULT_LANGUAGE })), 'x-default'))
  } else {
    tags.push(meta('name', 'robots', 'noindex'))
  }

  tags.push(
    meta('property', 'og:type', page.path === '/about' ? 'profile' : 'website'),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:title', page.title),
    meta('property', 'og:description', page.description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('property', 'og:locale', OG_LOCALE[page.lang]),
    ...LANGUAGES.filter(lang => lang !== page.lang).map(lang => meta('property', 'og:locale:alternate', OG_LOCALE[lang])),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', page.title),
    meta('name', 'twitter:description', page.description),
    meta('name', 'twitter:image', image),
  )

  return tags.join('\n    ')
}
