import type { ReactNode } from 'react'

interface DividerProps {
  icon?: ReactNode
}

export function Divider({ icon }: DividerProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        margin: '24px 0',
      }}
    >
      <span
        style={{
          flex: '0 1 160px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--gold-dark))',
        }}
      />
      {icon ? (
        <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : (
        <>
          <span
            style={{
              width: '8px',
              height: '8px',
              border: '1px solid var(--gold)',
              transform: 'rotate(45deg)',
            }}
          />
          <span
            style={{
              width: '5px',
              height: '5px',
              background: 'var(--gold-dark)',
              transform: 'rotate(45deg)',
            }}
          />
          <span
            style={{
              width: '8px',
              height: '8px',
              border: '1px solid var(--gold)',
              transform: 'rotate(45deg)',
            }}
          />
        </>
      )}
      <span
        style={{
          flex: '0 1 160px',
          height: '1px',
          background: 'linear-gradient(270deg, transparent, var(--gold-dark))',
        }}
      />
    </div>
  )
}
