import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useCalmScroll } from '../lib/motion'

/**
 * A light section rising out of the dark one before it: it arrives as a slightly inset card with
 * rounded shoulders and opens to the full width as it reaches the top of the screen (a clip, cheap
 * on the graphics card). Phones, tablets and reduced motion get the section as it is.
 */
export function Curtain({ id, className, labelledBy, children }: { id: string; className: string; labelledBy?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const calm = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 15%'] })
  const side = useTransform(scrollYProgress, [0, 1], [4.5, 0])
  const round = useTransform(scrollYProgress, [0, 1], [36, 0])
  const clipPath = useTransform(() => `inset(0% ${side.get()}% 0% ${side.get()}% round ${round.get()}px ${round.get()}px 0px 0px)`)
  return (
    <motion.section ref={ref} id={id} className={className} aria-labelledby={labelledBy} style={calm ? undefined : { clipPath }}>
      {children}
    </motion.section>
  )
}
