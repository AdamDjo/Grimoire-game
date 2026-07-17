interface ConsequenceListProps {
  messages: string[]
}

export function ConsequenceList({ messages }: ConsequenceListProps) {
  if (messages.length === 0) return null

  return (
    <div className="game-session-consequences" aria-label="Latest consequences" role="status">
      {messages.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  )
}
