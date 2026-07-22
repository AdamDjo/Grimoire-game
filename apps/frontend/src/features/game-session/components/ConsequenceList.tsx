interface ConsequenceListProps {
  messages: string[]
}

export function ConsequenceList({ messages }: ConsequenceListProps) {
  const t = useTranslations('Session')
  if (messages.length === 0) return null

  return (
    <div className="game-session-consequences" aria-label={t('latestConsequences')} role="status">
      {messages.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  )
}
import { useTranslations } from 'next-intl'
