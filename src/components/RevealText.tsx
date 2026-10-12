import { motion } from 'motion/react'
import type { ElementType } from 'react'
import { easeLuxe } from '../lib/motion'

type Props = {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean
  /** Words to render in italic gold. */
  accent?: string[]
  accentClass?: string
}

/** Word-by-word vertical reveal behind a mask. Line breaks: use "\n". */
export function RevealText({ text, as: Tag = 'h2', className, delay = 0, stagger = 0.06, immediate, accent = [], accentClass = 'italic text-gold' }: Props) {
  const lines = text.split('\n')
  let i = 0
  const anim = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -12% 0px' } }
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')}>
      <motion.span initial="hide" {...anim} aria-hidden className="block">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(' ').map((word, wi) => {
              const idx = i++
              const strip = (w: string) => w.replace(/[.,]/g, '')
              const isAccent = accent.map(strip).includes(strip(word))
              return (
                <span key={wi} className="-mr-[0.12em] inline-block overflow-hidden pr-[0.12em] pb-[0.08em] align-top">
                  <motion.span
                    className={`inline-block ${isAccent ? accentClass : ''}`}
                    variants={{
                      hide: { y: '110%', rotate: 3 },
                      show: { y: '0%', rotate: 0, transition: { duration: 1.1, ease: easeLuxe, delay: delay + idx * stagger } },
                    }}
                  >
                    {word}
                  </motion.span>
                  {wi < line.split(' ').length - 1 && ' '}
                </span>
              )
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
