import { Armchair, BedDouble, Building2, Flower2, UtensilsCrossed } from 'lucide-react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { conceptReality, hospitalityImages, venues } from '../data/portfolio'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe } from '../lib/motion'

const icons = { bed: BedDouble, dining: UtensilsCrossed, lotus: Flower2, armchair: Armchair, building: Building2 }

/**
 * Luxury hospitality & hotel projects, then "from concept to reality": every frame
 * pairs the sketch with the finished room. Frames change with a diagonal wipe that
 * echoes the red stroke dividing sketch from photograph in the portfolio, and advance
 * on their own while the section is on screen.
 */
export function ConceptReality() {
  const { t, tx } = useLang()
  const [i, setI] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, { amount: 0.4 })
  const [paused, setPaused] = useState(false)
  const item = conceptReality[i]

  useEffect(() => {
    if (!inView || paused) return
    const id = window.setTimeout(() => setI((x) => (x + 1) % conceptReality.length), 6500)
    return () => clearTimeout(id)
  }, [i, inView, paused])

  return (
    <section id="concept" className="relative overflow-hidden bg-ink py-28 md:py-40" aria-labelledby="concept-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* luxury hospitality */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold">FF&amp;E · {t('Design', 'Diseño')} · {t('Manufacturing', 'Fabricación')} · {t('Installation', 'Instalación')}</p>
            <RevealText text={t('Luxury Hospitality\n& Hotel Projects', 'Hotelería de lujo\ny proyectos hoteleros')} accent={['Hospitality', 'lujo']} className="display mt-6 text-[11vw] text-bone uppercase sm:text-[7.5vw] lg:text-[4.8vw]" />
          </div>
          <FadeIn className="lg:col-span-4 lg:col-start-9">
            <p className="font-display text-3xl leading-snug text-bone/80 italic">{t('Bespoke furniture solutions for world-class hotels and resorts.', 'Soluciones de mobiliario a medida para hoteles y resorts de clase mundial.')}</p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
          <MaskImage src={hospitalityImages[0]} alt={t('Resort villa with a reflecting pool at dusk', 'Villa de resort con piscina espejo al anochecer')} className="aspect-[16/9] md:col-span-3 md:aspect-[21/9]" sizes="100vw" />
          {hospitalityImages.slice(1).map((src, k) => (
            <MaskImage key={src} src={src} alt="" className="aspect-[4/3]" from={k === 1 ? 'bottom' : k === 0 ? 'left' : 'right'} delay={k * 0.1} sizes="(min-width: 768px) 33vw, 100vw" />
          ))}
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-px border-y border-bone/10 sm:grid-cols-3 lg:grid-cols-5">
          {venues.map((v, k) => {
            const Icon = icons[v.icon]
            return (
              <motion.li
                key={v.icon}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: easeLuxe, delay: k * 0.07 }}
                className="flex items-center gap-4 py-6 pr-4"
              >
                <Icon className="size-6 shrink-0 text-terracotta" strokeWidth={1.2} />
                <span className="font-display text-xl leading-tight text-bone/85">{tx(v.title)}</span>
              </motion.li>
            )
          })}
        </ul>

        {/* from concept to reality */}
        <div className="mt-28 grid gap-10 md:mt-40 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold">{t('Hotel projects', 'Proyectos hoteleros')}</p>
            <h2 id="concept-title" className="sr-only">
              {t('From concept to reality', 'Del concepto a la realidad')}
            </h2>
            <RevealText text={t('From concept\nto reality.', 'Del concepto\na la realidad.')} accent={['reality.', 'realidad.']} className="display mt-6 text-[13vw] text-bone uppercase sm:text-[8vw] lg:text-[5.4vw]" />
          </div>
          <FadeIn className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-bone/60">
              {t(
                'Left of the red line, the sketch or photograph-derived study; right of it, the finished space from the original Runway portfolio.',
                'A la izquierda de la línea roja, el boceto o estudio a partir de fotografía; a la derecha, el espacio terminado del portafolio original de Runway.',
              )}
            </p>
          </FadeIn>
        </div>

        <div ref={stage} className="mt-12 grid gap-8 lg:grid-cols-12" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          <ol className="-mx-5 flex gap-2 overflow-x-auto px-5 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0" aria-label={t('Projects', 'Proyectos')}>
            {conceptReality.map((c, k) => (
              <li key={c.title.en} className="shrink-0">
                <button
                  onClick={() => setI(k)}
                  aria-current={k === i || undefined}
                  className={`group relative w-full rounded-full border px-4 py-2 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-bone/10 lg:px-0 lg:py-5 ${k === i ? 'border-gold text-bone' : 'border-bone/15 text-bone/50 hover:text-bone'}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="hidden font-sans text-xs text-gold/80 lg:inline">{String(k + 1).padStart(2, '0')}</span>
                    <span className="font-display text-base whitespace-nowrap lg:text-2xl lg:whitespace-normal">{tx(c.title)}</span>
                  </span>
                  <span className="mt-1 hidden pl-9 text-xs tracking-[0.18em] text-mineral/60 uppercase lg:block">{tx(c.kind)}</span>
                  {k === i && (
                    <motion.span layoutId="cr-bar" className="absolute bottom-0 left-0 hidden h-px w-full origin-left bg-gold lg:block">
                      {inView && !paused && <motion.span key={i} className="block h-full origin-left bg-terracotta" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: 'linear' }} />}
                    </motion.span>
                  )}
                </button>
              </li>
            ))}
          </ol>

          <div className="lg:col-span-8">
            <div className="relative aspect-[1800/820] overflow-hidden bg-smoke">
              <AnimatePresence initial={false}>
                <motion.img
                  key={item.image}
                  src={item.image}
                  srcSet={`${thumb(item.image)} 960w, ${item.image} 1800w`}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  alt={`${tx(item.title)} — ${t('sketch and finished space', 'boceto y espacio terminado')}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ clipPath: 'polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)' }}
                  animate={{ clipPath: 'polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)' }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: easeCine }}
                />
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease: easeLuxe }} className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-3xl text-bone md:text-4xl">{tx(item.title)}</p>
                  <p className="eyebrow mt-2 text-mineral/60">{tx(item.kind)}</p>
                </div>
                <p className="max-w-sm font-display text-xl text-bone/70 italic">{tx(item.text)}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex text-[0.6rem] font-semibold tracking-[0.24em] uppercase">
              <span className="flex-1 border-t border-bone/20 pt-3 text-bone/50">{t('Sketch / study', 'Boceto / estudio')}</span>
              <span className="flex-1 border-t border-terracotta pt-3 text-right text-terracotta">{t('Reality / Runway portfolio', 'Realidad / portafolio Runway')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
