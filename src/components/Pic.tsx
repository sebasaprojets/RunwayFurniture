import { cloneElement, type CSSProperties, type ReactElement } from 'react'

/**
 * Lighter delivery for a photo, without touching the photo itself:
 *  - browsers that read AVIF get a copy sized for the screen (640 → full resolution), roughly a third
 *    of the JPEG's weight; any other browser keeps the original JPEG exactly as before;
 *  - while it downloads, the frame shows a soft blur of the photo's own colours instead of an empty box.
 * The copies are made by scripts/optimize-images.py. Wrap any <img> / <motion.img> whose src is a photo.
 */
type Table = Record<string, [number, number, string]>
let table: Table = {}
/** The photo table (sizes + previews, ~60 KB) is fetched on its own so it never delays the opening film;
 * the app waits for it before building the photo sections. */
export const picReady: Promise<void> = import('../data/imgmeta.json').then(
  (m) => void (table = m.default as unknown as Table),
  () => undefined,
)
const STEPS = [640, 1200, 1600, 2400]
const base = `${import.meta.env.BASE_URL}img/`

function lookup(url: string) {
  const file = url.split('/').pop()?.split('?')[0].replace(/\.jpg$/, '') ?? ''
  // dev serves the file under its own name; the build adds an 8-character hash
  for (const name of [file, file.replace(/-[\w-]{8}$/, '')]) {
    const key = name.replace(/\.sm$/, '')
    if (table[key]) return { key, entry: table[key] }
  }
  return null
}

export function picture(url: string) {
  const hit = lookup(url)
  if (!hit) return null
  const [w, , blur] = hit.entry
  const widths = [...STEPS.filter((s) => s < w * 0.92), w]
  return { srcSet: widths.map((x) => `${base}${hit.key}-${x}.avif ${x}w`).join(', '), blur }
}

// full-bleed photos on a portrait screen are cropped from a much wider frame, hence the portrait rule
export function Pic({ src, sizes = '(orientation: portrait) 170vh, 100vw', blur = true, children }: { src: string; sizes?: string; blur?: boolean; children: ReactElement<{ style?: CSSProperties }> }) {
  const p = picture(src)
  if (!p) return children
  const img = blur
    ? cloneElement(children, {
        style: { backgroundImage: `url(${p.blur})`, backgroundSize: 'cover', backgroundPosition: 'center', ...children.props.style },
      })
    : children
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={p.srcSet} sizes={sizes} />
      {img}
    </picture>
  )
}
