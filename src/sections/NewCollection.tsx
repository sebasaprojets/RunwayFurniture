import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { heritage, newPieces, type Piece } from '../data/signature'
import { thumb } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { lockScroll, scrollToTarget } from '../lib/scroll'

/** Ask the contact form to start an enquiry about a piece. */
export const requestQuote = (piece: string) => {
  window.dispatchEvent(new CustomEvent('contact:prefill', { detail: piece }))
  scrollToTarget('#contact')
}

/** Side sheet with the piece photographed full-height, its family and a quote shortcut. */
function PieceSheet({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const { t, tx } = useLang()
  const piece = newPieces[index]
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    lockScroll(true)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      lockScroll(false)
      last?.focus()
    }
  }, [onClose, onStep])

  return (
    <motion.div className="fixed inset-0 z-[120]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <button className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} aria-label={t('Close', 'Cerrar')} tabIndex={-1} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="piece-title"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.8, ease: easeLuxe }}
        className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-graphite md:w-[min(600px,48vw)]"
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-8">
          <p className="eyebrow text-gold">
            {t('New 2026', 'Novedad 2026')} · {String(index + 1).padStart(2, '0')} / {newPieces.length}
          </p>
          <button ref={closeRef} onClick={onClose} className="grid size-11 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink" aria-label={t('Close', 'Cerrar')}>
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={piece.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: easeLuxe }} className="flex flex-1 flex-col">
            <div className="mx-6 overflow-hidden bg-ink md:mx-8">
              <img src={piece.image} alt={`${piece.name} ${tx(piece.type)}`} className="mx-auto max-h-[62svh] w-auto object-contain" decoding="async" />
            </div>
            <div className="flex flex-1 flex-col px-6 pt-8 pb-8 md:px-8">
              <h3 id="piece-title" className="font-display text-5xl text-bone">
                {piece.name}
              </h3>
              <p className="mt-2 text-lg text-bone/60">{tx(piece.type)}</p>
              <dl className="mt-8 grid grid-cols-2 gap-px border-t border-bone/10 text-sm">
                <div className="pt-4">
                  <dt className="eyebrow text-bone/45">{t('Family', 'Familia')}</dt>
                  <dd className="mt-2 text-bone/80">{piece.family}</dd>
                </div>
                <div className="pt-4">
                  <dt className="eyebrow text-bone/45">{t('Collection', 'Colección')}</dt>
                  <dd className="mt-2 text-bone/80">{t('New 2026', 'Novedades 2026')}</dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
                <Button
                  onClick={() => {
                    onClose()
                    // wait for the sheet to slide away and release the scroll lock
                    const name = `${piece.name} ${tx(piece.type)}`
                    window.setTimeout(() => requestQuote(name), 850)
                  }}
                >
                  {t('Request a quote', 'Solicitar cotización')}
                </Button>
                <div className="ml-auto flex gap-2">
                  <button onClick={() => onStep(-1)} className="grid size-11 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink" aria-label={t('Previous piece', 'Pieza anterior')}>
                    <ArrowLeft className="size-4" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => onStep(1)} className="grid size-11 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink" aria-label={t('Next piece', 'Pieza siguiente')}>
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.aside>
    </motion.div>
  )
}

function Card({ piece, i, onOpen }: { piece: Piece; i: number; onOpen: () => void }) {
  const { t, tx } = useLang()
  return (
    <FadeIn delay={(i % 5) * 0.06}>
      <button onClick={onOpen} className="group block w-full text-left" aria-label={`${piece.name} ${tx(piece.type)} — ${t('view details', 'ver ficha')}`}>
        <div className={`relative aspect-[5/7] overflow-hidden ${piece.dark ? 'bg-ink' : 'bg-[#ecebe8]'}`}>
          <img
            src={thumb(piece.image)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
          />
          <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.2em] text-gold uppercase backdrop-blur">
            2026
          </span>
          <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>
        <p className="mt-4 font-display text-2xl text-bone transition-colors group-hover:text-gold">{piece.name}</p>
        <p className="text-sm text-bone/50">{tx(piece.type)}</p>
      </button>
    </FadeIn>
  )
}

/** Thirty years of outdoor living, then the 2026 pieces with a detail sheet each. */
export function NewCollection() {
  const { t, tx } = useLang()
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + newPieces.length) % newPieces.length)), [])
  const img = heritage.images

  return (
    <section id="new-2026" className="relative bg-ink py-28 md:py-40" aria-labelledby="new-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Heritage */}
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <MaskImage src={img.water} alt={t('Gazer pavilion floating on still water', 'Pabellón Gazer sobre agua en calma')} className="aspect-[4/5] lg:col-span-5" from="bottom" parallax={6} />
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow mb-8 text-gold">— {t('Since the 1990s', 'Desde los años 90')}</p>
            <RevealText
              text={t('Inside out,\noutside in.', 'Adentro afuera,\nafuera adentro.')}
              accent={['outside', 'afuera']}
              className="display text-[12vw] text-bone uppercase sm:text-[8vw] lg:text-[4.8vw]"
            />
            <ol className="mt-12 divide-y divide-bone/10 border-y border-bone/10">
              {heritage.milestones.map((m, i) => (
                <FadeIn key={m.year} delay={i * 0.08}>
                  <li className="grid grid-cols-[6.5rem_1fr] items-baseline gap-6 py-6 md:grid-cols-[9rem_1fr]">
                    <span className="display text-4xl text-gold md:text-5xl">{m.year}</span>
                    <span className="text-sm leading-relaxed text-bone/65">{tx(m.text)}</span>
                  </li>
                </FadeIn>
              ))}
            </ol>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {heritage.designers.map((d) => (
                <FadeIn key={d.name}>
                  <p className="font-display text-2xl text-bone italic">{d.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-bone/55">{tx(d.text)}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-28 md:gap-6">
          <MaskImage src={img.beach} alt={t('Bouffi sofa set on the sand', 'Sofás Bouffi sobre la arena')} className="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" />
          <MaskImage src={img.window} alt={t('Chairs facing a desert through a broken wall', 'Sillas frente al desierto a través de un muro')} className="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" delay={0.1} />
          <MaskImage src={img.forest} alt={t('Gazebo among the trees', 'Pérgola entre los árboles')} className="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" delay={0.2} />
        </div>

        {/* New 2026 */}
        <div className="mt-32 grid gap-10 border-t border-bone/10 pt-16 md:mt-44 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="new-title" className="sr-only">
              {t('New for 2026', 'Novedades 2026')}
            </h2>
            <RevealText text={t('New for\n2026.', 'Novedades\n2026.')} accent={['2026.']} className="display text-[14vw] text-bone uppercase sm:text-[9vw] lg:text-[6vw]" />
          </div>
          <FadeIn className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-sm leading-relaxed text-bone/60">
              {t(
                'Woven rope, teak and polished steel — fifteen new pieces for terraces, lobbies and living rooms. Open any piece for its sheet and a direct quote.',
                'Cuerda tejida, teca y acero pulido: quince piezas nuevas para terrazas, lobbies y salones. Abre cualquier pieza para ver su ficha y cotizar.',
              )}
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-5">
          {newPieces.map((piece, i) => (
            <Card key={piece.slug} piece={piece} i={i} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      <AnimatePresence>{open !== null && <PieceSheet key="sheet" index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
