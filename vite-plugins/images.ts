import { createReadStream } from 'node:fs'
import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import type { Plugin } from 'vite'
import { SMALL_SUFFIX } from '../src/entities/lib/images'

type Format = 'webp' | 'png'

/** One generated file: `public/<src>` resized to `width` and encoded as `format`, served at `/<out>`. */
type Job = { src: string; out: string; width: number; format: Format; quality: number }

/**
 * Max width per folder (≈2x the size each image is displayed at). First match wins.
 * `small` also emits a `<name>-sm.webp` for cards and thumbnails.
 */
const RULES: { match: RegExp; width: number; small?: number; quality?: number }[] = [
  { match: /^images\/tech-icons\//, width: 128, quality: 85 },
  { match: /^images\/motivation\//, width: 600 },
  { match: /^images\/projects\//, width: 1600, small: 640 },
  { match: /^images\//, width: 900 },
]

/** Favicons derived from the 2500px logo, which is far too heavy to use as-is. */
const ICONS: Job[] = [
  { src: 'maletin.png', out: 'favicon.png', width: 64, format: 'png', quality: 100 },
  { src: 'maletin.png', out: 'apple-touch-icon.png', width: 180, format: 'png', quality: 100 },
]

const SOURCE = /\.(png|jpe?g)$/i
const QUALITY = 78
const CONTENT_TYPE: Record<Format, string> = { webp: 'image/webp', png: 'image/png' }

const listFiles = async (dir: string, base = dir): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const nested = await Promise.all(
    entries.map(entry => {
      const full = path.join(dir, entry.name)
      return entry.isDirectory() ? listFiles(full, base) : [path.relative(base, full).split(path.sep).join('/')]
    }),
  )
  return nested.flat()
}

const collectJobs = async (publicDir: string): Promise<Job[]> => {
  const jobs = [...ICONS]
  for (const src of await listFiles(path.join(publicDir, 'images'), publicDir)) {
    if (!SOURCE.test(src)) continue
    const rule = RULES.find(r => r.match.test(src))
    if (!rule) continue
    const name = src.replace(SOURCE, '')
    const quality = rule.quality ?? QUALITY
    jobs.push({ src, out: `${name}.webp`, width: rule.width, format: 'webp', quality })
    if (rule.small) jobs.push({ src, out: `${name}${SMALL_SUFFIX}.webp`, width: rule.small, format: 'webp', quality })
  }
  return jobs
}

const mtime = (file: string) => stat(file).then(s => s.mtimeMs, () => 0)

/**
 * Converts every PNG/JPG under public/images to resized WebP (and the logo to small favicons).
 * Results are cached in node_modules/.cache/images and only redone when the source changes,
 * so the originals stay untouched in the repo.
 * - dev: generated on demand when the browser asks for `/images/....webp`.
 * - build: all written to dist, and the heavy originals are dropped from it.
 */
export const images = (): Plugin => {
  let publicDir = ''
  let outDir = ''
  let cacheDir = ''
  let jobs = new Map<string, Job>()
  const pending = new Map<string, Promise<string>>()

  const generate = async (job: Job) => {
    const source = path.join(publicDir, job.src)
    const cached = path.join(cacheDir, `${job.out}@${job.width}q${job.quality}`)
    if ((await mtime(cached)) >= (await mtime(source))) return cached

    await mkdir(path.dirname(cached), { recursive: true })
    const image = sharp(source).resize({ width: job.width, withoutEnlargement: true })
    await (job.format === 'webp'
      ? image.webp({ quality: job.quality, effort: 5 })
      : image.png({ compressionLevel: 9, palette: true })
    ).toFile(cached)
    return cached
  }

  /** Dedupes concurrent requests for the same file (dev server). */
  const ensure = (job: Job) => {
    let promise = pending.get(job.out)
    if (!promise) {
      promise = generate(job).finally(() => pending.delete(job.out))
      pending.set(job.out, promise)
    }
    return promise
  }

  return {
    name: 'images',
    async configResolved(config) {
      publicDir = config.publicDir
      outDir = path.resolve(config.root, config.build.outDir)
      cacheDir = path.resolve(config.root, 'node_modules/.cache/images')
      jobs = new Map((await collectJobs(publicDir)).map(job => [job.out, job]))
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const job = jobs.get(decodeURIComponent((req.url ?? '').split('?')[0].slice(1)))
        if (!job) return next()
        try {
          const file = await ensure(job)
          res.setHeader('Content-Type', CONTENT_TYPE[job.format])
          res.setHeader('Cache-Control', 'no-cache')
          createReadStream(file).pipe(res)
        } catch (error) {
          next(error)
        }
      })
    },
    async writeBundle() {
      const all = [...jobs.values()]
      const sizes = await Promise.all(
        all.map(async job => {
          const file = await ensure(job)
          const target = path.join(outDir, job.out)
          await mkdir(path.dirname(target), { recursive: true })
          await copyFile(file, target)
          return (await stat(target)).size
        }),
      )

      // The site only references the WebP versions, so the originals are dead weight in the deploy.
      const converted = [...new Set(all.filter(job => job.src.startsWith('images/')).map(job => job.src))]
      const originals = await Promise.all(
        converted.map(async src => {
          await rm(path.join(outDir, src), { force: true })
          return (await stat(path.join(publicDir, src))).size
        }),
      )

      const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)
      const before = sum(originals)
      const after = sum(sizes)
      const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
      this.info(`${all.length} optimized images (${mb(before)} of originals → ${mb(after)})`)
    },
  }
}
