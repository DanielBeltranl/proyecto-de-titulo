import './Navbar.css'

export type NavbarLink = {
  label: string
  href: string
}

export type NavbarProps = {
  brand?: string
  links?: NavbarLink[]
  profileImageUrl?: string
  onNotificationsClick?: () => void
  onSettingsClick?: () => void
}

const defaultLinks: NavbarLink[] = [
  { label: 'PAGINA PRINCIPAL', href: '/' },
  { label: 'AMIGOS', href: '/amigos' },
  { label: 'GRUPOS', href: '/grupos' },
  { label: 'PERFIL', href: '/perfil' },
  { label: 'ENTRENADOR', href: '/entrenador' },
]

const defaultProfileImage =
  'https://lh3.googleusercontent.com/aida/ADBb0ugApgdPDo8Omj_CyV6FZMGtPrdCyrkIJMLnW11zlM89uSwDpyecysXm-8U92PJ7tqmO1uvsJ3uPJVFvKZdfkPzSzQOjB7e8T2J9ZvDe7O2irpLGvRkaj6cA1GpEEuw1eodXvwnLq0fWlTEhtQS6IbZu8Mc6a4Ggz_YQqbjGJ_cRB9nL5sYex0yMGT-EMcXm2_V0y_1AHHpwpJdrmvllrnW4bvggwNZ9d0Gnv91BWKQZvL0B78Ar2L61Z-j89ciWo5bNxjif_QSkdw'

function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2a6 6 0 0 0-6 6v3.56c0 .74-.2 1.46-.58 2.1L4 16h16l-1.42-2.34a4.06 4.06 0 0 1-.58-2.1V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 2.82-2H9.18A3 3 0 0 0 12 22Z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M19.14 12.94c.04-.3.06-.62.06-.94s-.02-.64-.07-.95l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.35 7.35 0 0 0-1.64-.95l-.36-2.54A.5.5 0 0 0 13.88 2h-3.76a.5.5 0 0 0-.49.42L9.27 4.96c-.58.23-1.13.54-1.64.95l-2.39-.96a.5.5 0 0 0-.6.22L2.72 8.49a.5.5 0 0 0 .12.64l2.03 1.58c-.05.31-.07.63-.07.95s.02.64.07.95l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.51.4 1.06.72 1.64.95l.36 2.54a.5.5 0 0 0 .49.42h3.76a.5.5 0 0 0 .49-.42l.36-2.54c.58-.23 1.13-.55 1.64-.95l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z" />
    </svg>
  )
}

function Navbar({
  brand = 'DOUBLE FOULT',
  links = defaultLinks,
  profileImageUrl = defaultProfileImage,
  onNotificationsClick,
  onSettingsClick,
}: NavbarProps) {
  return (
    <header className="top-navbar">
      <div className="top-navbar__inner">
        <div className="top-navbar__brand">{brand}</div>

        <nav className="top-navbar__links" aria-label="Navegacion principal">
          {links.map((link) => (
            <a key={`${link.label}-${link.href}`} href={link.href} className="top-navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="top-navbar__actions">
          <button
            type="button"
            className="top-navbar__icon-button"
            aria-label="Notificaciones"
            onClick={onNotificationsClick}
          >
            <NotificationIcon />
          </button>
          <button
            type="button"
            className="top-navbar__icon-button"
            aria-label="Configuracion"
            onClick={onSettingsClick}
          >
            <SettingsIcon />
          </button>

          <div className="top-navbar__avatar" aria-hidden="true">
            <img src={profileImageUrl} alt="User profile" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar