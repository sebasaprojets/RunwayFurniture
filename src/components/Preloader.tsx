import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { brand } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe } from '../lib/motion'
import { RunwaySymbol, RunwaySymbolAnimated } from './RunwayLogo'

const WORD = 'Josefin Sans, Manrope, system-ui, sans-serif'
/** Brushed champagne metal, like the letters on the portfolio cover. */
const metal = {
  backgroundImage: 'linear-gradient(180deg, #fbf1dc 0%, #e3cba0 38%, #a98654 62%, #e9d6ae 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const

/**
 * Opening screen built on the company logo:
 *  1. In a warm dark room the red drop swells and its four bubbles bud off it like liquid.
 *  2. RUNWAY rises letter by letter in brushed champagne, a light passes across it,
 *     FURNITURE settles and the hairlines draw out on either side of INTERNATIONAL.
 *  3. The room parts like two doors onto the site, on its own (the language is
 *     switched from the menu, never asked here).
 * Any key or a click also enters at once. Reduced motion skips straight to a fade.
 */
export function Preloader({ onDone, onReveal, reduced }: { onDone: () => void; onReveal?: () => void; reduced: boolean }) {
  const { t } = useLang()
  const [phase, setPhase] = useState<'intro' | 'open' | 'done'>('intro')
  const opening = useRef(false)

  const enter = useCallback(() => {
    if (opening.current) return
    opening.current = true
    setPhase('open')
    onReveal?.()
    window.setTimeout(() => {
      setPhase('done')
      onDone()
    }, reduced ? 300 : 1500)
  }, [onDone, onReveal, reduced])

  useEffect(() => {
    const timer = window.setTimeout(enter, reduced ? 400 : 4800)
    const key = () => enter()
    window.addEventListener('keydown', key)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', key)
    }
  }, [reduced, enter])

  const open = phase === 'open'
  const letters = 'RUNWAY'.split('')

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-modal="true" aria-label="Runway Furniture International" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {/* the room: two doors that part to reveal the site */}
          {(['left', 'right'] as const).map((side) => (
            <motion.div
              key={side}
              className={`absolute inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} w-1/2 bg-[#0b0a09]`}
              animate={open ? { x: side === 'left' ? '-101%' : '101%' } : { x: 0 }}
              transition={{ duration: reduced ? 0.3 : 1.3, ease: easeCine, delay: reduced ? 0 : 0.25 }}
            >
              <div
                className={`absolute inset-y-0 ${side === 'left' ? 'right-0' : 'left-0'} w-px bg-gradient-to-b from-transparent via-[#c9a66b]/40 to-transparent`}
                style={{ opacity: open ? 1 : 0, transition: 'opacity .3s' }}
              />
            </motion.div>
          ))}

          {!reduced && (
            <>
              <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen" style={{ opacity: open ? 0 : 0.6, transition: 'opacity .4s' }}>
                <div className="grain" />
              </div>
              {/* warm light from above, as on the cover's lit wall */}
              <motion.div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_38%,rgba(201,140,90,.22),rgba(120,40,30,.08)_55%,transparent_75%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: open ? 0.4 : 2.4, ease: 'easeOut' }}
              />
            </>
          )}

          <button className="absolute inset-0 cursor-default" tabIndex={-1} aria-hidden onClick={enter} />

          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            animate={open ? { opacity: 0, scale: 1.08, filter: 'blur(8px)' } : { opacity: 1 }}
            transition={{ duration: 0.6, ease: easeLuxe }}
          >
            {reduced ? (
              <RunwaySymbol className="h-[18vmin] max-h-40 w-auto" />
            ) : (
              <RunwaySymbolAnimated className="h-[22vmin] max-h-52 min-h-24 w-auto drop-shadow-[0_18px_40px_rgba(160,20,20,0.35)]" delay={0.3} />
            )}

            <h1 className="sr-only">Runway Furniture International</h1>
            <div className="relative mt-[3.2vmin] flex overflow-hidden pt-[0.08em]" style={{ fontFamily: WORD }} aria-hidden>
              {letters.map((l, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block text-[clamp(2.9rem,10vw,6.4rem)] leading-none font-light tracking-[0.04em]"
                    style={metal}
                    initial={reduced ? false : { y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 1.2, ease: easeLuxe, delay: 1.9 + i * 0.07 }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
              {/* a light passing over the metal */}
              {!reduced && (
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent mix-blend-overlay"
                  initial={{ x: '-120%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut', delay: 3.1 }}
                />
              )}
            </div>
            <motion.p
              className="mt-[1.6vmin] text-[clamp(0.8rem,2.2vw,1.35rem)] font-normal text-[#e9dcc4] uppercase"
              style={{ fontFamily: WORD }}
              initial={reduced ? false : { opacity: 0, letterSpacing: '1.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.62em' }}
              transition={{ duration: 1.6, ease: easeLuxe, delay: 2.5 }}
              aria-hidden
            >
              <span className="mr-[-0.62em]">Furniture</span>
            </motion.p>
            <div className="mt-[1.4vmin] flex items-center gap-4" aria-hidden>
              <motion.span className="h-px origin-right bg-gradient-to-r from-transparent to-[#c9a66b]" style={{ width: 'clamp(2.5rem,8vw,5.5rem)' }} initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: easeLuxe, delay: 2.9 }} />
              <motion.span
                className="text-[clamp(0.62rem,1.5vw,0.9rem)] tracking-[0.4em] text-[#d9c4a0] uppercase"
                style={{ fontFamily: WORD }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3 }}
              >
                <span className="mr-[-0.4em]">International</span>
              </motion.span>
              <motion.span className="h-px origin-left bg-gradient-to-l from-transparent to-[#c9a66b]" style={{ width: 'clamp(2.5rem,8vw,5.5rem)' }} initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: easeLuxe, delay: 2.9 }} />
            </div>

            <motion.p
              className="mt-[4.5vmin] font-display text-[clamp(1.15rem,2.6vw,1.7rem)] text-[#efe4d0]/85 italic"
              initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: easeLuxe, delay: 3.5 }}
            >
              {t('Creating extraordinary spaces worldwide', 'Creando espacios extraordinarios en todo el mundo')}
            </motion.p>
            <motion.p
              className="mt-3 text-[0.62rem] tracking-[0.32em] text-[#d9c4a0]/60 uppercase"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.8 }}
            >
              {t('Hospitality · Residential · Contract · Bespoke', 'Hotelería · Residencial · Contract · A medida')} — {t('Since', 'Desde')} {brand.since}
            </motion.p>

          </motion.div>

          <motion.p
            className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-[0.58rem] tracking-[0.36em] text-[#d9c4a0]/45 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ delay: open ? 0 : 1.2 }}
          >
            Montreal · Singapore · Worldwide
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
