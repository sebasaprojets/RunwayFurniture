import { useLayoutEffect, useRef } from 'react'
import { brand, images } from '../data/site'
import { gsap } from '../lib/scroll'

/** Closing shot of the founder chapter: letterboxed, slow push-in, the founder's line typed across the frame. */
export function FounderFilm() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', scrub: 1, pin: true } })
      tl.fromTo(q('[data-img]'), { scale: 1.25, filter: 'brightness(0.55)' }, { scale: 1, filter: 'brightness(0.9)', ease: 'none', duration: 1.4 }, 0)
        .fromTo(q('[data-bar-t]'), { height: '50%' }, { height: '12%', ease: 'power2.inOut', duration: 0.7 }, 0)
        .fromTo(q('[data-bar-b]'), { height: '50%' }, { height: '12%', ease: 'power2.inOut', duration: 0.7 }, 0)
        .fromTo(q('[data-char]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.3 }, 0.6)
        .fromTo(q('[data-sign]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.2)
    })
    return () => mm.revert()
  }, [])

  const words = brand.founder.quote.toUpperCase().split(' ')
  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ink" aria-label={brand.founder.quote}>
      <div className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[58%]">
        <img data-img src={images.founderDeck} alt={`${brand.founder.name} overlooking a Caribbean bay`} className="grade h-full w-full object-cover object-[50%_18%]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent max-md:from-ink/80 max-md:via-ink/50" />
      </div>
      <div data-bar-t className="absolute inset-x-0 top-0 h-[12%] bg-ink" />
      <div data-bar-b className="absolute inset-x-0 bottom-0 flex h-[12%] items-center justify-between bg-ink px-5 md:px-10">
        <span className="eyebrow text-[0.6rem] text-bone/40">Scene 07 — The Founder</span>
        <span className="eyebrow text-[0.6rem] text-bone/40">{brand.offices.map((o) => o.city).join(' — ')}</span>
      </div>
      <div className="absolute inset-y-0 left-0 flex max-w-3xl flex-col justify-center px-5 md:w-[52%] md:px-14">
        <p className="font-display text-7xl leading-none text-terracotta">“</p>
        <p className="display text-[11vw] text-bone md:text-[4.6vw]" aria-hidden>
          {words.map((w, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
              {w.split('').map((c, ci) => (
                <span key={ci} data-char className={`inline-block ${w.startsWith('INSPIRATION') ? 'text-gold italic' : ''}`}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div data-sign className="mt-8">
          <p className="font-script text-5xl text-gold md:text-6xl">Roberto Castle</p>
          <p className="eyebrow mt-3 text-mineral/70">{brand.founder.role}</p>
        </div>
      </div>
    </section>
  )
}
