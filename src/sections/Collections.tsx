import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { interiorCollection, kenkoon } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'

/** Kenkoon outdoor collections (index on the left drives the large image) + Runway's own interior pieces. */
export function Collections() {
  const { t, tx } = useLang()
  const [active, setActive] = useState(0)
  const c = kenkoon.collections[active]

  return (
    <section id="collections" className="relative border-t border-bone/10 bg-graphite py-28 md:py-40" aria-labelledby="collections-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="04" label={t('Collections', 'Colecciones')} />
            <RevealText
              text={t('Modernized\noutdoor living.', 'Vida exterior\nmodernizada.')}
              accent={['outdoor', 'exterior']}
              className="display mt-10 text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[6vw]"
            />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-bone/60 lg:col-span-4 lg:col-start-9">
            {t(
              `Runway represents ${kenkoon.name} — teak, stainless steel, braided rope and stone, designed by ${kenkoon.designer} for terraces, pool decks and gardens that live outside all year.`,
              `Runway representa a ${kenkoon.name}: teca, acero inoxidable, cuerda trenzada y piedra, diseñados por ${kenkoon.designer} para terrazas, piscinas y jardines que se viven todo el año.`,
            )}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden bg-smoke">
              <AnimatePresence mode="sync">
                <motion.img
                  key={c.name}
                  src={c.image}
                  alt={`${kenkoon.name} — ${c.name}`}
                  initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.1 }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                  transition={{ duration: 1.1, ease: easeLuxe }}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 grid gap-3 md:grid-cols-2 md:gap-10"
              >
                <p className="text-sm leading-relaxed text-bone/70">{tx(c.description)}</p>
                <p className="eyebrow text-[0.6rem] leading-loose text-gold/80">{c.pieces}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <ul className="divide-y divide-bone/10 border-y border-bone/10 lg:col-span-4 lg:col-start-9" aria-label={`${kenkoon.name} — ${t('collections', 'colecciones')}`}>
            {kenkoon.collections.map((col, i) => (
              <li key={col.name}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="group flex w-full items-baseline gap-5 py-5 text-left"
                >
                  <span className="text-[0.65rem] text-bone/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span
                    className={`font-display text-2xl transition-all duration-500 md:text-3xl ${
                      i === active ? 'translate-x-2 text-bone italic' : 'text-bone/40 group-hover:text-bone/70'
                    }`}
                  >
                    {col.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-28 border-t border-bone/10 pt-14 md:mt-40">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <p className="display text-4xl text-bone uppercase lg:col-span-6 lg:text-5xl">
              {t('Interior', 'Colección')} <span className="text-gold italic">{t('collection', 'interior')}</span>
            </p>
            <FadeIn className="lg:col-span-5 lg:col-start-8">
              <p className="text-sm leading-relaxed text-bone/60">
                {t(
                  'Aged leathers, deep lounge seating and characterful accent pieces — supplied to hotels, retail stores and private homes worldwide.',
                  'Cueros envejecidos, asientos profundos y piezas de acento con carácter, suministrados a hoteles, tiendas y residencias privadas en todo el mundo.',
                )}
              </p>
            </FadeIn>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {interiorCollection.map((src, i) => (
              <MaskImage
                key={src}
                src={src}
                alt={`${t('Runway interior collection — piece', 'Colección interior Runway — pieza')} ${i + 1}`}
                className={`aspect-[4/5] ${i % 2 ? 'md:mt-16' : ''}`}
                from={i % 2 ? 'top' : 'bottom'}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
