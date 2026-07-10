import Link from 'next/link'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

import './button.css'

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href: string
  variant?: ButtonVariant
  disabled?: boolean
}

export function Button({
  children,
  href,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const decorations = (
    <>
      <span className="button__corner button__corner--top-left" aria-hidden="true" />
      <span className="button__corner button__corner--top-right" aria-hidden="true" />
      <span className="button__corner button__corner--bottom-left" aria-hidden="true" />
      <span className="button__corner button__corner--bottom-right" aria-hidden="true" />
      <span className="button__sigil" aria-hidden="true" />
      <span>{children}</span>
    </>
  )

  // État inerte : un `<Link>` désactivé reste focusable et cliquable, donc on
  // rend un `<span>` avec le rôle/état ARIA. Sheen et spark (animations
  // d'appel à l'action) sont retirés — le bouton ne doit pas attirer l'œil.
  if (disabled) {
    return (
      <span
        className={`button button--${variant} button--disabled relative inline-flex items-center justify-center gap-4 leading-none ${className}`}
        role="link"
        aria-disabled="true"
      >
        {decorations}
      </span>
    )
  }

  return (
    <Link
      className={`button button--${variant} relative inline-flex items-center justify-center gap-4 leading-none ${className}`}
      href={href}
      {...props}
    >
      {variant !== 'ghost' ? <span className="button__sheen" aria-hidden="true" /> : null}
      {decorations}
      {variant === 'primary' ? <span className="button__spark" aria-hidden="true" /> : null}
    </Link>
  )
}
