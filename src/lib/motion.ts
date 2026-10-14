import { useEffect, useState } from 'react'

export const easeLuxe = [0.22, 1, 0.36, 1] as const
export const easeCine = [0.76, 0, 0.24, 1] as const

/**
 * The client wants the full cinematic experience on every device, including Windows/macOS machines
 * with "reduce animations" turned on. Flip to true to honour the OS setting again.
 */
export const RESPECT_REDUCED_MOTION = false

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => RESPECT_REDUCED_MOTION && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (!RESPECT_REDUCED_MOTION) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/**
 * True on phones/tablets (touch, or narrow screens):
 * scroll stays native and nothing moves with the scroll position, so the page never "swims".
 */
export function useCalmScroll() {
  const reduced = usePrefersReducedMotion()
  const touch = useMediaQuery('(hover: none), (pointer: coarse), (max-width: 899px)')
  return reduced || touch
}
