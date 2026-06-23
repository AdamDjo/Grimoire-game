'use client'

import { useState } from 'react'

import { NavLink } from './NavLink'

export function NavBar({
  logo,
  links,
}: {
  logo: React.ReactNode
  links: { label: string; href: string; active?: boolean }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-12 h-16"
        style={{
          background: 'linear-gradient(180deg, var(--bg-overlay-95) 0%, rgba(5,5,6,0.0) 100%)',
          backdropFilter: 'blur(2px)',
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
          className="fixed inset-0 z-[99] md:hidden"
          style={{ background: 'var(--bg-overlay-50)' }}
        />
      )}

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="Navigation principale"
        className={`fixed top-16 left-0 right-0 z-[100] md:hidden flex flex-col py-3 pb-5 transition-all duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'var(--bg-overlay-97)',
          borderBottom: '1px solid var(--gold-15)',
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
