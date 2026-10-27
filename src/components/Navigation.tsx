import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { brand, navItems } from '../data/site'

/** The few sections linked straight from the header; the full list lives in the menu. */
const HEADER_LINKS = ['#projects', '#hotels', '#collections', '#kitchens', '#founder']
import { langs, useLang } from '../i18n'
import { easeCine, easeLuxe } from '../lib/motion'
import { lockScroll, scrollToTarget } from '../lib/scroll'
import { Logo } from './Logo'

export function Navigation({ ready }: { ready: boolean }) {
  const { t, tx } = useLang()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const first = menuRef.current?.querySelector<HTMLElement>('a')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && menuRef.current) {
        const f = [toggleRef.current!, ...menuRef.current.querySelectorAll<HTMLElement>('a,button')]
        const i = f.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => scrollToTarget(href), 650)
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: easeLuxe, delay: ready && !scrolled ? 0.6 : 0 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`mx-auto flex items-center justify-between px-5 transition-all duration-700 md:px-10 ${
            scrolled && !open ? 'bg-ink/92 py-4' : 'py-6 md:py-8'
          }`}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              go('#top')
            }}
            className="relative z-10 text-bone"
            aria-label={`${brand.full} — ${t('back to top', 'volver arriba')}`}
          >
            <Logo />
          </a>
          <nav aria-label={t('Primary', 'Principal')} className={`hidden items-center gap-9 transition-opacity duration-500 lg:flex ${open ? "pointer-events-none opacity-0" : ""}`}>
            {navItems.filter((n) => HEADER_LINKS.includes(n.href)).map((n) => (
              <a
                key={n.href + n.label.en}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault()
                  go(n.href)
                }}
                className="group relative text-[0.6875rem] font-medium tracking-[0.24em] text-bone/80 uppercase transition-colors hover:text-bone"
              >
                {tx(n.label)}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="relative z-10 flex shrink-0 items-center gap-3 md:gap-6">
            <LangSwitch />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                go('#contact')
              }}
              className="hidden text-[0.6875rem] font-semibold tracking-[0.24em] text-gold uppercase md:block"
            >
              {t('Enquire', 'Cotizar')}
            </a>
            <button
              ref={toggleRef}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="fullscreen-menu"
              aria-label={open ? t('Close menu', 'Cerrar menú') : t('Open menu', 'Abrir menú')}
              className="group flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.24em] text-bone uppercase"
            >
              <span className="hidden sm:inline">{open ? t('Close', 'Cerrar') : t('Menu', 'Menú')}</span>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-bone/25 transition-colors group-hover:border-gold">
                <span className={`absolute h-px w-4 bg-current transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
                <span className={`absolute h-px w-4 bg-current transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="fullscreen-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('Site menu', 'Menú del sitio')}
            data-lenis-prevent
            className="fixed inset-0 z-40 overflow-hidden bg-ink"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 1, ease: easeCine }}
          >
            {/* category imagery cross-fades behind the list */}
            <div className="absolute inset-0">
              <AnimatePresence mode="sync">
                <motion.img
                  key={hovered}
                  src={navItems[hovered].image}
                  alt=""
                  className="grade absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 0.38, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: easeLuxe }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
            </div>

            <div className="relative flex h-full flex-col justify-between gap-10 overflow-y-auto overscroll-contain px-5 pt-28 pb-8 md:px-10 md:pt-32">
              <ul className="flex flex-col">
                {navItems.map((n, i) => (
                  <li key={n.label.en} className="overflow-hidden">
                    <motion.a
                      href={n.href}
                      onClick={(e) => {
                        e.preventDefault()
                        go(n.href)
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onFocus={() => setHovered(i)}
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '-110%' }}
                      transition={{ duration: 0.9, ease: easeLuxe, delay: 0.25 + i * 0.06 }}
                      className="group flex items-baseline gap-5 py-1 md:gap-8"
                    >
                      <span className="w-8 shrink-0 font-sans text-xs text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                      <span
                        className={`display min-w-0 pr-4 text-[clamp(2.25rem,min(12vw,7.6vh),5.75rem)] transition-all duration-700 ${n.href === '#elite' ? 'leading-[1.08]' : ''} ${
                          hovered === i ? 'translate-x-3 text-bone italic' : 'text-bone/70'
                        }`}
                      >
                        {tx(n.label)}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="eyebrow flex flex-wrap justify-between gap-4 border-t border-bone/15 pt-6 text-mineral/70"
              >
                <span>{brand.offices.map((o) => tx(o.cityLabel)).join(' · ')} · {t('Worldwide', 'Todo el mundo')}</span>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    go('#contact')
                  }}
                  className="text-gold md:hidden"
                >
                  {t('Enquire', 'Cotizar')}
                </a>
                <span>{t('Since', 'Desde')} {brand.since}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** EN | ES pill — always visible in the header and inside the open menu. */
function LangSwitch() {
  const { lang, setLang, t } = useLang()
  return (
    <div role="group" aria-label={t('Language', 'Idioma')} className="flex items-center rounded-full border border-bone/25 p-0.5">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'en' ? 'English' : 'Español'}
          className={`min-w-9 rounded-full px-2.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${
            lang === l ? 'bg-bone text-ink' : 'text-bone/60 hover:text-bone'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
