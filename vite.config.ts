import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { HERO_PHOTO } from './src/entities/lib/images'
import { renderPageContent } from './src/seo/content'
import { getMeta, listPages, pageUrlPath } from './src/seo/pages'
import type { PageMeta } from './src/seo/pages'
import { renderSeoTags } from './src/seo/render'
import { DEFAULT_LANGUAGE, LANGUAGES, absoluteUrl } from './src/seo/site'
import { images } from './vite-plugins/images'

const OUT_DIR = 'dist'
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
const CONTENT_BLOCK = /<!--content:start-->[\s\S]*?<!--content:end-->/

/** The home hero photo is the largest thing on first paint: start downloading it before the JS runs. */
const preloads = (page: PageMeta) =>
  page.path === '/' ? `\n    <link rel="preload" as="image" href="${HERO_PHOTO}" type="image/webp" fetchpriority="high" />` : ''

const withPage = (html: string, page: PageMeta) =>
  html
    .replace(SEO_BLOCK, `<!--seo:start-->\n    ${renderSeoTags(page)}${preloads(page)}\n    <!--seo:end-->`)
    .replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`)
    .replace(CONTENT_BLOCK, `<!--content:start-->${renderPageContent(page.path, page.lang)}<!--content:end-->`)

/** "/" → index.html, "/en" → en.html, "/en/about" → en/about.html. */
const htmlFileFor = (urlPath: string) => (urlPath === '/' ? 'index.html' : `${urlPath.slice(1)}.html`)

const renderSitemap = (pages: PageMeta[]) => {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = pages
    .filter(page => page.indexable)
    .map(page => {
      const alternates = [
        ...LANGUAGES.map(lang => ({ hreflang: lang, href: absoluteUrl(pageUrlPath({ path: page.path, lang })) })),
        { hreflang: 'x-default', href: absoluteUrl(pageUrlPath({ path: page.path, lang: DEFAULT_LANGUAGE })) },
      ]
      return [
        '  <url>',
        `    <loc>${absoluteUrl(pageUrlPath(page))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        ...alternates.map(a => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
        '  </url>',
      ].join('\n')
    })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/**
 * Static SEO without SSR: every route gets its own HTML file with the right <head>
 * (title, description, canonical, hreflang, OG) and its content as plain HTML,
 * so Google and other bots see it without running JS. React mounts exactly as before.
 */
const seo = (): Plugin => {
  let root = process.cwd()

  return {
    name: 'seo',
    configResolved(config) {
      root = config.root
    },
    // Dev server + base dist/index.html: Spanish home.
    transformIndexHtml: html => withPage(html, getMeta('/', DEFAULT_LANGUAGE)),
    async writeBundle() {
      const outDir = path.resolve(root, OUT_DIR)
      const shell = await readFile(path.join(outDir, 'index.html'), 'utf8')
      const pages = listPages()

      await Promise.all(
        pages.map(async page => {
          const file = path.join(outDir, htmlFileFor(pageUrlPath(page)))
          await mkdir(path.dirname(file), { recursive: true })
          await writeFile(file, withPage(shell, page))
        }),
      )
      await writeFile(path.join(outDir, 'sitemap.xml'), renderSitemap(pages))

      this.info(`pre-rendered ${pages.length} pages + sitemap.xml`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seo(), images()],
  build: {
    outDir: OUT_DIR,
    rollupOptions: {
      output: {
        // Libraries change less often than the app: separate files stay cached across deploys.
        // three/r3f are left out on purpose: they only load lazily with the hero's 3D grid.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
})
