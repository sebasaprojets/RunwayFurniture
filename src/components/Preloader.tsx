import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { brand } from '../data/site'
import { easeCine, easeLuxe } from '../lib/motion'
import { useLang } from '../i18n'

const SERIF = 'Instrument Serif, Georgia, serif'

/**
 * Opening title sequence, directed like a film's main titles:
 *  1. Letterboxed black frame, film grain, a gold hairline frame draws itself.
 *  2. The gilded "R" monogram resolves from soft focus; a specular highlight travels across the metal.
 *  3. The wordmark tightens into place letter by letter; opening credits fade through.
 *  4. The camera dives through the counter of the R into the hero scene while the bars retract.
 * Skippable (click / key), and reduced to a simple fade for prefers-reduced-motion.
 */
export function Preloader({ onDone, onReveal, reduced }: { onDone: () => void; onReveal?: () => void; reduced: boolean }) {
  const { t, tx } = useLang()
  const [phase, setPhase] = useState<'title' | 'dive' | 'done'>('title')
  const [count, setCount] = useState(0)
  const [credit, setCredit] = useState(-1)
  const finished = useRef(false)
  const diving = useRef(false)
  const dive = useAnimationControls()

  const credits = [
    `${t('Est.', 'Desde')} ${brand.since}`,
    `${brand.offices.map((o) => tx(o.cityLabel)).join('  ·  ')}  ·  ${t('Worldwide', 'Todo el mundo')}`,
    t('Creating extraordinary spaces', 'Creamos espacios extraordinarios'),
  ]

  const finish = () => {
    if (finished.current) return
    finished.current = true
    onReveal?.()
    setPhase('done')
    onDone()
  }

  const startDive = async () => {
    if (diving.current) return
    diving.current = true
    setPhase('dive')
    onReveal?.()
    await dive.start('dive')
    finish()
  }

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(finish, 400)
      return () => clearTimeout(t)
    }
    // loading counter (eased, cinematic rather than literal)
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 3600)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const timers = [
      setTimeout(() => setCredit(0), 2100),
      setTimeout(() => setCredit(1), 2900),
      setTimeout(() => setCredit(2), 3700),
      setTimeout(startDive, 4500),
    ]
    const skip = () => startDive()
    window.addEventListener('keydown', skip)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
    }
  }, [reduced])

  if (reduced)
    return (
      <AnimatePresence>
        {phase !== 'done' && <motion.div className="fixed inset-0 z-[100] bg-ink" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} aria-hidden />}
      </AnimatePresence>
    )

  const letters = 'RUNWAY'.split('')

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden"
          onClick={startDive}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          role="presentation"
        >
          {/* Black frame with an R-shaped aperture that scales open during the dive */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <defs>
              <mask id="intro-aperture" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
                <rect width="1600" height="900" fill="white" />
                <motion.text
                  x="800"
                  y="560"
                  textAnchor="middle"
                  fontFamily={SERIF}
                  fontSize="300"
                  fill="black"
                  style={{ transformBox: 'view-box', transformOrigin: '782px 470px' }}
                  initial={{ scale: 0.0001, opacity: 0 }}
                  animate={dive}
                  variants={{ dive: { scale: [1, 1.05, 46], opacity: [1, 1, 1], transition: { duration: 2.1, times: [0, 0.25, 1], ease: easeCine } } }}
                >
                  R
                </motion.text>
              </mask>
            </defs>
            <motion.rect
              width="1600"
              height="900"
              fill="#0A0A0A"
              mask="url(#intro-aperture)"
              animate={dive}
              variants={{ dive: { opacity: [1, 1, 0], transition: { duration: 2.1, times: [0, 0.75, 1] } } }}
            />
          </svg>

          {/* atmosphere: grain + a slow warm light leak */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 mix-blend-screen">
            <div className="grain" />
          </div>
          <motion.div
            className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(40%_30%_at_50%_50%,rgba(184,154,106,.16),transparent_70%)]"
            initial={{ x: '-30%', opacity: 0 }}
            animate={phase === 'dive' ? { opacity: 0 } : { x: '20%', opacity: 1 }}
            transition={{ duration: 5, ease: 'easeInOut' }}
          />

          {/* Title card */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={phase === 'dive' ? { opacity: 0, scale: 1.06, filter: 'blur(6px)' } : {}}
            transition={{ duration: 0.6, ease: easeLuxe }}
          >
            {/* architectural hairline frame */}
            <svg className="absolute h-[62vmin] w-[62vmin] text-gold/50" viewBox="0 0 100 100" aria-hidden>
              {[
                'M 2 14 L 2 2 L 14 2',
                'M 86 2 L 98 2 L 98 14',
                'M 98 86 L 98 98 L 86 98',
                'M 14 98 L 2 98 L 2 86',
              ].map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.25"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: easeLuxe, delay: 0.2 + i * 0.08 }}
                />
              ))}
              <motion.circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.12"
                strokeOpacity="0.5"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.6, ease: easeLuxe, delay: 0.4 }}
                style={{ transformOrigin: '50px 50px' }}
              />
            </svg>

            {/* Gilded monogram */}
            <motion.svg
              viewBox="0 0 200 220"
              className="relative h-[24vmin] max-h-48 min-h-28 w-auto drop-shadow-[0_8px_40px_rgba(184,154,106,0.25)]"
              initial={{ opacity: 0, scale: 1.12, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: easeLuxe, delay: 0.6 }}
              aria-hidden
            >
              <defs>
                <linearGradient id="gold-metal" x1="0" y1="0" x2="0.35" y2="1">
                  <stop offset="0" stopColor="#f6e7c1" />
                  <stop offset="0.22" stopColor="#c9a66b" />
                  <stop offset="0.45" stopColor="#7d5a32" />
                  <stop offset="0.58" stopColor="#d9bd84" />
                  <stop offset="0.75" stopColor="#a07d4a" />
                  <stop offset="1" stopColor="#5e4224" />
                </linearGradient>
                <linearGradient id="gold-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#fffaf0" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="r-clip">
                  <text x="100" y="186" textAnchor="middle" fontFamily={SERIF} fontSize="230">
                    R
                  </text>
                </clipPath>
              </defs>
              {/* engraved depth: dark offset + bevel highlight */}
              <text x="101.5" y="188" textAnchor="middle" fontFamily={SERIF} fontSize="230" fill="#000" opacity="0.6">
                R
              </text>
              <text x="100" y="186" textAnchor="middle" fontFamily={SERIF} fontSize="230" fill="url(#gold-metal)">
                R
              </text>
              <text x="99.4" y="185.2" textAnchor="middle" fontFamily={SERIF} fontSize="230" fill="none" stroke="#fff5dc" strokeOpacity="0.35" strokeWidth="0.6">
                R
              </text>
              {/* travelling specular highlight */}
              <g clipPath="url(#r-clip)">
                <motion.rect
                  y="-20"
                  width="70"
                  height="260"
                  fill="url(#gold-sheen)"
                  transform="skewX(-18)"
                  initial={{ x: -120 }}
                  animate={{ x: 320 }}
                  transition={{ duration: 1.8, ease: 'easeInOut', delay: 1.9, repeat: 1, repeatDelay: 1.2 }}
                  style={{ mixBlendMode: 'overlay' }}
                />
              </g>
            </motion.svg>

            {/* wordmark */}
            <div className="relative mt-6 flex font-display text-3xl text-bone md:text-5xl" aria-label="Runway">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: 'blur(10px)', letterSpacing: '0.9em', y: 6 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.38em', y: 0 }}
                  transition={{ duration: 1.6, ease: easeLuxe, delay: 1.3 + i * 0.07 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <div className="relative mt-5 flex items-center gap-4">
              <motion.span className="h-px bg-gradient-to-r from-transparent to-gold/70" initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 1.4, ease: easeLuxe, delay: 1.9 }} />
              <motion.span
                className="eyebrow text-[0.6rem] text-gold"
                initial={{ opacity: 0, letterSpacing: '0.7em' }}
                animate={{ opacity: 1, letterSpacing: '0.42em' }}
                transition={{ duration: 1.6, ease: easeLuxe, delay: 2 }}
              >
                Furniture International
              </motion.span>
              <motion.span className="h-px bg-gradient-to-l from-transparent to-gold/70" initial={{ width: 0 }} animate={{ width: 64 }} transition={{ duration: 1.4, ease: easeLuxe, delay: 1.9 }} />
            </div>

            {/* opening credits */}
            <div className="absolute bottom-[16vh] h-6 overflow-hidden text-center">
              <AnimatePresence mode="wait">
                {credit >= 0 && (
                  <motion.p
                    key={credit}
                    className="font-display text-lg text-mineral/80 italic md:text-xl"
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                    transition={{ duration: 0.6, ease: easeLuxe }}
                  >
                    {credits[credit]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* letterbox bars + slate details */}
          {(['top', 'bottom'] as const).map((side) => (
            <motion.div
              key={side}
              className={`absolute inset-x-0 ${side}-0 flex h-[9vh] items-center justify-between bg-ink px-5 md:px-10 ${side === 'top' ? 'origin-top' : 'origin-bottom'}`}
              initial={{ scaleY: 1 }}
              animate={phase === 'dive' ? { scaleY: 0 } : { scaleY: 1 }}
              transition={{ duration: 1.2, ease: easeCine, delay: 0.3 }}
            >
              <motion.span
                className="eyebrow text-[0.6rem] text-bone/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'dive' ? 0 : 1 }}
                transition={{ delay: phase === 'dive' ? 0 : 0.8 }}
              >
                {side === 'top' ? 'Runway Furniture International' : <><span className="md:hidden">{t('Tap to enter', 'Toca para entrar')}</span><span className="hidden md:inline">{t('Click or press any key to enter', 'Haz clic o pulsa cualquier tecla para entrar')}</span></>}
              </motion.span>
              <motion.span
                className={`eyebrow text-[0.6rem] text-bone/60 tabular-nums ${side === 'bottom' ? 'max-md:hidden' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'dive' ? 0 : 1 }}
                transition={{ delay: phase === 'dive' ? 0 : 0.8 }}
              >
                {side === 'top' ? `${String(count).padStart(3, '0')} %` : 'Montreal — Singapore'}
              </motion.span>
            </motion.div>
          ))}
          {/* progress hairline */}
          <motion.div
            className="absolute inset-x-0 top-[9vh] h-px origin-left bg-gold/60"
            style={{ scaleX: count / 100 }}
            animate={phase === 'dive' ? { opacity: 0 } : {}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
