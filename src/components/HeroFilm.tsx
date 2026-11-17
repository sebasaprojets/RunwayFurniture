import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../data/site'
import { useLang } from '../i18n'

/**
 * The hero film: the original vertical film (720×1280, its own speed and look, 60 fps), looped
 * seamlessly. Phones and portrait tablets see it full screen; wide screens see it in a full-height
 * panel beside the text, close to its real size (so it stays sharp).
 */

/** Plays on its own while the visitor can see it; rests when scrolled away or in the background. */
function useFilmPlayback(ref: React.RefObject<HTMLVideoElement | null>, active: boolean) {
  const [visible, setVisible] = useState(true)
  const [pageShown, setPageShown] = useState(() => typeof document === 'undefined' || !document.hidden)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    // React sets `muted` only as a property; iOS Safari needs the attribute to allow autoplay
    v.muted = true
    v.defaultMuted = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
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
    if (!(active && visible && pageShown)) {
      v.pause()
      return
    }
    // some phones refuse autoplay (iOS Low Power Mode, data saver): the still image stays, with no
    // play icon, and the film starts by itself on the visitor's first touch, click or key. iOS loads
    // nothing before play() is called, so play() is asked for right away, never after `loadeddata`.
    const gestures = ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'] as const
    const off = () => gestures.forEach((g) => window.removeEventListener(g, retry, true))
    const wait = () => gestures.forEach((g) => window.addEventListener(g, retry, { capture: true, passive: true }))
    const retry = () => {
      v.play().then(off, () => undefined)
    }
    v.play().catch(wait)
    return off
  }, [ref, active, visible, pageShown])
}

/** Wide screens (computers, tablets lying down) give the film its own panel beside the text. */
export function useWide() {
  const q = '(min-width: 1024px) and (min-aspect-ratio: 9/10)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

/**
 * The film fills its box (the whole screen on phones, the panel on wide screens) without being
 * stretched: where the box is wider than the film's shape, `slice` (0–100, from the hero: scroll and
 * pointer) glides the visible part from the horizon down to the pool, with a transform (cheap on the
 * graphics card).
 */
export function HeroBackdrop({ active, slice }: { active: boolean; slice?: MotionValue<number> }) {
  const { tx } = useLang()
  const box = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  useFilmPlayback(ref, active)
  const [playing, setPlaying] = useState(false)
  const [frameH, setFrameH] = useState<number>()
  const over = useMotionValue(0)
  const mid = useMotionValue(50)
  const s = slice ?? mid
  const y = useTransform(() => -over.get() * (s.get() / 100))
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const h = Math.max(height, (width * 16) / 9)
      setFrameH(h)
      over.set(h - height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [over])
  if (!heroVideo) return null
  return (
    <>
      <div ref={box} className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-x-0 top-0 h-full will-change-transform" style={{ y, height: frameH }}>
          <video
            ref={ref}
            src={heroVideo.src}
            className="hero-film absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            aria-hidden
            onPlaying={() => setPlaying(true)}
          />
          {/* the still frame lies over the film (iOS will not start a hidden video) and fades away once it runs */}
          <img
            src={heroVideo.poster}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-0' : 'opacity-100'}`}
            {...{ fetchpriority: 'high' }}
            decoding="async"
          />
        </motion.div>
      </div>
      <p className="sr-only">{tx(heroVideo.alt)}</p>
    </>
  )
}
