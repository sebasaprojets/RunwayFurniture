import { useEffect, useRef } from 'react'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { brand } from '../data/site'
import { useLang } from '../i18n'
import { usePrefersReducedMotion } from '../lib/motion'

const DEG = Math.PI / 180

/** Wireframe globe (orthographic projection) with the two studios and the arc connecting them. */
function Globe() {
  const { t, tx } = useLang()
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let rot = 60
    let visible = false
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    size()
    window.addEventListener('resize', size)

    const project = (lat: number, lon: number, R: number, cx: number, cy: number) => {
      const tilt = 28 * DEG
      const l = (lon + rot) * DEG
      const p = lat * DEG
      const x = Math.cos(p) * Math.sin(l)
      let y = Math.sin(p)
      let z = Math.cos(p) * Math.cos(l)
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
      z = y * Math.sin(tilt) + z * Math.cos(tilt)
      y = y2
      return { x: cx + x * R, y: cy - y * R, z }
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const R = Math.min(w, h) * 0.42
      const cx = w / 2
      const cy = h / 2
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = Math.max(1, w / 900)

      const line = (pts: { x: number; y: number; z: number }[], color: string) => {
        ctx.beginPath()
        let pen = false
        for (const p of pts) {
          if (p.z < 0) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(p.x, p.y)
          else ctx.moveTo(p.x, p.y)
          pen = true
        }
        ctx.strokeStyle = color
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(184,154,106,.45)'
      ctx.stroke()

      for (let lat = -75; lat <= 75; lat += 15) {
        const pts = []
        for (let lon = -180; lon <= 180; lon += 4) pts.push(project(lat, lon, R, cx, cy))
        line(pts, 'rgba(242,240,234,.10)')
      }
      for (let lon = -180; lon < 180; lon += 20) {
        const pts = []
        for (let lat = -90; lat <= 90; lat += 4) pts.push(project(lat, lon, R, cx, cy))
        line(pts, 'rgba(242,240,234,.10)')
      }

      // great-circle arc Montreal → Singapore (via slerp)
      const [a, b] = brand.offices
      const toVec = (lat: number, lon: number) => [Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG)]
      const va = toVec(a.lat, a.lon)
      const vb = toVec(b.lat, b.lon)
      const omega = Math.acos(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])
      const arc = []
      for (let i = 0; i <= 80; i++) {
        const t = i / 80
        const s1 = Math.sin((1 - t) * omega) / Math.sin(omega)
        const s2 = Math.sin(t * omega) / Math.sin(omega)
        const v = [va[0] * s1 + vb[0] * s2, va[1] * s1 + vb[1] * s2, va[2] * s1 + vb[2] * s2]
        const lift = 1 + Math.sin(t * Math.PI) * 0.12
        const p = project(Math.asin(v[2]) * (180 / Math.PI), Math.atan2(v[1], v[0]) * (180 / Math.PI), R * lift, cx, cy)
        arc.push(p)
      }
      ctx.lineWidth = Math.max(1.5, w / 500)
      line(arc, 'rgba(185,84,61,.85)')

      for (const o of brand.offices) {
        const p = project(o.lat, o.lon, R, cx, cy)
        if (p.z < 0) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, R * 0.018, 0, Math.PI * 2)
        ctx.fillStyle = '#B89A6A'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, R * 0.045, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(184,154,106,.5)'
        ctx.stroke()
        ctx.font = `${Math.round(R * 0.055)}px Manrope Variable, sans-serif`
        ctx.fillStyle = 'rgba(242,240,234,.85)'
        const left = p.x > cx
        ctx.textAlign = left ? 'right' : 'left'
        ctx.fillText(tx(o.cityLabel).toUpperCase(), p.x + (left ? -1 : 1) * R * 0.065, p.y + R * 0.02)
      }
    }

    const loop = () => {
      rot += 0.08
      draw()
      if (visible) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !reduced
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(loop)
      else draw()
    })
    io.observe(canvas)
    draw()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', size)
    }
  }, [reduced, tx])

  return <canvas ref={ref} className="aspect-square w-full" role="img" aria-label={t('Globe showing Runway studios in Montreal and Singapore', 'Globo con los estudios de Runway en Montreal y Singapur')} />
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
          </FadeIn>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Globe />
        </div>
      </div>
    </section>
  )
}
