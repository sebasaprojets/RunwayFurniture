import { useLayoutEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { hospitalityScenes, thumb } from '../data/site'
import { useLang } from '../i18n'
import { gsap } from '../lib/scroll'
import { scrollToTarget } from '../lib/scroll'

/**
 * Pinned, horizontally-scrolling sequence of hospitality "scenes" (GSAP ScrollTrigger).
 * Each frame counter-pans inside its window for a camera-dolly feel.
 * On touch / small screens / reduced motion it becomes a native swipe carousel.
 */
export function Hospitality() {
  const { t, tx } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const track = trackRef.current!
      const total = hospitalityScenes.length
      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
            if (counterRef.current) counterRef.current.textContent = String(Math.min(total, Math.floor(self.progress * total) + 1)).padStart(2, '0')
          },
        },
      })
      gsap.to(sectionRef.current!.querySelector('[data-bgword]'), {
        xPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.6 },
      })
      // a gentle camera drift inside each frame, never more than the image's spare width
      track.querySelectorAll<HTMLElement>('[data-pan]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -4 },
          {
            xPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hospitality" className="relative overflow-hidden bg-graphite" aria-labelledby="hospitality-title">
      <div
        data-bgword
        className="display pointer-events-none absolute bottom-[-4vw] left-0 hidden text-[20vw] leading-none whitespace-nowrap text-transparent uppercase min-[900px]:block"
        style={{ WebkitTextStroke: '1px rgba(184,154,106,.08)' }}
        aria-hidden
      >
        {t('Destinations · Hospitality', 'Destinos · Hotelería')}
      </div>
      <div
        ref={trackRef}
        className="relative grid grid-cols-1 gap-12 px-5 py-24 sm:grid-cols-2 sm:gap-x-6 min-[900px]:flex min-[900px]:h-[100svh] min-[900px]:items-center min-[900px]:gap-[3vw] min-[900px]:px-[6vw] min-[900px]:py-0"
      >
        {/* intro panel */}
        <div className="flex shrink-0 flex-col justify-center sm:col-span-2 min-[900px]:w-[36vw] min-[900px]:pr-[2vw]">
          <RevealText
            text={t('Spaces that\ndefine\ndestinations.', 'Espacios que\ndefinen\ndestinos.')}
            accent={['destinations', 'destinos']}
            className="display text-[13vw] text-bone uppercase min-[900px]:text-[5.6vw]"
          />
          <p className="mt-8 max-w-md leading-relaxed text-bone/65">
            {t(
              'Thoughtfully designed environments where architecture, furniture and hospitality come together to create something extraordinary.',
              'Ambientes diseñados con cuidado, donde arquitectura, mobiliario y hospitalidad se unen para crear algo extraordinario.',
            )}
          </p>
          <div className="mt-10">
            <Button
              href="#projects"
              variant="ghost"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('projects:filter', { detail: 'Luxury Hospitality' }))
                scrollToTarget('#projects')
              }}
            >
              {t('Explore hospitality projects', 'Ver proyectos de hotelería')}
            </Button>
          </div>
        </div>

        {hospitalityScenes.map((s, i) => (
          <figure key={s.title.en} className="relative shrink-0 min-[900px]:w-[calc(58svh*1.5)]">
            <div className="relative aspect-[3/2] overflow-hidden bg-ink">
              <img
                data-pan
                src={s.image}
                srcSet={`${thumb(s.image)} 1280w, ${s.image} 2000w`}
                sizes="(min-width: 900px) 55vw, 100vw"
                alt={`${tx(s.title)}: ${tx(s.caption)}`}
                loading="lazy"
                decoding="async"
                className="grade absolute inset-0 h-full w-full max-w-none object-cover min-[900px]:-left-[5%] min-[900px]:w-[110%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>
            <figcaption className="mt-6 grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-bone/15 pt-5">
              <span className="pt-2 font-display text-lg text-gold italic tabular-nums">0{i + 1}</span>
              <span>
                <span className="block font-display text-3xl text-bone">{tx(s.title)}</span>
                <span className="mt-2 block max-w-sm text-sm leading-relaxed text-bone/55">{tx(s.caption)}</span>
              </span>
            </figcaption>
          </figure>
        ))}
        <div className="hidden w-[6vw] shrink-0 min-[900px]:block" aria-hidden />
      </div>

      <div className="pointer-events-none absolute inset-x-[6vw] bottom-10 hidden items-center gap-6 min-[900px]:flex" aria-hidden>
        <span className="font-display text-lg text-bone tabular-nums italic">
          <span ref={counterRef}>01</span> <span className="text-bone/35">/ {String(hospitalityScenes.length).padStart(2, '0')}</span>
        </span>
        <span className="relative h-px flex-1 bg-bone/15">
          <span ref={progressRef} className="absolute inset-0 block origin-left scale-x-0 bg-gold" />
        </span>
      </div>
    </section>
  )
}
