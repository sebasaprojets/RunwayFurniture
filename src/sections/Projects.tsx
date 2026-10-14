import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { categories, projects, type Category, type Project } from '../data/site'
import { easeLuxe } from '../lib/motion'

// Editorial placements — deliberately irregular so the portfolio reads like a magazine spread.
const layout = [
  { cell: 'md:col-span-7', ratio: 'aspect-[4/5] md:aspect-[5/6]' },
  { cell: 'md:col-span-4 md:col-start-9 md:mt-56', ratio: 'aspect-[3/4]' },
  { cell: 'md:col-span-5 md:col-start-2 md:-mt-16', ratio: 'aspect-[4/5]' },
  { cell: 'md:col-span-5 md:col-start-8 md:mt-28', ratio: 'aspect-square' },
  { cell: 'md:col-span-6 md:col-start-3', ratio: 'aspect-[16/11]' },
  { cell: 'md:col-span-3 md:col-start-10 md:mt-40', ratio: 'aspect-[3/4]' },
]

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const used = categories.filter((c) => projects.some((p) => p.category === c))

  return (
    <section id="projects" className="relative bg-ink py-28 md:py-40" aria-labelledby="projects-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="02" label="Signature Projects" />
            <RevealText
              text={'Signature\nprojects'}
              accent={['projects']}
              className="display mt-10 text-[16vw] text-bone uppercase sm:text-[11vw] lg:text-[7vw]"
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-bone/60">
              A selection of resorts, hotels and private residences furnished by Runway across the Caribbean, Europe and the Americas —
              from beachfront terraces to hillside villas.
            </p>
          </div>
        </div>

        <div role="tablist" aria-label="Filter projects by category" className="mt-14 flex gap-2 overflow-x-auto pb-2 md:mt-20 md:flex-wrap">
          {(['All', ...used] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase transition-all duration-500 ${
                filter === c ? 'border-gold bg-gold text-ink' : 'border-bone/15 text-bone/60 hover:border-bone/40 hover:text-bone'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <LayoutGroup>
          <motion.ul layout className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-12 md:gap-y-24">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} onOpen={onOpen} placement={layout[i % layout.length]} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  )
}

function ProjectCard({
  project: p,
  index,
  onOpen,
  placement,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
  placement: (typeof layout)[number]
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.9, ease: easeLuxe, delay: index * 0.05 }}
      className={placement.cell}
    >
      <button onClick={() => onOpen(p)} data-cursor="View" className="group block w-full text-left" aria-label={`Open project: ${p.title}`}>
        <motion.div layoutId={`cover-${p.slug}`} className={`relative overflow-hidden bg-graphite ${placement.ratio}`}>
          <img
            src={p.cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="grade h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
          {p.isConcept && (
            <span className="eyebrow absolute top-4 left-4 rounded-full border border-bone/25 bg-ink/40 px-3 py-1.5 text-[0.6rem] text-bone/80 backdrop-blur-sm">
              Concept study
            </span>
          )}
          <span className="absolute top-4 right-4 grid size-12 scale-75 place-items-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 ease-[var(--ease-luxe)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 max-md:scale-100 max-md:opacity-100">
            <ArrowUpRight className="size-5" strokeWidth={1.25} />
          </span>
          <div className="absolute inset-x-5 bottom-5 overflow-hidden">
            <p className="translate-y-full text-sm text-bone/85 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-y-0 max-md:translate-y-0">
              {p.summary}
            </p>
          </div>
        </motion.div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-gold/80">{p.category}</p>
            <h3 className="mt-2 font-display text-3xl text-bone transition-colors md:text-4xl">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]">
                {p.title}
              </span>
            </h3>
          </div>
          <span className="eyebrow mt-1 shrink-0 text-bone/40">{p.location ?? `N° 0${index + 1}`}</span>
        </div>
      </button>
    </motion.li>
  )
}
