import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { photos, textures } from '../data/site'
import { useLang } from '../i18n'

export function Philosophy() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const draw = useTransform(scrollYProgress, [0.05, 0.8], [0, 1])

  const details = [
    { src: textures.walnut, label: t('Joinery', 'Ebanistería'), note: t('Oiled walnut, hand-finished edges', 'Nogal aceitado, cantos terminados a mano') },
    { src: textures.linen, label: t('Upholstery', 'Tapicería'), note: t('Belgian linen, French seams', 'Lino belga, costuras francesas') },
    { src: textures.travertine, label: t('Stone', 'Piedra'), note: t('Honed travertine, open pores', 'Travertino apomazado, poro abierto') },
    { src: textures.bronze, label: t('Metal', 'Metal'), note: t('Brushed bronze, living patina', 'Bronce cepillado, pátina viva') },
  ]

  return (
    <section ref={ref} id="philosophy" className="relative overflow-hidden bg-bone text-ink" aria-labelledby="philosophy-title">
      <div className="grid-lines-dark pointer-events-none absolute inset-0" aria-hidden />
      {/* construction lines drawn by scroll */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-bronze/40" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d="M 4 0 L 4 300 M 0 92 L 100 92 M 58 30 C 80 30 96 50 96 80 L 96 300 M 30 160 A 30 30 0 0 1 90 160"
          stroke="currentColor"
          strokeWidth="0.1"
          vectorEffect="non-scaling-stroke"
          fill="none"
          style={{ pathLength: draw }}
        />
      </svg>

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01" label={t('Our Philosophy', 'Nuestra filosofía')} light={false} />
            <RevealText
              text={t('Design that\nbecomes an\nexperience.', 'Diseño que\nse convierte en\nexperiencia.')}
              accent={['experience', 'experiencia']}
              accentClass="italic text-bronze"
              className="display mt-10 text-[14vw] text-ink uppercase sm:text-[10vw] lg:text-[6.6vw]"
            />
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <FadeIn>
              <p className="font-display text-2xl leading-snug text-ink/90 md:text-3xl">
                {t(
                  '“Great furniture is more than design. It shapes the atmosphere, defines how a space feels and creates experiences that remain long after the moment has passed.”',
                  '“Un gran mueble es más que diseño. Crea la atmósfera, define cómo se siente un espacio y genera experiencias que permanecen mucho después del momento.”',
                )}
              </p>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-ink/65">
                {t(
                  'We approach every piece as part of an integrated architectural vision — conceived with the building, the light and the landscape, never in isolation from them.',
                  'Concebimos cada pieza como parte de una visión arquitectónica integral: pensada junto con el edificio, la luz y el paisaje, nunca aislada de ellos.',
                )}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* asymmetric editorial composition */}
        <div className="mt-24 grid grid-cols-12 gap-4 md:mt-36 md:gap-6">
          <div className="col-span-12 md:col-span-5">
            <MaskImage src={photos.livingRoom} alt={t('Contemporary living room with a sculptural sofa and natural materials', 'Sala contemporánea con un sofá escultórico y materiales naturales')} className="aspect-[4/5]" />
            <p className="eyebrow mt-4 text-ink/50">{t('From line to living space', 'Del trazo al espacio habitado')}</p>
          </div>
          <div className="col-span-7 md:col-span-3 md:mt-48">
            <MaskImage src={textures.marble} alt={t('Macro detail of Calacatta marble', 'Detalle macro de mármol Calacatta')} className="aspect-square" from="left" delay={0.1} />
            <p className="eyebrow mt-4 text-ink/50">{t('Calacatta, honed', 'Calacatta apomazado')}</p>
          </div>
          <div className="col-span-5 mt-24 md:col-span-4 md:mt-0">
            <MaskImage src={photos.livingGallery} alt={t('Double-height contemporary living space with large windows', 'Sala contemporánea de doble altura con grandes ventanales')} className="aspect-[3/5]" from="top" delay={0.2} />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-28 md:grid-cols-4 md:gap-6">
          {details.map((d, i) => (
            <FadeIn key={d.label} delay={i * 0.08}>
              <div className="group overflow-hidden">
                <img
                  src={d.src}
                  alt={`${d.label} — ${d.note}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-110"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-3">
                <span className="font-display text-xl">{d.label}</span>
                <span className="text-[0.7rem] text-ink/55">{d.note}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
