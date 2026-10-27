import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { eliteKinds, type Drawing, type EliteKind } from '../data/elite'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { lockScroll, scrollToTarget } from '../lib/scroll'

/** Ask the contact form to start an information request about a property or category. */
const enquire = (subject: string) => {
  window.dispatchEvent(new CustomEvent('contact:prefill', { detail: { subject } }))
  scrollToTarget('#contact')
}

/** Runway Sale — hotels, land, islands, condominiums and villas, each as a line drawing that sketches itself in. */
export function Elite() {
  const { t, tx } = useLang()
  const [open, setOpen] = useState<EliteKind | null>(null)

  return (
    <section id="elite" className="relative overflow-hidden border-t border-bone/10 bg-ink py-28 md:py-40" aria-labelledby="elite-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <CineTitle />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1.2, ease: easeLuxe, delay: 1.1 }}
            className="max-w-md text-sm leading-relaxed text-bone/60 lg:col-span-4"
          >
            {t(
              'A private selection of properties and development opportunities around the world, presented with the same eye we bring to every interior.',
              'Una selección privada de propiedades y oportunidades de desarrollo en todo el mundo, presentada con el mismo criterio que llevamos a cada interior.',
            )}
          </motion.p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-px bg-bone/10 sm:grid-cols-2 md:mt-24 lg:grid-cols-3 xl:grid-cols-5">
          {eliteKinds.map((k, i) => (
            <li key={k.key} className="bg-ink">
              <button
                onClick={() => setOpen(k)}
                className="group flex h-full w-full flex-col p-6 text-left transition-colors duration-700 hover:bg-graphite focus-visible:bg-graphite md:p-8"
                aria-label={`${tx(k.title)} — ${t('view properties', 'ver propiedades')}`}
              >
                <span className="flex w-full items-baseline justify-between">
                  <span className="font-sans text-xs text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                  <span className="eyebrow text-mineral/40">{t('Worldwide', 'Todo el mundo')}</span>
                </span>
                <Sketch drawing={k.drawing} label={tx(k.title)} />
                <span className="display block text-4xl text-bone transition-transform duration-700 group-hover:translate-x-1 md:text-5xl xl:text-[2.6vw]">{tx(k.title)}</span>
                <span className="mt-4 block text-sm leading-relaxed text-bone/55">{tx(k.text)}</span>
                <span className="mt-auto flex items-center gap-3 pt-8 text-[0.6875rem] font-semibold tracking-[0.24em] text-gold uppercase">
                  {t('View properties', 'Ver propiedades')}
                  {k.listings.length > 0 && <span className="text-bone/50">({k.listings.length})</span>}
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
                </span>
              </button>
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
          <Button onClick={() => enquire('Runway Sale — Élite Project Worldwide')}>{t('Request the portfolio', 'Solicitar el portafolio')}</Button>
        </div>
      </div>

      <AnimatePresence>{open && <Listings key={open.key} kind={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}

/**
 * The section title arrives like an opening credit: each letter rises out of a
 * mask while coming into focus, then a light sweep runs across "Worldwide".
 */
function CineTitle() {
  const lines = [
    { text: 'Élite Project', accent: false },
    { text: 'Worldwide', accent: true },
  ]
  let n = 0
  return (
    <motion.div initial="hide" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
      <p className="eyebrow mb-8 flex items-center gap-4 text-gold">
        <motion.span
          className="h-px w-10 origin-left bg-gold"
          variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease: easeLuxe } } }}
        />
        <motion.span variants={{ hide: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easeLuxe, delay: 0.3 } } }}>
          Runway Sale
        </motion.span>
      </p>
      <h2 id="elite-title" className="display text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[6vw]" aria-label="Runway Sale Élite Project Worldwide">
        {lines.map((l) => (
          <span key={l.text} aria-hidden className={`relative block pt-[0.12em] pb-[0.04em] ${l.accent ? 'text-gold italic' : ''}`} style={{ perspective: '600px' }}>
            {l.text.split('').map((ch, i) => {
              const d = 0.35 + n++ * 0.035
              return (
                <span key={i} className="inline-block overflow-hidden pt-[0.12em] pb-[0.14em] -mt-[0.12em] -mb-[0.14em] align-bottom">
                  <motion.span
                    className="inline-block origin-bottom will-change-transform"
                    variants={{
                      hide: { y: '105%', rotateX: -70, opacity: 0, filter: 'blur(14px)' },
                      show: {
                        y: '0%',
                        rotateX: 0,
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: { duration: 1.3, ease: easeLuxe, delay: d, filter: { duration: 1.1, delay: d + 0.1 } },
                      },
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                </span>
              )
            })}
            {l.accent && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-bone/50 to-transparent mix-blend-overlay"
                style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 40%, #000 60%, transparent)' }}
                variants={{ hide: { x: '-110%', opacity: 0 }, show: { x: '110%', opacity: [0, 1, 0], transition: { duration: 1.6, ease: 'easeInOut', delay: 1.4 } } }}
              />
            )}
          </span>
        ))}
      </h2>
    </motion.div>
  )
}

/** Full-screen sheet listing the properties for sale in one category. */
function Listings({ kind, onClose }: { kind: EliteKind; onClose: () => void }) {
  const { t, tx } = useLang()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    lockScroll(true)
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      lockScroll(false)
      last?.focus()
    }
  }, [onClose])

  const ask = (subject: string) => {
    onClose()
    // wait for the sheet to leave and release the scroll lock
    window.setTimeout(() => enquire(subject), 850)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="listings-title"
      data-lenis-prevent
      className="fixed inset-0 z-[120] overflow-y-auto overscroll-contain bg-ink"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.9, ease: easeLuxe }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-bone/10 bg-ink/95 px-5 py-5 md:px-10">
        <p className="eyebrow text-gold">Runway Sale · {tx(kind.title)}</p>
        <button
          ref={closeRef}
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink"
          aria-label={t('Close', 'Cerrar')}
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 pt-14 pb-24 md:px-10 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <motion.h3
            id="listings-title"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: easeLuxe, delay: 0.35 }}
            className="display text-[14vw] text-bone uppercase sm:text-[10vw] lg:col-span-7 lg:text-[6vw]"
          >
            {tx(kind.title)}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-md text-sm leading-relaxed text-bone/60 lg:col-span-4 lg:col-start-9"
          >
            {tx(kind.text)}
          </motion.p>
        </div>

        {kind.listings.length > 0 ? (
          <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
            {kind.listings.map((l, i) => (
              <motion.li
                key={l.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: easeLuxe, delay: 0.5 + i * 0.08 }}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
                  <img
                    src={thumb(l.image)}
                    srcSet={thumb(l.image) === l.image ? undefined : `${thumb(l.image)} 1280w, ${l.image} 2000w`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    alt={`${l.name} — ${tx(l.location)}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-bone/10 pt-4">
                  <h4 className="font-display text-3xl text-bone">{l.name}</h4>
                  {l.price && <span className="shrink-0 text-sm text-gold">{l.price}</span>}
                </div>
                <p className="eyebrow mt-2 text-mineral/60">{tx(l.location)}</p>
                {l.details && <p className="mt-3 text-sm leading-relaxed text-bone/55">{tx(l.details)}</p>}
                <button
                  onClick={() => ask(`${l.name} (${tx(l.location)})`)}
                  className="mt-5 flex items-center gap-3 self-start text-[0.6875rem] font-semibold tracking-[0.24em] text-gold uppercase"
                >
                  {t('Request information', 'Solicitar información')}
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.5 }}
            className="mt-14 grid items-center gap-10 border-t border-bone/10 pt-14 md:mt-20 md:grid-cols-2"
          >
            <div className="max-w-md">
              <Sketch drawing={kind.drawing} label={tx(kind.title)} />
            </div>
            <div>
              <p className="font-display text-3xl leading-snug text-bone md:text-4xl">
                {t('New properties are being prepared for this collection.', 'Estamos preparando nuevas propiedades para esta colección.')}
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/60">
                {t(
                  'Our current selection is shared privately. Tell us what you are looking for and we will send you the available options.',
                  'Nuestra selección actual se comparte de forma privada. Cuéntenos qué busca y le enviaremos las opciones disponibles.',
                )}
              </p>
              <div className="mt-8">
                <Button onClick={() => ask(`Runway Sale — ${tx(kind.title)}`)}>{t('Request information', 'Solicitar información')}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
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
