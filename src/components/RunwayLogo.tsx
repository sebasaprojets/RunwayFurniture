import { motion } from 'motion/react'
import { useId } from 'react'
import { easeLuxe } from '../lib/motion'

/**
 * Runway's mark from the company portfolio cover: a red drop with four bubbles
 * rising from it. Redrawn as vectors from the cover so it stays sharp at any size.
 */
export const SYMBOL_VIEWBOX = '110 55 592 535'
export const BLOB =
  'M120 445C120 390 160 345 215 345C265 345 300 365 340 378C390 392 440 392 490 382C530 374 560 372 600 378C655 386 692 430 692 478C692 535 650 580 600 580C555 580 525 555 490 525C455 497 420 485 385 488C345 492 310 515 280 532C255 545 235 548 215 548C160 548 120 500 120 445Z'
/** Bubbles from the largest (nearest the drop) to the smallest. */
export const BUBBLES = [
  { cx: 430, cy: 312, r: 62 },
  { cx: 494, cy: 221, r: 39 },
  { cx: 512, cy: 138, r: 26 },
  { cx: 525, cy: 77, r: 12 },
]

/** Lacquered red with a soft top light, as on the cover's wall sign. */
function Paint({ id }: { id: string }) {
  return (
    <>
      <linearGradient id={`${id}-red`} x1="0" y1="0.2" x2="1" y2="0.8">
        <stop offset="0" stopColor="#7e0d12" />
        <stop offset="0.45" stopColor="#b8161b" />
        <stop offset="1" stopColor="#ec3a2b" />
      </linearGradient>
      <radialGradient id={`${id}-bub`} cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#f2523d" />
        <stop offset="0.6" stopColor="#c11b1e" />
        <stop offset="1" stopColor="#8a0f14" />
      </radialGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </>
  )
}

/** The finished symbol, for static use. */
export function RunwaySymbol({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox={SYMBOL_VIEWBOX} className={className} aria-hidden>
      <defs>
        <Paint id={id} />
      </defs>
      <path d={BLOB} fill={`url(#${id}-red)`} />
      <path d={BLOB} fill={`url(#${id}-gloss)`} />
      {BUBBLES.map((b) => (
        <circle key={b.cy} {...b} fill={`url(#${id}-bub)`} />
      ))}
    </svg>
  )
}

/**
 * The symbol building itself: the drop swells out of a single point and the
 * bubbles bud off it one after another, merging like liquid (a "goo" filter)
 * until a crisp copy settles on top.
 */
export function RunwaySymbolAnimated({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const id = useId().replace(/:/g, '')
  const settle = delay + 2.3
  return (
    <svg viewBox={SYMBOL_VIEWBOX} className={className} aria-hidden overflow="visible">
      <defs>
        <Paint id={id} />
        <filter id={`${id}-goo`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="atop" />
        </filter>
      </defs>

      {/* liquid build */}
      <motion.g filter={`url(#${id}-goo)`} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: settle, duration: 0.5 }}>
        <motion.path
          d={BLOB}
          fill={`url(#${id}-red)`}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 55%' }}
          // fades in already half-grown, so no lone red speck shows before the drop forms
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.05, 1], opacity: [0, 1, 1] }}
          transition={{ delay, duration: 1.4, ease: easeLuxe, times: [0, 0.65, 1] }}
        />
        {BUBBLES.map((b, i) => (
          <motion.circle
            key={b.cy}
            fill={`url(#${id}-bub)`}
            // positions are animated in the drawing's own units, so the bubbles bud
            // straight out of the drop at any rendered size
            initial={{ cx: 430, cy: 400, r: b.r * 0.4, opacity: 0 }}
            animate={{ cx: b.cx, cy: b.cy, r: b.r, opacity: 1 }}
            transition={{ delay: delay + 0.75 + i * 0.22, duration: 1.1, ease: easeLuxe }}
          />
        ))}
      </motion.g>

      {/* crisp, lacquered final */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: settle - 0.15, duration: 0.6 }}>
        <path d={BLOB} fill={`url(#${id}-red)`} />
        <path d={BLOB} fill={`url(#${id}-gloss)`} />
        {BUBBLES.map((b) => (
          <circle key={b.cy} {...b} fill={`url(#${id}-bub)`} />
        ))}
      </motion.g>
    </svg>
  )
}
