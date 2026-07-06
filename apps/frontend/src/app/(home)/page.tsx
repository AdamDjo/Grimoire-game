const LANDING_MOMENTS = ['Hero', 'Gameplay proof', 'Auberge'] as const

export default function HomePage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Navigation principale">
        <a className="landing-brand" href="/">
          GRIMOIRE
        </a>
        <a className="landing-nav-link" href="/login">
          Entrer
        </a>
      </nav>

      <section className="landing-reset" aria-labelledby="landing-title">
        <p className="landing-kicker">Nouvelle base landing</p>
        <h1 id="landing-title">Of Ash and Salt</h1>
        <p className="landing-copy">
          Socle nettoye pour reconstruire la landing pixel-perfect du plan VEO3 avec des
          fonds propres, des calques HTML lisibles et des animations ajoutees progressivement.
        </p>

        <div className="landing-moments" aria-label="Moments prevus">
          {LANDING_MOMENTS.map((moment) => (
            <span key={moment}>{moment}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
