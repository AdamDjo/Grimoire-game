export function StatItem({
  icon,
  value,
  label,
  iconLabel,
}: {
  icon: React.ReactNode
  value: string
  label: string
  iconLabel: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span aria-label={iconLabel} role="img" className="text-gold">
        {icon}
      </span>
      <span
        className="font-display font-semibold text-gold-light tracking-[0.05em]"
        style={{ fontSize: 28 }}
      >
        {value}
      </span>
      <span className="text-disp-xs">{label}</span>
    </div>
  )
}
