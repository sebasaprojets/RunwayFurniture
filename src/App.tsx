import { AnimatePresence, LayoutGroup } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Navigation } from './components/Navigation'
import { Preloader } from './components/Preloader'
import { projects, type Project } from './data/site'
import { useCalmScroll, usePrefersReducedMotion } from './lib/motion'
import { initSmoothScroll, lockScroll, ScrollTrigger } from './lib/scroll'
import { ScrollProgress } from './components/ScrollProgress'
import { WhatsAppButton } from './components/WhatsAppButton'
import { CinemaReveal } from './sections/CinemaReveal'
import { Elite } from './sections/Elite'
import { Awards } from './sections/Awards'
import { ConceptReality } from './sections/ConceptReality'
import { Factory } from './sections/Factory'
import { Story } from './sections/Story'
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
import { SignatureHotels } from './sections/SignatureHotels'
import { NewCollection } from './sections/NewCollection'
import { OutdoorKitchens } from './sections/OutdoorKitchens'
import { useLang } from './i18n'

const fromHash = () => {
  const m = window.location.hash.match(/^#\/project\/([\w-]+)/)
  return m ? (projects.find((p) => p.slug === m[1]) ?? null) : null
}

export default function App() {
  const { t } = useLang()
  const reduced = usePrefersReducedMotion()
  const calm = useCalmScroll()
  // The opening film plays when someone arrives; reloading or coming back in the same tab goes straight to the site.
  const [intro] = useState(() => {
    try {
      return sessionStorage.getItem('runway-intro') !== '1'
    } catch {
      return true // storage blocked: show the opening
    }
  })
  useEffect(() => {
    try {
      sessionStorage.setItem('runway-intro', '1')
    } catch {
      /* ignore */
    }
  }, [])
  const [ready, setReady] = useState(!intro)
  const [revealed, setRevealed] = useState(!intro)
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
      {intro && <Preloader onDone={onReady} onReveal={onReveal} reduced={reduced} />}
      <Navigation ready={ready} />
      <main id="main">
        <Hero ready={ready} revealed={revealed} reduced={reduced} />
        <Statement />
        <Story />
        <CinemaReveal />
        <Elite />
        <Projects onOpen={open} />
        <Hospitality />
        <ConceptReality />
        <SignatureHotels />
        <Collections />
        <NewCollection />
        <OutdoorKitchens />
        <Factory />
        <Founder />
        <FounderFilm />
        <Films />
        <Awards />
        <Clients />
        <Global />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton ready={ready} />
      <AnimatePresence>{project && <ProjectDetail key="detail" project={project} onClose={close} onNavigate={open} />}</AnimatePresence>
    </LayoutGroup>
  )
}
