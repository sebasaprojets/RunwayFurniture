import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Pic } from '../components/Pic'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { RevealText } from '../components/RevealText'
import { categories, categoryLabel, projects, thumb, type Category, type Project } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { jumpBy, ScrollTrigger } from '../lib/scroll'

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { t, tx } = useLang()
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [showAll, setShowAll] = useState(false)
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const INITIAL = 9
  const list = showAll ? filtered : filtered.slice(0, INITIAL)

  useEffect(() => {
    const on = (e: Event) => setFilter((e as CustomEvent<Category>).detail)
    window.addEventListener('projects:filter', on)
    return () => window.removeEventListener('projects:filter', on)
  }, [])

  // "Show fewer" removes most of the grid at once: the button stays exactly where it was on screen
  // (the page moves up with it instead of dropping the visitor far below), then every pinned scene
  // further down is re-measured straight away and once more when the cards have settled.
  const more = useRef<HTMLButtonElement>(null)
  const anchor = useRef<number | null>(null)
  const [collapsing, setCollapsing] = useState(false)
  const toggle = () => {
    if (showAll) {
      anchor.current = more.current?.getBoundingClientRect().top ?? null
      setCollapsing(true)
    } else setCollapsing(false)
    setShowAll((v) => !v)
  }
  useLayoutEffect(() => {
    let raf = 0
    const target = anchor.current
    anchor.current = null
    // the removed cards leave the page a frame or two later: follow the button until it has moved,
    // then hold it in place for a few frames, then re-measure the scenes below
    let frames = 0
    let settled = -1
    const follow = () => {
      if (target !== null && more.current) {
        const d = more.current.getBoundingClientRect().top - target
        if (Math.abs(d) > 1) {
          jumpBy(d)
          settled = frames
        }
      }
      frames++
      if (target !== null && frames < 60 && (settled < 0 || frames - settled < 6)) raf = requestAnimationFrame(follow)
      else ScrollTrigger.refresh()
    }
    raf = requestAnimationFrame(follow)
    const id = setTimeout(() => ScrollTrigger.refresh(), 1000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(id)
    }
  }, [showAll, filter])
  const used = categories.filter((c) => projects.some((p) => p.category === c))

  return (
    <section id="projects" className="relative bg-ink py-28 md:py-40" aria-labelledby="projects-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <RevealText
              text={t('Signature\nprojects', 'Proyectos\nemblemáticos')}
              accent={['projects', 'emblemáticos']}
              className="display text-[16vw] text-bone uppercase sm:text-[11vw] lg:text-[7vw]"
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-xl text-sm leading-relaxed text-bone/60">
              {t(
                'A selection of resorts, hotels and private residences furnished by Runway across the Caribbean, Europe and the Americas — from beachfront terraces to hillside villas.',
                'Una selección de resorts, hoteles y residencias privadas amueblados por Runway en el Caribe, Europa y las Américas: desde terrazas frente al mar hasta villas en la ladera.',
              )}
            </p>
          </div>
        </div>

        <div role="tablist" aria-label={t('Filter projects by category', 'Filtrar proyectos por categoría')} className="mt-14 flex gap-2 overflow-x-auto pb-2 md:mt-20 md:flex-wrap">
          {(['All', ...used] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => {
                setCollapsing(false)
                setFilter(c)
              }}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase transition-all duration-500 ${
                filter === c ? 'border-gold bg-gold text-ink' : 'border-bone/15 text-bone/60 hover:border-bone/40 hover:text-bone'
              }`}
            >
              {c === 'All' ? t('All', 'Todos') : tx(categoryLabel[c])}
            </button>
          ))}
        </div>

        <LayoutGroup>
          <motion.ul layout className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
            {/* collapsing, the extra cards leave at once: nothing floats over the sections below */}
            <AnimatePresence mode="popLayout" custom={collapsing}>
              {list.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} onOpen={onOpen} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {filtered.length > INITIAL && (
          <div className="mt-16 flex justify-center md:mt-20">
            <button
              ref={more}
              onClick={toggle}
              aria-expanded={showAll}
              className="rounded-full border border-bone/25 px-8 py-4 text-[0.6875rem] font-semibold tracking-[0.24em] text-bone uppercase transition-colors duration-500 hover:border-gold hover:text-gold"
            >
              {showAll ? t('Show fewer projects', 'Ver menos proyectos') : `${t('View all projects', 'Ver todos los proyectos')} (${filtered.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({
  project: p,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const { t, tx } = useLang()
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      variants={{ exit: (instant?: boolean) => (instant ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.96 }) }}
      exit="exit"
      transition={{ duration: 0.9, ease: easeLuxe, delay: (index % 3) * 0.06 }}
    >
      <button onClick={() => onOpen(p)} className="group block w-full text-left" aria-label={`${t('Open project', 'Abrir proyecto')}: ${p.title}`}>
        <motion.div layoutId={`cover-${p.slug}`} className="relative aspect-[4/3] overflow-hidden bg-graphite">
          <Pic src={p.cover} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw">
          <img
            src={thumb(p.cover)}
            alt=""
            loading="lazy"
            decoding="async"
            className="grade h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
          />
          </Pic>
          <div className="absolute inset-0 hidden bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:block" />
          {p.isConcept && (
            <span className="eyebrow absolute top-4 left-4 rounded-full border border-bone/25 bg-ink/40 px-3 py-1.5 text-[0.6875rem] text-bone/80 backdrop-blur-sm">
              {t('Concept study', 'Estudio conceptual')}
            </span>
          )}
          <span className="absolute top-4 right-4 grid size-12 scale-75 place-items-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 ease-[var(--ease-luxe)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 max-md:scale-100 max-md:opacity-100">
            <ArrowUpRight className="size-5" strokeWidth={1.25} />
          </span>
          <div className="absolute inset-x-5 bottom-5 hidden overflow-hidden md:block">
            <p className="translate-y-full text-sm text-bone/90 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-y-0">
              {tx(p.summary)}
            </p>
          </div>
        </motion.div>
        <div className="mt-5">
          <div>
            <p className="eyebrow text-gold/80">{tx(categoryLabel[p.category])}</p>
            <h3 className="mt-2 font-display text-3xl text-bone transition-colors">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]">
                {p.title}
              </span>
            </h3>
          </div>
          {p.location && <p className="mt-2 text-sm text-bone/50">{tx(p.location)}</p>}
        </div>
      </button>
    </motion.li>
  )
}
