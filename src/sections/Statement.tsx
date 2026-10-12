import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { brand } from '../data/site'

/** Kinetic marquee + key facts taken from the founder's letter. */
export function Statement() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const words = ['Luxury Hospitality', 'Residential', 'Bespoke Furniture', 'Montreal', 'Singapore', 'Worldwide']

  const facts = [
    { value: String(brand.since), label: 'Founded' },
    { value: `${brand.years}`, label: 'Years of excellence' },
    { value: String(brand.offices.length), label: 'Studios — Montreal & Singapore' },
    { value: String(brand.regions.length), label: brand.regions.join(' · ') },
  ]

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-bone/10 bg-ink py-16 md:py-24" aria-label="Runway at a glance">
      <motion.div style={{ x }} className="flex whitespace-nowrap" aria-hidden>
        {[...words, ...words].map((w, i) => (
          <span key={i} className="display flex items-center text-[16vw] text-bone/[0.07] md:text-[9vw]">
            {w}
            <span className="mx-[3vw] inline-block size-[1.4vw] rotate-45 border border-gold/40" />
          </span>
        ))}
      </motion.div>
      <dl className="mx-auto mt-12 grid max-w-[1600px] grid-cols-2 gap-px px-5 md:mt-16 md:grid-cols-4 md:px-10">
        {facts.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col border-l border-bone/10 py-4 pl-5"
          >
            <dt className="eyebrow order-2 mt-3 text-mineral/60">{f.label}</dt>
            <dd className="display order-1 text-6xl text-bone md:text-7xl">{f.value}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  )
}
