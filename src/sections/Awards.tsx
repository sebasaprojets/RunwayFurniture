import { motion } from 'motion/react'
import { Pic } from '../components/Pic'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { awards } from '../data/portfolio'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'

/** Awards & recognitions: the five distinctions from the portfolio, dealt onto the table like cards. */
export function Awards() {
  const { t, tx } = useLang()
  return (
    <section id="awards" className="relative overflow-hidden bg-ink py-28 md:py-36" aria-labelledby="awards-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(184,154,106,.14),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-gold">{t('Awards & recognitions', 'Premios y reconocimientos')}</p>
          <h2 id="awards-title" className="sr-only">
            {t('Awards & recognitions', 'Premios y reconocimientos')}
          </h2>
          <RevealText
            text={t('A global recognition of design, quality and hospitality excellence.', 'Un reconocimiento mundial al diseño, la calidad y la excelencia hotelera.')}
            accent={['excellence.', 'excelencia']}
            className="display mt-6 text-[9vw] text-bone uppercase sm:text-[6vw] lg:text-[3.4vw]"
          />
        </div>

        <ul className="mt-16 grid grid-cols-2 items-end gap-4 sm:grid-cols-3 md:mt-20 lg:grid-cols-5 lg:gap-6">
          {awards.map((a, i) => (
            <motion.li
              key={a.image}
              initial={{ opacity: 0, y: 60, rotate: (i - 2) * 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.1, ease: easeLuxe, delay: i * 0.1 }}
              className={`group ${i === 4 ? 'col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-auto' : ''}`}
            >
              <div className="relative overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:-translate-y-2">
                <Pic src={a.image} sizes="(min-width: 768px) 25vw, 50vw">
                  <img src={a.image} alt={tx(a.name)} loading="lazy" decoding="async" className="h-auto w-full" />
                </Pic>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </div>
              <p className="mt-4 text-center text-xs leading-relaxed text-bone/60">{tx(a.name)}</p>
            </motion.li>
          ))}
        </ul>

        <FadeIn>
          <p className="mx-auto mt-16 max-w-xl text-center font-display text-2xl text-bone/70 italic">
            {t('Designed for the world’s finest destinations.', 'Diseñado para los mejores destinos del mundo.')}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
