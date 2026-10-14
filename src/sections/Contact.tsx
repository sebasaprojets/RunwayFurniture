import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { SectionLabel } from '../components/SectionLabel'
import { brand, categories, categoryLabel, showcase } from '../data/site'
import { useLang } from '../i18n'

export function Contact() {
  const { t, tx } = useLang()
  const [sent, setSent] = useState(false)

  // No backend yet: the enquiry is composed into the visitor's email client.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [`Name: ${f.get('name')}`, `Company: ${f.get('company') || '—'}`, `Email: ${f.get('email')}`, `Project type: ${f.get('type')}`, '', `${f.get('message')}`].join('\n')
    window.location.href = `mailto:${brand.contactEmail}?subject=${encodeURIComponent(`Project enquiry — ${f.get('type')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const field =
    'peer w-full border-b border-bone/20 bg-transparent pt-6 pb-3 text-bone placeholder-transparent outline-none transition-colors focus:border-gold'
  const lbl =
    'pointer-events-none absolute top-6 left-0 text-sm text-bone/45 transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:tracking-[0.2em] peer-focus:text-gold peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase'

  return (
    <section id="contact" className="relative overflow-hidden bg-graphite" aria-labelledby="contact-title">
      <img src={showcase.contact} alt="" className="grade absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-b from-graphite via-graphite/90 to-graphite" />
      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:px-10 md:py-40 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="07" label={t('Contact', 'Contacto')} />
          <RevealText text={t('Let’s create\nsomething\nextraordinary.', 'Creemos\nalgo\nextraordinario.')} accent={['extraordinary.', 'extraordinario.']} className="display mt-10 text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[5.4vw]" />
          <FadeIn>
            <p className="mt-10 max-w-md leading-relaxed text-bone/65">
              {t(
                'For hospitality, residential and bespoke furniture commissions, tell us about your project — our studios in Montreal and Singapore work with clients worldwide.',
                'Para proyectos hoteleros, residenciales y de mobiliario a medida, cuéntanos tu proyecto: nuestros estudios en Montreal y Singapur trabajan con clientes de todo el mundo.',
              )}
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-bone/10 pt-8">
              {brand.offices.map((o) => (
                <div key={o.city}>
                  <dt className="eyebrow text-gold">{t('Studio', 'Estudio')}</dt>
                  <dd className="mt-2 font-display text-3xl text-bone">{tx(o.cityLabel)}</dd>
                  {o.country.en !== o.city && <dd className="text-sm text-bone/50">{tx(o.country)}</dd>}
                </div>
              ))}
            </dl>
            <a href={`mailto:${brand.contactEmail}`} className="mt-10 inline-block font-display text-2xl text-bone transition-colors hover:text-gold md:text-3xl">
              {brand.contactEmail}
            </a>
          </FadeIn>
        </div>

        <FadeIn className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          {sent ? (
            <div className="flex h-full flex-col justify-center border border-bone/10 p-10" role="status">
              <p className="font-display text-5xl text-bone">{t('Thank you.', 'Gracias.')}</p>
              <p className="mt-4 max-w-sm text-bone/65">
                {t('Your email application has opened with the enquiry prepared — simply press send.', 'Tu aplicación de correo se abrió con la consulta preparada: solo tienes que enviarla.')}
              </p>
              <button onClick={() => setSent(false)} className="eyebrow mt-8 self-start text-gold">
                {t('Write another enquiry', 'Escribir otra consulta')}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-8 sm:grid-cols-2">
              <div className="relative">
                <input id="name" name="name" required placeholder="Name" autoComplete="name" className={field} />
                <label htmlFor="name" className={lbl}>{t('Full name *', 'Nombre completo *')}</label>
              </div>
              <div className="relative">
                <input id="company" name="company" placeholder="Company" autoComplete="organization" className={field} />
                <label htmlFor="company" className={lbl}>{t('Company / Studio', 'Empresa / Estudio')}</label>
              </div>
              <div className="relative sm:col-span-2">
                <input id="email" name="email" type="email" required placeholder="Email" autoComplete="email" className={field} />
                <label htmlFor="email" className={lbl}>{t('Email *', 'Correo electrónico *')}</label>
              </div>
              <fieldset className="sm:col-span-2">
                <legend className="eyebrow text-bone/45">{t('Project type', 'Tipo de proyecto')}</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((c, i) => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="type" value={c} defaultChecked={i === 0} className="peer sr-only" />
                      <span className="block rounded-full border border-bone/15 px-4 py-2 text-xs text-bone/60 transition-colors peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold hover:border-bone/40">
                        {tx(categoryLabel[c])}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="relative sm:col-span-2">
                <textarea id="message" name="message" required rows={4} placeholder="Message" className={`${field} resize-none`} />
                <label htmlFor="message" className={lbl}>{t('Tell us about your project *', 'Cuéntanos sobre tu proyecto *')}</label>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">{t('Send enquiry', 'Enviar consulta')}</Button>
              </div>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
