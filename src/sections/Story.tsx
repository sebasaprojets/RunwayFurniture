import { Armchair, BedDouble, Layers, Sofa } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { services, story, storyImages, vision } from '../data/portfolio'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe, useCalmScroll } from '../lib/motion'

const icons = { bed: BedDouble, sofa: Sofa, chair: Armchair, layers: Layers }

/**
 * "Our Story" from the company portfolio: the cover photograph with the Runway sign,
 * the letter to clients beside it and the architect's sketches drifting over it,
 * then the design vision as a row of panels and the four services.
 */
export function Story() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLElement>(null)
  const calm = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], ['18%', '-22%'])

  return (
    <section ref={ref} id="story" className="relative overflow-hidden bg-bone py-28 text-ink md:py-40" aria-labelledby="story-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-7">
            <MaskImage src={storyImages.cover} alt={t('The Runway Furniture International sign on a stone wall above an oceanfront lounge at sunset', 'El letrero de Runway Furniture International sobre un muro de piedra en una sala frente al mar al atardecer')} className="aspect-[16/10]" from="left" sizes="(min-width: 1024px) 58vw, 100vw" />
            <motion.div style={calm ? undefined : { y: drift }} className="absolute -right-4 -bottom-16 hidden w-[38%] border-[6px] border-bone shadow-2xl md:block lg:-right-10">
              <img src={thumb(storyImages.lobby)} alt={t('Architect’s sketch of a hotel lobby', 'Boceto arquitectónico de un lobby de hotel')} loading="lazy" className="aspect-square w-full object-cover" />
            </motion.div>
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow text-bronze">{t('Company portfolio · 2026 – 2027', 'Portafolio corporativo · 2026 – 2027')}</p>
            <RevealText text={t('Our Story', 'Nuestra historia')} accent={['Story', 'historia']} accentClass="italic text-terracotta" as="h2" className="display mt-6 text-[16vw] uppercase sm:text-[10vw] lg:text-[5.6vw]" />
            <span className="mt-8 block h-px w-16 bg-terracotta" />
            <div className="mt-10 space-y-5 text-[1.02rem] leading-relaxed text-ink/70">
              {story.map((p, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <p className={i === 0 ? 'font-display text-2xl leading-snug text-ink' : ''}>{tx(p)}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* services */}
        <ul className="mt-28 grid grid-cols-2 gap-px bg-ink/10 md:mt-36 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <motion.li
                key={s.icon}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, ease: easeLuxe, delay: i * 0.08 }}
                className="group flex flex-col items-start gap-6 bg-bone p-6 md:p-10"
              >
                <span className="grid size-14 place-items-center rounded-full border border-terracotta/40 text-terracotta transition-colors duration-500 group-hover:bg-terracotta group-hover:text-bone">
                  <Icon className="size-6" strokeWidth={1.2} />
                </span>
                <span className="font-display text-2xl leading-tight md:text-3xl">{tx(s.title)}</span>
              </motion.li>
            )
          })}
        </ul>

        {/* design vision panels */}
        <div className="mt-28 md:mt-36">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <RevealText text={t('Architecture &\nDesign Vision', 'Arquitectura y\nvisión de diseño')} accent={['&', 'y']} accentClass="italic text-terracotta" className="display text-[12vw] uppercase sm:text-[8vw] lg:col-span-7 lg:text-[4.6vw]" />
            <FadeIn className="lg:col-span-4 lg:col-start-9">
              <p className="font-display text-2xl leading-snug text-ink/75 italic">{tx(vision[0].text)}</p>
            </FadeIn>
          </div>
          <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
            {vision.map((v, i) => (
              <motion.figure
                key={v.title.en}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1, ease: easeLuxe, delay: i * 0.09 }}
                className={`group w-[78vw] shrink-0 snap-start md:w-auto ${i % 2 ? 'md:mt-16' : ''}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-smoke">
                  <img src={thumb(v.image)} alt={tx(v.title)} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]" />
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-terracotta transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-100" />
                </div>
                <figcaption className="mt-5">
                  <p className="font-display text-2xl leading-tight">{tx(v.title)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{tx(v.text)}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
