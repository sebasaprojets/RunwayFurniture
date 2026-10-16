import { useLayoutEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { hospitalityScenes } from '../data/site'
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

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const track = trackRef.current!
      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
      gsap.to(sectionRef.current!.querySelector('[data-bgword]'), {
        xPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: () => `+=${distance()}`, scrub: 1 },
      })
      track.querySelectorAll<HTMLElement>('[data-pan]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })
      track.querySelectorAll<HTMLElement>('[data-caption]').forEach((cap) => {
        gsap.from(cap, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: cap, containerAnimation: tween, start: 'left 80%' },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hospitality" className="relative overflow-hidden bg-graphite" aria-labelledby="hospitality-title">
      <div
        data-bgword
        className="display pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/2 text-[24vw] whitespace-nowrap text-transparent uppercase min-[900px]:block"
        style={{ WebkitTextStroke: '1px rgba(184,154,106,.14)' }}
        aria-hidden
      >
        {t('Destinations · Hospitality', 'Destinos · Hotelería')}
      </div>
      <div
        ref={trackRef}
        className="relative grid grid-cols-1 gap-12 px-5 py-24 sm:grid-cols-2 sm:gap-x-6 min-[900px]:flex min-[900px]:h-[100svh] min-[900px]:items-center min-[900px]:gap-[4vw] min-[900px]:px-[6vw] min-[900px]:py-0"
      >
        {/* intro panel */}
        <div className="flex shrink-0 flex-col justify-center sm:col-span-2 min-[900px]:w-[42vw]">
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
          <figure
            key={s.title.en}
            className={`relative shrink-0 ${
              i % 2 ? 'min-[900px]:mt-[16vh] min-[900px]:w-[25vw]' : 'min-[900px]:-mt-[8vh] min-[900px]:w-[44vw]'
            }`}
          >
            <div
              className={`relative overflow-hidden ${
                i % 2 ? 'aspect-[4/3] min-[900px]:aspect-[3/4]' : 'aspect-[4/3] min-[900px]:aspect-[16/11]'
              }`}
            >
              <img
                data-pan
                src={s.image}
                alt={`${tx(s.title)}: ${tx(s.caption)}`}
                loading="lazy"
                decoding="async"
                className="grade absolute inset-0 h-full w-full max-w-none object-cover min-[900px]:-left-[12%] min-[900px]:w-[124%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute top-5 left-5 font-display text-lg text-bone/80 italic">0{i + 1}</span>
            </div>
            <figcaption data-caption className="mt-5 flex max-w-md items-baseline gap-5">
              <span className="font-display text-3xl whitespace-nowrap text-bone">{tx(s.title)}</span>
              <span className="text-sm leading-relaxed text-bone/55">{tx(s.caption)}</span>
            </figcaption>
          </figure>
        ))}
        <div className="hidden w-[6vw] shrink-0 min-[900px]:block" aria-hidden />
      </div>

      <div className="pointer-events-none absolute inset-x-[6vw] bottom-10 hidden h-px bg-bone/15 min-[900px]:block" aria-hidden>
        <span ref={progressRef} className="block h-full origin-left scale-x-0 bg-gold" />
      </div>
    </section>
  )
}
