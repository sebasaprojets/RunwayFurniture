import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { easeCine, easeLuxe } from '../lib/motion'

/** Opening title card: black frame → monogram → wordmark → curtain lifts onto the hero. */
export function Preloader({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false)
      onDone()
    }, reduced ? 300 : 2500)
    return () => clearTimeout(t)
  }, [onDone, reduced])

  const letters = 'RUNWAY'.split('')
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.2, ease: easeCine }}
          aria-hidden
        >
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 80 96" className="mb-6 h-16 w-14 text-gold">
              <motion.text
                x="40"
                y="78"
                textAnchor="middle"
                fontFamily="Instrument Serif, Georgia, serif"
                fontSize="96"
                fill="currentColor"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: easeLuxe }}
              >
                R
              </motion.text>
            </svg>
            <div className="flex overflow-hidden font-display text-4xl tracking-[0.35em] text-bone md:text-5xl">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: easeLuxe, delay: 0.35 + i * 0.07 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="mt-5 h-px bg-gold/60"
              initial={{ width: 0 }}
              animate={{ width: 180 }}
              transition={{ duration: 1.3, ease: easeLuxe, delay: 0.7 }}
            />
            <motion.p
              className="eyebrow mt-5 text-mineral/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.1 }}
            >
              Furniture International
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
