import { motion } from 'motion/react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { eliteKinds, type Drawing } from '../data/elite'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

/** Runway Sale — hotels, land, islands, condominiums and villas, each as a line drawing that sketches itself in. */
export function Elite() {
  const { t, tx } = useLang()

  return (
    <section id="elite" className="relative overflow-hidden border-t border-bone/10 bg-ink py-28 md:py-40" aria-labelledby="elite-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="eyebrow mb-8 text-gold">— Runway Sale</p>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <RevealText
              as="h2"
              text={'Élite Project\nWorldwide'}
              accent={['Worldwide']}
              className="display text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[6vw]"
            />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-bone/60 lg:col-span-4">
            {t(
              'A private selection of properties and development opportunities around the world, presented with the same eye we bring to every interior.',
              'Una selección privada de propiedades y oportunidades de desarrollo en todo el mundo, presentada con el mismo criterio que llevamos a cada interior.',
            )}
          </p>
        </div>
        {/* the h2 above is decorative word-by-word; this is the accessible name */}
        <span id="elite-title" className="sr-only">Runway Sale Élite Project Worldwide</span>

        <ul className="mt-16 grid grid-cols-1 gap-px bg-bone/10 sm:grid-cols-2 md:mt-24 lg:grid-cols-3 xl:grid-cols-5">
          {eliteKinds.map((k, i) => (
            <li key={k.key} className="group flex flex-col bg-ink p-6 transition-colors duration-700 hover:bg-graphite md:p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-sans text-xs text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                <span className="eyebrow text-mineral/40">{t('Worldwide', 'Todo el mundo')}</span>
              </div>
              <Sketch drawing={k.drawing} label={tx(k.title)} />
              <h3 className="display text-4xl text-bone transition-transform duration-700 group-hover:translate-x-1 md:text-5xl xl:text-[2.6vw]">{tx(k.title)}</h3>
              <p className="mt-4 text-sm leading-relaxed text-bone/55">{tx(k.text)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-6 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-bone/60">
            {t(
              'Listings are shared privately on request. Tell us what you are looking for and where.',
              'Las propiedades se comparten de forma privada bajo solicitud. Cuéntenos qué busca y dónde.',
            )}
          </p>
          <Button onClick={() => scrollToTarget('#contact')}>{t('Request the portfolio', 'Solicitar el portafolio')}</Button>
        </div>
      </div>
    </section>
  )
}

function Sketch({ drawing, label }: { drawing: Drawing; label: string }) {
  const paths = [...drawing.lines.map((d) => ({ d, water: false })), ...(drawing.water ?? []).map((d) => ({ d, water: true }))]
  return (
    <motion.svg
      viewBox="0 0 240 160"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      className="my-10 w-full transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    >
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          stroke={p.water ? 'var(--color-mineral)' : 'var(--color-gold)'}
          strokeOpacity={p.water ? 0.45 : 0.9}
          strokeWidth={0.9}
          variants={{
            hide: { pathLength: 0, opacity: 0 },
            show: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.8, ease: easeLuxe, delay: 0.1 + i * 0.08 }, opacity: { duration: 0.2, delay: 0.1 + i * 0.08 } } },
          }}
        />
      ))}
    </motion.svg>
  )
}
