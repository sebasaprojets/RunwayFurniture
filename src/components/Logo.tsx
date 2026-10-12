export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="font-display text-[1.65rem] tracking-[0.32em]">RUNWAY</span>
      <span className="mt-1 text-[0.5rem] font-semibold tracking-[0.42em] text-gold uppercase">Furniture International</span>
    </span>
  )
}
