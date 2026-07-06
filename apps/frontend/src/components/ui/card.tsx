import './card.css'

interface CardProps {
  index: string
  title: string
  body: string
  tone: 'ash' | 'gold' | 'soul'
}

export function Card({ index, title, body, tone }: CardProps) {
  return (
    <article className={`card card--${tone}`} data-motion="gameplay-card">
      <div className="card__head">
        <span className="card__index">{index}</span>
        <h3>{title}</h3>
        <span className="card__icon" aria-hidden="true" />
      </div>
      <p>{body}</p>
    </article>
  )
}
