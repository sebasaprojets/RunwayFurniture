import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from '../components/Button'
import { RevealText } from '../components/RevealText'
import { WaterCanvas } from '../components/WaterCanvas'
import { brand, heroVideo } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe, useCalmScroll } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function Hero({ ready, revealed, reduced }: { ready: boolean; revealed: boolean; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const calm = useCalmScroll()
  const { lang, t, tx } = useLang()

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink" aria-label={t('Introduction', 'Introducción')}>
      {/* Film — revealed through an expanding architectural aperture */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.35, filter: 'brightness(0.4)' }}
        animate={revealed || ready ? { scale: 1, filter: 'brightness(1)' } : {}}
        transition={{ duration: 3.2, ease: easeCine }}
      >
        <motion.div className="absolute inset-0" style={calm ? undefined : { scale }}>
          {heroVideo ? (
            <video className="h-full w-full object-cover" src={heroVideo.src} poster={heroVideo.poster} autoPlay muted loop playsInline />
          ) : (
            <WaterCanvas still={reduced} className="absolute inset-0" />
          )}

          {/* Structural glass floor — steel mullions in perspective, like standing above the sea */}
          <div className="pointer-events-none absolute inset-0 [perspective:900px]" aria-hidden>
            <motion.div style={calm ? undefined : { y: gridY }} className="absolute inset-0 [transform-style:preserve-3d]">
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
            transition={{ duration: 2.2, ease: easeLuxe, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </svg>

      <Seal show={ready} reduced={reduced} />

      <motion.div style={calm ? undefined : { y: contentY, opacity: fade }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">

        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {ready && (
              <RevealText
                as="h1"
                immediate
                delay={0.15}
                stagger={0.08}
                text={t('Creating\nExtraordinary\nSpaces Worldwide', 'Creamos\nespacios\nextraordinarios')}
                accent={['Extraordinary', 'extraordinarios']}
                className={`display text-bone uppercase sm:text-[11vw] lg:text-[7.4vw] ${lang === 'es' ? 'text-[12.4vw]' : 'text-[15vw]'}`}
              />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: easeLuxe, delay: 0.75 }}
            className="lg:col-span-4 lg:pb-4"
          >
            <p className="max-w-sm text-base leading-relaxed text-bone/75 md:text-lg">
              {t(
                'Bespoke furniture and considered interiors for exceptional hospitality and residential destinations.',
                'Mobiliario a medida e interiores cuidados para destinos residenciales y hoteleros excepcionales.',
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="#projects"
                onClick={() => {
                  scrollToTarget('#projects')
                }}
              >
                {t('Explore our work', 'Ver proyectos')}
              </Button>
              <Button href="#founder" variant="ghost" onClick={() => scrollToTarget('#founder')}>
                {t('Discover Runway', 'Conocer Runway')}
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-10 flex items-center justify-start border-t border-bone/15 pt-5 md:justify-between"
        >
          <span className="eyebrow text-mineral/60">{t('Scroll to explore', 'Desliza para explorar')}</span>
          <span className="relative block h-10 w-px overflow-hidden bg-bone/15 max-md:order-first max-md:mr-4" aria-hidden>
            <span className="absolute inset-0 bg-gold [animation:scroll-cue_2.4s_var(--ease-luxe)_infinite]" />
          </span>
          <span className="eyebrow hidden text-mineral/60 md:inline">{brand.regions.map(tx).join(' · ')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

/** Rotating gilded seal — a quiet signature mark in the composition. */
function Seal({ show, reduced }: { show: boolean; reduced: boolean }) {
  const { t } = useLang()
  const text = t('Since 2009 · Hospitality · Residential · Bespoke · ', 'Desde 2009 · Hotelería · Residencial · A medida · ')
  return (
    <motion.button
      onClick={() => scrollToTarget('#projects')}
      initial={{ opacity: 0, scale: 0.8, rotate: -40 }}
      animate={show ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ duration: 1.6, ease: easeLuxe, delay: 1 }}
      className="group absolute top-[26%] right-5 z-20 hidden size-32 md:right-10 md:block lg:top-[24%] lg:size-36"
      aria-label={t('Discover Runway', 'Conocer Runway')}
    >
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full text-bone/70 ${reduced ? '' : 'animate-[spin_24s_linear_infinite]'}`}>
        <defs>
          <path id="seal-circle" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="13" fill="currentColor" fontFamily="Manrope Variable, sans-serif" style={{ textTransform: 'uppercase' }}>
          <textPath href="#seal-circle" textLength="486" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[26%] grid place-items-center rounded-full border border-gold/40 bg-ink/30 backdrop-blur-sm transition-colors duration-500 group-hover:bg-gold/90">
        <span className="font-display text-4xl text-gold transition-colors duration-500 group-hover:text-ink">R</span>
      </span>
    </motion.button>
  )
}
