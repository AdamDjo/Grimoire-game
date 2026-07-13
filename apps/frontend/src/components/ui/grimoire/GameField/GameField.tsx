import { cloneElement, useId } from 'react'

import type { ReactElement } from 'react'

import './game-field.css'

interface FieldControlProps {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

export interface GameFieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactElement<FieldControlProps>
  className?: string
}

export function GameField({
  children,
  className = '',
  error,
  hint,
  label,
  required = false,
}: GameFieldProps) {
  const generatedId = useId()
  const controlId = children.props.id ?? `${generatedId}-control`
  const hintId = hint ? `${generatedId}-hint` : undefined
  const errorId = error ? `${generatedId}-error` : undefined
  const describedBy = [children.props['aria-describedby'], hintId, errorId]
    .filter(Boolean)
    .join(' ')

  const control = cloneElement(children, {
    id: controlId,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': error ? true : children.props['aria-invalid'],
  })

  return (
    <div className={`game-field ${error ? 'game-field--invalid' : ''} ${className}`}>
      <label className="game-field__label" htmlFor={controlId}>
        {label}
        {required ? (
          <span className="game-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {control}
      {hint ? (
        <p className="game-field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="game-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
