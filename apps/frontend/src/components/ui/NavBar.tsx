'use client'

import { useEffect, useRef, useState } from 'react'

import { NavLink } from './NavLink'

const HIDE_THRESHOLD = 8 // px pour éviter les jitters
const OPAQUE_THRESHOLD = 80

/**
 * Hide on scroll-down, show on scroll-up, opaque dès qu'on a quitté le top.
 * `mounted` retarde la 1ʳᵉ apparition pour permettre l'anim slide-down + fade.
 */
function useNavbarScrollState() {
  const [hidden, setHidden] = useState(false)
  const [opaque, setOpaque] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setMounted(true)
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      setOpaque(y > OPAQUE_THRESHOLD)
      if (y < OPAQUE_THRESHOLD) {
        setHidden(false)
      } else if (Math.abs(delta) > HIDE_THRESHOLD) {
        setHidden(delta > 0)
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { hidden, opaque, mounted }
}

export function NavBar({
  logo,
  links,
}: {
  logo: React.ReactNode
  links: { label: string; href: string; active?: boolean }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { hidden, opaque, mounted } = useNavbarScrollState()

  // Translation : -100% au mount, 0 quand monté + non hidden, -100% quand hidden.
  const translateY = !mounted ? '-100%' : hidden && !isOpen ? '-100%' : '0%'

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between px-5 md:px-12 h-16 motion-safe:transition-[transform,background,backdrop-filter] motion-safe:duration-[600ms] motion-safe:ease-out"
        style={{
          transform: `translateY(${translateY})`,
          background: opaque
            ? 'linear-gradient(180deg, rgba(5,5,6,0.55) 0%, rgba(5,5,6,0.15) 70%, rgba(5,5,6,0) 100%)'
            : 'linear-gradient(180deg, rgba(5,5,6,0.35) 0%, rgba(5,5,6,0) 100%)',
          backdropFilter: opaque ? 'blur(14px)' : 'blur(2px)',
          WebkitBackdropFilter: opaque ? 'blur(14px)' : 'blur(2px)',
        }}
      >
        <div className="flex items-center gap-2.5">{logo}</div>

        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden md:flex gap-5 lg:gap-9">
          {links.map(({ label, href, active }) => (
            <NavLink key={label} label={label} href={href} active={active} />
          ))}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 cursor-pointer bg-transparent border-0"
        >
          <span
            className="block w-6 h-px rounded transition-all duration-200"
            style={{
              background: 'var(--gold)',
              transform: isOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            className="block w-6 h-px rounded transition-all duration-200"
            style={{ background: 'var(--gold)', opacity: isOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px rounded transition-all duration-200"
            style={{
              background: 'var(--gold)',
              transform: isOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          aria-hidden
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[49] md:hidden"
          style={{ background: 'var(--bg-overlay-50)' }}
        />
      )}

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="Navigation principale"
        className={`fixed top-16 left-0 right-0 z-[50] md:hidden flex flex-col py-3 pb-5 transition-all duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(5,5,6,0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {links.map(({ label, href, active }) => (
          <div key={label} className="px-6 py-3" onClick={() => setIsOpen(false)}>
            <NavLink label={label} href={href} active={active} />
          </div>
        ))}
      </nav>
    </>
  )
}
