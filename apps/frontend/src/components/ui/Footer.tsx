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
      className="z-[2] flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4 px-6 md:px-20 py-6"
      style={{ borderTop: '1px solid var(--gold-15)' }}
    >
      <p className="text-disp-xs text-center md:text-left m-0 text-ink-4">{copyright}</p>

      <nav
        aria-label="Liens du pied de page"
        className="flex flex-wrap justify-center gap-x-7 gap-y-2"
      >
        {links.map(({ label, href }) => (
          <NavLink key={label} label={label} href={href} small />
        ))}
      </nav>

      {actions && actions.length > 0 && (
        <div role="group" aria-label="Actions" className="flex gap-4">
          {actions.map(({ icon, label }) => (
            <IconButton key={label} icon={icon} label={label} />
          ))}
        </div>
      )}
    </footer>
  )
}
