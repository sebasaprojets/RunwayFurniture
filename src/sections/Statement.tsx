import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { brand } from '../data/site'
import { useCalmScroll } from '../lib/motion'
import { useLang } from '../i18n'

const manifesto = {
  en: 'For more than seventeen years we have partnered with architects, developers, hotel brands and interior designers around the world — to deliver hospitality and residential environments that people remember.',
  es: 'Durante más de diecisiete años hemos trabajado con arquitectos, desarrolladores, marcas hoteleras e interioristas de todo el mundo para crear espacios hoteleros y residenciales que la gente recuerda.',
}

/** A manifesto that lights up word by word as you scroll, followed by count-up facts. */
export function Statement() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 45%'] })
  const marquee = useRef<HTMLElement>(null)
  const { scrollYProgress: mq } = useScroll({ target: marquee, offset: ['start end', 'end start'] })
  const x = useTransform(mq, [0, 1], ['0%', '-25%'])
  const words = tx(manifesto).split(' ')

  const facts = [
    { value: brand.since, label: t('Founded', 'Fundada'), plain: true },
    { value: brand.years, label: t('Years of excellence', 'Años de excelencia') },
    { value: brand.offices.length, label: t('Studios — Montreal & Singapore', 'Estudios — Montreal y Singapur') },
    { value: brand.regions.length, label: brand.regions.map(tx).join(' · ') },
  ]

  return (
    <section ref={marquee} className="relative overflow-hidden bg-ink py-28 md:py-44" aria-label={t('Runway at a glance', 'Runway en cifras')}>
      <div ref={ref} className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="eyebrow mb-10 text-gold">— {t('Since', 'Desde')} {brand.since}</p>
        <p className="display text-[8.5vw] leading-[1.02] md:text-[4.6vw]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={['remember.', 'world', 'recuerda.', 'mundo'].includes(w)}>
              {w}
            </Word>
          ))}
        </p>
      </div>


      <motion.div style={{ x }} className="mt-24 flex whitespace-nowrap md:mt-32" aria-hidden>
        {(t('Luxury Hospitality|Residential|Bespoke Furniture|Montreal|Singapore|Worldwide|Luxury Hospitality|Residential', 'Hotelería de lujo|Residencial|Mobiliario a medida|Montreal|Singapur|Todo el mundo|Hotelería de lujo|Residencial')).split('|').map((w, i) => (
          <span key={i} className="display flex items-center text-[15vw] text-transparent md:text-[8vw]" style={{ WebkitTextStroke: '1px rgba(210,196,174,.22)' }}>
            {w}
            <span className="mx-[3vw] inline-block size-[1.2vw] rotate-45 bg-gold/40" />
          </span>
        ))}
      </motion.div>

      <dl className="mx-auto mt-20 grid max-w-[1600px] grid-cols-2 gap-px px-5 md:mt-28 md:grid-cols-4 md:px-10">
        {facts.map((f, i) => (
          <div key={f.label} className="flex flex-col border-l border-bone/10 py-4 pl-5">
            <dd className="display order-1 text-6xl text-bone md:text-8xl">
              <CountUp to={f.value} plain={f.plain} delay={i * 0.12} />
            </dd>
            <dt className="eyebrow order-2 mt-3 text-mineral/60">{f.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const calm = useCalmScroll()
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span style={calm ? undefined : { opacity, y }} className={`mr-[0.25em] inline-block ${accent ? 'text-gold italic' : 'text-bone'}`}>
      {children}
    </motion.span>
  )
}

function CountUp({ to, plain, delay }: { to: number; plain?: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const [v, setV] = useState(plain ? to - 40 : 0)
  useEffect(() => {
    if (!inView) return
    const c = animate(plain ? to - 40 : 0, to, { duration: 2.2, delay, ease: [0.22, 1, 0.36, 1], onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to, plain, delay])
  return (
    <span ref={ref} className="tabular-nums">
      {String(v).padStart(plain ? 4 : 2, '0')}
    </span>
  )
}
