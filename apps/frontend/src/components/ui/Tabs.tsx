'use client'

import { useState } from 'react'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        gap: '4px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const isHovered = tab.id === hoveredId

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            onMouseEnter={() => setHoveredId(tab.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              position: 'relative',
              padding: '10px 18px',
              fontFamily: 'var(--font-disp)',
              fontSize: '11px',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--gold-light)' : isHovered ? 'var(--ink)' : 'var(--ink-3)',
              transition: 'color .2s',
            }}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '18px',
                  right: '18px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
