import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from 'lucide-react'
import { Pic } from '../components/Pic'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { eliteKinds, type Drawing, type EliteKind, type Listing } from '../data/elite'
import { openWhatsApp, thumb } from '../data/site'
import { useLang, type T } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { lockScroll } from '../lib/scroll'

const TOUCH = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

type Translate = (en: string, es: string) => string

/** Opens a WhatsApp chat with Runway, the request about a property or category already written. */
const enquire = (t: Translate, subject: string) =>
  openWhatsApp(t(`Hello, I would like more information about: ${subject}.`, `Hola, me gustaría recibir información sobre: ${subject}.`))

const subjectOf = (tx: (v: T) => string, l: Listing) => `${tx(l.name)} (${tx(l.location)})`

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
          <Button onClick={() => enquire(t, 'Runway Sale — Élite Project Worldwide')}>{t('Request the portfolio', 'Solicitar el portafolio')}</Button>
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
                      // a lighter blur on phones: twenty letters blurring at once is heavy for mobile chips
                      hide: { y: '105%', rotateX: -70, opacity: 0, filter: TOUCH ? 'blur(4px)' : 'blur(14px)' },
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
  const [view, setView] = useState<number | null>(null)
  const viewing = useRef(false)
  viewing.current = view !== null

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    lockScroll(true)
    // while the viewer is open, Escape belongs to it
    const key = (e: KeyboardEvent) => e.key === 'Escape' && !viewing.current && onClose()
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      lockScroll(false)
      last?.focus()
    }
  }, [onClose])

  const count = (l: Listing) => {
    const v = l.media.filter((m) => m.kind === 'video').length
    const p = l.media.length - v
    return [
      p > 0 && `${p} ${p === 1 ? t('photo', 'foto') : t('photos', 'fotos')}`,
      v > 0 && `${v} ${v === 1 ? t('film', 'video') : t('films', 'videos')}`,
    ]
      .filter(Boolean)
      .join(' · ')
  }

  const ask = (subject: string) => enquire(t, subject)

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
          <ul className={`mt-14 grid gap-x-8 gap-y-20 border-t border-bone/10 pt-14 md:mt-20 md:pt-20 ${kind.listings.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
            {kind.listings.map((l, i) => (
              <ListingCard
                key={l.name.en}
                listing={l}
                index={i}
                total={kind.listings.length}
                feature={kind.listings.length === 1}
                count={count(l)}
                onView={() => setView(i)}
                onAsk={() => ask(subjectOf(tx, l))}
              />
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

      <AnimatePresence>
        {view !== null && <Viewer key="viewer" listings={kind.listings} start={view} onClose={() => setView(null)} onAsk={(l) => ask(subjectOf(tx, l))} />}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * One property: its cover, and a muted preview of the first film that plays while
 * hovering, or on touch screens while the card is in view. A category with a single property shows it
 * as a feature, image beside the text.
 */
function ListingCard({
  listing: l,
  index,
  total,
  feature,
  count,
  onView,
  onAsk,
}: {
  listing: Listing
  index: number
  total: number
  feature: boolean
  count: string
  onView: () => void
  onAsk: () => void
}) {
  const { t, tx } = useLang()
  const [hover, setHover] = useState(false)
  const film = l.media.find((m) => m.kind === 'video')
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  // on touch screens there is no hover: the preview plays while the card is well in view
  const coverRef = useRef<HTMLButtonElement>(null)
  const inView = useInView(coverRef, { amount: 0.6 })
  const preview = canHover ? hover : inView
  const no = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: easeLuxe, delay: 0.5 + index * 0.1 }}
      className={`group ${feature ? 'grid items-center gap-10 md:grid-cols-12 md:gap-14' : 'flex flex-col'}`}
    >
      <button
        ref={coverRef}
        onClick={onView}
        onPointerEnter={() => canHover && setHover(true)}
        onPointerLeave={() => setHover(false)}
        className={`relative block aspect-[4/5] overflow-hidden bg-smoke text-left ${feature ? 'md:col-span-6 lg:col-span-5' : ''}`}
        aria-label={`${tx(l.name)} — ${t('view photos and films', 'ver fotos y videos')}`}
      >
        <Pic src={l.cover} sizes={feature ? '(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw'}>
        <img
          src={thumb(l.cover)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
        />
        </Pic>
        {film && film.kind === 'video' && preview && (
          <motion.video
            src={film.src}
            poster={film.poster}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/20" />
        {total > 1 && <span className="absolute top-4 left-4 rounded-full bg-ink/50 px-2.5 py-1 font-sans text-[0.65rem] tracking-[0.15em] text-bone/90 backdrop-blur">{no}</span>}
        <span className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 text-[0.6875rem] font-semibold tracking-[0.24em] text-bone uppercase">
          <span>{count}</span>
          <span className="grid size-11 place-items-center rounded-full border border-bone/40 bg-ink/40 backdrop-blur transition-colors duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
            <Play className="ml-0.5 size-3.5" strokeWidth={1.5} />
          </span>
        </span>
      </button>

      <div className={feature ? 'md:col-span-6 lg:col-span-6 lg:col-start-7' : 'mt-6'}>
        <p className="eyebrow text-gold/80">{tx(l.location)}</p>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h4 className={`font-display text-bone ${feature ? 'text-5xl leading-[1.05] md:text-6xl' : 'text-3xl'}`}>{tx(l.name)}</h4>
          {l.price && <span className="shrink-0 text-sm text-gold">{l.price}</span>}
        </div>
        {l.details && <p className={`mt-4 leading-relaxed text-bone/60 ${feature ? 'max-w-lg text-base' : 'text-sm'}`}>{tx(l.details)}</p>}
        <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${feature ? 'mt-10' : 'mt-6 border-t border-bone/10 pt-5'}`}>
          {feature ? (
            <Button onClick={onAsk}>{t('Request information', 'Solicitar información')}</Button>
          ) : (
            <button onClick={onAsk} className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.24em] text-gold uppercase">
              {t('Request information', 'Solicitar información')}
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </button>
          )}
          <button onClick={onView} className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.24em] text-bone/70 uppercase transition-colors hover:text-gold">
            {t('Photos & films', 'Fotos y videos')}
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.li>
  )
}

/**
 * Full-screen photos and films of a category, one at a time. Arrows, the keyboard
 * or a swipe move through every property in turn; the strip jumps straight to one.
 */
function Viewer({ listings, start, onClose, onAsk }: { listings: Listing[]; start: number; onClose: () => void; onAsk: (l: Listing) => void }) {
  const { t, tx } = useLang()
  const slides = listings.flatMap((l) => l.media.map((m) => ({ l, m })))
  const n = slides.length
  const [i, setI] = useState(() => slides.findIndex((x) => x.l === listings[start]))
  const [dir, setDir] = useState(1)
  const step = useCallback(
    (d: number) => {
      setDir(d)
      setI((x) => (x + d + n) % n)
    },
    [n],
  )
  const closeRef = useRef<HTMLButtonElement>(null)
  const { l, m } = slides[i]

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      last?.focus()
    }
  }, [onClose, step])

  const round = 'grid size-11 shrink-0 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={tx(l.name)}
      className="fixed inset-0 z-[130] flex flex-col bg-ink/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10">
        <AnimatePresence mode="wait">
          <motion.div key={l.name.en} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: easeLuxe }} className="min-w-0">
            <p className="truncate font-display text-2xl text-bone md:text-3xl">{tx(l.name)}</p>
            <p className="eyebrow mt-1 truncate text-mineral/60">{tx(l.location)}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex shrink-0 items-center gap-4">
          {n > 1 && (
            <span className="font-sans text-xs text-bone/60" aria-live="polite">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          )}
          <button ref={closeRef} onClick={onClose} className={round} aria-label={t('Close', 'Cerrar')}>
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 md:px-24">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60, filter: 'blur(8px)' }),
              show: { opacity: 1, x: 0, filter: 'blur(0px)' },
              leave: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="show"
            exit="leave"
            transition={{ duration: 0.6, ease: easeLuxe }}
            // swipe on touch screens; the drag snaps back and the gesture picks the direction
            drag={n > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            dragDirectionLock
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) step(1)
              else if (info.offset.x > 60 || info.velocity.x > 400) step(-1)
            }}
            className="flex h-full w-full touch-pan-y items-center justify-center"
          >
            {m.kind === 'video' ? (
              <video src={m.src} poster={m.poster} className="max-h-full max-w-full bg-ink object-contain" autoPlay muted loop playsInline controls preload="metadata" />
            ) : (
              <Pic src={m.src} sizes="100vw" blur={false}>
                <img src={m.src} alt={`${tx(l.name)} — ${i + 1} / ${n}`} className="pointer-events-none max-h-full max-w-full object-contain select-none" decoding="async" draggable={false} />
              </Pic>
            )}
          </motion.div>
        </AnimatePresence>
        {n > 1 && (
          <>
            <button onClick={() => step(-1)} className={`${round} absolute left-2 bg-ink/50 backdrop-blur md:left-8`} aria-label={t('Previous', 'Anterior')}>
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button onClick={() => step(1)} className={`${round} absolute right-2 bg-ink/50 backdrop-blur md:right-8`} aria-label={t('Next', 'Siguiente')}>
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-10">
        {n > 1 ? (
          <div className="flex max-w-full gap-2 overflow-x-auto">
            {slides.map((x, j) => (
              <button
                key={x.m.src}
                onClick={() => {
                  setDir(j > i ? 1 : -1)
                  setI(j)
                }}
                className={`relative h-14 w-10 shrink-0 overflow-hidden border transition-opacity ${j === i ? 'border-gold opacity-100' : 'border-transparent opacity-50 hover:opacity-90'}`}
                aria-label={`${tx(x.l.name)} — ${j + 1} / ${n}`}
                aria-current={j === i || undefined}
              >
                <Pic src={x.m.kind === 'video' ? x.m.poster : x.m.src} sizes="120px">
                  <img src={x.m.kind === 'video' ? x.m.poster : thumb(x.m.src)} alt="" className="h-full w-full object-cover" loading="lazy" />
                </Pic>
                {x.m.kind === 'video' && <Play className="absolute inset-0 m-auto size-3.5 text-bone" strokeWidth={1.5} />}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <Button onClick={() => onAsk(l)}>{t('Request information', 'Solicitar información')}</Button>
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
