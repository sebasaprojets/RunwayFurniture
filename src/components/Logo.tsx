import { BRAND_SERIF } from './BrandMark'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center leading-none ${className}`}>
      <span className="text-[1.45rem] font-medium tracking-[0.2em]" style={{ fontFamily: BRAND_SERIF }}>
        RUNWAY
      </span>
      <span className="mt-1.5 flex items-center gap-1.5">
        <span className="h-px w-5 bg-gradient-to-r from-transparent to-gold" />
        <span className="size-1 rotate-45 bg-gold" />
        <span className="h-px w-5 bg-gradient-to-l from-transparent to-gold" />
      </span>
      <span className="mt-1.5 text-[0.46rem] font-semibold tracking-[0.36em] text-gold uppercase">Furniture International</span>
    </span>
  )
}
