import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { materials, textures } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'

/** Tactile material library: list on the left drives a large macro "sample" on the right. */
export function Materials() {
  const { t, tx } = useLang()
  const [active, setActive] = useState(0)
  const m = materials[active]

  return (
    <section id="materials" className="relative bg-bone text-ink" aria-labelledby="materials-title">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="06" label={t('Materials & Details', 'Materiales y detalles')} light={false} />
            <RevealText
              text={t('The language\nof materials.', 'El lenguaje\nde los materiales.')}
              accent={['materials.', 'materiales.']}
              accentClass="italic text-bronze"
              className="display mt-10 text-[13vw] uppercase sm:text-[9vw] lg:text-[6vw]"
            />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink/65 lg:col-span-4 lg:col-start-9">
            {t(
              'Quality is something you feel before you see it. Each surface is selected for how it ages, how it catches light and how it feels under the hand.',
              'La calidad se siente antes de verse. Cada superficie se elige por cómo envejece, cómo atrapa la luz y cómo se siente al tacto.',
            )}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <ul className="order-2 divide-y divide-ink/10 border-y border-ink/10 lg:order-1 lg:col-span-5" aria-label={t('Materials', 'Materiales')}>
            {materials.map((mat, i) => (
              <li key={mat.key}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="group flex w-full items-center gap-5 py-4 text-left"
                >
                  <span className="text-[0.65rem] text-ink/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <img src={textures[mat.key]} alt="" className={`size-10 rounded-full object-cover transition-transform duration-500 lg:hidden ${i === active ? 'scale-110' : ''}`} />
                  <span className={`font-display text-3xl transition-all duration-500 md:text-4xl ${i === active ? 'translate-x-2 text-ink italic' : 'text-ink/40 group-hover:text-ink/70'}`}>
                    {tx(mat.name)}
                  </span>
                  <span className="eyebrow ml-auto text-[0.6rem] text-ink/40">{tx(mat.family)}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-mineral lg:sticky lg:top-24 lg:aspect-[4/5]">
              <AnimatePresence mode="sync">
                <motion.img
                  key={m.key}
                  src={textures[m.key]}
                  alt={`${t('Macro detail of', 'Detalle macro de')} ${tx(m.name)}`}
                  initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.15 }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 1.1, ease: easeLuxe }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_25%_15%,rgba(255,250,240,.18),transparent_55%)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 pt-20 text-bone md:p-8 md:pt-24"
                >
                  <p className="eyebrow text-mineral">{tx(m.family)}</p>
                  <p className="mt-2 font-display text-4xl">{tx(m.name)}</p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/75">{tx(m.description)}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
