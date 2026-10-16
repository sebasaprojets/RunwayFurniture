import { AnimatePresence, LayoutGroup } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Navigation } from './components/Navigation'
import { Preloader } from './components/Preloader'
import { projects, type Project } from './data/site'
import { useCalmScroll, usePrefersReducedMotion } from './lib/motion'
import { initSmoothScroll, lockScroll, ScrollTrigger } from './lib/scroll'
import { ScrollProgress } from './components/ScrollProgress'
import { CinemaReveal } from './sections/CinemaReveal'
import { Clients } from './sections/Clients'
import { Collections } from './sections/Collections'
import { Films } from './sections/Films'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Founder } from './sections/Founder'
import { FounderFilm } from './sections/FounderFilm'
import { Global } from './sections/Global'
import { Hero } from './sections/Hero'
import { Hospitality } from './sections/Hospitality'
import { ProjectDetail } from './sections/ProjectDetail'
import { Projects } from './sections/Projects'
import { Statement } from './sections/Statement'
import { useLang } from './i18n'

const fromHash = () => {
  const m = window.location.hash.match(/^#\/project\/([\w-]+)/)
  return m ? (projects.find((p) => p.slug === m[1]) ?? null) : null
}

export default function App() {
  const { t } = useLang()
  const reduced = usePrefersReducedMotion()
  const calm = useCalmScroll()
  const [ready, setReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const onReveal = useCallback(() => setRevealed(true), [])
  const [project, setProject] = useState<Project | null>(fromHash)
  const onReady = useCallback(() => setReady(true), [])

  // Native scrolling on touch devices; smooth scroll only with a mouse/trackpad.
  useEffect(() => initSmoothScroll(calm), [calm])

  // Recalculate pinned sections once fonts and images settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Project pages are shareable via #/project/<slug>.
  useEffect(() => {
    const on = () => setProject(fromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  useEffect(() => {
    lockScroll(!!project)
  }, [project])

  const open = (p: Project) => {
    history.pushState(null, '', `#/project/${p.slug}`)
    setProject(p)
  }
  const close = useCallback(() => {
    history.pushState(null, '', window.location.pathname + window.location.search)
    setProject(null)
  }, [])

  return (
    <LayoutGroup>
      <a href="#main" className="sr-only z-[200] rounded bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        {t('Skip to content', 'Saltar al contenido')}
      </a>
      <ScrollProgress />
      <Preloader onDone={onReady} onReveal={onReveal} reduced={reduced} />
      <Navigation ready={ready} />
      <main id="main">
        <Hero ready={ready} revealed={revealed} reduced={reduced} />
        <Statement />
        <CinemaReveal />
        <Projects onOpen={open} />
        <Hospitality />
        <Collections />
        <Founder />
        <FounderFilm />
        <Films />
        <Clients />
        <Global />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>{project && <ProjectDetail key="detail" project={project} onClose={close} onNavigate={open} />}</AnimatePresence>
    </LayoutGroup>
  )
}
