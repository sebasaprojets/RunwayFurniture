import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { WaterCanvas } from '../components/WaterCanvas'
import { brand, heroVideo } from '../data/site'
import { easeCine, easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function Hero({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink" aria-label="Introduction">
      {/* Film — revealed through an expanding architectural aperture */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'inset(38% 34% 38% 34%)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
        transition={{ duration: 1.8, ease: easeCine, delay: 0.15 }}
      >
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
          {heroVideo ? (
            <video className="h-full w-full object-cover" src={heroVideo.src} poster={heroVideo.poster} autoPlay muted loop playsInline />
          ) : (
            <WaterCanvas still={reduced} className="absolute inset-0" />
          )}

          {/* Structural glass floor — steel mullions in perspective, like standing above the sea */}
          <div className="pointer-events-none absolute inset-0 [perspective:900px]" aria-hidden>
            <motion.div style={reduced ? undefined : { y: gridY }} className="absolute inset-0 [transform-style:preserve-3d]">
            <div className="absolute -inset-x-full top-[-260%] bottom-[-50%] origin-bottom [transform:rotateX(58deg)]">
              <div
                className="h-full w-full opacity-70"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(8,10,11,.7) 0 6px, transparent 6px), linear-gradient(to bottom, rgba(8,10,11,.7) 0 6px, transparent 7px)',
                  backgroundSize: '12.5% 300px',
                  backgroundPosition: 'center bottom',
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,236,205,.07)_45%,transparent_60%)]" />
            </div>
            </motion.div>
          </div>
        </motion.div>

        {/* grading + legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
        <div className="absolute inset-0 overflow-hidden mix-blend-overlay">
          <div className="grain" />
        </div>
      </motion.div>

      {/* Technical drawing overlay that draws itself in */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-bone/20" aria-hidden preserveAspectRatio="none" viewBox="0 0 100 100">
        {[
          'M 8 0 L 8 100',
          'M 92 0 L 92 100',
          'M 0 18 L 100 18',
          'M 62 18 L 62 100',
          'M 62 70 C 72 70 80 62 80 52',
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.08"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={ready ? { pathLength: 1 } : {}}
            transition={{ duration: 2.2, ease: easeLuxe, delay: 1 + i * 0.15 }}
          />
        ))}
      </svg>

      <motion.div style={reduced ? undefined : { y: contentY, opacity: fade }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.7, duration: 1 }}
          className="eyebrow absolute top-32 left-5 hidden flex-col gap-2 text-mineral/70 md:left-10 md:flex"
        >
          <span>{brand.pillars.join('  ·  ')}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 1 }}
          className="eyebrow absolute top-32 right-5 hidden text-right text-mineral/70 md:right-10 md:block"
        >
          Est. {brand.since}
          <br />
          {brand.offices.map((o) => o.city).join(' — ')}
        </motion.div>

        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {ready && (
              <RevealText
                as="h1"
                immediate
                delay={1.05}
                stagger={0.08}
                text={'Creating\nExtraordinary\nSpaces Worldwide'}
                accent={['Extraordinary']}
                className="display text-[15vw] text-bone uppercase sm:text-[11vw] lg:text-[7.4vw]"
              />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: easeLuxe, delay: 1.7 }}
            className="lg:col-span-4 lg:pb-4"
          >
            <p className="max-w-sm text-base leading-relaxed text-bone/75 md:text-lg">
              Bespoke furniture and considered interiors for exceptional hospitality and residential destinations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="#projects"
                onClick={() => {
                  scrollToTarget('#projects')
                }}
              >
                Explore our work
              </Button>
              <Button href="#philosophy" variant="ghost" onClick={() => scrollToTarget('#philosophy')}>
                Discover Runway
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 2.3, duration: 1 }}
          className="mt-10 flex items-center justify-start border-t border-bone/15 pt-5 md:justify-between"
        >
          <span className="eyebrow text-mineral/60">Scroll to explore</span>
          <span className="relative block h-10 w-px overflow-hidden bg-bone/15 max-md:order-first max-md:mr-4" aria-hidden>
            <span className="absolute inset-0 bg-gold [animation:scroll-cue_2.4s_var(--ease-luxe)_infinite]" />
          </span>
          <span className="eyebrow hidden text-mineral/60 md:inline">{brand.regions.join(' · ')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
