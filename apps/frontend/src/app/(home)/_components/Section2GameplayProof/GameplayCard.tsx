interface GameplayCardProps {
  card: {
    body: string
    index: string
    title: string
    tone: 'ash' | 'gold' | 'soul'
  }
}

export function GameplayCard({ card }: GameplayCardProps) {
  return (
    <article className={`gameplay-card gameplay-card--${card.tone}`} data-motion="gameplay-card">
      <div className="gameplay-card__head">
        <span className="gameplay-card__index">{card.index}</span>
        <h3>{card.title}</h3>
        <span className="gameplay-card__icon" aria-hidden="true" />
      </div>
      <p>{card.body}</p>
    </article>
  )
}
