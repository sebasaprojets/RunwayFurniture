import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, useState } from 'react'
import { Button } from '../components/Button'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { kitchens } from '../data/signature'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { requestQuote } from './NewCollection'

/** Ardente: the red studio shot opens from a framed window to full bleed as you scroll. */
function ArdenteScene() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const clip = useTransform(p, [0, 0.6], ['inset(18% 22% 18% 22%)', 'inset(0% 0% 0% 0%)'])
  const scale = useTransform(p, [0, 0.6], [1.12, 1])
  const titleY = useTransform(p, [0.25, 0.7], ['40%', '0%'])
  const titleO = useTransform(p, [0.3, 0.65], [0, 1])
  const introO = useTransform(p, [0, 0.25], [1, 0])

  return (
    <div ref={ref} className="relative h-[230svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.img
            style={{ scale }}
            src={kitchens.ardente.red}
            alt={t('Ardente fire kitchen on a red backdrop', 'Cocina de fuego Ardente sobre fondo rojo')}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        </motion.div>
        <motion.p style={{ opacity: introO }} className="eyebrow absolute top-[10svh] left-1/2 -translate-x-1/2 text-center whitespace-nowrap text-gold">
          — {t('Outdoor kitchens', 'Cocinas al aire libre')}
        </motion.p>
        <motion.div style={{ y: titleY, opacity: titleO }} className="absolute inset-x-5 bottom-[9svh] md:inset-x-10">
          <p className="eyebrow text-bone/80">{t('Fire kitchen collection', 'Colección de cocinas de fuego')}</p>
          <p className="display mt-4 text-[22vw] leading-[0.8] text-bone uppercase md:text-[13vw]">Ardente</p>
          <p className="mt-6 max-w-lg font-display text-2xl text-bone/90 italic md:text-3xl">
            {t('Where there is fire, there is flavour.', 'Donde hay fuego, hay sabor.')}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

const steps = [
  {
    k: 'table',
    title: { en: 'A dining table.', es: 'Una mesa de comedor.' },
    text: { en: 'Clean and understated — Tavolo means “table” in Italian. But it is far more than a table.', es: 'Limpia y sobria: Tavolo significa “mesa” en italiano. Pero es mucho más que una mesa.' },
  },
  {
    k: 'host',
    title: { en: 'Open the hidden unit.', es: 'Abre el módulo oculto.' },
    text: { en: 'A built-in cooler box keeps the drinks cold, right where everyone sits.', es: 'Un cooler integrado mantiene las bebidas frías, justo donde todos se sientan.' },
  },
  {
    k: 'cook',
    title: { en: 'And cook at the table.', es: 'Y cocina en la mesa.' },
    text: { en: 'A gas burner hides in the top — dining, cooking and gathering in one piece, closer to nature.', es: 'Un quemador a gas se oculta en la cubierta: comer, cocinar y reunirse en una sola pieza, más cerca de la naturaleza.' },
  },
] as const

function Layer({ src, alt, p, range, first, last }: { src: string; alt: string; p: MotionValue<number>; range: [number, number, number, number]; first?: boolean; last?: boolean }) {
  const opacity = useTransform(p, range, [first ? 1 : 0, 1, 1, last ? 1 : 0])
  const scale = useTransform(p, [range[0], range[3]], [1.06, 1])
  return <motion.img style={{ opacity, scale }} src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
}

/** Tavolo: three photographs and three lines of copy, swapped by scroll position. */
function TavoloScene() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(0)
  useMotionValueEvent(p, 'change', (v) => setStep(v < 0.36 ? 0 : v < 0.7 ? 1 : 2))
  const bar = useTransform(p, [0, 1], ['0%', '100%'])
  const tv = kitchens.tavolo

  return (
    <div ref={ref} className="relative h-[300svh] bg-white text-ink">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10">
        <div className="relative h-[52svh] shrink-0 lg:col-span-7 lg:h-[78svh]">
          <Layer src={tv.closed} alt={t('Tavolo closed: a plain dining table', 'Tavolo cerrada: una mesa de comedor')} p={p} range={[0, 0.01, 0.3, 0.4]} first />
          <Layer src={tv.open} alt={t('Tavolo set for dinner with the cooler open', 'Tavolo lista para cenar con el cooler abierto')} p={p} range={[0.3, 0.4, 0.64, 0.74]} />
          <Layer src={tv.top} alt={t('Tavolo from above, cooking on the built-in burner', 'Tavolo desde arriba, cocinando en el quemador integrado')} p={p} range={[0.64, 0.74, 0.99, 1]} last />
        </div>
        <div className="flex flex-1 flex-col justify-center px-5 py-6 lg:col-span-4 lg:col-start-9 lg:px-0">
          <p className="eyebrow text-bronze">Q by Kenkoon · {t('Multifunction outdoor table', 'Mesa exterior multifunción')}</p>
          <p className="display mt-3 text-6xl uppercase md:text-7xl">Tavolo</p>
          <div className="relative mt-6 min-h-[9.5rem] md:min-h-[8rem]">
            {steps.map((s, i) => (
              <motion.div key={s.k} initial={false} animate={{ opacity: step === i ? 1 : 0, y: step === i ? 0 : step > i ? -14 : 14 }} transition={{ duration: 0.5 }} className="absolute inset-0" aria-hidden={step !== i}>
                <p className="font-display text-3xl italic">{tx(s.title)}</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">{tx(s.text)}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-xs tabular-nums text-ink/50">0{step + 1} / 03</span>
            <span className="relative h-px flex-1 bg-ink/15">
              <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-bronze" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Q kitchens: Ardente fire kitchens, the Tavolo table and the indoor / compact / outdoor lines. */
export function OutdoorKitchens() {
  const { t, tx } = useLang()
  const a = kitchens.ardente
  return (
    <section id="kitchens" className="relative bg-ink" aria-labelledby="kitchens-title">
      <h2 id="kitchens-title" className="sr-only">
        {t('Outdoor kitchens', 'Cocinas al aire libre')}
      </h2>
      <ArdenteScene />

      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <p className="font-display text-3xl leading-snug text-bone md:text-4xl">
              {t(
                'From Mediterranean al fresco dining to the Thai courtyard kitchen, fire is the heart of cooking.',
                'Del al fresco mediterráneo a la cocina tailandesa al aire libre, el fuego es el corazón de la cocina.',
              )}
            </p>
          </FadeIn>
          <FadeIn className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-sm leading-relaxed text-bone/60">
              {t(
                'Ardente brings durable materials and complete cooking functions to the terrace, whatever your level in the kitchen — a place where fire, flavour and the art of living come together.',
                'Ardente lleva materiales duraderos y funciones completas de cocina a la terraza, sea cual sea tu nivel: un lugar donde se unen el fuego, el sabor y el arte de vivir.',
              )}
            </p>
            <div className="mt-8">
              <Button variant="ghost" onClick={() => requestQuote('Ardente — fire kitchen')}>
                {t('Quote an Ardente kitchen', 'Cotizar una cocina Ardente')}
              </Button>
            </div>
          </FadeIn>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-24 md:gap-6">
          <MaskImage src={a.garden} alt={t('Ardente kitchen in a garden', 'Cocina Ardente en un jardín')} className="aspect-[4/3]" sizes="(min-width: 640px) 33vw, 100vw" />
          <MaskImage src={a.detail} alt={t('Ardente worktop detail', 'Detalle de la cubierta Ardente')} className="aspect-[4/3]" sizes="(min-width: 640px) 33vw, 100vw" delay={0.1} />
          <MaskImage src={a.garden2} alt={t('Ardente under garden lights', 'Ardente bajo luces de jardín')} className="aspect-[4/3]" sizes="(min-width: 640px) 33vw, 100vw" delay={0.2} />
        </div>
      </div>

      <TavoloScene />

      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <RevealText text={t('A kitchen\nfor every room.', 'Una cocina\npara cada espacio.')} accent={['every', 'cada']} className="display text-[12vw] text-bone uppercase sm:text-[8vw] lg:text-[5vw]" />
          </div>
          <FadeIn className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-bone/60">
              {t('Q by Kenkoon kitchens in three lines — available through Runway for residences, villas and hotel suites.', 'Las cocinas Q by Kenkoon en tres líneas, disponibles con Runway para residencias, villas y suites de hotel.')}
            </p>
          </FadeIn>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {kitchens.lines.map((l, i) => (
            <FadeIn key={l.name} delay={i * 0.08}>
              <div className="aspect-[4/3] overflow-hidden bg-graphite">
                <img src={thumb(l.image)} alt={`Q ${l.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] hover:scale-105" />
              </div>
              <p className="mt-5 flex items-baseline gap-4">
                <span className="text-[0.65rem] text-bone/40 tabular-nums">0{i + 1}</span>
                <span className="font-display text-3xl text-bone">{l.name}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-bone/55">{tx(l.text)}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
