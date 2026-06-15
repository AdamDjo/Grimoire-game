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
    <nav aria-label="Étapes" className="flex items-stretch overflow-x-auto scrollbar-none">
      {steps.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="flex items-center min-w-0">
            {/* Connector */}
            {i > 0 && (
              <div
                className={[
                  'h-px w-6 shrink-0 transition-colors duration-300',
                  isDone ? 'bg-[var(--ember)]' : 'bg-[var(--line)]',
                ].join(' ')}
              />
            )}

            {/* Step */}
            <div
              aria-current={isActive ? 'step' : undefined}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-ui font-medium whitespace-nowrap transition-colors duration-200',
                isActive
                  ? 'text-[var(--ember)] bg-[var(--bg-3)]'
                  : isDone
                    ? 'text-[var(--ink-2)]'
                    : 'text-[var(--ink-4)]',
              ].join(' ')}
            >
              {/* Dot */}
              <span
                className={[
                  'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold shrink-0 border transition-colors duration-200',
                  isActive
                    ? 'border-[var(--ember)] text-[var(--ember)] bg-transparent'
                    : isDone
                      ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--bg)]'
                      : 'border-[var(--line)] text-[var(--ink-4)] bg-transparent',
                ].join(' ')}
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
