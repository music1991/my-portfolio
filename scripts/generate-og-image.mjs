/**
 * Builds the social share image (Open Graph / Twitter card) used by every page.
 * Run it again only when the photo or the claim changes:
 *
 *   pnpm og-image  →  public/og-image.png (1200×630)
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PHOTO = path.join(ROOT, 'public', 'images', 'me-office.png')
const OUT = path.join(ROOT, 'public', 'og-image.png')

const WIDTH = 1200
const HEIGHT = 630
const PHOTO_WIDTH = 470
// Upper body from the 1086×1448 office photo, keeping the "System Architecture" sketch in frame.
const PHOTO_CROP = { left: 250, top: 140, width: 640, height: 858 }

const ACCENT = '#3B82F6'
const STACK = ['React', 'React Native', 'Next.js', 'Node.js', 'TypeScript', 'IA']

const chip = (label, x, y) => {
  const w = Math.round(label.length * 12.5 + 32)
  return {
    width: w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="40" rx="20" fill="#18181B" stroke="#3F3F46"/>
          <text x="${x + w / 2}" y="${y + 26}" font-size="20" font-weight="600" fill="#E4E4E7" text-anchor="middle">${label}</text>`,
  }
}

const chips = (() => {
  let x = 70
  let y = 400
  const parts = []
  for (const label of STACK) {
    const { width, svg } = chip(label, x, y)
    if (x + width > WIDTH - PHOTO_WIDTH - 40) {
      x = 70
      y += 52
    }
    parts.push(chip(label, x, y).svg)
    x += width + 12
  }
  return parts.join('')
})()

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="12%" cy="10%" r="65%">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#09090B"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="${ACCENT}"/>
</svg>`

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#09090B" stop-opacity="1"/>
      <stop offset="1" stop-color="#09090B" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="${WIDTH - PHOTO_WIDTH}" y="0" width="160" height="${HEIGHT - 6}" fill="url(#fade)"/>
  <g font-family="Inter, 'Segoe UI', Arial, Helvetica, sans-serif">
    <rect x="70" y="92" width="44" height="4" fill="${ACCENT}"/>
    <text x="126" y="100" font-size="20" font-weight="600" letter-spacing="3" fill="${ACCENT}">ING. EN SISTEMAS · UTN</text>
    <text x="70" y="190" font-size="72" font-weight="800" fill="#FAFAFA">Sebastián</text>
    <text x="70" y="270" font-size="72" font-weight="800" fill="#FAFAFA">Soraire</text>
    <text x="70" y="335" font-size="32" font-weight="500" fill="#A1A1AA">Ingeniero de Software · Software Engineer</text>
    ${chips}
    <text x="70" y="575" font-size="22" font-weight="500" fill="#71717A">ing-soraire.24studio.net</text>
  </g>
</svg>`

const photo = await sharp(PHOTO)
  .extract(PHOTO_CROP)
  .resize(PHOTO_WIDTH, HEIGHT - 6, { fit: 'cover', position: 'top' })
  .modulate({ saturation: 0.9 })
  .toBuffer()

await sharp(Buffer.from(background))
  .composite([
    { input: photo, left: WIDTH - PHOTO_WIDTH, top: 0 },
    { input: Buffer.from(overlay), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT)

console.log(`og-image: ${path.relative(ROOT, OUT)} (${WIDTH}×${HEIGHT})`)
