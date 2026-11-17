import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../data/site'
import { useLang } from '../i18n'

/**
 * The hero film, full screen on every device (AI-upscaled to 1440×2560, so a 1440px-wide screen
 * shows it at its real size). It plays by itself, with no play icon and no controls: the still
 * frame is an ordinary image, and the film fades in over it only once it is really running.
 */

type Source = { src: string; type: string; media?: string }

/**
 * Picks the file this device decodes smoothly: AV1 only where the device decodes it in hardware
 * (software AV1 made computers and phones stutter), H.264 everywhere else.
 */
async function pickSource(v: HTMLVideoElement): Promise<string | undefined> {
  if (!heroVideo) return undefined
  const fits = (heroVideo.sources as Source[]).filter((x) => !x.media || matchMedia(x.media).matches)
  const small = matchMedia('(max-width: 767px)').matches
  const playable = fits.filter((x) => v.canPlayType(x.type))
  // H.264 is decoded in hardware almost everywhere; AV1 that would be decoded in software is kept
  // only as a last resort (a browser without H.264)
  const fallback = (playable.find((x) => !/av01/i.test(x.type)) ?? playable[0] ?? fits[fits.length - 1])?.src
  for (const x of playable) {
    if (!/av01/i.test(x.type)) return x.src
    try {
      const contentType = x.type.replace(/^video\/mp4;\s*/i, 'video/mp4; ')
      const info = await navigator.mediaCapabilities?.decodingInfo({
        type: 'file',
        video: {
          contentType,
          width: small ? 1080 : 1440,
          height: small ? 1920 : 2560,
          bitrate: small ? 7_300_000 : 10_900_000,
          framerate: 24,
        },
      })
      if (info?.supported && info.powerEfficient) return x.src
    } catch {
      /* unknown: fall through to H.264 */
    }
  }
  return fallback
}

/**
 * Plays on its own while the visitor can see it; rests when the hero is scrolled away or the tab or
 * app is in the background (saves battery and data on phones).
 */
function useFilmPlayback(ref: React.RefObject<HTMLVideoElement | null>, active: boolean) {
  const [src, setSrc] = useState<string>()
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
    let alive = true
    pickSource(v).then((s) => alive && setSrc(s))
    // rests once less than a sliver of the film is on screen
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio >= 0.08), {
      threshold: [0, 0.08, 0.2],
    })
    io.observe(v)
    const onVis = () => setPageShown(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      alive = false
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ref])
  useEffect(() => {
    const v = ref.current
    if (!v || !src) return
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
  }, [ref, src, active, visible, pageShown])
  return src
}

/**
 * The film, full screen on every device. Wide screens see a horizontal slice of the vertical film:
 * `slice` (0–100, from the hero) glides that slice from the horizon down to the pool as the visitor
 * scrolls. It moves the film with a transform (cheap on the graphics card) instead of re-cropping
 * the video every frame.
 */
export function HeroBackdrop({ active, slice }: { active: boolean; slice?: MotionValue<number> }) {
  const { tx } = useLang()
  const box = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const src = useFilmPlayback(ref, active)
  const [playing, setPlaying] = useState(false)
  const [frameH, setFrameH] = useState<number>()
  const over = useMotionValue(0)
  const zero = useMotionValue(50)
  const s = slice ?? zero
  const y = useTransform(() => (slice ? -over.get() * (s.get() / 100) : -over.get() / 2))
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
            src={src}
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
          <img src={heroVideo.poster} alt="" aria-hidden className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-0' : 'opacity-100'}`} {...{ fetchpriority: 'high' }} decoding="async" />
        </motion.div>
      </div>
      <p className="sr-only">{tx(heroVideo.alt)}</p>
    </>
  )
}
