import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { textures } from '../data/site'
import { easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

const frames = [
  { id: 'oak', name: 'Natural Oak', tex: textures.oak, swatch: '#a3805a' },
  { id: 'walnut', name: 'American Walnut', tex: textures.walnut, swatch: '#4a3322' },
  { id: 'bronze', name: 'Brushed Bronze', tex: textures.bronze, swatch: '#8d6748' },
] as const

const fabrics = [
  { id: 'leather', name: 'Cognac Leather', tex: textures.leather, swatch: '#83492a' },
  { id: 'linen', name: 'Belgian Linen', tex: textures.linen, swatch: '#c8bda9' },
  { id: 'boucle', name: 'Wool Bouclé', tex: textures.boucle, swatch: '#e2ddd2' },
] as const

// Side elevation of the demonstration piece — the "Arc" lounge chair.
const P = {
  back: 'M 170 335 C 132 250 140 140 200 66 C 212 52 236 56 238 74 C 214 150 218 244 252 318 Z',
  seat: 'M 168 334 C 236 350 364 334 436 300 C 452 293 460 308 446 318 C 372 364 238 376 172 356 Z',
  backCushion: 'M 202 318 C 176 240 184 150 226 92 C 252 100 266 124 266 146 C 254 206 258 258 280 312 Z',
  seatCushion: 'M 214 324 C 284 322 364 310 428 288 C 446 283 452 300 436 309 C 372 336 290 348 222 346 C 204 344 202 326 214 324 Z',
  arm: 'M 252 228 C 304 218 364 226 404 240 C 416 244 413 259 401 258 C 362 249 304 246 260 252 Z',
  armPost: 'M 372 252 L 382 252 L 392 312 L 380 314 Z',
  stem: 'M 296 360 L 310 360 L 312 404 L 294 404 Z',
  legs: 'M 303 400 L 176 444 M 303 400 L 432 444 M 303 400 L 300 456',
}

export function Bespoke() {
  const [frame, setFrame] = useState<(typeof frames)[number]>(frames[1])
  const [fabric, setFabric] = useState<(typeof fabrics)[number]>(fabrics[0])
  const [view, setView] = useState<'drawing' | 'finished'>('drawing')
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, margin: '0px 0px -25% 0px' })
  const touched = useRef(false)
  const uid = useId().replace(/:/g, '')

  // The piece first appears as a technical drawing, then "becomes" the finished object.
  useEffect(() => {
    if (!inView || touched.current) return
    const t = setTimeout(() => !touched.current && setView('finished'), 2600)
    return () => clearTimeout(t)
  }, [inView])

  const choose = <T,>(set: (v: T) => void) => (v: T) => {
    touched.current = true
    set(v)
    setView('finished')
  }

  return (
    <section id="bespoke" className="relative overflow-hidden bg-ink py-28 md:py-40" aria-labelledby="bespoke-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="05" label="Bespoke Furniture" />
            <RevealText
              text={'Crafted with\nintention.\nDesigned\nto last.'}
              accent={['intention.']}
              className="display mt-10 text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[5.4vw]"
            />
            <FadeIn>
              <p className="mt-10 max-w-md leading-relaxed text-bone/65">
                Every bespoke commission is a meeting of art, engineering and precision — from a first line on paper to technical drawings,
                prototypes and the final hand-finished piece.
              </p>
            </FadeIn>
            <ol className="mt-12 divide-y divide-bone/10 border-y border-bone/10">
              {[
                ['Sketch', 'A single gesture defines proportion and character.'],
                ['Engineering', 'Technical drawings, structure and ergonomics resolved.'],
                ['Materials', 'Timber, stone, metal and textile selected for the setting.'],
                ['Craft', 'Built, upholstered and finished by hand.'],
              ].map(([t, d], i) => (
                <FadeIn key={t} delay={i * 0.06}>
                  <li className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                    <span className="font-display text-xl text-gold italic">0{i + 1}</span>
                    <span>
                      <span className="block font-display text-2xl text-bone">{t}</span>
                      <span className="mt-1 block text-sm text-bone/55">{d}</span>
                    </span>
                  </li>
                </FadeIn>
              ))}
            </ol>
          </div>

          {/* Configurator */}
          <div className="lg:col-span-7">
            <div ref={stageRef} className="relative overflow-hidden border border-bone/10 bg-graphite">
              <div className="grid-lines absolute inset-0" aria-hidden />
              <div className="relative flex items-center justify-between px-5 pt-5 md:px-7 md:pt-7">
                <p className="eyebrow text-mineral/60">Demonstration piece — Arc Lounge Chair</p>
                <div role="group" aria-label="View" className="flex rounded-full border border-bone/15 p-1">
                  {(['drawing', 'finished'] as const).map((v) => (
                    <button
                      key={v}
                      aria-pressed={view === v}
                      onClick={() => {
                        touched.current = true
                        setView(v)
                      }}
                      className={`rounded-full px-4 py-1.5 text-[0.625rem] font-semibold tracking-[0.2em] uppercase transition-colors ${
                        view === v ? 'bg-bone text-ink' : 'text-bone/60 hover:text-bone'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <svg
                viewBox="100 30 420 450"
                className="relative mx-auto aspect-[42/45] w-full max-w-[640px]"
                role="img"
                aria-label={`Arc lounge chair in ${frame.name} with ${fabric.name} upholstery, shown as a ${view === 'drawing' ? 'technical drawing' : 'finished piece'}`}
              >
                <defs>
                  <pattern id={`f-${uid}`} patternUnits="userSpaceOnUse" width="300" height="300">
                    <image href={frame.tex} width="300" height="300" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                  <pattern id={`u-${uid}`} patternUnits="userSpaceOnUse" width="180" height="180">
                    <image href={fabric.tex} width="180" height="180" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                  <pattern id={`m-${uid}`} patternUnits="userSpaceOnUse" width="200" height="200">
                    <image href={textures.bronze} width="200" height="200" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                  <linearGradient id={`shade-${uid}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
                    <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.55" />
                  </linearGradient>
                  <radialGradient id={`floor-${uid}`}>
                    <stop offset="0" stopColor="#000" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* finished render */}
                <motion.g animate={{ opacity: view === 'finished' ? 1 : 0 }} transition={{ duration: 1.2, ease: easeLuxe }}>
                  <ellipse cx="305" cy="452" rx="170" ry="16" fill={`url(#floor-${uid})`} />
                  <path d={P.legs} stroke={`url(#m-${uid})`} strokeWidth="12" strokeLinecap="round" fill="none" />
                  <path d={P.legs} stroke="#000" strokeOpacity="0.35" strokeWidth="12" strokeLinecap="round" fill="none" transform="translate(0 3)" />
                  <path d={P.stem} fill={`url(#m-${uid})`} />
                  {[P.back, P.seat].map((d) => (
                    <g key={d}>
                      <path d={d} fill={`url(#f-${uid})`} />
                      <path d={d} fill={`url(#shade-${uid})`} />
                    </g>
                  ))}
                  <path d={P.armPost} fill={`url(#f-${uid})`} />
                  {[P.backCushion, P.seatCushion].map((d) => (
                    <g key={d}>
                      <path d={d} fill={`url(#u-${uid})`} />
                      <path d={d} fill={`url(#shade-${uid})`} />
                      <path d={d} fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1.2" />
                    </g>
                  ))}
                  <path d={P.arm} fill={`url(#f-${uid})`} />
                  <path d={P.arm} fill={`url(#shade-${uid})`} />
                </motion.g>

                {/* technical drawing */}
                <motion.g
                  fill="none"
                  stroke="#d2c4ae"
                  strokeWidth="1"
                  animate={{ opacity: view === 'drawing' ? 1 : 0.12 }}
                  transition={{ duration: 1, ease: easeLuxe }}
                >
                  {Object.values(P).map((d, i) => (
                    <motion.path
                      key={d}
                      d={d}
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ duration: 1.8, ease: easeLuxe, delay: 0.2 + i * 0.12 }}
                    />
                  ))}
                  <g strokeOpacity="0.5" strokeDasharray="3 4">
                    <path d="M 120 456 L 500 456" />
                    <path d="M 303 40 L 303 470" />
                  </g>
                  <g strokeOpacity="0.7" fontFamily="Manrope Variable, sans-serif" fontSize="10" fill="#d2c4ae" stroke="none">
                    <path d="M 480 64 L 480 456 M 474 64 L 486 64 M 474 456 L 486 456" stroke="#d2c4ae" />
                    <text x="490" y="264" transform="rotate(90 490 264)" letterSpacing="2">H 840</text>
                    <path d="M 166 470 L 446 470" stroke="#d2c4ae" />
                    <text x="290" y="466" letterSpacing="2">W 860</text>
                    <text x="122" y="356" letterSpacing="2">SH 380</text>
                    <circle cx="303" cy="400" r="5" stroke="#d2c4ae" fill="none" />
                  </g>
                </motion.g>
              </svg>

              <div className="relative grid gap-6 border-t border-bone/10 p-5 sm:grid-cols-2 md:p-7">
                <SwatchGroup label="Frame" options={frames} value={frame} onChange={choose(setFrame)} />
                <SwatchGroup label="Upholstery" options={fabrics} value={fabric} onChange={choose(setFabric)} />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={frame.id + fabric.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-display text-2xl text-bone"
                  aria-live="polite"
                >
                  {frame.name} <span className="text-gold italic">&</span> {fabric.name}
                </motion.p>
              </AnimatePresence>
              <Button href="#contact" onClick={() => scrollToTarget('#contact')}>
                Discuss a bespoke project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type Opt = { id: string; name: string; swatch: string; tex: string }

function SwatchGroup<T extends Opt>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="eyebrow text-mineral/60">
        {label} — <span className="text-bone">{value.name}</span>
      </legend>
      <div className="mt-4 flex gap-3">
        {options.map((o) => (
          <label key={o.id} className="group relative cursor-pointer" title={o.name}>
            <input
              type="radio"
              name={label}
              value={o.id}
              checked={value.id === o.id}
              onChange={() => onChange(o)}
              className="peer sr-only"
            />
            <span
              className="block size-12 rounded-full border border-bone/20 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 peer-checked:ring-1 peer-checked:ring-gold peer-checked:ring-offset-4 peer-checked:ring-offset-graphite peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-8 peer-focus-visible:outline-gold"
              style={{ backgroundImage: `url(${o.tex})`, backgroundColor: o.swatch }}
            />
            <span className="sr-only">{o.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
