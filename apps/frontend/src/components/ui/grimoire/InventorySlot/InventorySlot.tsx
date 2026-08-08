'use client'

import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './inventory-slot.css'

export interface InventorySlotProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon?: ReactNode
  quantity?: number
  selected?: boolean
}

export const InventorySlot = forwardRef<HTMLButtonElement, InventorySlotProps>(
  function InventorySlot(
    {
      className,
      disabled = false,
      icon,
      label,
      quantity,
      selected = false,
      type = 'button',
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        aria-label={label}
        aria-pressed={selected}
        className={cn('inventory-slot', selected && 'inventory-slot--selected', className)}
        disabled={disabled}
        type={type}
        {...props}
      >
        <span className="inventory-slot__content" aria-hidden="true">
          {icon}
        </span>
        {quantity !== undefined ? (
          <span className="inventory-slot__quantity">{quantity}</span>
        ) : null}
      </button>
    )
  }
)

InventorySlot.displayName = 'InventorySlot'
