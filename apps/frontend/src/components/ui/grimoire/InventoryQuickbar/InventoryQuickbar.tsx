import type { HTMLAttributes } from 'react'

import './inventory-quickbar.css'

export interface InventoryQuickbarProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
}

export function InventoryQuickbar({
  children,
  className = '',
  label = 'Raccourcis d’inventaire',
  ...props
}: InventoryQuickbarProps) {
  return (
    <div aria-label={label} className={`inventory-quickbar ${className}`} role="toolbar" {...props}>
      {children}
    </div>
  )
}
