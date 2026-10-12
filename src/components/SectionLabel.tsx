export function SectionLabel({ index, label, light = true }: { index: string; label: string; light?: boolean }) {
  return (
    <div className={`eyebrow flex items-center gap-4 ${light ? 'text-mineral/70' : 'text-bronze'}`}>
      <span className="font-display text-base tracking-normal normal-case italic">{index}</span>
      <span className={`h-px w-10 ${light ? 'bg-mineral/40' : 'bg-bronze/50'}`} />
      <span>{label}</span>
    </div>
  )
}
