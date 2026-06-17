interface Step {
  id: string
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: string
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav aria-label="Étapes" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
      {steps.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = step.id === currentStep

        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <div
                style={{
                  height: '1px',
                  width: '32px',
                  flexShrink: 0,
                  background: isDone
                    ? 'linear-gradient(90deg, var(--gold-dark), var(--gold))'
                    : 'var(--border)',
                  transition: 'background .3s',
                }}
              />
            )}
            <div
              aria-current={isActive ? 'step' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-disp)',
                fontSize: '11px',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: isActive ? 'var(--gold-light)' : isDone ? 'var(--ink-2)' : 'var(--ink-4)',
                background: isActive ? 'rgba(196,164,104,.08)' : 'transparent',
                transition: 'color .2s, background .2s',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `1px solid ${isActive ? 'var(--gold)' : isDone ? 'var(--gold-dark)' : 'var(--border)'}`,
                  background: isDone ? 'var(--gold-dark)' : 'transparent',
                  color: isDone ? 'var(--bg)' : isActive ? 'var(--gold)' : 'var(--ink-4)',
                  fontSize: '10px',
                  flexShrink: 0,
                  transition: 'border-color .2s, background .2s, color .2s',
                }}
              >
                {isDone ? '✓' : i + 1}
              </span>
              {step.label}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
