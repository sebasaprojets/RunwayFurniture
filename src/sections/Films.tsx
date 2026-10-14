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
        {film.youtube && playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${film.youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={tx(film.title)}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : film.youtube ? (
          <img src={film.poster} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
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
        )}
        {!playing && (
          <button
            onClick={() => {
              setPlaying(true)
              if (!film.youtube) ref.current?.play()
            }}
            data-cursor="Play"
            className="group absolute inset-0 grid place-items-center bg-ink/30 transition-colors duration-500 hover:bg-ink/10"
            aria-label={`${t('Play', 'Reproducir')} ${tx(film.title)}${film.duration ? ` (${film.duration})` : ''}`}
          >
            <span className="grid size-20 place-items-center rounded-full bg-bone text-ink transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-110 md:size-24">
              <Play className="ml-1 size-6" strokeWidth={1.25} fill="currentColor" />
            </span>
            {film.duration && <span className="eyebrow absolute bottom-5 left-5 text-bone/80">{film.duration}</span>}
          </button>
        )}
      </div>
      <figcaption className="mt-5 flex max-w-xl flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
        <span className="font-display text-3xl whitespace-nowrap text-bone">{tx(film.title)}</span>
        <span className="text-sm leading-relaxed text-bone/55">
          {tx(film.caption)}
          {film.youtube && (
            <a
              href={`https://www.youtube.com/watch?v=${film.youtube}`}
              target="_blank"
              rel="noreferrer"
              className="eyebrow mt-3 block text-gold/80 transition-colors hover:text-gold"
            >
              {t('Watch on YouTube', 'Ver en YouTube')} ↗
            </a>
          )}
        </span>
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
        <SectionLabel index="05" label={t('Films', 'Películas')} />
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
            <FadeIn key={f.poster} className="lg:col-span-4 lg:mt-48" delay={0.1 * (i + 1)}>
              <Film film={f} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
