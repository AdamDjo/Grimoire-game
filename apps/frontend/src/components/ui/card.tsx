import './card.css'

interface CardProps {
  index: string
  title: string
  body: string
  tone: 'ash' | 'gold' | 'soul'
  // Segment mis en avant en tête du body (ex. « Jet de SOUFFLE »), coloré en
  // accent tandis que le reste du texte garde l'encre lisible du parchemin.
  accent?: string
}

export function Card({ index, title, body, tone, accent }: CardProps) {
  return (
    <article className={`card card--${tone}`} data-motion="gameplay-card">
      <div className="card__head grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[18px]">
        <span className="card__index text-card-num text-gold-soft leading-[0.9]">{index}</span>
        <h3 className="m-0 font-accent text-card-title font-medium text-parchment">{title}</h3>
        <span
          className="card__icon relative inline-block aspect-square w-11 rotate-45 text-gold before:h-px before:w-[22px]"
          aria-hidden="true"
        />
      </div>
      <p className="text-card-manuscript">
        {/* `.card p` est un conteneur flex (centrage vertical du manuscrit) : ses
            enfants directs sont « flexifiés » en items. Un accent + un nœud texte
            nus deviendraient deux items côte à côte qui se chevauchent. On enveloppe
            donc tout le contenu textuel dans un seul <span> = un unique flex item ;
            à l'intérieur, l'accent redevient un span inline dans le flux normal
            (desktop), et bascule en block au-dessus du corps sur mobile via CSS. */}
        <span className="card__manuscript">
          {accent ? <span className="card__accent">{accent}</span> : null}
          {accent ? ' ' : null}
          {body}
        </span>
      </p>
    </article>
  )
}
