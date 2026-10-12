import { motion } from 'motion/react'
import { useId } from 'react'
import { easeLuxe } from '../lib/motion'

export const BRAND_SERIF = 'Cinzel, "Trajan Pro", "Cormorant Garamond", Georgia, serif'

/**
 * The Runway lockup as it appears on the company's printed material:
 * gilded R monogram · RUNWAY in Roman capitals · ornamental rule with a centre point ·
 * FURNITURE INTERNATIONAL. `animate` plays the title-sequence entrance:
 * the R is drawn as a gold hairline, then floods with polished metal.
 */
export function BrandMark({ animate = false, delay = 0, className = '', pillars = false }: { animate?: boolean; delay?: number; className?: string; pillars?: boolean }) {
  const id = useId().replace(/:/g, '')
  const t = (d: number) => (animate ? { duration: 1.6, ease: easeLuxe, delay: delay + d } : { duration: 0 })

  return (
    <div className={`flex flex-col items-center ${className}`} aria-label="Runway Furniture International">
      <svg viewBox="0 0 200 200" className="h-[1.9em] w-auto overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`metal-${id}`} x1="0.1" y1="0" x2="0.55" y2="1">
            <stop offset="0" stopColor="#fbefcf" />
            <stop offset="0.18" stopColor="#d8b77a" />
            <stop offset="0.38" stopColor="#8a6538" />
            <stop offset="0.52" stopColor="#e9d3a0" />
            <stop offset="0.7" stopColor="#b08a52" />
            <stop offset="0.86" stopColor="#6e4f2b" />
            <stop offset="1" stopColor="#c9a66b" />
          </linearGradient>
          <linearGradient id={`sheen-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fffaf0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id={`emboss-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b" />
            <feSpecularLighting in="b" surfaceScale="3" specularConstant="0.9" specularExponent="22" lightingColor="#fff4dc" result="s">
              <feDistantLight azimuth="235" elevation="48" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" result="sIn" />
            <feComposite in="SourceGraphic" in2="sIn" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" />
          </filter>
          <clipPath id={`clip-${id}`}>
            <text x="100" y="168" textAnchor="middle" fontFamily={BRAND_SERIF} fontWeight="500" fontSize="190">
              R
            </text>
          </clipPath>
        </defs>

        {/* soft cast shadow */}
        <motion.text
          x="102"
          y="171"
          textAnchor="middle"
          fontFamily={BRAND_SERIF}
          fontWeight="500"
          fontSize="190"
          fill="#000"
          initial={{ opacity: animate ? 0 : 0.55 }}
          animate={{ opacity: 0.55 }}
          transition={t(1.4)}
          style={{ filter: 'blur(3px)' }}
        >
          R
        </motion.text>
        {/* polished metal fill */}
        <motion.text
          x="100"
          y="168"
          textAnchor="middle"
          fontFamily={BRAND_SERIF}
          fontWeight="500"
          fontSize="190"
          fill={`url(#metal-${id})`}
          filter={`url(#emboss-${id})`}
          initial={{ opacity: animate ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={t(1.25)}
        >
          R
        </motion.text>
        {/* gold hairline that draws the letter first */}
        <motion.text
          x="100"
          y="168"
          textAnchor="middle"
          fontFamily={BRAND_SERIF}
          fontWeight="500"
          fontSize="190"
          fill="none"
          stroke="#e6cc94"
          strokeWidth="0.9"
          strokeDasharray="900"
          initial={{ strokeDashoffset: animate ? 900 : 0, opacity: 1 }}
          animate={{ strokeDashoffset: 0, opacity: animate ? [1, 1, 0.35] : 0.35 }}
          transition={animate ? { duration: 2.4, ease: [0.65, 0, 0.35, 1], delay, opacity: { duration: 3, times: [0, 0.7, 1], delay } } : { duration: 0 }}
        >
          R
        </motion.text>
        {/* travelling specular highlight */}
        {animate && (
          <g clipPath={`url(#clip-${id})`}>
            <motion.rect
              y="-10"
              width="60"
              height="240"
              fill={`url(#sheen-${id})`}
              transform="skewX(-20)"
              initial={{ x: -110 }}
              animate={{ x: 300 }}
              transition={{ duration: 1.6, ease: 'easeInOut', delay: delay + 2.1, repeat: 1, repeatDelay: 1.4 }}
              style={{ mixBlendMode: 'overlay' }}
            />
          </g>
        )}
      </svg>

      <div className="mt-[0.18em] flex overflow-hidden" style={{ fontFamily: BRAND_SERIF }}>
        {'RUNWAY'.split('').map((l, i) => (
          <motion.span
            key={i}
            className="bg-gradient-to-b from-[#ffffff] via-[#ece8df] to-[#b9b2a4] bg-clip-text text-[0.62em] font-medium text-transparent"
            initial={animate ? { opacity: 0, y: '0.5em', filter: 'blur(8px)', letterSpacing: '0.4em' } : false}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.16em' }}
            transition={t(1.5 + i * 0.06)}
          >
            {l}
          </motion.span>
        ))}
      </div>

      <div className="mt-[0.2em] flex w-full items-center justify-center gap-[0.3em]">
        <motion.span
          className="h-px w-[1.5em] origin-right bg-gradient-to-r from-transparent to-gold"
          initial={animate ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={t(2.2)}
        />
        <motion.span
          className="size-[0.09em] min-h-1 min-w-1 rotate-45 bg-gold"
          initial={animate ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={t(2.1)}
        />
        <motion.span
          className="h-px w-[1.5em] origin-left bg-gradient-to-l from-transparent to-gold"
          initial={animate ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={t(2.2)}
        />
      </div>

      <motion.span
        className="mt-[0.35em] text-[max(0.13em,9px)] font-semibold tracking-[0.42em] whitespace-nowrap text-gold uppercase"
        initial={animate ? { opacity: 0, letterSpacing: '0.8em' } : false}
        animate={{ opacity: 1, letterSpacing: '0.42em' }}
        transition={t(2.4)}
      >
        Furniture International
      </motion.span>

      {pillars && (
        <motion.span
          className="mt-[0.9em] text-[max(0.085em,8px)] max-sm:hidden font-medium tracking-[0.36em] whitespace-nowrap text-bone/55 uppercase"
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={t(2.9)}
        >
          Luxury Hospitality&nbsp;&nbsp;•&nbsp;&nbsp;Residential&nbsp;&nbsp;•&nbsp;&nbsp;Bespoke Furniture
        </motion.span>
      )}
    </div>
  )
}
