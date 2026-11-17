import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../data/site'
import { useLang } from '../i18n'

/**
 * The hero film: the original vertical film (720×1280, 24 fps, its own speed and look), looped
 * seamlessly. Phones and portrait tablets see it full screen. Wider screens see the whole film, sharp,
 * at full height in the middle, over a soft, blurred copy of itself that fills the rest of the screen
 * (a vertical film is never stretched or cropped to a slice).
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

/** Screens wider than tall-ish show the whole film in the middle; narrower ones fill with it. */
function useWide() {
  const q = '(min-aspect-ratio: 9/10)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

const muteProps = {
  muted: true,
  loop: true,
  playsInline: true,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  controls: false,
  'aria-hidden': true,
} as const

/**
 * The film. On wide screens `slice` (0–100, from the hero: scroll and pointer) lets the film drift
 * a little against its blurred surround.
 */
export function HeroBackdrop({ active, slice }: { active: boolean; slice?: MotionValue<number> }) {
  const { tx } = useLang()
  const ref = useRef<HTMLVideoElement>(null)
  const amb = useRef<HTMLVideoElement>(null)
  const wide = useWide()
  useFilmPlayback(ref, active)
  const [playing, setPlaying] = useState(false)
  const zero = useMotionValue(70)
  const y = useTransform(slice ?? zero, (s) => `${((s - 70) / 28) * -2.5}%`)

  // the blurred surround follows the film: plays, rests and keeps time with it
  useEffect(() => {
    const v = ref.current
    const a = amb.current
    if (!v || !a || !wide) return
    a.muted = true
    const sync = () => {
      if (Math.abs(a.currentTime - v.currentTime) > 0.2) a.currentTime = v.currentTime
    }
    const play = () => {
      sync()
      a.play().catch(() => undefined)
    }
    const pause = () => a.pause()
    v.addEventListener('playing', play)
    v.addEventListener('pause', pause)
    v.addEventListener('seeked', sync)
    const id = window.setInterval(sync, 2000)
    if (!v.paused) play()
    return () => {
      v.removeEventListener('playing', play)
      v.removeEventListener('pause', pause)
      v.removeEventListener('seeked', sync)
      window.clearInterval(id)
    }
  }, [wide])

  if (!heroVideo) return null
  const still = (
    <img
      src={heroVideo.poster}
      alt=""
      aria-hidden
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-0' : 'opacity-100'}`}
      {...{ fetchpriority: 'high' }}
      decoding="async"
    />
  )
  const film = (
    <video
      ref={ref}
      src={heroVideo.src}
      className="hero-film absolute inset-0 h-full w-full object-cover"
      preload="auto"
      onPlaying={() => setPlaying(true)}
      {...muteProps}
    />
  )
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {wide ? (
          <>
            {/* the surround: a tiny copy of the film, scaled up (soft by nature, no live blur filter) */}
            <video
              ref={amb}
              src={heroVideo.ambient}
              className="absolute inset-[-6%] h-[112%] w-[112%] object-cover opacity-60 saturate-[1.1]"
              preload="auto"
              {...muteProps}
            />
            <div className="absolute inset-0 bg-ink/35" />
            {/* the whole film, sharp, full height; its sides melt into the surround */}
            <motion.div
              className="absolute top-1/2 left-1/2 aspect-[9/16] h-[108%] -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent),linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)] [mask-composite:intersect]"
              style={{ y }}
            >
              {film}
              {still}
            </motion.div>
          </>
        ) : (
          <>
            {film}
            {still}
          </>
        )}
      </div>
      <p className="sr-only">{tx(heroVideo.alt)}</p>
    </>
  )
}
