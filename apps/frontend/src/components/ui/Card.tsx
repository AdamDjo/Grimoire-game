import type { ReactNode, MouseEvent } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  className?: string
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

export function Card({ children, title, className = '', onClick }: CardProps) {
  const isClickable = Boolean(onClick)

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ')
                onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
            }
          : undefined
      }
      className={[
        'bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius)] p-5',
        isClickable
          ? 'cursor-pointer transition-all duration-200 hover:border-[var(--panel-edge)] hover:bg-[var(--bg-3)] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ember)]'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {title && (
        <h3 className="font-disp text-[var(--ember)] text-sm uppercase tracking-widest mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
