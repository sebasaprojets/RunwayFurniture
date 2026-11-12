import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Smooth scrolling wired into GSAP's ticker. Skipped entirely for reduced-motion users. */
export function initSmoothScroll(reduced: boolean) {
  if (reduced || lenis) return () => {}
  lenis = new Lenis({ lerp: 0.12 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
  // Move focus for keyboard and screen-reader users.
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Move the page by a few pixels at once, without any smoothing (used to keep something in place
 * when the content above it changes height). */
export function jumpBy(dy: number) {
  if (!dy) return
  if (lenis) lenis.scrollTo(window.scrollY + dy, { immediate: true, force: true })
  else window.scrollTo(0, window.scrollY + dy)
}

/**
 * Keeping the visitor's place across a change that reflows the whole page (the language switch):
 * remember what sits in the upper part of the screen, then bring it back to the same spot.
 * A pinned scene is held by its spacer, which scrolls with the page.
 */
let place: { el: Element; top: number; pinned: boolean } | null = null
const spacerOf = (el: Element) => (el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : null)

export function holdPlace() {
  place = null
  const main = document.querySelector('main')
  if (!main) return
  const y = window.innerHeight * 0.35
  for (const hit of document.elementsFromPoint(window.innerWidth / 2, y)) {
    if (!main.contains(hit)) continue
    // a pinned scene: hold its section (the spacer around it is rebuilt when the language changes)
    const pinSpacer = hit.closest('.pin-spacer')
    if (pinSpacer) {
      const section = pinSpacer.firstElementChild!
      place = { el: section, top: pinSpacer.getBoundingClientRect().top, pinned: true }
      return
    }
    // otherwise the nearest block of a reasonable size
    let el: Element | null = hit
    while (el && el !== main && (el as HTMLElement).offsetHeight < 40) el = el.parentElement
    if (el && el !== main) place = { el, top: el.getBoundingClientRect().top, pinned: false }
    return
  }
}

export function restorePlace() {
  const p = place
  place = null
  if (!p || !p.el.isConnected) return
  const box = p.pinned ? spacerOf(p.el) ?? p.el : p.el
  jumpBy(box.getBoundingClientRect().top - p.top)
  ScrollTrigger.update()
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export { gsap, ScrollTrigger }
