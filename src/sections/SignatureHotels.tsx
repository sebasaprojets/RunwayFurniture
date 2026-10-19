import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { hotelCountries, hotelNames, hotels } from '../data/signature'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe } from '../lib/motion'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Signature hotels: an index of names on the left drives a large photograph on the right
 * (the row crossing the middle of the screen becomes active; hover and focus work too).
 * Below 1024px it becomes a native swipe carousel.
 */
export function SignatureHotels() {
  const { t, tx } = useLang()
  const [active, setActive] = useState(0)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const band = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: band, offset: ['start end', 'end start'] })
  const xa = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const xb = useTransform(scrollYProgress, [0, 1], ['-30%', '0%'])
  const hotel = hotels[active]

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rows.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])

  const half = Math.ceil(hotelNames.length / 2)

  return (
    <section id="hotels" className="relative border-t border-bone/10 bg-ink pt-28 md:pt-40" aria-labelledby="hotels-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8 text-gold">— {t('Signature hotels', 'Hoteles emblemáticos')}</p>
            <h2 id="hotels-title" className="sr-only">
              {t('Signature hotels', 'Hoteles emblemáticos')}
            </h2>
            <RevealText
              text={t('Where the\nworld checks in.', 'Donde el\nmundo se hospeda.')}
              accent={['world', 'mundo']}
              className="display text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[5.6vw]"
            />
          </div>
          <FadeIn className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-sm leading-relaxed text-bone/60">
              {t(
                'Pool decks, rooftops, beach clubs and suites furnished for W Hotels, St. Regis, Fontainebleau, Six Senses, Conrad and the Ritz-Carlton — from the Maldives to Manhattan.',
                'Piscinas, azoteas, beach clubs y suites amueblados para W Hotels, St. Regis, Fontainebleau, Six Senses, Conrad y Ritz-Carlton, de las Maldivas a Manhattan.',
              )}
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-px border-t border-bone/10">
              {[
                { v: '50+', l: t('Properties', 'Propiedades') },
                { v: String(hotelCountries), l: t('Countries', 'Países') },
                { v: '5', l: t('Continents', 'Continentes') },
              ].map((s) => (
                <div key={s.l} className="flex flex-col pt-5">
                  <dd className="display order-1 text-4xl text-bone md:text-5xl">{s.v}</dd>
                  <dt className="eyebrow order-2 mt-2 text-mineral/60">{s.l}</dt>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>

        {/* Desktop: sticky photograph driven by the index */}
        <div className="mt-20 hidden gap-10 lg:grid lg:grid-cols-12">
          <ol className="lg:col-span-5" aria-label={t('Hotel index', 'Índice de hoteles')}>
            {hotels.map((h, i) => (
              <li key={h.slug} ref={(el) => void (rows.current[i] = el)} data-i={i} className="border-b border-bone/10 first:border-t">
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-current={i === active}
                  className="group flex w-full items-baseline gap-6 py-6 text-left"
                >
                  <span className={`w-7 text-[0.65rem] tabular-nums transition-colors duration-500 ${i === active ? 'text-gold' : 'text-bone/40'}`}>{pad(i + 1)}</span>
                  <span className="flex-1">
                    <span
                      className={`block font-display text-3xl leading-tight transition-all duration-700 ease-[var(--ease-luxe)] xl:text-4xl ${
                        i === active ? 'translate-x-3 text-bone italic' : 'text-bone/45 group-hover:text-bone/75'
                      }`}
                    >
                      {h.name}
                    </span>
                    <span className={`mt-1 block text-xs tracking-[0.18em] uppercase transition-all duration-700 ${i === active ? 'translate-x-3 text-gold/80' : 'text-bone/30'}`}>
                      {tx(h.city)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="lg:col-span-7">
            <div className="sticky top-[12vh]">
              <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={hotel.slug}
                    src={hotel.image}
                    alt={`${hotel.name}, ${tx(hotel.city)}`}
                    initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.5 } }}
                    transition={{ duration: 1.1, ease: easeCine }}
                    className="grade absolute inset-0 h-full w-full object-cover"
                    decoding="async"
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hotel.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.6, ease: easeLuxe }}
                    className="absolute right-8 bottom-7 left-8 flex items-end justify-between gap-6"
                  >
                    <div>
                      <p className="font-display text-4xl text-bone">{hotel.name}</p>
                      <p className="eyebrow mt-2 text-bone/70">{tx(hotel.city)}</p>
                    </div>
                    <p className="font-display text-xl text-bone/70 tabular-nums italic">
                      {pad(active + 1)} <span className="text-bone/35">/ {pad(hotels.length)}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* warm the next photograph so the wipe never waits */}
              <link rel="prefetch" href={hotels[(active + 1) % hotels.length].image} />
            </div>
          </div>
        </div>
      </div>

      {/* Phones & tablets: swipe carousel */}
      <ul className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 lg:hidden" aria-label={t('Signature hotels', 'Hoteles emblemáticos')}>
        {hotels.map((h, i) => (
          <li key={h.slug} className="w-[82vw] max-w-[440px] shrink-0 snap-start">
            <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
              <img src={thumb(h.image)} alt={`${h.name}, ${tx(h.city)}`} loading="lazy" decoding="async" className="grade h-full w-full object-cover" />
              <span className="absolute top-4 left-4 font-display text-base text-bone/85 italic">{pad(i + 1)}</span>
            </div>
            <p className="mt-4 font-display text-2xl text-bone">{h.name}</p>
            <p className="eyebrow mt-1 text-gold/80">{tx(h.city)}</p>
          </li>
        ))}
      </ul>

      {/* Every property in the book, drifting with the scroll */}
      <div ref={band} className="mt-24 overflow-hidden border-y border-bone/10 py-8 md:mt-32 md:py-10" aria-hidden>
        {[hotelNames.slice(0, half), hotelNames.slice(half)].map((names, r) => (
          <motion.div key={r} style={{ x: r ? xb : xa }} className={`flex whitespace-nowrap ${r ? 'mt-4' : ''}`}>
            {[...names, ...names].map((n, i) => (
              <span key={i} className={`flex items-center font-display text-3xl md:text-5xl ${r ? 'text-bone/25 italic' : 'text-bone/70'}`}>
                {n}
                <span className="mx-6 inline-block size-1.5 rotate-45 bg-gold/60 md:mx-10" />
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
