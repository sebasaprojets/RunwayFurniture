import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { categoryLabel, projects, type Project } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function ProjectDetail({ project: p, onClose, onNavigate }: { project: Project; onClose: () => void; onNavigate: (p: Project) => void }) {
  const { t, tx } = useLang()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const next = projects[(projects.indexOf(p) + 1) % projects.length]

  useEffect(() => {
    closeRef.current?.focus()
    panelRef.current?.scrollTo({ top: 0 })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [p, onClose])

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      data-lenis-prevent
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.4 }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-ink/90 to-transparent px-5 py-6 md:px-10">
        <button ref={closeRef} onClick={onClose} className="eyebrow group flex items-center gap-3 text-bone">
          <span className="grid size-10 place-items-center rounded-full border border-bone/25 transition-colors group-hover:border-gold">
            <ArrowLeft className="size-4" strokeWidth={1.25} />
          </span>
          {t('All projects', 'Todos los proyectos')}
        </button>
        {p.isConcept && <span className="eyebrow rounded-full border border-gold/40 px-4 py-2 text-gold">{t('Concept study', 'Estudio conceptual')}</span>}
      </div>

      <header className="mx-auto grid max-w-[1600px] items-end gap-10 px-5 pt-4 md:px-10 lg:grid-cols-12">
        <motion.div
          className="order-2 lg:order-1 lg:col-span-7 lg:pb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeLuxe, delay: 0.35 }}
        >
          <p className="eyebrow text-gold">{tx(categoryLabel[p.category])}</p>
          <h2 id="project-title" className="display mt-4 text-6xl text-bone md:text-8xl xl:text-9xl">
            {p.title}
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-bone/70">{tx(p.summary)}</p>
        </motion.div>
        <motion.div layoutId={`cover-${p.slug}`} className="relative order-1 aspect-[4/5] overflow-hidden lg:order-2 lg:col-span-5 lg:max-h-[82svh]">
          <img src={p.cover} alt={tx(p.summary)} className="grade h-full w-full object-cover" />
        </motion.div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <dl className="grid grid-cols-2 gap-6 border-y border-bone/10 py-8 md:grid-cols-4">
          {[
            [t('Category', 'Categoría'), tx(categoryLabel[p.category])],
            [t('Location', 'Ubicación'), p.location ? tx(p.location) : t('Concept — not a client commission', 'Concepto — no es un encargo de cliente')],
            [t('Scope', 'Alcance'), t('Furniture, FF&E & detailing', 'Mobiliario, FF&E y detalles')],
            [t('Collection', 'Colección'), p.collection ?? 'Runway Furniture'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-mineral/50">{k}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-bone/85">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <FadeIn className="lg:col-span-6">
            <p className="eyebrow text-mineral/50">{t('Concept', 'Concepto')}</p>
            <p className="mt-6 font-display text-3xl leading-snug text-bone md:text-4xl">{tx(p.concept)}</p>
          </FadeIn>
          <FadeIn className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <p className="eyebrow text-mineral/50">{t('Narrative', 'Narrativa')}</p>
            <p className="mt-6 leading-relaxed text-bone/70">{tx(p.narrative)}</p>
            <p className="eyebrow mt-12 text-mineral/50">{t('Furniture', 'Mobiliario')}</p>
            <ul className="mt-4 divide-y divide-bone/10 border-y border-bone/10">
              {p.furniture.map((f, i) => (
                <li key={f.en} className="flex items-baseline gap-5 py-3.5 text-sm text-bone/80">
                  <span className="font-display text-gold italic">{String(i + 1).padStart(2, '0')}</span>
                  {tx(f)}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {p.gallery.length > 0 && (
        <div className="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {p.gallery.map((g, i) => (
            <MaskImage
              key={g + i}
              src={g}
              alt={`${p.title} — ${t('gallery image', 'imagen de galería')} ${i + 1}`}
              className={`aspect-[4/3] ${p.gallery.length % 2 === 1 && i === 0 ? 'sm:col-span-2 sm:aspect-[16/9]' : ''}`}
              from={i % 2 ? 'left' : 'bottom'}
            />
          ))}
        </div>
        )}

        <div className="mt-28 flex flex-col items-start justify-between gap-10 border-t border-bone/10 pt-10 md:flex-row md:items-end">
          <Button
            href="#contact"
            onClick={() => {
              onClose()
              setTimeout(() => scrollToTarget('#contact'), 500)
            }}
          >
            {t('Discuss a similar project', 'Hablemos de un proyecto similar')}
          </Button>
          <button onClick={() => onNavigate(next)} className="group text-right">
            <span className="eyebrow text-mineral/50">{t('Next project', 'Siguiente proyecto')}</span>
            <span className="display mt-2 flex items-center gap-4 text-5xl text-bone transition-colors group-hover:text-gold md:text-7xl">
              {next.title}
              <ArrowRight className="size-8 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1} />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
