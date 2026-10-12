import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { easeLuxe } from '../lib/motion'

export function FadeIn({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: easeLuxe, delay }}
    >
      {children}
    </motion.div>
  )
}
