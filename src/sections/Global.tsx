import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo'
import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { hotelCountries, hotels } from '../data/signature'
import { brand, thumb } from '../data/site'
import { useLang } from '../i18n'
import { usePrefersReducedMotion } from '../lib/motion'

type Pin = { id: string; name: string; place: string; lat: number; lon: number; image?: string; studio?: boolean }

/** Land and country borders (Natural Earth 1:110m), loaded after first paint. */
async function loadWorld() {
  const [{ feature, mesh }, land, countries] = await Promise.all([
    import('topojson-client'),
    import('world-atlas/land-110m.json'),
    import('world-atlas/countries-110m.json'),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const l = land.default as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = countries.default as any
  return {
    land: feature(l, l.objects.land) as GeoPermissibleObjects,
    borders: mesh(c, c.objects.countries, (a: unknown, b: unknown) => a !== b) as GeoPermissibleObjects,
  }
}

/**
 * A real-world globe: drag to spin it, hover or tap a point for the hotel,
 * or jump to a studio. Pauses whenever it is off screen.
 */
function Globe() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLCanvasElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<Pin | null>(null)
  const api = useRef<{ flyTo: (lat: number, lon: number) => void; pin: () => void } | null>(null)

  const pins: Pin[] = [
    ...brand.offices.map((o) => ({ id: o.city, name: tx(o.cityLabel), place: `${t('Runway studio', 'Estudio Runway')} · ${tx(o.country)}`, lat: o.lat, lon: o.lon, studio: true })),
    ...hotels.map((h) => ({ id: h.slug, name: h.name, place: tx(h.city), lat: h.lat, lon: h.lon, image: thumb(h.image) })),
  ]
  const pinsRef = useRef(pins)
  pinsRef.current = pins
  const activeRef = useRef<Pin | null>(null)
  activeRef.current = active

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const projection = geoOrthographic().clipAngle(90).precision(0.6)
    const path = geoPath(projection, ctx)
    const graticule = geoGraticule10()
    let world: Awaited<ReturnType<typeof loadWorld>> | null = null
    let alive = true
    loadWorld().then((w) => {
      if (!alive) return
      world = w
      draw()
    })

    let dpr = 1
    let W = 0
    let R = 0
    const size = () => {
      dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas.clientWidth * dpr
      canvas.width = W
      canvas.height = W
      R = W * 0.43
      projection.scale(R).translate([W / 2, W / 2])
      draw()
    }

    // rotation state: λ spins around the axis, φ tilts toward the viewer
    let lambda = 60
    let phi = -22
    let vel = 0
    let dragging = false
    let idleUntil = 0
    let fly: { from: [number, number]; to: [number, number]; t0: number } | null = null
    let visible = false
    let raf = 0
    let last = performance.now()
    let tick = 0
    // a point chosen by click or button stays open; hover only previews
    let pinned = false

    const flyTo = (lat: number, lon: number) => {
      fly = { from: [lambda, phi], to: [lambda + (((-lon - lambda) % 360) + 540) % 360 - 180, Math.max(-50, Math.min(50, -lat * 0.85))], t0: performance.now() }
      idleUntil = performance.now() + 7000
      vel = 0
      wake()
    }
    api.current = { flyTo, pin: () => (pinned = true) }

    const screen = (lat: number, lon: number) => {
      const p = projection([lon, lat])!
      const vis = geoDistance([lon, lat], [-lambda, -phi]) < Math.PI / 2 - 0.02
      return { x: p[0], y: p[1], vis }
    }

    const draw = () => {
      if (!W) return
      projection.rotate([lambda, phi])
      const c = W / 2
      ctx.clearRect(0, 0, W, W)

      // atmosphere
      const glow = ctx.createRadialGradient(c, c, R * 0.96, c, c, R * 1.14)
      glow.addColorStop(0, 'rgba(184,154,106,.22)')
      glow.addColorStop(1, 'rgba(184,154,106,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(c, c, R * 1.14, 0, Math.PI * 2)
      ctx.fill()

      // ocean, lit from the upper left
      const sea = ctx.createRadialGradient(c - R * 0.45, c - R * 0.5, R * 0.1, c, c, R)
      sea.addColorStop(0, '#1d1c1a')
      sea.addColorStop(0.7, '#121211')
      sea.addColorStop(1, '#0b0b0b')
      ctx.fillStyle = sea
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.fill()

      ctx.lineWidth = dpr * 0.6
      ctx.strokeStyle = 'rgba(242,240,234,.06)'
      ctx.beginPath()
      path(graticule)
      ctx.stroke()

      if (world) {
        const land = ctx.createRadialGradient(c - R * 0.4, c - R * 0.45, R * 0.05, c, c, R * 1.05)
        land.addColorStop(0, 'rgba(210,190,150,.55)')
        land.addColorStop(0.6, 'rgba(184,154,106,.34)')
        land.addColorStop(1, 'rgba(141,103,72,.22)')
        ctx.fillStyle = land
        ctx.beginPath()
        path(world.land)
        ctx.fill()
        ctx.strokeStyle = 'rgba(214,190,146,.55)'
        ctx.lineWidth = dpr * 0.7
        ctx.stroke()
        ctx.strokeStyle = 'rgba(10,10,10,.45)'
        ctx.lineWidth = dpr * 0.6
        ctx.beginPath()
        path(world.borders)
        ctx.stroke()
      }

      // rim light
      ctx.strokeStyle = 'rgba(184,154,106,.5)'
      ctx.lineWidth = dpr
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.stroke()

      // Montreal → Singapore, lifted off the surface with a travelling highlight
      const [a, b] = brand.offices
      const ip = geoInterpolate([a.lon, a.lat], [b.lon, b.lat])
      const N = 90
      const pts = []
      for (let i = 0; i <= N; i++) {
        const [lon, lat] = ip(i / N)
        const s = screen(lat, lon)
        const lift = 1 + Math.sin((i / N) * Math.PI) * 0.16
        pts.push({ x: c + (s.x - c) * lift, y: c + (s.y - c) * lift, vis: s.vis || Math.sin((i / N) * Math.PI) > 0.35 })
      }
      ctx.lineWidth = dpr * 1.4
      ctx.strokeStyle = 'rgba(185,84,61,.55)'
      ctx.beginPath()
      let pen = false
      for (const p of pts) {
        if (!p.vis) {
          pen = false
          continue
        }
        if (pen) ctx.lineTo(p.x, p.y)
        else ctx.moveTo(p.x, p.y)
        pen = true
      }
      ctx.stroke()
      const head = Math.floor(((tick * 0.004) % 1) * N)
      for (let i = Math.max(0, head - 14); i <= head; i++) {
        const p = pts[i]
        if (!p.vis) continue
        ctx.fillStyle = `rgba(232,140,110,${((i - head + 14) / 14) * 0.9})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, dpr * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // pins
      const pulse = (tick * 0.02) % 1
      const act = activeRef.current
      for (const p of pinsRef.current) {
        const s = screen(p.lat, p.lon)
        if (!s.vis) continue
        const on = act?.id === p.id
        const r = (p.studio ? 4 : 2.6) * dpr * (on ? 1.4 : 1)
        ctx.fillStyle = p.studio ? '#B89A6A' : 'rgba(242,240,234,.9)'
        ctx.beginPath()
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = p.studio ? `rgba(184,154,106,${0.7 - pulse * 0.7})` : `rgba(242,240,234,${0.5 - pulse * 0.5})`
        ctx.lineWidth = dpr
        ctx.beginPath()
        ctx.arc(s.x, s.y, r + pulse * 10 * dpr, 0, Math.PI * 2)
        ctx.stroke()
        if (p.studio && !on) {
          ctx.font = `500 ${Math.round(11 * dpr)}px "Manrope Variable", sans-serif`
          ctx.fillStyle = 'rgba(242,240,234,.9)'
          const left = s.x > c
          ctx.textAlign = left ? 'right' : 'left'
          ctx.fillText(p.name.toUpperCase(), s.x + (left ? -1 : 1) * 12 * dpr, s.y + 4 * dpr)
        }
      }

      // keep the tooltip pinned to its point while the globe turns
      const tip = tipRef.current
      if (tip) {
        if (act) {
          const s = screen(act.lat, act.lon)
          tip.style.opacity = s.vis ? '1' : '0'
          // open toward the globe's centre so the card never leaves the frame
          const cw = W / dpr
          const tw = tip.offsetWidth || 224
          const th = tip.offsetHeight || 120
          const px = s.x / dpr
          const py = s.y / dpr
          let x = px + (s.x > c ? -16 - tw : 16)
          let y = py
          // no room beside the point (phones): sit the card just below or above it
          if (x < 0 || x + tw > cw) {
            x = px - tw / 2
            y = py + 18 + th / 2 + th / 2 + 18 > cw ? py - 18 - th / 2 : py + 18 + th / 2
          }
          x = Math.max(4, Math.min(cw - tw - 4, x))
          y = Math.max(th / 2 + 4, Math.min(cw - th / 2 - 4, y))
          tip.style.transform = `translate(${x}px, ${y}px)`
        } else tip.style.opacity = '0'
      }
    }

    const loop = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      tick += dt / 16.7
      if (fly) {
        const k = Math.min(1, (now - fly.t0) / 1400)
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
        lambda = fly.from[0] + (fly.to[0] - fly.from[0]) * e
        phi = fly.from[1] + (fly.to[1] - fly.from[1]) * e
        if (k === 1) fly = null
      } else if (!dragging) {
        if (Math.abs(vel) > 0.01) {
          lambda += vel * (dt / 16.7)
          vel *= Math.pow(0.94, dt / 16.7)
        } else if (now > idleUntil && !reduced) {
          lambda += 0.05 * (dt / 16.7)
          phi += (-22 - phi) * 0.01
        }
      }
      draw()
      if (visible) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      if (!visible) {
        draw()
        return
      }
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    // pointer: drag to spin, hover/tap to pick a point
    let sx = 0
    let sy = 0
    let px = 0
    let moved = 0
    const pick = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * dpr
      const y = (e.clientY - r.top) * dpr
      let best: Pin | null = null
      let bd = (e.pointerType === 'touch' ? 22 : 14) * dpr
      for (const p of pinsRef.current) {
        const s = screen(p.lat, p.lon)
        if (!s.vis) continue
        const d = Math.hypot(s.x - x, s.y - y)
        if (d < bd) {
          bd = d
          best = p
        }
      }
      return best
    }
    const down = (e: PointerEvent) => {
      dragging = true
      moved = 0
      sx = px = e.clientX
      sy = e.clientY
      fly = null
      vel = 0
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - px
        px = e.clientX
        moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy))
        const k = 120 / (R / dpr)
        lambda += dx * k
        phi = Math.max(-60, Math.min(60, phi - e.movementY * k))
        vel = dx * k
        idleUntil = performance.now() + 4000
        if (!visible) draw()
        return
      }
      if (e.pointerType === 'mouse') {
        const p = pick(e)
        canvas.style.cursor = p ? 'pointer' : 'grab'
        if (p) setActive(p)
        else if (!pinned) setActive(null)
      }
    }
    const up = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      canvas.style.cursor = 'grab'
      if (moved < 6) {
        const p = pick(e)
        pinned = !!p
        setActive(p)
        if (p) flyTo(p.lat, p.lon)
      }
    }
    const leave = () => {
      if (!dragging && !pinned) setActive(null)
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', () => (dragging = false))
    canvas.addEventListener('pointerleave', leave)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden
      cancelAnimationFrame(raf)
      if (visible) wake()
    })
    io.observe(canvas)
    const onVis = () => {
      visible = !document.hidden && visible
      if (document.hidden) cancelAnimationFrame(raf)
    }
    document.addEventListener('visibilitychange', onVis)
    const ro = new ResizeObserver(size)
    ro.observe(canvas)
    size()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointerleave', leave)
      api.current = null
    }
  }, [reduced])

  const go = (p: Pin) => {
    setActive(p)
    api.current?.pin()
    api.current?.flyTo(p.lat, p.lon)
  }

  return (
    <div>
      <div className="relative">
        <canvas
          ref={ref}
          className="aspect-square w-full cursor-grab touch-pan-y select-none"
          role="img"
          aria-label={t('Interactive globe showing Runway studios in Montreal and Singapore and the signature hotels', 'Globo interactivo con los estudios de Runway en Montreal y Singapur y los hoteles emblemáticos')}
        />
        <div ref={tipRef} className="pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity duration-300" aria-hidden={!active}>
          {active && (
            <div className="w-56 -translate-y-1/2 overflow-hidden border border-bone/15 bg-ink/90 shadow-2xl backdrop-blur-md">
              {active.image && <img src={active.image} alt="" className="aspect-[16/10] w-full object-cover" />}
              <div className="px-4 py-3">
                <p className="font-display text-xl leading-tight text-bone">{active.name}</p>
                <p className="eyebrow mt-1 text-gold/80">{active.place}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {pins
          .filter((p) => p.studio)
          .map((p) => (
            <button
              key={p.id}
              onClick={() => go(p)}
              className={`rounded-full border px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase transition-colors ${
                active?.id === p.id ? 'border-gold bg-gold text-ink' : 'border-bone/20 text-bone/80 hover:border-gold hover:text-bone'
              }`}
            >
              {p.name}
            </button>
          ))}
        <span className="eyebrow ml-auto text-mineral/50">{t('Drag to explore · tap a point', 'Arrastra para explorar · toca un punto')}</span>
      </div>
    </div>
  )
}

export function Global() {
  const { t, tx } = useLang()
  return (
    <section className="relative overflow-hidden border-t border-bone/10 bg-ink py-28 md:py-36" aria-labelledby="global-title">
      <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RevealText text={t('Montreal.\nSingapore.\nWorldwide.', 'Montreal.\nSingapur.\nTodo el mundo.')} accent={['Worldwide.', 'Todo', 'el', 'mundo.']} className="display text-[14vw] text-bone uppercase sm:text-[9vw] lg:text-[5.6vw]" />
          <FadeIn>
            <ul className="mt-12 grid grid-cols-2 gap-px border-t border-bone/10 sm:grid-cols-3">
              {brand.regions.map((r) => (
                <li key={r.en} className="border-b border-bone/10 py-4 font-display text-2xl text-bone/80">
                  {tx(r)}
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-4 text-sm text-bone/60">
              <span className="inline-block size-2 rounded-full bg-gold" /> {t('Studios', 'Estudios')}
              <span className="ml-4 inline-block size-2 rounded-full bg-bone/75" /> {t(`Signature hotels · ${hotels.length} shown, 50+ in ${hotelCountries} countries`, `Hoteles emblemáticos · ${hotels.length} en el mapa, más de 50 en ${hotelCountries} países`)}
            </p>
          </FadeIn>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Globe />
        </div>
      </div>
    </section>
  )
}
