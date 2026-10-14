import { useEffect, useRef, useState } from 'react'

/**
 * Gold cursor: a precise dot plus a lagging ring. Over elements marked
 * data-cursor="view" the ring opens into a "View" lens. Pointer-fine devices only.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      setLabel(target ? target.dataset.cursor || null : null)
    }
    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  if (!enabled) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[120]" aria-hidden>
      <div ref={dot} className="absolute top-0 left-0">
        <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-all duration-300 ${label ? 'size-0' : 'size-1.5'}`} />
      </div>
      <div ref={ring} className="absolute top-0 left-0">
        <div
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-luxe)] ${
            label ? 'size-24 border-gold bg-gold/90 backdrop-blur-sm' : 'size-9 border-bone/40'
          }`}
        >
          <span className={`eyebrow text-[0.6rem] text-ink transition-opacity duration-300 ${label ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
        </div>
      </div>
    </div>
  )
}
