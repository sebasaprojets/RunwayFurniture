import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { easeCine, useCalmScroll } from '../lib/motion'

type Props = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Direction the mask opens from. */
  from?: 'bottom' | 'left' | 'right' | 'top'
  parallax?: number
  delay?: number
  priority?: boolean
}

const clips = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

/** Image revealed by an architectural clip-path wipe, with a gentle scroll parallax inside the frame. */
export function MaskImage({ src, alt, className = '', imgClassName = '', from = 'bottom', parallax = 5, delay = 0, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const calm = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-graphite ${className}`}
      initial={{ clipPath: clips[from] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.5, ease: easeCine, delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={calm ? undefined : { y, scale: 1 + parallax / 50 }}
        className={`grade h-full w-full object-cover ${imgClassName}`}
      />
    </motion.div>
  )
}
