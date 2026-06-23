const SIZE_STYLES = {
  sm: 'clamp(16px, 1.6vw, 22px)',
  md: 'clamp(18px, 2vw, 28px)',
  lg: 'clamp(22px, 2.5vw, 34px)',
} as const

const GRADIENT = 'linear-gradient(180deg, #e8d4a0 0%, #c4a468 100%)'

export function Heading({
  title,
  level = 2,
  size = 'lg',
}: {
  title: string
  level?: 1 | 2 | 3
  size?: 'sm' | 'md' | 'lg'
}) {
  const Tag = `h${level}`
  return (
    <Tag
      style={{
        fontFamily: 'var(--font-disp)',
        fontSize: SIZE_STYLES[size],
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        background: GRADIENT,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: '0 0 20px',
      }}
    >
      {title}
    </Tag>
  )
}
