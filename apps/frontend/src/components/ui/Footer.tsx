import { IconButton } from './IconButton'
import { NavLink } from './NavLink'

export function Footer({
  copyright,
  links,
  actions,
}: {
  copyright: string
  links: { label: string; href: string }[]
  actions?: { icon: React.ReactNode; label: string }[]
}) {
  return (
    <footer
      role="contentinfo"
      style={{
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid rgba(196,164,104,0.12)',
        padding: '24px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'var(--ink-4)',
          margin: 0,
        }}
      >
        {copyright}
      </p>
      <nav aria-label="Liens du pied de page" style={{ display: 'flex', gap: 28 }}>
        {links.map(({ label, href }) => (
          <NavLink key={label} label={label} href={href} small />
        ))}
      </nav>
      {actions && actions.length > 0 && (
        <div role="group" aria-label="Actions" style={{ display: 'flex', gap: 16 }}>
          {actions.map(({ icon, label }) => (
            <IconButton key={label} icon={icon} label={label} />
          ))}
        </div>
      )}
    </footer>
  )
}
