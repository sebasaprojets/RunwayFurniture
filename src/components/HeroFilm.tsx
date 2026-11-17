import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../data/site'
import { useLang } from '../i18n'

/**
 * The hero film, full screen on every device (AI-upscaled to 1440×2560, so a 1440px-wide screen
 * shows it at its real size). It plays by itself, with no play icon and no controls: the still
 * frame is an ordinary image, and the film fades in over it only once it is really running.
 */

type Source = { src: string; type: string; media?: string; size?: [number, number]; band?: [number, number] }

/**
 * Picks the file this device decodes smoothly: AV1 only where the device decodes it in hardware
 * (software AV1 made computers and phones stutter), H.264 everywhere else.
 */
async function pickSource(v: HTMLVideoElement): Promise<Source | undefined> {
  if (!heroVideo) return undefined
  const all = heroVideo.sources as Source[]
  // the first group of files whose `media` matches (wide screens, phones, or everyone else)
  const firstMedia = all.find((x) => !x.media || matchMedia(x.media).matches)?.media
  const fits = all.filter((x) => x.media === firstMedia)
  const playable = fits.filter((x) => v.canPlayType(x.type))
  // H.264 is decoded in hardware almost everywhere; AV1 that would be decoded in software is kept
  // only as a last resort (a browser without H.264)
  const fallback = playable.find((x) => !/av01/i.test(x.type)) ?? playable[0] ?? fits[fits.length - 1]
  for (const x of playable) {
    if (!/av01/i.test(x.type)) return x
    try {
      const contentType = x.type.replace(/^video\/mp4;\s*/i, 'video/mp4; ')
      const info = await navigator.mediaCapabilities?.decodingInfo({
        type: 'file',
        video: {
          contentType,
          width: x.size?.[0] ?? 1440,
          height: x.size?.[1] ?? 2560,
          bitrate: 17_000_000,
          framerate: 60,
        },
      })
      if (info?.supported && info.powerEfficient) return x
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
  const [film, setFilm] = useState<Source>()
  const src = film?.src
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
    pickSource(v).then((s) => alive && setFilm(s))
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
  // A computer that cannot keep up with the full-size film (dropped frames) moves, once, to the
  // lighter 1080×1920 cut at the same moment of the film; strong machines keep the full size.
  useEffect(() => {
    const v = ref.current
    if (!v || !src || !heroVideo) return
    // one step lighter: the full-frame film for wide screens, the phone cut for everyone else
    const all = heroVideo.sources as Source[]
    const light = film?.band ? all.find((x) => !x.media && !/av01/i.test(x.type)) : all.find((x) => /max-width/.test(x.media ?? '') && !/av01/i.test(x.type))
    if (!light || src === light.src) return
    // judged only once the page has settled (the first seconds of loading drop frames on any
    // machine), over two 3-second windows in a row; the phone cut is only for real struggles
    const limit = film?.band ? 0.15 : 0.25
    let base: VideoPlaybackQuality | undefined
    let warm = 0
    let strikes = 0
    const id = window.setInterval(() => {
      if (v.paused || document.hidden) return void ((base = undefined), (warm = 0))
      if (++warm <= 5) return
      const q = v.getVideoPlaybackQuality?.()
      if (!q) return window.clearInterval(id)
      if (!base) return void (base = q)
      const total = q.totalVideoFrames - base.totalVideoFrames
      if (total < 150) return
      const dropped = q.droppedVideoFrames - base.droppedVideoFrames
      base = q
      strikes = dropped / total > limit ? strikes + 1 : 0
      if (strikes < 2) return
      window.clearInterval(id)
      const t = v.currentTime
      v.addEventListener('loadedmetadata', () => (v.currentTime = t), { once: true })
      setFilm(light)
    }, 1000)
    return () => window.clearInterval(id)
  }, [ref, src, film])
  return film
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
  const film = useFilmPlayback(ref, active)
  const band = film?.band
  const [playing, setPlaying] = useState(false)
  const [frameH, setFrameH] = useState<number>()
  const over = useMotionValue(0)
  const zero = useMotionValue(50)
  const s = slice ?? zero
  const frame = useMotionValue(0)
  const bandMV = useMotionValue<[number, number] | undefined>(undefined)
  useEffect(() => bandMV.set(band), [band, bandMV])
  // the wide-screen file holds only the band of the frame a wide screen can ever see: the glide
  // stays inside it
  const y = useTransform(() => {
    const o = over.get()
    let top = slice ? o * (s.get() / 100) : o / 2
    const b = bandMV.get()
    const h = frame.get()
    if (b && h) {
      const lo = b[0] * h
      const hi = (b[0] + b[1]) * h - (h - o)
      if (lo <= hi) top = Math.min(hi, Math.max(lo, top))
    }
    return -top
  })
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const h = Math.max(height, (width * 16) / 9)
      setFrameH(h)
      frame.set(h)
      over.set(h - height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [over, frame])
  if (!heroVideo) return null
  return (
    <>
      <div ref={box} className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-x-0 top-0 h-full will-change-transform" style={{ y, height: frameH }}>
          <video
            ref={ref}
            src={film?.src}
            className="hero-film absolute inset-x-0 w-full object-cover"
            style={band ? { top: `${band[0] * 100}%`, height: `${band[1] * 100}%` } : { top: 0, height: '100%' }}
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
