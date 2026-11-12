import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { brand, whatsappUrl } from '../data/site'
import { useLang } from '../i18n'
import { easeLuxe } from '../lib/motion'

/** WhatsApp's mark, drawn inline so the button needs no external asset. */
export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.44 9.44 0 0 1-1.45-5.04c0-5.22 4.25-9.46 9.47-9.46 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.21-4.25 9.45-9.47 9.45m8.05-17.5A11.32 11.32 0 0 0 12.05.66C5.78.66.67 5.77.67 12.05c0 2 .52 3.96 1.52 5.69L.57 23.66l6.06-1.59a11.37 11.37 0 0 0 5.42 1.38h.01c6.27 0 11.38-5.11 11.38-11.39 0-3.04-1.18-5.9-3.34-8.06" />
    </svg>
  )
}

/** A quiet round button in the corner that opens a chat with Runway, shown once the visitor scrolls past the opening. */
export function WhatsAppButton({ ready }: { ready: boolean }) {
  const { t } = useLang()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const on = () => setShown(window.scrollY > window.innerHeight * 0.6)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const label = t('Chat with us on WhatsApp', 'Escríbenos por WhatsApp')
  return (
    <AnimatePresence>
      {ready && shown && (
        <motion.a
          href={whatsappUrl(t('Hello, I would like more information about Runway Furniture.', 'Hola, me gustaría recibir información sobre Runway Furniture.'))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} — ${brand.whatsappLabel}`}
          className="group pointer-events-none fixed right-5 bottom-5 z-[90] flex items-center gap-3 md:right-8 md:bottom-8"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.7, ease: easeLuxe }}
        >
          <span className="pointer-events-none hidden translate-x-2 rounded-full bg-ink/85 px-4 py-2 text-[0.65rem] font-semibold tracking-[0.2em] text-bone uppercase opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:block">
            {label}
          </span>
          {/* only the round button takes clicks: the label beside it never covers what is underneath */}
          <span className="pointer-events-auto relative grid size-14 place-items-center rounded-full bg-gold text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.8s]" />
            <WhatsAppIcon className="relative size-7" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
