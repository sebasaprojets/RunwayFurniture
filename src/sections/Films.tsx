import { Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { films } from '../data/site'
import { useLang } from '../i18n'

/** Poster first; the video only loads when the visitor asks for it. */
function Film({ film }: { film: (typeof films)[number] }) {
  const { t, tx } = useLang()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden bg-smoke">
        <video
          ref={ref}
          src={film.src}
          poster={film.poster}
          preload="none"
          playsInline
          controls={playing}
          onEnded={() => setPlaying(false)}
          className="h-full w-full object-cover"
          aria-label={tx(film.title)}
        />
        {!playing && (
          <button
            onClick={() => {
              setPlaying(true)
              ref.current?.play()
            }}
            data-cursor="Play"
            className="group absolute inset-0 grid place-items-center bg-ink/30 transition-colors duration-500 hover:bg-ink/10"
            aria-label={`${t('Play', 'Reproducir')} ${tx(film.title)} (${film.duration})`}
          >
            <span className="grid size-20 place-items-center rounded-full bg-bone text-ink transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-110 md:size-24">
              <Play className="ml-1 size-6" strokeWidth={1.25} fill="currentColor" />
            </span>
            <span className="eyebrow absolute bottom-5 left-5 text-bone/80">{film.duration}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-5 flex max-w-xl items-baseline gap-5">
        <span className="font-display text-3xl whitespace-nowrap text-bone">{tx(film.title)}</span>
        <span className="text-sm leading-relaxed text-bone/55">{tx(film.caption)}</span>
      </figcaption>
    </figure>
  )
}

export function Films() {
  const { t } = useLang()
  const [main, ...rest] = films
  return (
    <section id="films" className="relative bg-ink py-28 md:py-40" aria-labelledby="films-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="08" label={t('Films', 'Películas')} />
        <RevealText
          text={t('See it\nin motion.', 'Míralo\nen movimiento.')}
          accent={['motion.', 'movimiento.']}
          className="display mt-10 text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[6vw]"
        />
        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-6">
          <FadeIn className="lg:col-span-8">
            <Film film={main} />
          </FadeIn>
          {rest.map((f, i) => (
            <FadeIn key={f.src} className="lg:col-span-4 lg:mt-48" delay={0.1 * (i + 1)}>
              <Film film={f} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
