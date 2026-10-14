import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { brand, images } from '../data/site'
import { useLang } from '../i18n'
import { useCalmScroll } from '../lib/motion'

/** Founder letter — text and portraits exactly as supplied by the company. */
export function Founder() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLElement>(null)
  const calm = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const yB = useTransform(scrollYProgress, [0, 1], ['-6%', '14%'])

  return (
    <section ref={ref} id="founder" className="relative overflow-hidden bg-ink py-28 md:py-40" aria-labelledby="founder-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">

        <div className="mt-12 grid gap-16 lg:grid-cols-12">
          {/* portraits */}
          <div className="relative lg:col-span-6">
            <motion.div style={calm ? undefined : { y: yA }} className="relative z-10 w-[78%]">
              <MaskImage
                src={images.founderStanding}
                alt={t(
                  `${brand.founder.name}, founder of ${brand.full}, smiling with arms crossed`,
                  `${brand.founder.name}, fundador de ${brand.full}, sonriendo con los brazos cruzados`,
                )}
                className="aspect-[4/5]"
                parallax={4}
              />
            </motion.div>
            <motion.div style={calm ? undefined : { y: yB }} className="relative z-20 -mt-[38%] ml-auto w-[52%] border-[6px] border-ink">
              <MaskImage
                src={images.founderSeated}
                alt={t(
                  `${brand.founder.name} seated in a leather lounge chair at an oceanfront resort`,
                  `${brand.founder.name} sentado en un sillón de cuero en un resort frente al mar`,
                )}
                className="aspect-[4/5]"
                from="left"
                delay={0.2}
                parallax={4}
              />
            </motion.div>
            <FadeIn delay={0.3} className="relative z-30 mt-10 max-w-xs lg:absolute lg:bottom-6 lg:left-0 lg:mt-0">
              <p className="font-display text-5xl leading-none text-terracotta">“</p>
              <p className="font-display text-3xl leading-tight text-bone uppercase">{tx(brand.founder.quote)}</p>
            </FadeIn>
          </div>

          {/* letter */}
          <div className="lg:col-span-5 lg:col-start-8">
            <RevealText text={t('The Founder', 'El fundador')} as="h2" className="display mt-4 text-[16vw] text-bone uppercase sm:text-[10vw] lg:text-[6vw]" />
            <span className="mt-8 block h-px w-16 bg-terracotta" />
            <FadeIn>
              <div className="mt-10 max-w-[62ch] space-y-6 text-[1.05rem] leading-relaxed text-bone/75">
                <p className="font-display text-3xl leading-snug text-bone">
                  {t('“Great furniture is more than design — it creates experiences that people remember.', '“Un gran mueble es más que diseño: crea experiencias que la gente recuerda.')}
                </p>
                <p>
                  {t(
                    'For more than seventeen years, Runway Furniture International has partnered with architects, developers, hotel brands, and interior designers around the world to deliver exceptional hospitality and residential environments.',
                    'Durante más de diecisiete años, Runway Furniture International ha trabajado con arquitectos, desarrolladores, marcas hoteleras e interioristas de todo el mundo para crear espacios hoteleros y residenciales excepcionales.',
                  )}
                </p>
                <p>
                  {t(
                    'From boutique hotels to five-star resorts and luxury residences, every project reflects our commitment to innovation, craftsmanship, and timeless design.',
                    'Desde hoteles boutique hasta resorts de cinco estrellas y residencias de lujo, cada proyecto refleja nuestro compromiso con la innovación, el oficio y el diseño atemporal.',
                  )}
                </p>
                <p>
                  {t('We don’t simply supply furniture.', 'No solo suministramos muebles.')}
                  <br />
                  <span className="font-display text-3xl text-gold italic">{t('We help create destinations.', 'Ayudamos a crear destinos.')}</span>
                </p>
                <p>{t('Welcome to Runway Furniture International.”', 'Bienvenidos a Runway Furniture International.”')}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-12 border-t border-bone/10 pt-8">
                <p className="font-script text-6xl leading-none text-gold md:text-7xl" aria-hidden>
                  Roberto Castle
                </p>
                <p className="mt-4 font-display text-2xl text-bone">{brand.founder.name}</p>
                <p className="eyebrow mt-2 text-mineral/60">{tx(brand.founder.role)}</p>
              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </section>
  )
}
