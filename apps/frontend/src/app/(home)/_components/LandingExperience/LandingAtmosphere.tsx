'use client'

/**
 * Decorative overlays for the landing: film grain, vignette, the pointer beam,
 * the custom cursor and the veil played when leaving for another route.
 *
 * Everything here is `aria-hidden` and pointer-transparent — the page reads and
 * operates identically without it. Behaviour lives in `landing-atmosphere.ts`
 * and is wired by `useLandingMotion`, which owns the reduced-motion gate.
 */
export function LandingAtmosphere() {
  return (
    <>
      <div className="salt-atmosphere" aria-hidden="true">
        <div className="salt-atmosphere__vignette" />
        <div className="salt-atmosphere__beam" />
        <div className="salt-atmosphere__grain" />
      </div>
      <div className="salt-cursor" aria-hidden="true">
        <div className="salt-cursor__grain" />
      </div>
      <div className="salt-counter" aria-hidden="true">
        <span className="salt-counter__index">
          <span className="salt-counter__current">01</span>
          <span>/</span>
          <span className="salt-counter__total">06</span>
        </span>
        <span className="salt-counter__label" />
      </div>
    </>
  )
}
