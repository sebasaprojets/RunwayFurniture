import { Armchair, BedDouble, Layers, Sofa } from 'lucide-react'
import { Pic } from '../components/Pic'
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
              <Pic src={storyImages.lobby} sizes="(min-width: 1024px) 50vw, 100vw">
              <img src={thumb(storyImages.lobby)} alt={t('Architect’s sketch of a hotel lobby', 'Boceto arquitectónico de un lobby de hotel')} loading="lazy" className="aspect-square w-full object-cover" />
              </Pic>
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
                className="flex flex-col items-start gap-6 bg-bone p-6 md:p-10"
              >
                <span className="grid size-14 place-items-center rounded-full border border-terracotta/40 text-terracotta">
                  <Icon className="size-6" strokeWidth={1.2} />
                </span>
                <span className="font-display text-2xl leading-tight md:text-3xl">{tx(s.title)}</span>
              </motion.li>
            )
          })}
        </ul>

        {/* design vision panels */}
        <div className="mt-28 md:mt-36">
          <RevealText text={t('Architecture &\nDesign Vision', 'Arquitectura y\nvisión de diseño')} accent={['&', 'y']} accentClass="italic text-terracotta" className="display text-[12vw] uppercase sm:text-[8vw] lg:text-[4.6vw]" />
          {/* an even grid on every screen: two columns on phones and tablets (the fifth panel spans the
              row as a wide closing image), five aligned columns on desktop */}
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 md:mt-16 lg:grid-cols-5 lg:gap-x-5">
            {vision.map((v, i) => {
              const wide = i === vision.length - 1 && vision.length % 2 === 1
              return (
                <motion.figure
                  key={v.title.en}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1, ease: easeLuxe, delay: (i % 5) * 0.09 }}
                  className={`group ${wide ? 'col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-smoke ${wide ? 'aspect-[16/9] lg:aspect-[3/4]' : 'aspect-[3/4]'}`}>
                    <Pic src={v.image} sizes={wide ? '(min-width: 1024px) 20vw, 100vw' : '(min-width: 1024px) 20vw, 50vw'}>
                      <img src={thumb(v.image)} alt={tx(v.title)} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]" />
                    </Pic>
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-terracotta transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-100" />
                  </div>
                  <figcaption className="mt-4 sm:mt-5">
                    <p className="text-[0.6875rem] tracking-[0.32em] text-terracotta tabular-nums">{String(i + 1).padStart(2, '0')}</p>
                    <p className="mt-2 font-display text-xl leading-tight sm:text-2xl">{tx(v.title)}</p>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-ink/60 sm:text-sm">{tx(v.text)}</p>
                  </figcaption>
                </motion.figure>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
