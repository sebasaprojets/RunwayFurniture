import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'ghost' | 'dark'
  className?: string
  type?: 'button' | 'submit'
}

/** Pill button with a sliding fill and arrow that travels on hover. */
export function Button({ children, href, onClick, variant = 'solid', className = '', type = 'button' }: Props) {
  const styles = {
    solid: 'bg-bone text-ink [--fill:var(--color-gold)]',
    ghost: 'border border-bone/30 text-bone [--fill:var(--color-bone)] hover:text-ink',
    dark: 'bg-ink text-bone [--fill:var(--color-bronze)]',
  }[variant]
  const inner = (
    <>
      <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[var(--fill)] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 grid size-5 place-items-center overflow-hidden">
        <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-5 group-hover:-translate-y-5" strokeWidth={1.5} />
        <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-0 group-hover:translate-y-0" strokeWidth={1.5} />
      </span>
    </>
  )
  const cls = `group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[0.6875rem] font-semibold tracking-[0.28em] uppercase transition-colors duration-500 ${styles} ${className}`
  if (href)
    return (
      <a
        href={href}
        onClick={(e) => {
          if (!onClick) return
          e.preventDefault()
          onClick()
        }}
        className={cls}
      >
        {inner}
      </a>
    )
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
