import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { FadeIn } from '../components/FadeIn'
import { RevealText } from '../components/RevealText'
import { brand, categories, categoryLabel, showcase } from '../data/site'
import { useLang } from '../i18n'

type Field = 'name' | 'email' | 'message'

export function Contact() {
  const { t, tx } = useLang()
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [prefill, setPrefill] = useState('')

  // "Request a quote" on a piece starts the message for the visitor.
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail
      // a property enquiry asks for information rather than a quote
      const info = typeof d === 'object' && d !== null
      const piece = String(info ? d.subject : (d ?? '')).slice(0, 120)
      if (!piece) return
      setPrefill(
        info
          ? t(`I would like more information about: ${piece}.\n\n`, `Me gustaría recibir información sobre: ${piece}.\n\n`)
          : t(`I would like a quote for: ${piece}.\n\n`, `Me gustaría cotizar: ${piece}.\n\n`),
      )
      setSent(false)
    }
    window.addEventListener('contact:prefill', on)
    return () => window.removeEventListener('contact:prefill', on)
  }, [t])

  // No backend yet: the enquiry is composed into the visitor's email client.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const next: Partial<Record<Field, string>> = {}
    if (!get('name')) next.name = t('Please tell us your name.', 'Indícanos tu nombre.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get('email'))) next.email = t('Please enter a valid email, e.g. name@company.com.', 'Escribe un correo válido, por ejemplo nombre@empresa.com.')
    if (get('message').length < 10) next.message = t('Tell us a little about the project (at least 10 characters).', 'Cuéntanos un poco sobre el proyecto (al menos 10 caracteres).')
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      form.querySelector<HTMLElement>(`#${first}`)?.focus()
      return
    }
    const type = get('type') || 'General'
    const body = [`Name: ${get('name')}`, `Company: ${get('company') || '—'}`, `Email: ${get('email')}`, `Project type: ${type}`, '', get('message')].join('\n')
    window.location.href = `mailto:${brand.contactEmail}?subject=${encodeURIComponent(`Project enquiry — ${type}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const err = (k: Field) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-sm text-terracotta">
        {errors[k]}
      </p>
    ) : null
  const aria = (k: Field) => ({ 'aria-invalid': !!errors[k] || undefined, 'aria-describedby': errors[k] ? `${k}-error` : undefined })

  const field =
    'peer w-full border-b border-bone/20 bg-transparent pt-6 pb-3 text-bone placeholder-transparent outline-none transition-colors focus:border-gold'
  const lbl =
    'pointer-events-none absolute top-6 left-0 text-sm text-bone/70 transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:tracking-[0.2em] peer-focus:text-gold peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase'

  return (
    <section id="contact" className="relative overflow-hidden bg-graphite" aria-labelledby="contact-title">
      <img src={showcase.contact} alt="" className="grade absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-b from-graphite via-graphite/90 to-graphite" />
      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:px-10 md:py-40 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RevealText text={t('Let’s create\nsomething\nextraordinary.', 'Creemos\nalgo\nextraordinario.')} accent={['extraordinary.', 'extraordinario.']} className="display text-[13vw] text-bone uppercase sm:text-[9vw] lg:text-[5.4vw]" />
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
              <p className="mt-4 max-w-sm text-bone/70">
                {t(
                  'Your email app should open with the enquiry ready — just press send. If it did not open, write to us directly:',
                  'Tu aplicación de correo debería abrirse con la consulta lista: solo tienes que enviarla. Si no se abrió, escríbenos directamente:',
                )}
              </p>
              <a href={`mailto:${brand.contactEmail}`} className="mt-4 self-start font-display text-2xl break-all text-bone transition-colors hover:text-gold">
                {brand.contactEmail}
              </a>
              <button onClick={() => setSent(false)} className="eyebrow mt-8 self-start text-gold">
                {t('Write another enquiry', 'Escribir otra consulta')}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-8 sm:grid-cols-2">
              <div className="relative">
                <input id="name" name="name" required maxLength={120} placeholder="Name" autoComplete="name" className={field} {...aria('name')} />
                <label htmlFor="name" className={lbl}>{t('Full name *', 'Nombre completo *')}</label>
                {err('name')}
              </div>
              <div className="relative">
                <input id="company" name="company" maxLength={120} placeholder="Company" autoComplete="organization" className={field} />
                <label htmlFor="company" className={lbl}>{t('Company / Studio', 'Empresa / Estudio')}</label>
              </div>
              <div className="relative sm:col-span-2">
                <input id="email" name="email" type="email" required maxLength={200} placeholder="Email" autoComplete="email" className={field} {...aria('email')} />
                <label htmlFor="email" className={lbl}>{t('Email *', 'Correo electrónico *')}</label>
                {err('email')}
              </div>
              <fieldset className="sm:col-span-2">
                <legend className="eyebrow text-bone/70">{t('Project type (optional)', 'Tipo de proyecto (opcional)')}</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="type" value={c} className="peer sr-only" />
                      <span className="block rounded-full border border-bone/15 px-4 py-2 text-xs text-bone/75 transition-colors peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold hover:border-bone/40">
                        {tx(categoryLabel[c])}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="relative sm:col-span-2">
                <textarea key={prefill} defaultValue={prefill} id="message" name="message" required maxLength={4000} rows={4} placeholder="Message" className={`${field} resize-none`} {...aria('message')} />
                <label htmlFor="message" className={lbl}>{t('Tell us about your project *', 'Cuéntanos sobre tu proyecto *')}</label>
                {err('message')}
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
