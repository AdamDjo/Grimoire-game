'use client'

import { type InputHTMLAttributes, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ReactNode
  onAction?: () => void
  actionIcon?: React.ReactNode
}

export function Input({
  error,
  icon,
  onAction,
  actionIcon,
  disabled,
  style,
  className,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false)

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: `1px solid ${focused ? 'var(--gold)' : 'var(--border-choice)'}`,
    borderRadius: 'var(--radius)',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '0 4px 0 0',
    boxShadow: focused ? '0 0 0 1px rgba(196,164,104,.3)' : 'none',
    transition: 'border-color .25s, box-shadow .25s',
    opacity: disabled ? 0.4 : 1,
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: 'var(--font-serif)',
    fontSize: '16px',
    color: 'var(--parchment)',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '13px 16px',
    cursor: disabled ? 'not-allowed' : undefined,
    ...style,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className={className}>
      <div style={wrapperStyle}>
        {icon && (
          <span
            style={{
              paddingLeft: '16px',
              color: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
        <input
          disabled={disabled}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '46px',
              border: '1px solid var(--gold-dark)',
              borderRadius: 'var(--radius)',
              background: 'linear-gradient(180deg, #3a2d18, #241a0c)',
              color: 'var(--gold-light)',
              flexShrink: 0,
              transition: 'border-color .25s, box-shadow .3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-light)'
              e.currentTarget.style.boxShadow =
                '0 0 26px rgba(224,196,137,.5), inset 0 0 14px rgba(196,164,104,.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-dark)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {actionIcon}
          </button>
        )}
      </div>
      {error && (
        <span style={{ color: '#c44a3e', fontFamily: 'var(--font-serif)', fontSize: '14px' }}>
          {error}
        </span>
      )}
    </div>
  )
}
