import { AnimatePresence, motion } from 'motion/react'
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { brand } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe } from '../lib/motion'
import { RunwaySymbol, RunwaySymbolAnimated } from './RunwayLogo'

const IntroScene = lazy(() => import('./IntroScene'))

const WORD = 'Josefin Sans, Manrope, system-ui, sans-serif'

/**
 * Opening screen in the style of the company's presentation film:
 *  1. In a white studio the camera skims low past the red bubbles of the Runway mark,
 *     a real lacquered 3D object, and glides over the RUNWAY lettering in shallow focus.
 *  2. It rises to show the whole mark; the name and tagline settle beneath it.
 *  3. The studio lifts away like a curtain onto the site, on its own.
 * Any key or a click enters at once. Reduced motion shows the finished shot and fades.
 */
export function Preloader({ onDone, onReveal, reduced }: { onDone: () => void; onReveal?: () => void; reduced: boolean }) {
  const { t } = useLang()
  const [phase, setPhase] = useState<'intro' | 'open' | 'done'>('intro')
  const [ready, setReady] = useState(false)
  // the titles wait until the camera has come to rest, so they never sit over the mark
  const [settled, setSettled] = useState(false)
  const [flat, setFlat] = useState(false)
  const opening = useRef(false)

  const enter = useCallback(() => {
    if (opening.current) return
    opening.current = true
    setPhase('open')
    onReveal?.()
    window.setTimeout(() => {
      setPhase('done')
      onDone()
    }, reduced ? 400 : 1300)
  }, [onDone, onReveal, reduced])

  // the film runs from the moment the scene is on screen; a hard cap keeps a slow device from waiting forever
  useEffect(() => {
    const key = () => enter()
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [enter])
  useEffect(() => {
    if (ready) return
    const cap = window.setTimeout(enter, 9000)
    return () => clearTimeout(cap)
  }, [ready, enter])
  // whatever happens, nobody waits more than 14 seconds
  useEffect(() => {
    const cap = window.setTimeout(enter, 14000)
    return () => clearTimeout(cap)
  }, [enter])
  const fallback = useCallback(() => {
    setFlat(true)
    setReady(true)
    window.setTimeout(() => setSettled(true), reduced ? 0 : 1600)
  }, [reduced])
  useEffect(() => {
    if (!ready || (window as { __introT?: number }).__introT !== undefined) return
    const timer = window.setTimeout(enter, reduced ? 1400 : flat ? 5200 : 7800)
    return () => clearTimeout(timer)
  }, [ready, reduced, flat, enter])

  const open = phase === 'open'
  const late = reduced ? 0.1 : 0.15

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#f3f1ee]"
          role="dialog"
          aria-modal="true"
          aria-label="Runway Furniture International"
          initial={false}
          animate={open ? (reduced ? { opacity: 0 } : { y: '-100%' }) : { y: 0, opacity: 1 }}
          transition={{ duration: reduced ? 0.4 : 1.15, ease: easeCine, delay: reduced ? 0 : 0.1 }}
        >
          {flat ? (
            // devices without graphics acceleration: the mark builds itself in 2D instead
            <div className="absolute inset-x-0 top-[14vh] flex flex-col items-center">
              {reduced ? <RunwaySymbol className="h-[26vmin] w-auto" /> : <RunwaySymbolAnimated className="h-[26vmin] w-auto drop-shadow-[0_24px_30px_rgba(60,10,10,0.25)]" delay={0.1} />}
              <motion.p
                className="mt-[3vmin] text-[clamp(2.6rem,8vw,5.4rem)] leading-none font-light tracking-[0.08em] text-[#1d1916]"
                style={{ fontFamily: WORD }}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: easeLuxe, delay: 1.2 }}
                aria-hidden
              >
                <span className="mr-[-0.08em]">RUNWAY</span>
              </motion.p>
            </div>
          ) : (
            <Suspense fallback={null}>
              <IntroScene still={reduced} onReady={() => setReady(true)} onSettle={() => setSettled(true)} onFallback={fallback} />
            </Suspense>
          )}

          {/* studio vignette and a whisper of film grain */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(40,30,25,.22))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply">
            <div className="grain" />
          </div>

          <button className="absolute inset-0 cursor-default" tabIndex={-1} aria-hidden onClick={enter} />

          <h1 className="sr-only">Runway Furniture International</h1>
          {settled && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[9vh] flex flex-col items-center px-6 text-center">
              <div className="flex items-center gap-4" aria-hidden>
                <motion.span className="h-px origin-right bg-gradient-to-r from-transparent to-[#8c0d14]" style={{ width: 'clamp(2rem,7vw,5rem)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: easeLuxe, delay: late }} />
                <motion.span
                  className="text-[clamp(0.7rem,1.7vw,1rem)] tracking-[0.5em] text-[#2a2420] uppercase sm:whitespace-nowrap"
                  style={{ fontFamily: WORD }}
                  initial={{ opacity: 0, letterSpacing: '0.9em' }}
                  animate={{ opacity: 1, letterSpacing: '0.5em' }}
                  transition={{ duration: 1.4, ease: easeLuxe, delay: late }}
                >
                  <span className="mr-[-0.5em]">Furniture International</span>
                </motion.span>
                <motion.span className="h-px origin-left bg-gradient-to-l from-transparent to-[#8c0d14]" style={{ width: 'clamp(2rem,7vw,5rem)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: easeLuxe, delay: late }} />
              </div>
              <motion.p
                className="mt-4 font-display text-[clamp(1.1rem,2.5vw,1.6rem)] text-[#1d1916]/85 italic"
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: easeLuxe, delay: late + 0.5 }}
              >
                {t('Creating extraordinary spaces worldwide', 'Creando espacios extraordinarios en todo el mundo')}
              </motion.p>
              <motion.p
                className="mt-3 text-[0.6rem] tracking-[0.32em] text-[#2a2420]/55 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: late + 0.9 }}
              >
                {t('Hospitality · Residential · Contract · Bespoke', 'Hotelería · Residencial · Contract · A medida')} — {t('Since', 'Desde')} {brand.since}
              </motion.p>
            </div>
          )}

          <motion.p
            className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-[0.56rem] tracking-[0.36em] text-[#2a2420]/40 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Montreal · Singapore · Worldwide
          </motion.p>

          {/* the lacquer-red edge the studio lifts away on */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[#8c0d14]" style={{ opacity: open ? 1 : 0, transition: 'opacity .2s' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
