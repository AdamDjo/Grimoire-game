const SIZE_STYLES = {
  sm: 'clamp(20px, 2vw, 26px)',
  md: 'clamp(24px, 2.5vw, 32px)',
  lg: 'clamp(28px, 3vw, 40px)',
} as const

export function Heading({
  title,
  level = 2,
  size = 'lg',
}: {
  title: string
  level?: 1 | 2 | 3
  size?: 'sm' | 'md' | 'lg'
}) {
  const className =
    'text-gradient-gold font-display font-semibold uppercase tracking-[0.08em] mb-5 block'
  const style = { fontSize: SIZE_STYLES[size], lineHeight: 1.1 }
  if (level === 1)
    return (
      <h1 className={className} style={style}>
        {title}
      </h1>
    )
  if (level === 3)
    return (
      <h3 className={className} style={style}>
        {title}
      </h3>
    )
  return (
    <h2 className={className} style={style}>
      {title}
    </h2>
  )
}
