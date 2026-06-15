'use client'

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
  return (
    <div role="tablist" className="flex border-b border-[var(--line)] gap-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              'relative px-4 py-2.5 text-sm font-ui font-medium transition-colors duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ember)] rounded-t-md',
              isActive ? 'text-[var(--ember)]' : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]',
            ].join(' ')}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-ember-grad rounded-full"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
