'use client'

import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ error, disabled, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <input
        disabled={disabled}
        className={[
          'w-full bg-[var(--bg-3)] text-[var(--ink)] border rounded-[var(--radius)] px-4 py-2.5 text-base font-ui',
          'placeholder:text-[var(--ink-4)]',
          'transition-colors duration-200',
          'focus:outline-none focus:border-[var(--ember)] focus:ring-1 focus:ring-[var(--ember)]',
          error ? 'border-[var(--hp)]' : 'border-[var(--line)]',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <span className="text-[var(--hp)] text-sm font-ui">{error}</span>}
    </div>
  )
}
