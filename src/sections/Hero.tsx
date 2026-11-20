import { animate, motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { HeroBackdrop, useWide } from '../components/HeroFilm'
import { WaterCanvas } from '../components/WaterCanvas'
import { brand, heroVideo, projects } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe, useCalmScroll } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function Hero({ ready: readyIn, revealed, reduced }: { ready: boolean; revealed: boolean; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null)
  // the opening: the film first shows only through the letters of RUNWAY, then the camera flies
  // through them into the full picture; the words of the hero arrive once it has opened
  const { opened, maskScale, maskOpacity } = useLettersOpening(revealed || readyIn, reduced || !heroVideo)
  const vw = useViewportWidth()
  // computers: the words wait until the film has glided into its panel, so it never passes over them
  const [settled, setSettled] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const calm = useCalmScroll()
  // computers and tablets lying down: the film has its own full-height panel on the right, the words the left
  const wide = useWide() && !!heroVideo
  const ready = readyIn && opened && (!wide || settled)
  // skipped opening (reload, reduced motion): the panel is already in place
  const [glided] = useState(() => !opened)
  useEffect(() => {
    if (!opened || !wide || settled) return
    const id = window.setTimeout(() => setSettled(true), glided ? 1150 : 0)
    return () => window.clearTimeout(id)
  }, [opened, wide, settled, glided])
  const { lang, t, tx } = useLang()
  // wide screens see a fixed slice of the vertical film (the camera already moves inside the film;
  // moving the frame as well, with the cursor or the scroll, made the picture look shaky)

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden bg-ink" aria-label={t('Introduction', 'Introducción')}>
      <motion.div
        className={`absolute inset-y-0 right-0 overflow-hidden ${wide && opened ? 'border-l border-bone/10' : ''}`}
        initial={false}
        animate={{ width: wide && opened ? Math.min(vw * 0.42, 832) : vw }}
        transition={{ duration: 1.2, ease: easeCine }}
      >
      {/* Film — revealed through an expanding architectural aperture */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.35 }}
        animate={revealed || ready ? { scale: 1 } : {}}
        transition={{ duration: 3.2, ease: easeCine }}
      >
        <motion.div className="absolute inset-0" style={calm ? undefined : { scale }}>
          {heroVideo ? (
            <HeroBackdrop active={revealed || ready} />
          ) : (
            <WaterCanvas still={reduced} paused={!revealed} className="absolute inset-0" />
          )}

          {/* Structural glass floor — steel mullions in perspective, like standing above the sea */}
          {!heroVideo && <div className="pointer-events-none absolute inset-0 [perspective:900px]" aria-hidden>
            <motion.div style={calm ? undefined : { y: gridY }} className="absolute inset-0 [transform-style:preserve-3d]">
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
          </div>}
        </motion.div>

        {/* grading + legibility */}
        {!heroVideo && <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/80" />}
        {/* full-screen film on phones: a deeper ground under the title, text and buttons */}
        {wide && (
          <>
            {/* the panel: shade only at the top (menu, clocks) and a breath at the foot */}
            <div className="absolute inset-x-0 top-0 h-[15rem] bg-[linear-gradient(to_bottom,rgb(10_10_10/0.88)_0%,rgb(10_10_10/0.6)_45%,transparent_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[9rem] bg-[linear-gradient(to_top,rgb(10_10_10/0.7)_0%,transparent_100%)]" />
            {/* the clocks sit over bright sand: a deeper pool of shade behind them */}
            <div className="absolute top-0 right-0 h-[16rem] w-[min(30rem,100%)] bg-[radial-gradient(ellipse_100%_100%_at_100%_0,rgb(10_10_10/0.92)_55%,transparent_100%)]" />
          </>
        )}
        {heroVideo && !wide && (
          <>
            {/* the film stays bright and alive: shade only under the menu and the clocks, and behind the words */}
            <div className="absolute inset-x-0 top-0 h-[10rem] bg-[linear-gradient(to_bottom,rgb(10_10_10/0.82)_0%,rgb(10_10_10/0.5)_50%,transparent_100%)]" />
            <div className="absolute top-0 right-0 h-[16rem] w-[min(30rem,70vw)] bg-[radial-gradient(ellipse_100%_100%_at_100%_0,rgb(10_10_10/0.75)_40%,transparent_100%)] max-md:hidden" />
            {/* phones: the title stands over the bright sand, so the shade climbs higher there */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_10/0.92)_0%,rgb(10_10_10/0.8)_32%,rgb(10_10_10/0.62)_55%,rgb(10_10_10/0.3)_72%,transparent_86%)] md:hidden" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(to_top,rgb(10_10_10/0.92)_0%,rgb(10_10_10/0.8)_28%,rgb(10_10_10/0.58)_52%,transparent_76%)] md:block" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(10_10_10/0.7)_0%,rgb(10_10_10/0.3)_45%,transparent_70%)] max-md:hidden" />
          </>
        )}
        {!heroVideo && <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />}
        {/* plain blending: an overlay blend over the moving water was recomposited every frame */}
        <div className="absolute inset-0 overflow-hidden opacity-60">
          <div className="grain" />
        </div>
        {/* the letters window: black everywhere but the letters, which show the film (a multiply blend:
            white letters keep the picture, black hides it); it zooms through the W and fades away */}
        {!opened && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[5] grid place-items-center overflow-hidden bg-ink mix-blend-multiply" style={{ opacity: maskOpacity }}>
            <motion.span
              className="font-display leading-none tracking-[-0.01em] text-white select-none"
              style={{ scale: maskScale, transformOrigin: '55.5% 52%', fontSize: 'min(21vw, 40svh)' }}
            >
              RUNWAY
            </motion.span>
          </motion.div>
        )}
        {!opened && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[6] grid place-items-center overflow-hidden" style={{ opacity: maskOpacity }}>
            {/* a hairline of light around the letters, so they read even where the film is dark */}
            <motion.span
              className="font-display leading-none tracking-[-0.01em] text-transparent select-none [-webkit-text-stroke:1px_rgb(242_240_234/0.45)]"
              style={{ scale: maskScale, transformOrigin: '55.5% 52%', fontSize: 'min(21vw, 40svh)' }}
            >
              RUNWAY
            </motion.span>
          </motion.div>
        )}
        {/* the film rises out of the dark (a fading veil: a live brightness filter repainted every frame) */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-ink"
          // with the film, the letters already open it out of the dark: a lighter veil keeps them bright
          initial={{ opacity: heroVideo ? 0.25 : 0.6 }}
          animate={revealed || ready ? { opacity: 0 } : {}}
          transition={{ duration: 3.2, ease: easeCine }}
        />
      </motion.div>

      </motion.div>

      {/* Technical drawing overlay that draws itself in */}
      {/* (wide screens with the film: only over the words' side, fainter, so the dark side has texture) */}
      <svg
        className={`pointer-events-none absolute inset-y-0 left-0 h-full ${wide ? 'w-[calc(100%-min(42vw,52rem))] text-bone/[0.14]' : 'w-full text-bone/20'} ${heroVideo && !wide ? 'hidden' : ''}`}
        aria-hidden
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {/* wide screens: only the two lines that frame the words without crossing them */}
        {(wide
          ? ['M 0 18 L 100 18', 'M 96 0 L 96 100']
          : ['M 8 0 L 8 100', 'M 92 0 L 92 100', 'M 0 18 L 100 18', 'M 62 18 L 62 100', 'M 62 70 C 72 70 80 62 80 52']
        ).map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={wide ? 0.1 : 0.08}
            vectorEffect={wide ? undefined : 'non-scaling-stroke'}
            initial={{ pathLength: 0 }}
            animate={ready ? { pathLength: 1 } : {}}
            transition={{ duration: 2.2, ease: easeLuxe, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </svg>

      <Seal show={ready} reduced={reduced} wide={wide} />

      <motion.div style={calm ? undefined : { y: contentY, opacity: fade }} className={`relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pt-28 pb-10 md:px-10 md:pt-56 md:pb-14 ${wide ? 'pr-[calc(min(42vw,52rem)+4rem)]!' : ''}`}>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 1 }}
          className="eyebrow absolute top-32 left-5 hidden flex-col gap-2 text-mineral/70 md:left-10 md:flex"
        >
          <span>{t('Luxury Hospitality  ·  Residential  ·  Bespoke Furniture', 'Hotelería de lujo  ·  Residencial  ·  Mobiliario a medida')}</span>
          <SceneLabel show={ready} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="eyebrow absolute top-32 right-5 hidden text-right text-mineral/70 md:right-10 md:block"
        >
          <WorldClocks />
        </motion.div>
        {wide && <Figures show={ready} reduced={reduced} />}
        <div className={`grid items-end gap-10 ${wide ? '' : 'lg:grid-cols-12'}`}>
          <div className={wide ? '' : 'lg:col-span-8'}>
            {ready && (
              <RevealText
                as="h1"
                immediate
                delay={0.15}
                stagger={0.08}
                text={t('Creating\nExtraordinary\nSpaces Worldwide', 'Creamos\nespacios\nextraordinarios')}
                accent={['Extraordinary', 'extraordinarios']}
                // phones: a lighter gold, so the accent still reads over the bright sand of the film
                accentClass="hero-shine italic text-gold max-md:text-[color-mix(in_srgb,var(--color-gold)_45%,var(--color-bone))]"
                // sized by both width and height, so short screens (in-app browsers, landscape) never push it under the menu
                className={`display text-bone uppercase max-md:[text-shadow:0_1px_6px_rgb(0_0_0/0.4)] sm:text-[min(11vw,9svh)] ${wide ? 'lg:text-[min(6.2vw,12svh)]' : 'lg:text-[min(7.4vw,12.5svh)]'} ${lang === 'es' ? 'text-[min(12.4vw,8.4svh)]' : 'text-[min(15vw,9.2svh)]'}`}
              />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: easeLuxe, delay: 0.75 }}
            className={wide ? 'flex flex-wrap items-end justify-between gap-x-10 gap-y-8' : 'lg:col-span-4 lg:pb-4'}
          >
            <p className="max-w-sm text-base leading-relaxed text-bone/80 md:text-lg">
              {t(
                'Bespoke furniture and considered interiors for exceptional hospitality and residential destinations.',
                'Mobiliario a medida e interiores cuidados para destinos residenciales y hoteleros excepcionales.',
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#contact" onClick={() => scrollToTarget('#contact')}>
                {t('Start your project', 'Iniciar tu proyecto')}
              </Button>
              <Button href="#projects" variant="ghost" onClick={() => scrollToTarget('#projects')}>
                {t('Explore our work', 'Ver proyectos')}
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 1 }}
          className={`mt-10 flex items-center justify-start border-t border-bone/15 pt-5 md:justify-between`}
        >
          <span className="eyebrow text-mineral/60">{t('Scroll to explore', 'Desplázate para explorar')}</span>
          <span className="relative block h-10 w-px overflow-hidden bg-bone/15 max-md:order-first max-md:mr-4" aria-hidden>
            <span className="absolute inset-0 bg-gold [animation:scroll-cue_2.4s_var(--ease-luxe)_infinite]" />
          </span>
          <span className={`eyebrow hidden text-mineral/60 ${heroVideo ? 'xl:inline' : 'md:inline'}`}>{brand.regions.map(tx).join(' · ')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

const zones = [
  { city: { en: 'Montreal', es: 'Montreal' }, tz: 'America/Toronto' },
  { city: { en: 'Singapore', es: 'Singapur' }, tz: 'Asia/Singapore' },
]

/** Live local time in both studios — the brand's global reach, ticking. */
function WorldClocks() {
  const { tx } = useLang()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="flex flex-col items-end gap-2">
      {zones.map((z) => (
        <span key={z.tz} className="flex items-center gap-3">
          <span>{tx(z.city)}</span>
          <span className="h-px w-6 bg-gold/50" />
          <span className="font-display text-sm tracking-normal text-bone tabular-nums">
            {now.toLocaleTimeString('en-GB', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </span>
      ))}
    </span>
  )
}

/** The scene label under the eyebrow, in the language of the site's film moments. */
function SceneLabel({ show }: { show: boolean }) {
  const { t } = useLang()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : {}}
      transition={{ delay: 1.2, duration: 1 }}
      className="mt-2 flex items-center gap-3 text-[0.6875rem] text-mineral/60"
      aria-hidden
    >
      <span className="size-1.5 animate-pulse rounded-full bg-terracotta" />
      <span>{t('Scene 01 — The sea beneath the glass', 'Escena 01 — El mar bajo el cristal')}</span>
    </motion.div>
  )
}

/** Rotating gilded seal — a quiet signature mark in the composition. */
function Seal({ show, reduced, wide }: { show: boolean; reduced: boolean; wide: boolean }) {
  const { t } = useLang()
  const text = t('Since 2009 · Hospitality · Residential · Bespoke · ', 'Desde 2009 · Hotelería · Residencial · A medida · ')
  return (
    <motion.button
      onClick={() => scrollToTarget('#projects')}
      initial={{ opacity: 0, scale: 0.8, rotate: -40 }}
      animate={show ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ duration: 1.6, ease: easeLuxe, delay: 1 }}
      // wide screens: the seal sits on the seam between the words and the film, on its own dark disc
      className={`group absolute top-[26%] right-5 z-20 hidden size-32 md:right-10 md:block lg:top-[24%] lg:size-36 [@media(max-height:780px)]:!hidden ${wide ? 'rounded-full bg-ink lg:right-[calc(min(42vw,52rem)-4.5rem)]!' : ''}`}
      aria-label={t('Explore our work', 'Ver proyectos')}
    >
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full text-bone/70 ${reduced ? '' : 'animate-[spin_24s_linear_infinite]'}`}>
        <defs>
          <path id="seal-circle" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="13" fill="currentColor" fontFamily="Manrope Variable, sans-serif" style={{ textTransform: 'uppercase' }}>
          <textPath href="#seal-circle" textLength="486" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[26%] grid place-items-center rounded-full border border-gold/40 bg-ink/55 transition-colors duration-500 group-hover:bg-gold/90">
        <span className="font-display text-4xl text-gold transition-colors duration-500 group-hover:text-ink">R</span>
      </span>
    </motion.button>
  )
}

/** The company in four real figures (all read from the site's own data), counting up as the site opens. */
function Figures({ show, reduced }: { show: boolean; reduced: boolean }) {
  const { t } = useLang()
  const items = [
    { n: brand.years, label: t('Years', 'Años') },
    { n: brand.offices.length, label: t('Studios', 'Estudios') },
    { n: brand.regions.length, label: t('Regions', 'Regiones') },
    { n: projects.length, label: t('Projects', 'Proyectos') },
  ]
  return (
    <motion.dl
      initial={{ opacity: 0, y: 16 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: easeLuxe, delay: 1.1 }}
      // only where the screen is tall enough to hold them above the title
      className="mb-[clamp(2rem,6svh,4.5rem)] hidden w-[min(40rem,calc(100%-3.5rem))] grid-cols-4 gap-6 border-t border-bone/12 pt-5 [@media(min-height:820px)]:grid"
    >
      {items.map((x, i) => (
        <div key={x.label} className="flex flex-col-reverse justify-end gap-3">
          <dt className="eyebrow text-[0.6875rem] whitespace-nowrap text-mineral/70">{x.label}</dt>
          <dd className="font-display text-[clamp(2rem,3.2vw,3.25rem)] leading-none text-bone tabular-nums">
            <Count to={x.n} run={show} reduced={reduced} delay={1.2 + i * 0.12} />
          </dd>
        </div>
      ))}
    </motion.dl>
  )
}

function Count({ to, run, reduced, delay }: { to: number; run: boolean; reduced: boolean; delay: number }) {
  const [n, setN] = useState(reduced ? to : 0)
  useEffect(() => {
    if (!run || reduced) return void (reduced && setN(to))
    const c = animate(0, to, { duration: 1.8, delay, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [run, reduced, to, delay])
  return <>{String(n).padStart(2, '0')}</>
}

/** The opening through the letters: holds a moment, then flies through. Any scroll, touch or key hurries it. */
function useLettersOpening(start: boolean, skip: boolean) {
  const [opened, setOpened] = useState(skip)
  const z = useMotionValue(0)
  const maskScale = useTransform(z, (v) => 1 + Math.pow(v, 2.4) * 40)
  const maskOpacity = useTransform(z, [0.62, 0.9], [1, 0])
  useEffect(() => {
    if (skip) setOpened(true)
  }, [skip])
  useEffect(() => {
    if (opened || !start) return
    let run: { stop: () => void } | undefined
    const finish = () => setOpened(true)
    const hold = window.setTimeout(() => {
      run = animate(z, 1, { duration: 1.7, ease: [0.64, 0, 0.78, 0], onComplete: finish })
    }, 900)
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    const off = () => events.forEach((e) => window.removeEventListener(e, hurry))
    const hurry = () => {
      off()
      window.clearTimeout(hold)
      run?.stop()
      run = animate(z, 1, { duration: 0.45, ease: 'easeIn', onComplete: finish })
    }
    events.forEach((e) => window.addEventListener(e, hurry, { passive: true }))
    return () => {
      window.clearTimeout(hold)
      run?.stop()
      off()
    }
  }, [start, opened, z])
  return { opened, maskScale, maskOpacity }
}

function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth))
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}
