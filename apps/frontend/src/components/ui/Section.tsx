export function Section({
  id,
  snap = false,
  'aria-label': ariaLabel,
  children,
  style,
}: {
  id?: string
  snap?: boolean
  'aria-label'?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        zIndex: 2,
        height: '100vh',
        flexShrink: 0,
        ...(snap && {
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always' as const,
        }),
        ...style,
      }}
    >
      {children}
    </section>
  )
}
