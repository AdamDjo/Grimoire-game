'use client'

import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-ember-grad text-[var(--bg)] font-semibold hover:brightness-110 active:brightness-90 animate-ember-pulse',
  secondary:
    'bg-[var(--bg-3)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--panel-edge)] hover:bg-[var(--bg-2)]',
  danger:
    'bg-[var(--hp)] text-[var(--ink)] font-semibold hover:brightness-110 active:brightness-90',
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-[var(--radius)]',
  lg: 'px-7 py-3.5 text-lg rounded-[var(--radius)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-ui transition-all duration-200 cursor-pointer select-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
