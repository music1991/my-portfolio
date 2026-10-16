/**
 * Images under public/images are PNG/JPG in the repo; the "images" Vite plugin
 * (vite-plugins/images.ts) serves and builds them as resized `.webp`.
 * Project screenshots also get a lighter `-sm.webp` for cards and thumbnails.
 */
export const SMALL_SUFFIX = '-sm'

/** Hero photo: the LCP image of the home page, preloaded from its HTML. */
export const HERO_PHOTO = '/images/me-office.webp'

export const smallImage = (src: string) => src.replace(/\.webp$/, `${SMALL_SUFFIX}.webp`)

/** srcset for a project screenshot: 640px version for phones/cards, full one for larger screens. */
export const projectSrcSet = (src: string) => `${smallImage(src)} 640w, ${src} 1600w`
