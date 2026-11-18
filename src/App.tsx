import { AnimatePresence, LayoutGroup } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigation } from './components/Navigation'
import { Preloader } from './components/Preloader'
import { picReady } from './components/Pic'
import { projects, type Project } from './data/site'
import { useCalmScroll, usePrefersReducedMotion } from './lib/motion'
import { initSmoothScroll, lockScroll, restorePlace, ScrollTrigger } from './lib/scroll'
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
import { LiveDifferent } from './sections/LiveDifferent'
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
  const { t, lang } = useLang()
  const reduced = usePrefersReducedMotion()
  const calm = useCalmScroll()
  // The opening film plays every time someone opens the site; it is skipped only when the page is
  // reloaded (or reached with the browser's back/forward buttons).
  const [intro] = useState(() => {
    const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined
    return !nav || (nav.type !== 'reload' && nav.type !== 'back_forward')
  })
  const [ready, setReady] = useState(!intro)
  // During the opening film only the hero is built: the rest of the site (and its photos) waits until
  // the camera comes to rest, so the film downloads and plays without competing for the connection.
  // (and the photo table is in, so every photo is requested in its light version from the start)
  const [rest, setRest] = useState(false)
  const onSettle = useCallback(() => void picReady.then(() => setRest(true)), [])
  useEffect(() => {
    if (!intro) void picReady.then(() => setRest(true))
  }, [intro])
  // The rest of the site is built one section at a time, in the browser's idle moments: building it
  // all at once froze the page for up to a second just as the opening film began (longer on modest
  // phones and computers). A link to a section, or a visitor racing ahead, builds the rest at once.
  const [built, setBuilt] = useState(0)
  const total = 20
  useEffect(() => {
    if (!rest || built >= total) return
    if (built === 0 && /^#(?!\/)./.test(location.hash)) return void setBuilt(total)
    const all = () => setBuilt(total)
    const ahead = () => {
      if (window.scrollY + innerHeight * 2.5 > document.documentElement.scrollHeight) all()
    }
    window.addEventListener('site:build-all', all)
    window.addEventListener('scroll', ahead, { passive: true })
    const next = () => setBuilt((n) => Math.min(total, n + 1))
    // Safari has no idle callback: a short pause between sections instead
    const ric = 'requestIdleCallback' in window
    const id = ric ? window.requestIdleCallback(next, { timeout: 350 }) : window.setTimeout(next, 60)
    return () => {
      if (ric) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
      window.removeEventListener('site:build-all', all)
      window.removeEventListener('scroll', ahead)
    }
  }, [rest, built])
  // pinned scenes are measured once the whole page stands
  useEffect(() => {
    if (built < total) return
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [built])
  const [revealed, setRevealed] = useState(!intro)
  const onReveal = useCallback(() => setRevealed(true), [])
  const [project, setProject] = useState<Project | null>(fromHash)
  const onReady = useCallback(() => setReady(true), [])

  // Native scrolling on touch devices; smooth scroll only with a mouse/trackpad.
  useEffect(() => initSmoothScroll(calm), [calm])

  // A language switch changes the length of every text and rebuilds the founder's film: re-measure the
  // pinned scenes so each one starts only after the previous has finished, never on top of it.
  const firstLang = useRef(true)
  useEffect(() => {
    if (firstLang.current) return void (firstLang.current = false)
    // the rebuilt film is newest in GSAP's list: put the scenes back in page order before measuring
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      // and the visitor stays on the part of the page they were reading
      restorePlace()
    })
    return () => cancelAnimationFrame(id)
  }, [lang])

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

  const parts = [
    <Statement key="statement" />,
    <Story key="story" />,
    <CinemaReveal key="cinema" />,
    <Elite key="elite" />,
    <Projects key="projects" onOpen={open} />,
    <Hospitality key="hospitality" />,
    <ConceptReality key="concept" />,
    <SignatureHotels key="hotels" />,
    <Collections key="collections" />,
    <NewCollection key="new" />,
    <OutdoorKitchens key="kitchens" />,
    <Factory key="factory" />,
    <Founder key="founder" />,
    <FounderFilm key="founder-film" />,
    <LiveDifferent key="live" />,
    <Films key="films" />,
    <Awards key="awards" />,
    <Clients key="clients" />,
    <Global key="global" />,
    <Contact key="contact" />,
  ]

  return (
    <LayoutGroup>
      <a href="#main" className="sr-only z-[200] rounded bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        {t('Skip to content', 'Saltar al contenido')}
      </a>
      <ScrollProgress />
      {intro && <Preloader onDone={onReady} onReveal={onReveal} onSettle={onSettle} reduced={reduced} />}
      <Navigation ready={ready} />
      <main id="main">
        <Hero ready={ready} revealed={revealed} reduced={reduced} />
        {parts.slice(0, built)}
      </main>
      {built >= parts.length && <Footer />}
      <WhatsAppButton ready={ready} />
      <AnimatePresence>{project && <ProjectDetail key="detail" project={project} onClose={close} onNavigate={open} />}</AnimatePresence>
    </LayoutGroup>
  )
}
