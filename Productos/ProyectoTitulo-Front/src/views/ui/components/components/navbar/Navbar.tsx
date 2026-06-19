import { useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../../../context/AuthContext'
import { logoutUsuario } from '../../../../../services/usuarioService'
import { NotificationBell } from './components/notificationBell/NotificationBell'
import './Navbar.css'

export type NavbarLink = {
  label: string
  href: string
}

export type NavbarProps = {
  brand?: string
  links?: NavbarLink[]
}

const defaultLinks: NavbarLink[] = [
  { label: 'INICIO', href: '/' },
  { label: 'PARTIDOS', href: '/partidos' },
  { label: 'CONTACTOS', href: '/contactos' },
  { label: 'AGENDAR', href: '/agendamiento' },
]

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24">
      {open ? (
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" fill="none" />
      ) : (
        <>
          <path d="M4 6h16" stroke="currentColor" strokeWidth="2" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2" />
          <path d="M4 18h16" stroke="currentColor" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

function Navbar({
  brand = 'DOUBLE FAULT',
  links = defaultLinks,
}: NavbarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { usuario, isAuthenticated, logout } = useAuth()
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutUsuario()
      logout()
      navigate('/login')
    } catch (error) {
      console.error('Error en logout:', error)
      logout()
      navigate('/login')
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setMenuOpen(false)
    setProfileMenuOpen(false)
  }

  return (
    <header className="top-navbar">
      <div className="top-navbar__inner">
        <div 
          className="top-navbar__brand" 
          onClick={() => handleNavigation('/')}
          style={{ cursor: 'pointer' }}
        >
          {brand}
        </div>

        <nav
          className={`top-navbar__links ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navegacion principal"
        >
          {!isAuthPage && isAuthenticated && links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="top-navbar__link"
              onClick={(e) => {
                e.preventDefault()
                handleNavigation(link.href)
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="top-navbar__actions">
          {isAuthenticated && usuario ? (
            <>
              <div className="top-navbar__user-info">
                <span className="top-navbar__username">
                  {usuario.nombre} {usuario.apellidoPaterno}
                </span>
              </div>

              <NotificationBell isAuthenticated={isAuthenticated} />

              <div className="top-navbar__profile-menu">
                <button
                  className="top-navbar__profile-button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  title="Menú de usuario"
                  aria-label="Abrir menú de usuario"
                >
                  <div className="top-navbar__avatar">
                    <span className="top-navbar__avatar-text">
                      {usuario.nombre[0]}{usuario.apellidoPaterno[0]}
                    </span>
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="top-navbar__profile-dropdown">
                    <button
                      className="top-navbar__dropdown-link"
                      onClick={() => handleNavigation('/vista')}
                    >
                      👤 Ver Perfil
                    </button>
                    <button
                      className="top-navbar__dropdown-link"
                      onClick={() => handleNavigation('/historial')}
                    >
                      📚 Historial
                    </button>
                    <button
                      className="top-navbar__dropdown-link"
                      onClick={() => handleNavigation('/cambiar-password')}
                    >
                      🔑 Cambiar Contraseña
                    </button>
                    <button
                      className="top-navbar__dropdown-link top-navbar__logout-link"
                      onClick={handleLogout}
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="top-navbar__auth-button"
                onClick={() => handleNavigation('/login')}
              >
                Iniciar Sesión
              </button>
              <button
                className="top-navbar__auth-button top-navbar__auth-button--primary"
                onClick={() => handleNavigation('/register')}
              >
                Registrarse
              </button>
            </>
          )}

          <button
            className="top-navbar__icon-button top-navbar__menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Menú móvil - SIEMPRE VISIBLE CUANDO menuOpen = true */}
      {menuOpen && (
        <div className="top-navbar__mobile-menu">
          {/* Si está autenticado, muestra info del usuario */}
          {isAuthenticated && usuario && (
            <>
              <div className="top-navbar__mobile-user">
                <div className="top-navbar__mobile-avatar">
                  <span>{usuario.nombre[0]}{usuario.apellidoPaterno[0]}</span>
                </div>
                <span className="top-navbar__mobile-username">
                  {usuario.nombre} {usuario.apellidoPaterno}
                </span>
              </div>

              <div className="top-navbar__mobile-divider"></div>
            </>
          )}

          {/* Links de navegación */}
          <div className="top-navbar__mobile-links">
            {!isAuthPage && isAuthenticated && links.map((link) => (
              <button
                key={`${link.label}-${link.href}`}
                className="top-navbar__mobile-link"
                onClick={() => handleNavigation(link.href)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Opciones según autenticación */}
          {isAuthenticated && usuario ? (
            <>
              <div className="top-navbar__mobile-divider"></div>
              <div className="top-navbar__mobile-options">
                <button
                  className="top-navbar__mobile-option"
                  onClick={() => handleNavigation('/perfil')}
                >
                  👤 Mi Perfil
                </button>
                <button
                  className="top-navbar__mobile-option"
                  onClick={() => handleNavigation('/sesiones')}
                >
                  🔐 Mis Sesiones
                </button>
                <button
                  className="top-navbar__mobile-option"
                  onClick={() => handleNavigation('/cambiar-password')}
                >
                  🔑 Cambiar Contraseña
                </button>
                <button
                  className="top-navbar__mobile-option top-navbar__mobile-logout"
                  onClick={handleLogout}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="top-navbar__mobile-divider"></div>
              <div className="top-navbar__mobile-options">
                <button
                  className="top-navbar__mobile-option"
                  onClick={() => handleNavigation('/login')}
                >
                  🔓 Iniciar Sesión
                </button>
                <button
                  className="top-navbar__mobile-option top-navbar__mobile-register"
                  onClick={() => handleNavigation('/register')}
                >
                  📝 Registrarse
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default memo(Navbar);