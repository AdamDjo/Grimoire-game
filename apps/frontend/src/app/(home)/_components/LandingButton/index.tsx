import Link from 'next/link'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

type LandingButtonVariant = 'primary' | 'ghost'

interface LandingButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href: string
  variant?: LandingButtonVariant
}

export function LandingButton({
  children,
  href,
  variant = 'primary',
  className = '',
  ...props
}: LandingButtonProps) {
  return (
    <Link
      className={`landing-button landing-button--${variant} ${className}`}
      href={href}
      {...props}
    >
      <span
        className="landing-button__corner landing-button__corner--top-left"
        aria-hidden="true"
      />
      <span
        className="landing-button__corner landing-button__corner--top-right"
        aria-hidden="true"
      />
      <span
        className="landing-button__corner landing-button__corner--bottom-left"
        aria-hidden="true"
      />
      <span
        className="landing-button__corner landing-button__corner--bottom-right"
        aria-hidden="true"
      />
      <span className="landing-button__sigil" aria-hidden="true" />
      <span>{children}</span>
      {variant === 'primary' ? <span className="landing-button__spark" aria-hidden="true" /> : null}
    </Link>
  )
}
