import { motion, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { heroVideo } from '../data/site'
import { useLang } from '../i18n'

/**
 * The hero film, full screen on every device (AI-upscaled to 1440×2560, so a 1440px-wide screen
 * shows it at its real size). One pause control stops it (anything moving longer than 5 s must be
 * stoppable).
 */

// ── shared pause state ────────────────────────────────────────────────────────────────────────
let paused = false
const subs = new Set<() => void>()
const setPaused = (v: boolean) => {
  paused = v
  subs.forEach((f) => f())
}
const usePaused = () =>
  useSyncExternalStore(
    (f) => (subs.add(f), () => void subs.delete(f)),
    () => paused,
    () => paused,
  )

/**
 * Plays on its own while the visitor can see it; rests when the hero is scrolled away, the tab or
 * app is in the background, or the visitor paused it (saves battery and data on phones).
 */
function useFilmPlayback(ref: React.RefObject<HTMLVideoElement | null>, active: boolean) {
  const isPaused = usePaused()
  const [visible, setVisible] = useState(true)
  const [pageShown, setPageShown] = useState(() => typeof document === 'undefined' || !document.hidden)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    // React sets `muted` only as a property; iOS Safari needs the attribute to allow autoplay
    v.muted = true
    v.defaultMuted = true
    v.setAttribute('muted', '')
    // rests once less than a sliver of the film is on screen
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio >= 0.08), {
      threshold: [0, 0.08, 0.2],
    })
    io.observe(v)
    const onVis = () => setPageShown(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ref])
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (!(active && visible && pageShown && !isPaused)) {
      v.pause()
      return
    }
    // some phones refuse autoplay (iOS Low Power Mode, data saver): the still frame stays, with no
    // play icon, and the film starts by itself on the visitor's first touch, click or key
    const gestures = ['touchend', 'pointerup', 'click', 'keydown'] as const
    const retry = () => {
      off()
      v.play().catch(() => undefined)
    }
    const off = () => gestures.forEach((g) => window.removeEventListener(g, retry, true))
    v.play().catch(() => gestures.forEach((g) => window.addEventListener(g, retry, { capture: true, passive: true })))
    return off
  }, [ref, active, visible, pageShown, isPaused])
}

/**
 * The film, full screen on every device. Wide screens see a horizontal slice of the vertical film:
 * `position` (from the hero) glides that slice from the horizon down to the pool as the visitor
 * scrolls, and leans a little towards the cursor.
 */
export function HeroBackdrop({ active, position }: { active: boolean; position?: MotionValue<string> }) {
  const { tx } = useLang()
  const ref = useRef<HTMLVideoElement>(null)
  useFilmPlayback(ref, active)
  if (!heroVideo) return null
  return (
    <>
      <motion.video
        ref={ref}
        className="hero-film absolute inset-0 h-full w-full object-cover"
        style={position ? { objectPosition: position } : undefined}
        poster={heroVideo.poster}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
      >
        {heroVideo.sources.map((x) => (
          <source key={x.src} src={x.src} type={x.type} media={x.media} />
        ))}
      </motion.video>
      <p className="sr-only">{tx(heroVideo.alt)}</p>
    </>
  )
}

/** Pause / play every copy of the film. */
export function FilmPause({ className = '' }: { className?: string }) {
  const { t } = useLang()
  const isPaused = usePaused()
  return (
    <button
      type="button"
      onClick={() => setPaused(!isPaused)}
      aria-pressed={isPaused}
      aria-label={isPaused ? t('Play the film', 'Reproducir la película') : t('Pause the film', 'Pausar la película')}
      className={`grid size-11 place-items-center rounded-full border border-bone/30 bg-ink/40 text-bone backdrop-blur-sm transition-[background-color,transform] duration-300 hover:bg-ink/70 active:scale-95 ${className}`}
    >
      {isPaused ? (
        <svg viewBox="0 0 10 10" className="ml-0.5 size-2.5 fill-current" aria-hidden>
          <path d="M2 1l7 4-7 4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 10 10" className="size-2.5 fill-current" aria-hidden>
          <path d="M2 1h2v8H2zM6 1h2v8H6z" />
        </svg>
      )}
    </button>
  )
}
