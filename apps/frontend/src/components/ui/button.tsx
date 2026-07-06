import Link from 'next/link'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

import './button.css'

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href: string
  variant?: ButtonVariant
}

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <Link className={`button button--${variant} ${className}`} href={href} {...props}>
      <span className="button__corner button__corner--top-left" aria-hidden="true" />
      <span className="button__corner button__corner--top-right" aria-hidden="true" />
      <span className="button__corner button__corner--bottom-left" aria-hidden="true" />
      <span className="button__corner button__corner--bottom-right" aria-hidden="true" />
      <span className="button__sigil" aria-hidden="true" />
      <span>{children}</span>
      {variant === 'primary' ? <span className="button__spark" aria-hidden="true" /> : null}
    </Link>
  )
}
