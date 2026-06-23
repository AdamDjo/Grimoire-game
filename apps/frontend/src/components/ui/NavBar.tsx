import { NavLink } from './NavLink'

export function NavBar({
  logo,
  links,
}: {
  logo: React.ReactNode
  links: { label: string; href: string; active?: boolean }[]
}) {
  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        height: 64,
        background: 'linear-gradient(180deg, rgba(5,5,6,0.95) 0%, rgba(5,5,6,0.0) 100%)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{logo}</div>
      <nav aria-label="Navigation principale" style={{ display: 'flex', gap: 36 }}>
        {links.map(({ label, href, active }) => (
          <NavLink key={label} label={label} href={href} active={active} />
        ))}
      </nav>
    </header>
  )
}
