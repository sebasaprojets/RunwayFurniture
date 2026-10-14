import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { brand, images } from '../data/site'
import { usePrefersReducedMotion } from '../lib/motion'

/** Founder letter — text and portraits exactly as supplied by the company. */
export function Founder() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const yB = useTransform(scrollYProgress, [0, 1], ['-6%', '14%'])

  return (
    <section ref={ref} id="founder" className="relative overflow-hidden bg-ink py-28 md:py-40" aria-labelledby="founder-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="07" label="The Founder" />

        <div className="mt-12 grid gap-16 lg:grid-cols-12">
          {/* portraits */}
          <div className="relative lg:col-span-6">
            <motion.div style={reduced ? undefined : { y: yA }} className="relative z-10 w-[78%]">
              <MaskImage
                src={images.founderStanding}
                alt={`${brand.founder.name}, founder of ${brand.full}, smiling with arms crossed`}
                className="aspect-[4/5]"
                parallax={4}
              />
            </motion.div>
            <motion.div style={reduced ? undefined : { y: yB }} className="relative z-20 -mt-[38%] ml-auto w-[52%] border-[6px] border-ink">
              <MaskImage
                src={images.founderSeated}
                alt={`${brand.founder.name} seated in a leather lounge chair at an oceanfront resort`}
                className="aspect-[4/5]"
                from="left"
                delay={0.2}
                parallax={4}
              />
            </motion.div>
            <FadeIn delay={0.3} className="relative z-30 mt-10 max-w-xs lg:absolute lg:bottom-6 lg:left-0 lg:mt-0">
              <p className="font-display text-5xl leading-none text-terracotta">“</p>
              <p className="font-display text-3xl leading-tight text-bone uppercase">{brand.founder.quote}</p>
            </FadeIn>
          </div>

          {/* letter */}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow text-gold">A letter from</p>
            <RevealText text="The Founder" as="h2" className="display mt-4 text-[16vw] text-bone uppercase sm:text-[10vw] lg:text-[6vw]" />
            <span className="mt-8 block h-px w-16 bg-terracotta" />
            <FadeIn>
              <div className="mt-10 space-y-6 text-[1.05rem] leading-relaxed text-bone/75">
                <p className="font-display text-3xl leading-snug text-bone">
                  “Great furniture is more than design — it creates experiences that people remember.
                </p>
                <p>
                  For more than seventeen years, Runway Furniture International has partnered with architects, developers, hotel brands,
                  and interior designers around the world to deliver exceptional hospitality and residential environments.
                </p>
                <p>
                  From boutique hotels to five-star resorts and luxury residences, every project reflects our commitment to innovation,
                  craftsmanship, and timeless design.
                </p>
                <p>
                  We don’t simply supply furniture.
                  <br />
                  <span className="font-display text-3xl text-gold italic">We help create destinations.</span>
                </p>
                <p>Welcome to Runway Furniture International.”</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-12 border-t border-bone/10 pt-8">
                <p className="font-script text-6xl leading-none text-gold md:text-7xl" aria-hidden>
                  Roberto Castle
                </p>
                <p className="mt-4 font-display text-2xl text-bone">{brand.founder.name}</p>
                <p className="eyebrow mt-2 text-mineral/60">{brand.founder.role}</p>
              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </section>
  )
}
