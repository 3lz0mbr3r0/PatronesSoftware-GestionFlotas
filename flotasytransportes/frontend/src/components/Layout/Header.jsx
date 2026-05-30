import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 28L20 8L32 28H8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
              <circle cx="14" cy="24" r="3" fill="currentColor"/>
              <circle cx="26" cy="24" r="3" fill="currentColor"/>
              <path d="M6 32H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">Flotas</span>
            <span className="logo-subtitle">Transportes</span>
          </div>
        </div>
        
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <span className="nav-icon">◫</span>
            Dashboard
          </NavLink>
          <NavLink to="/ordenes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◬</span>
            Órdenes
          </NavLink>
          <NavLink to="/vehiculos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◭</span>
            Vehículos
          </NavLink>
          <NavLink to="/reportes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◳</span>
            Mantenimiento
          </NavLink>
          <NavLink to="/rutas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◰</span>
            Rutas
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◱</span>
            Analytics
          </NavLink>
          <NavLink to="/historial-vehiculo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◷</span>
            Historial
          </NavLink>
          <NavLink to="/calendario-mantenimiento" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◶</span>
            Calendario
          </NavLink>
        </nav>
        
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          {/* <div className="user-menu">
            <div className="user-avatar">A</div>
            <span className="user-name">Admin</span>
          </div> */}
        </div>
      </div>
    </header>
  )
}

export default Header