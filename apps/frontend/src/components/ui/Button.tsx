'use client'

import { type ButtonHTMLAttributes, forwardRef, useState } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'choice'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const BASE: React.CSSProperties = {
  cursor: 'pointer',
  fontFamily: 'var(--font-disp)',
  textTransform: 'uppercase',
  border: '1px solid',
  borderRadius: 'var(--radius)',
  transition: 'color .25s, border-color .25s, box-shadow .3s, transform .25s',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}

interface StyleMap {
  default: React.CSSProperties
  hover: React.CSSProperties
}

const VARIANTS: Record<ButtonVariant, StyleMap> = {
  primary: {
    default: {
      fontSize: '14px',
      letterSpacing: '.18em',
      color: 'var(--gold-light)',
      padding: '16px 38px',
      borderColor: 'var(--gold-dark)',
      background: 'linear-gradient(180deg, #2c2217, #1a130c)',
      boxShadow:
        'inset 0 1px 0 rgba(224,196,137,.22), inset 0 0 0 1px rgba(11,8,5,.6), 0 6px 18px rgba(0,0,0,.4)',
    },
    hover: {
      color: 'var(--gold-hover)',
      borderColor: 'var(--gold-light)',
      boxShadow:
        'inset 0 1px 0 rgba(224,196,137,.4), 0 0 30px rgba(224,196,137,.5), 0 0 70px rgba(196,164,104,.22), 0 6px 18px rgba(0,0,0,.4)',
    },
  },
  secondary: {
    default: {
      fontSize: '13px',
      letterSpacing: '.16em',
      color: 'var(--ink)',
      padding: '14px 30px',
      borderColor: 'var(--gold-border)',
      background: 'linear-gradient(180deg, #241c12, #16100a)',
      boxShadow: 'inset 0 1px 0 rgba(224,196,137,.15), 0 5px 14px rgba(0,0,0,.35)',
    },
    hover: {
      color: 'var(--gold-light)',
      borderColor: 'var(--gold-light)',
      boxShadow: '0 0 24px rgba(224,196,137,.34), inset 0 1px 0 rgba(224,196,137,.2)',
    },
  },
  ghost: {
    default: {
      fontSize: '12px',
      letterSpacing: '.2em',
      color: 'var(--text-parch-3)',
      padding: '13px 4px',
      borderColor: 'transparent',
      background: 'transparent',
      boxShadow: 'none',
    },
    hover: { color: 'var(--ruby)' },
  },
  choice: {
    default: {
      fontSize: '15px',
      letterSpacing: '.06em',
      textTransform: 'none',
      color: 'var(--gold-light)',
      padding: '16px 20px',
      borderColor: 'var(--border-choice)',
      background: 'linear-gradient(180deg, #211b14, #15100a)',
      boxShadow: 'inset 0 0 0 1px rgba(196,164,104,.12), 0 4px 12px rgba(0,0,0,.3)',
      justifyContent: 'flex-start',
      textAlign: 'left',
    },
    hover: {
      borderColor: 'var(--gold-light)',
      boxShadow:
        'inset 0 0 0 1px rgba(224,196,137,.45), 0 0 26px rgba(224,196,137,.42), 0 0 60px rgba(196,164,104,.2)',
      transform: 'translateX(4px)',
    },
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', disabled, style, children, ...props }, ref) => {
    const [hovered, setHovered] = useState(false)
    const v = VARIANTS[variant]
    const computed: React.CSSProperties = {
      ...BASE,
      ...v.default,
      ...(hovered && !disabled ? v.hover : {}),
      ...(disabled ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
      ...style,
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={computed}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
