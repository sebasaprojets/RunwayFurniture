import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { brand, clients } from '../data/site'

/** Hotels and resorts by region, then private clients — as listed in the Runway company profile. */
export function Clients() {
  return (
    <section id="clients" className="relative bg-bone text-ink" aria-labelledby="clients-title">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="09" label="Clients" light={false} />
            <RevealText
              text={'Trusted by the\nworld’s finest\naddresses.'}
              accent={['finest']}
              accentClass="italic text-bronze"
              className="display mt-10 text-[12vw] uppercase sm:text-[8vw] lg:text-[5.4vw]"
            />
          </div>
          <FadeIn className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-ink/65">
              Our furniture can be found in some of the world’s most beautiful hotels, resorts and residences — including, but not limited
              to, the following.
            </p>
            <p className="eyebrow mt-6 text-bronze">{brand.award}</p>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-14 md:mt-24 md:grid-cols-2 xl:grid-cols-4">
          {clients.regions.map((r, i) => (
            <FadeIn key={r.region} delay={i * 0.08}>
              <p className="font-display text-3xl italic">{r.region}</p>
              <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {r.names.map((n) => {
                  const [name, place] = n.split(' — ')
                  return (
                    <li key={n} className="py-3 text-sm leading-snug">
                      <span className="text-ink/85">{name}</span>
                      {place && <span className="block text-xs text-ink/45">{place}</span>}
                    </li>
                  )
                })}
              </ul>
            </FadeIn>
          ))}
        </div>

        <div className="mt-28 grid gap-10 border-t border-ink/10 pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-bronze">Private clients</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/60">
              Homes, suites and sets furnished for actors, musicians, athletes and heads of state.
            </p>
          </div>
          <FadeIn className="lg:col-span-8">
            <p className="font-display text-3xl leading-snug text-ink/85 md:text-4xl">
              {clients.celebrities.map((c, i) => (
                <span key={c}>
                  {c}
                  {i < clients.celebrities.length - 1 && <span className="mx-3 text-bronze/60">·</span>}
                </span>
              ))}
            </p>
            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-ink/45">Dignitaries</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink/75">{clients.dignitaries.join(' · ')}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/45">Film & television</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink/75">{clients.media.join(' · ')}</dd>
              </div>
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
