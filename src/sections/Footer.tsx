import { ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'
import { BRAND_SERIF } from '../components/BrandMark'
import { brand, navItems, whatsappUrl } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function Footer() {
  const { t, tx } = useLang()
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-bone">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 border-b border-bone/10 pb-16 md:grid-cols-12">
          <p className="font-display text-3xl leading-snug md:col-span-5">
            {t('We don’t simply supply furniture.', 'No solo suministramos muebles.')}{' '}
            <span className="text-gold italic">{t('We help create destinations.', 'Ayudamos a crear destinos.')}</span>
          </p>
          <nav aria-label={t('Footer', 'Pie de página')} className="md:col-span-3 md:col-start-6">
            <p className="eyebrow text-mineral/80">{t('Explore', 'Explorar')}</p>
            <ul className="mt-5 space-y-2 max-md:space-y-0">
              {navItems.map((n) => (
                <li key={n.label.en}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(n.href)
                    }}
                    className="text-bone/70 transition-colors hover:text-gold max-md:flex max-md:min-h-11 max-md:items-center"
                  >
                    {tx(n.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow text-mineral/80">{t('Studios', 'Estudios')}</p>
            <ul className="mt-5 space-y-2 text-bone/70">
              {brand.offices.map((o) => (
                <li key={o.city}>
                  {tx(o.cityLabel)}
                  {o.country.en !== o.city && `, ${tx(o.country)}`}
                </li>
              ))}
              <li>{brand.regions.map(tx).join(' · ')}</li>
              <li className="pt-3">
                <a href={`mailto:${brand.contactEmail}`} className="break-all transition-colors hover:text-gold max-md:flex max-md:min-h-11 max-md:items-center">
                  {brand.contactEmail}
                </a>
              </li>
              <li>
                <a href={whatsappUrl(t('Hello, I would like more information about Runway Furniture.', 'Hola, me gustaría recibir información sobre Runway Furniture.'))} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold max-md:flex max-md:min-h-11 max-md:items-center">
                  WhatsApp {brand.whatsappLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <motion.p
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: easeLuxe }}
        className="mt-10 text-center text-[19vw] leading-[0.85] font-medium tracking-[0.06em] text-bone/[0.92] select-none"
        style={{ fontFamily: BRAND_SERIF }}
        aria-hidden
      >
        RUNWAY
      </motion.p>

      {/* kept clear of the floating WhatsApp button (bottom-right on every screen) */}
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 pt-8 pb-8 text-xs text-bone/70 md:px-10 md:pr-32">
        <span>
          © {new Date().getFullYear()} {brand.full}. {t('Since', 'Desde')} {brand.since}.
        </span>
        <span>{t('Luxury Hospitality · Residential · Bespoke Furniture', 'Hotelería de lujo · Residencial · Mobiliario a medida')}</span>
        <button onClick={() => scrollToTarget('#top')} className="eyebrow flex min-h-11 items-center gap-2 text-bone/70 hover:text-gold">
          {t('Back to top', 'Volver arriba')} <ArrowUp className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <DeveloperCredit />
    </footer>
  )
}

/** The web designer's signature: one tap opens his studio's Instagram. */
const DEVELOPER = { name: 'Sebastian Andrade', instagram: 'safdigitalsolutions' }

/** Instagram's mark, drawn inline so the credit needs no external asset. */
function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function DeveloperCredit() {
  const { t } = useLang()
  const href = `https://www.instagram.com/${DEVELOPER.instagram}/`
  const by = t('Developed by', 'Desarrollado por')
  return (
    <div className="border-t border-bone/10">
      {/* right-aligned signature, kept clear of the floating WhatsApp button */}
      <div className="mx-auto flex max-w-[1600px] justify-center px-5 pt-7 pb-28 sm:justify-end md:px-10 md:pr-32 md:pb-9">
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${by} ${DEVELOPER.name} — Instagram @${DEVELOPER.instagram}`}
          className="group flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easeLuxe }}
        >
          <span className="eyebrow text-[0.6875rem] text-bone/50 transition-colors duration-500 group-hover:text-bone/80">{by}</span>
          <span className="flex items-center gap-4">
            <span
              className="relative text-lg tracking-[0.1em] whitespace-nowrap text-gold uppercase transition-colors duration-500 group-hover:text-[#d8bd8e] min-[400px]:text-xl sm:text-[1.7rem] sm:tracking-[0.14em]"
              style={{ fontFamily: BRAND_SERIF }}
            >
              {DEVELOPER.name}
              {/* a hairline draws under the name on hover */}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold/70 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-x-100" />
            </span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
              <InstagramIcon className="size-4" />
            </span>
          </span>
        </motion.a>
      </div>
    </div>
  )
}
