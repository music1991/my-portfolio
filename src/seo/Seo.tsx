import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta } from './pages'
import { SEO_ATTR, renderSeoTags } from './render'

/**
 * Keeps the <head> in sync with the current route on client-side navigation.
 * The first load already has the right tags (pre-rendered by the build), so this only matters
 * after navigating — and for Google, which renders JS.
 */
export const Seo = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = getPageMeta(pathname)
    const template = document.createElement('template')
    template.innerHTML = renderSeoTags(page)

    document.head.querySelectorAll(`[${SEO_ATTR}]`).forEach(el => el.remove())
    document.head.append(template.content)
    document.title = page.title
    document.documentElement.lang = page.lang
  }, [pathname])

  return null
}
