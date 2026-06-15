type StatBarVariant = 'hp' | 'mana' | 'vigor' | 'default'

interface StatBarProps {
  label?: string
  value: number
  max: number
  variant?: StatBarVariant
  showValues?: boolean
  className?: string
}

const VARIANT_COLOR: Record<StatBarVariant, string> = {
  hp: 'var(--hp)',
  mana: 'var(--mana)',
  vigor: 'var(--vig)',
  default: 'var(--ember)',
}

export function StatBar({
  label,
  value,
  max,
  variant = 'default',
  showValues = true,
  className = '',
}: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const color = VARIANT_COLOR[variant]

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label != null || showValues) && (
        <div className="flex justify-between items-baseline text-xs font-ui">
          {label && <span className="text-[var(--ink-3)]">{label}</span>}
          {showValues && (
            <span className="text-[var(--ink-2)] tabular-nums ml-auto">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-[var(--bg-3)] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
