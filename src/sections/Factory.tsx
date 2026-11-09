import { motion, useScroll, useTransform } from 'motion/react'
import { Pic } from '../components/Pic'
import { useRef } from 'react'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { factory } from '../data/portfolio'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe, useCalmScroll } from '../lib/motion'

/** Factory & production: the five steps light up along a line as you scroll, beside the workshop photographs. */
export function Factory() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLElement>(null)
  const calm = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const lift = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section ref={ref} id="factory" className="relative overflow-hidden bg-graphite py-28 md:py-40" aria-labelledby="factory-title">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-gold">{t('Factory & production', 'Fábrica y producción')}</p>
          <h2 id="factory-title" className="sr-only">
            {t('Factory & production', 'Fábrica y producción')}
          </h2>
          <RevealText text={t('Made by\nhand, built\nto last.', 'Hecho a\nmano, para\ndurar.')} accent={['hand,', 'mano,']} className="display mt-6 text-[14vw] text-bone uppercase sm:text-[9vw] lg:text-[5.4vw]" />
          <FadeIn>
            <p className="mt-8 max-w-md leading-relaxed text-bone/65">
              {t(
                'From concept to reality: every piece is drawn, engineered, prototyped, manufactured and inspected in our own production — then delivered and installed worldwide.',
                'Del concepto a la realidad: cada pieza se dibuja, se diseña técnicamente, se prototipa, se fabrica y se inspecciona en nuestra propia producción, y luego se entrega e instala en todo el mundo.',
              )}
            </p>
          </FadeIn>

          <ol className="relative mt-12 space-y-7 pl-10">
            <span className="absolute top-2 bottom-2 left-[7px] w-px bg-bone/15" />
            <motion.span style={{ scaleY: line }} className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gold" />
            {factory.steps.map((s, i) => (
              <motion.li
                key={s.en}
                initial={{ opacity: 0.25, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: '0px 0px -35% 0px' }}
                transition={{ duration: 0.7, ease: easeLuxe }}
                className="relative"
              >
                <span className="absolute top-2 -left-10 size-[15px] rounded-full border border-gold bg-graphite" />
                <span className="font-sans text-xs text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-display text-3xl text-bone">{tx(s)}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-4 self-center lg:col-span-7">
          {factory.images.map((im, i) => {
            const wide = i === 0 || i === 3
            return (
              <motion.figure
                key={im.src}
                style={calm || !wide ? undefined : { y: lift }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1, ease: easeLuxe, delay: i * 0.08 }}
                className={`group overflow-hidden ${wide ? 'col-span-2' : ''}`}
              >
                <Pic src={im.src} sizes={wide ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'}>
                <img
                  src={thumb(im.src)}
                  srcSet={wide ? `${thumb(im.src)} 960w, ${im.src} 1600w` : undefined}
                  sizes={wide ? '(min-width: 1024px) 55vw, 100vw' : undefined}
                  alt={tx(im.alt)}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.06] ${wide ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
                />
                </Pic>
              </motion.figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
