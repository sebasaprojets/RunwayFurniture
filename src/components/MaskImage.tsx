import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { Pic } from './Pic'
import { useRef } from 'react'
import { thumb } from '../data/site'
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
  /** Rendered width hint so the browser can pick the lighter file. */
  sizes?: string
  /** Border classes for a frame that opens together with the image. */
  frame?: string
}

const clips = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

/** Image revealed by an architectural clip-path wipe, with a gentle scroll parallax inside the frame. */
export function MaskImage({ src, alt, className = '', imgClassName = '', from = 'bottom', parallax = 5, delay = 0, priority, sizes = '(min-width: 640px) 50vw, 100vw', frame = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const calm = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])
  // The wipe is triggered by the outer frame, which is never clipped: a fully closed clip-path has
  // no visible area, and some browsers then never report the image as on screen.
  const seen = useInView(ref, { once: true, amount: 0.15 })
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className={`absolute inset-0 overflow-hidden bg-graphite ${frame}`}
        initial={{ clipPath: clips[from] }}
        animate={seen ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.5, ease: easeCine, delay }}
      >
        <Pic src={src} sizes={sizes}>
          <motion.img
            src={src}
            srcSet={thumb(src) === src ? undefined : `${thumb(src)} 1280w, ${src} 2000w`}
            sizes={sizes}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={calm ? undefined : { y, scale: 1 + parallax / 50 }}
            className={`grade h-full w-full object-cover ${imgClassName}`}
          />
        </Pic>
      </motion.div>
    </div>
  )
}
