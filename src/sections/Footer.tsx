import { ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'
import { BRAND_SERIF } from '../components/BrandMark'
import { brand, navItems } from '../data/site'
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

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-bone/70 md:px-10">
        <span>
          © {new Date().getFullYear()} {brand.full}. {t('Since', 'Desde')} {brand.since}.
        </span>
        <span>{t('Luxury Hospitality · Residential · Bespoke Furniture', 'Hotelería de lujo · Residencial · Mobiliario a medida')}</span>
        <button onClick={() => scrollToTarget('#top')} className="eyebrow flex items-center gap-2 text-bone/70 hover:text-gold">
          {t('Back to top', 'Volver arriba')} <ArrowUp className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </footer>
  )
}
