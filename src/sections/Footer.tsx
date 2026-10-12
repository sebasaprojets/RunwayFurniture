import { ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'
import { brand, navItems } from '../data/site'
import { easeLuxe } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-bone">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 border-b border-bone/10 pb-16 md:grid-cols-12">
          <p className="font-display text-3xl leading-snug md:col-span-5">
            We don’t simply supply furniture. <span className="text-gold italic">We help create destinations.</span>
          </p>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow text-mineral/50">Explore</p>
            <ul className="mt-5 space-y-2">
              {navItems.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(n.href)
                    }}
                    className="text-bone/70 transition-colors hover:text-gold"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow text-mineral/50">Studios</p>
            <ul className="mt-5 space-y-2 text-bone/70">
              {brand.offices.map((o) => (
                <li key={o.city}>
                  {o.city}
                  {o.country !== o.city && `, ${o.country}`}
                </li>
              ))}
              <li>{brand.regions.join(' · ')}</li>
            </ul>
          </div>
        </div>
      </div>

      <motion.p
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: easeLuxe }}
        className="display mt-10 text-center text-[25vw] leading-[0.8] tracking-[0.04em] text-bone/[0.92] select-none"
        aria-hidden
      >
        RUNWAY
      </motion.p>

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-bone/45 md:px-10">
        <span>
          © {new Date().getFullYear()} {brand.full}. Since {brand.since}.
        </span>
        <span>Luxury Hospitality · Residential · Bespoke Furniture</span>
        <button onClick={() => scrollToTarget('#top')} className="eyebrow flex items-center gap-2 text-bone/70 hover:text-gold">
          Back to top <ArrowUp className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </footer>
  )
}
