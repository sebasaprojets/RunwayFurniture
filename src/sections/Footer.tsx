import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { BRAND_SERIF } from '../components/BrandMark'
import { WhatsAppIcon } from '../components/WhatsAppButton'
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
            <p className="eyebrow text-mineral/75">{t('Explore', 'Explorar')}</p>
            <ul className="mt-5 space-y-2">
              {navItems.map((n) => (
                <li key={n.label.en}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(n.href)
                    }}
                    className="text-bone/70 transition-colors hover:text-gold"
                  >
                    {tx(n.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow text-mineral/75">{t('Studios', 'Estudios')}</p>
            <ul className="mt-5 space-y-2 text-bone/70">
              {brand.offices.map((o) => (
                <li key={o.city}>
                  {tx(o.cityLabel)}
                  {o.country.en !== o.city && `, ${tx(o.country)}`}
                </li>
              ))}
              <li>{brand.regions.map(tx).join(' · ')}</li>
              <li className="pt-3">
                <a href={`mailto:${brand.contactEmail}`} className="break-all transition-colors hover:text-gold">
                  {brand.contactEmail}
                </a>
              </li>
              <li>
                <a href={whatsappUrl(t('Hello, I would like more information about Runway Furniture.', 'Hola, me gustaría recibir información sobre Runway Furniture.'))} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">
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
        <button onClick={() => scrollToTarget('#top')} className="eyebrow flex items-center gap-2 text-bone/70 hover:text-gold">
          {t('Back to top', 'Volver arriba')} <ArrowUp className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <DeveloperCredit />
    </footer>
  )
}

/** The web designer's signature: one tap opens a WhatsApp chat with a message already written. */
const DEVELOPER = { name: 'Sebastian Andrade', whatsapp: '5541996173375' }

function DeveloperCredit() {
  const { t } = useLang()
  const message = t(
    'Hi Sebastian! I saw the Runway Furniture website you built and I’m interested in a website like it for my business.',
    '¡Hola Sebastian! Vi el sitio web de Runway Furniture que desarrollaste y me interesa un sitio así para mi negocio.',
  )
  const href = `https://wa.me/${DEVELOPER.whatsapp}?text=${encodeURIComponent(message)}`
  return (
    <div className="border-t border-bone/10">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-5 pt-7 pb-28 text-center sm:flex-row sm:justify-center sm:gap-5 md:px-10 md:pr-32 md:pb-9 md:pl-32">
        <span className="eyebrow text-[0.6rem] text-bone/55">{t('Designed & developed by', 'Diseño y desarrollo web por')}</span>
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('Designed & developed by', 'Diseño y desarrollo web por')} ${DEVELOPER.name} — ${t('chat on WhatsApp', 'escribir por WhatsApp')}`}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold/35 bg-bone/[0.03] py-2 pr-4 pl-2 transition-colors duration-500 hover:border-gold hover:bg-gold/10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easeLuxe }}
        >
          {/* a band of light crosses the pill once as it comes into view, and again on hover */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-bone/25 to-transparent"
            initial={{ x: '0%' }}
            whileInView={{ x: '450%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: easeLuxe, delay: 0.5 }}
          />
          <span className="grid size-8 place-items-center rounded-full border border-gold/50 text-gold transition-all duration-500 group-hover:rotate-[-8deg] group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
            <WhatsAppIcon className="size-4" />
          </span>
          <span className="bg-gradient-to-r from-[#f6e7c8] via-gold to-[#f6e7c8] bg-[length:200%_100%] bg-clip-text bg-left text-base font-semibold tracking-[0.06em] text-transparent transition-[background-position] duration-1000 ease-[var(--ease-luxe)] group-hover:bg-right sm:text-lg">
            {DEVELOPER.name}
          </span>
          <ArrowUpRight className="size-4 text-gold transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
        </motion.a>
      </div>
    </div>
  )
}
