import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { brand, textures } from '../data/site'
import { BRAND_SERIF, BrandMark } from './BrandMark'
import { easeCine, easeLuxe } from '../lib/motion'


/**
 * Opening title sequence, directed like a film's main titles:
 *  1. Letterboxed black frame, film grain, a gold hairline frame draws itself.
 *  2. The gilded "R" monogram resolves from soft focus; a specular highlight travels across the metal.
 *  3. The wordmark tightens into place letter by letter; opening credits fade through.
 *  4. The camera dives through the counter of the R into the hero scene while the bars retract.
 * Skippable (click / key), and reduced to a simple fade for prefers-reduced-motion.
 */
export function Preloader({ onDone, onReveal, reduced }: { onDone: () => void; onReveal?: () => void; reduced: boolean }) {
  const [phase, setPhase] = useState<'title' | 'dive' | 'done'>('title')
  const [count, setCount] = useState(0)
  const [credit, setCredit] = useState(-1)
  const finished = useRef(false)
  const diving = useRef(false)
  const dive = useAnimationControls()

  const credits = [`Est. ${brand.since}`, `${brand.offices.map((o) => o.city).join('  ·  ')}  ·  Worldwide`, 'Creating extraordinary spaces']

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
      const p = Math.min(1, (now - start) / 5200)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const timers = [
      setTimeout(() => setCredit(0), 3300),
      setTimeout(() => setCredit(1), 4100),
      setTimeout(() => setCredit(2), 4900),
      setTimeout(startDive, 5800),
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
              <radialGradient id="atelier-ground" cx="0.62" cy="0.45" r="0.85">
                <stop offset="0" stopColor="#3a2a1c" />
                <stop offset="0.45" stopColor="#1f1711" />
                <stop offset="1" stopColor="#0c0907" />
              </radialGradient>
              <radialGradient id="atelier-glow" cx="0.78" cy="0.28" r="0.5">
                <stop offset="0" stopColor="#d9a866" stopOpacity="0.28" />
                <stop offset="1" stopColor="#d9a866" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="blind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.16" />
                <stop offset="0.6" stopColor="#ffd9a0" stopOpacity="0.05" />
                <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="atelier-vignette" cx="0.5" cy="0.5" r="0.75">
                <stop offset="0.55" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.65" />
              </radialGradient>
              <mask id="intro-aperture" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
                <rect width="1600" height="900" fill="white" />
                <motion.text
                  x="800"
                  y="560"
                  textAnchor="middle"
                  fontFamily={BRAND_SERIF}
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
            <motion.g
              mask="url(#intro-aperture)"
              animate={dive}
              variants={{ dive: { opacity: [1, 1, 0], transition: { duration: 2.1, times: [0, 0.75, 1] } } }}
            >
              {/* warm atelier ground: espresso → bronze glow, with a whisper of travertine */}
              <rect width="1600" height="900" fill="url(#atelier-ground)" />
              <image href={textures.travertine} width="1600" height="900" preserveAspectRatio="xMidYMid slice" opacity="0.07" style={{ mixBlendMode: 'soft-light' }} />
              <rect width="1600" height="900" fill="url(#atelier-glow)" />

              {/* golden-hour light falling through blinds, drifting slowly */}
              <motion.g
                initial={{ x: -260, opacity: 0 }}
                animate={{ x: 120, opacity: 1 }}
                transition={{ duration: 7, ease: 'easeOut' }}
                style={{ mixBlendMode: 'screen' }}
              >
                {Array.from({ length: 7 }).map((_, i) => (
                  <rect key={i} x={760 + i * 92} y="-200" width="46" height="1400" fill="url(#blind)" transform="skewX(-28)" opacity={0.55 - i * 0.05} />
                ))}
              </motion.g>

              {/* architectural drawing drawing itself — arches, floor grid, a lounge chair in elevation */}
              <g fill="none" stroke="#c9a66b" strokeWidth="0.8" strokeOpacity="0.32">
                {[
                  'M 160 900 L 160 360 A 150 150 0 0 1 460 360 L 460 900',
                  'M 200 900 L 200 370 A 110 110 0 0 1 420 370 L 420 900',
                  'M 1140 900 L 1140 330 A 170 170 0 0 1 1480 330 L 1480 900',
                  'M 0 760 L 1600 760',
                  'M 800 470 L 0 900 M 800 470 L 300 900 M 800 470 L 620 900 M 800 470 L 980 900 M 800 470 L 1300 900 M 800 470 L 1600 900',
                  'M 0 820 L 1600 820 M 0 880 L 1600 880',
                  'M 1210 700 C 1190 640 1196 560 1236 510 C 1244 502 1258 504 1258 516 C 1242 580 1244 640 1266 690 Z M 1206 702 C 1260 712 1340 702 1392 680 C 1404 676 1408 686 1398 692 C 1344 722 1260 730 1210 718 Z M 1300 724 L 1300 752 M 1300 752 L 1230 772 M 1300 752 L 1370 772',
                  'M 1100 140 L 1100 300 M 1094 140 L 1106 140 M 1094 300 L 1106 300',
                  'M 120 120 L 520 120 M 120 114 L 120 126 M 520 114 L 520 126',
                ].map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3.2, ease: easeLuxe, delay: 0.3 + i * 0.22 }}
                  />
                ))}
                <motion.circle cx="1100" cy="220" r="60" strokeDasharray="4 6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 2 }} />
              </g>
              <g fill="#c9a66b" fillOpacity="0.45" fontFamily="Manrope Variable, sans-serif" fontSize="11" letterSpacing="3">
                <motion.text x="120" y="104" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1.5 }}>ELEVATION A — LOBBY ARCADE</motion.text>
                <motion.text x="1120" y="226" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1.5 }}>Ø 1200</motion.text>
                <motion.text x="1212" y="800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1.5 }}>ARC LOUNGE CHAIR — 1:20</motion.text>
              </g>
              <rect width="1600" height="900" fill="url(#atelier-vignette)" />
            </motion.g>
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
            <svg className="absolute h-[78vmin] w-[78vmin] text-gold/50" viewBox="0 0 100 100" aria-hidden>
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

            {/* Brand lockup — hairline-drawn R floods with polished gold, then the wordmark settles */}
            <BrandMark animate delay={0.5} pillars className="relative text-[clamp(78px,13vmin,128px)]" />

            {/* opening credits */}
            <div className="absolute bottom-[14vh] h-7 overflow-hidden text-center">
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
                className="eyebrow text-[0.6rem] text-bone/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'dive' ? 0 : 1 }}
                transition={{ delay: phase === 'dive' ? 0 : 0.8 }}
              >
                {side === 'top' ? 'Runway Furniture International' : <><span className="md:hidden">Tap to enter</span><span className="hidden md:inline">Click or press any key to enter</span></>}
              </motion.span>
              <motion.span
                className={`eyebrow text-[0.6rem] text-bone/40 tabular-nums ${side === 'bottom' ? 'max-md:hidden' : ''}`}
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
