import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { WaterCanvas } from '../components/WaterCanvas'
import { brand, heroVideo } from '../data/site'
import { easeCine, easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function Hero({ ready, revealed, reduced }: { ready: boolean; revealed: boolean; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink" aria-label="Introduction">
      {/* Film — revealed through an expanding architectural aperture */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.35, filter: 'brightness(0.4)' }}
        animate={revealed || ready ? { scale: 1, filter: 'brightness(1)' } : {}}
        transition={{ duration: 3.2, ease: easeCine }}
      >
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
          {heroVideo ? (
            <video className="h-full w-full object-cover" src={heroVideo.src} poster={heroVideo.poster} autoPlay muted loop playsInline />
          ) : (
            <WaterCanvas still={reduced} className="absolute inset-0" />
          )}

          {/* Structural glass floor — steel mullions in perspective, like standing above the sea */}
          <div className="pointer-events-none absolute inset-0 [perspective:900px]" aria-hidden>
            <motion.div style={reduced ? undefined : { y: gridY }} className="absolute inset-0 [transform-style:preserve-3d]">
            <div className="absolute -inset-x-full top-[-260%] bottom-[-50%] origin-bottom [transform:rotateX(58deg)]">
              <div
                className="h-full w-full opacity-70"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(8,10,11,.7) 0 6px, transparent 6px), linear-gradient(to bottom, rgba(8,10,11,.7) 0 6px, transparent 7px)',
                  backgroundSize: '12.5% 300px',
                  backgroundPosition: 'center bottom',
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,236,205,.07)_45%,transparent_60%)]" />
            </div>
            </motion.div>
          </div>
        </motion.div>

        {/* grading + legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
        <div className="absolute inset-0 overflow-hidden mix-blend-overlay">
          <div className="grain" />
        </div>
      </motion.div>

      {/* Technical drawing overlay that draws itself in */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-bone/20" aria-hidden preserveAspectRatio="none" viewBox="0 0 100 100">
        {[
          'M 8 0 L 8 100',
          'M 92 0 L 92 100',
          'M 0 18 L 100 18',
          'M 62 18 L 62 100',
          'M 62 70 C 72 70 80 62 80 52',
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.08"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={ready ? { pathLength: 1 } : {}}
            transition={{ duration: 2.2, ease: easeLuxe, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </svg>

      <CursorLight disabled={reduced} />
      <Seal show={ready} reduced={reduced} />

      <motion.div style={reduced ? undefined : { y: contentY, opacity: fade }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 1 }}
          className="eyebrow absolute top-32 left-5 hidden flex-col gap-2 text-mineral/70 md:left-10 md:flex"
        >
          <span>{brand.pillars.join('  ·  ')}</span>
          <Timecode show={ready} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="eyebrow absolute top-32 right-5 hidden text-right text-mineral/70 md:right-10 md:block"
        >
          <WorldClocks />
        </motion.div>

        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {ready && (
              <RevealText
                as="h1"
                immediate
                delay={0.15}
                stagger={0.08}
                text={'Creating\nExtraordinary\nSpaces Worldwide'}
                accent={['Extraordinary']}
                className="display text-[15vw] text-bone uppercase sm:text-[11vw] lg:text-[7.4vw]"
              />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: easeLuxe, delay: 0.75 }}
            className="lg:col-span-4 lg:pb-4"
          >
            <p className="max-w-sm text-base leading-relaxed text-bone/75 md:text-lg">
              Bespoke furniture and considered interiors for exceptional hospitality and residential destinations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="#projects"
                onClick={() => {
                  scrollToTarget('#projects')
                }}
              >
                Explore our work
              </Button>
              <Button href="#philosophy" variant="ghost" onClick={() => scrollToTarget('#philosophy')}>
                Discover Runway
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-10 flex items-center justify-start border-t border-bone/15 pt-5 md:justify-between"
        >
          <span className="eyebrow text-mineral/60">Scroll to explore</span>
          <span className="relative block h-10 w-px overflow-hidden bg-bone/15 max-md:order-first max-md:mr-4" aria-hidden>
            <span className="absolute inset-0 bg-gold [animation:scroll-cue_2.4s_var(--ease-luxe)_infinite]" />
          </span>
          <span className="eyebrow hidden text-mineral/60 md:inline">{brand.regions.join(' · ')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

const zones = [
  { city: 'Montreal', tz: 'America/Toronto' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
]

/** Live local time in both studios — the brand's global reach, ticking. */
function WorldClocks() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="flex flex-col items-end gap-2">
      {zones.map((z) => (
        <span key={z.city} className="flex items-center gap-3">
          <span>{z.city}</span>
          <span className="h-px w-6 bg-gold/50" />
          <span className="font-display text-sm tracking-normal text-bone tabular-nums">
            {now.toLocaleTimeString('en-GB', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </span>
      ))}
    </span>
  )
}

/** Film-slate timecode running at 24 fps. */
function Timecode({ show }: { show: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = (now: number) => {
      const f = Math.floor(((now - start) / 1000) * 24)
      const s = Math.floor(f / 24)
      if (ref.current) ref.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : {}}
      transition={{ delay: 1.2, duration: 1 }}
      className="mt-2 flex items-center gap-3 text-[0.6rem] text-mineral/60"
      aria-hidden
    >
      <span className="size-1.5 animate-pulse rounded-full bg-terracotta" />
      <span>Scene 01 — The sea beneath the glass</span>
      <span ref={ref} className="tabular-nums text-bone/70">00:00:00:00</span>
    </motion.div>
  )
}

/** Rotating gilded seal — a quiet signature mark in the composition. */
function Seal({ show, reduced }: { show: boolean; reduced: boolean }) {
  const text = 'Since 2009 · Hospitality · Residential · Bespoke · '
  return (
    <motion.button
      onClick={() => scrollToTarget('#philosophy')}
      initial={{ opacity: 0, scale: 0.8, rotate: -40 }}
      animate={show ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ duration: 1.6, ease: easeLuxe, delay: 1 }}
      className="group absolute top-[26%] right-5 z-20 hidden size-32 md:right-10 md:block lg:top-[24%] lg:size-36"
      aria-label="Discover Runway"
    >
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full text-bone/70 ${reduced ? '' : 'animate-[spin_24s_linear_infinite]'}`}>
        <defs>
          <path id="seal-circle" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="13" fill="currentColor" fontFamily="Manrope Variable, sans-serif" style={{ textTransform: 'uppercase' }}>
          <textPath href="#seal-circle" textLength="486" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[26%] grid place-items-center rounded-full border border-gold/40 bg-ink/30 backdrop-blur-sm transition-colors duration-500 group-hover:bg-gold/90">
        <span className="font-display text-4xl text-gold transition-colors duration-500 group-hover:text-ink">R</span>
      </span>
    </motion.button>
  )
}

/** Soft warm light that follows the pointer across the water, like a sunbeam through glass. */
function CursorLight({ disabled }: { disabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (disabled || !window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current!
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }
    const loop = () => {
      cx += (x - cx) * 0.08
      cy += (y - cy) * 0.08
      el.style.background = `radial-gradient(520px circle at ${cx}px ${cy}px, rgba(255, 226, 180, 0.13), transparent 60%)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
    }
  }, [disabled])
  return <div ref={ref} className="pointer-events-none absolute inset-0 z-[5] mix-blend-screen" aria-hidden />
}
