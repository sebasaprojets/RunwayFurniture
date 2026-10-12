import { useLayoutEffect, useRef } from 'react'
import { photos } from '../data/site'
import { gsap } from '../lib/scroll'

/**
 * Pinned cinematic moment: a small framed still expands to a full-bleed scene as you scroll,
 * the camera pushes in, letterbox bars retract and a line of copy surfaces.
 */
export function CinemaReveal() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=160%', scrub: 1, pin: true },
      })
      tl.fromTo(q('[data-frame]'), { clipPath: 'inset(28% 34% 28% 34%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(q('[data-img]'), { scale: 1.45 }, { scale: 1.05, ease: 'none', duration: 1.4 }, 0)
        .fromTo(q('[data-bar]'), { scaleY: 1 }, { scaleY: 0, ease: 'power2.inOut', duration: 0.6 }, 0.55)
        .fromTo(q('[data-pre]'), { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.4 }, 0)
        .fromTo(q('[data-copy] > *'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, 0.8)
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ink" aria-label="Every piece begins with a place">
      <p data-pre className="display absolute inset-x-0 top-[12%] z-10 text-center text-[9vw] text-bone/90 uppercase md:text-[5vw]">
        Every piece <span className="text-gold italic">begins</span>
      </p>
      <div data-frame className="absolute inset-0 overflow-hidden">
        <img data-img src={photos.villaModern} alt="Contemporary villa with pool at dusk" className="grade h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/40" />
      </div>
      <div data-bar className="absolute inset-x-0 top-0 h-[11vh] origin-top bg-ink" />
      <div data-bar className="absolute inset-x-0 bottom-0 h-[11vh] origin-bottom bg-ink" />
      <div data-copy className="absolute inset-x-0 bottom-[14%] z-10 px-5 text-center md:px-10">
        <p className="eyebrow text-gold">Scene 02 — The Residence</p>
        <p className="display mt-6 text-[11vw] text-bone uppercase md:text-[6.5vw]">
          …with a <span className="italic">place.</span>
        </p>
        <p className="mx-auto mt-6 max-w-lg text-bone/75">
          We study the architecture, the light and the landscape first — then design the furniture that belongs there.
        </p>
      </div>
    </section>
  )
}
