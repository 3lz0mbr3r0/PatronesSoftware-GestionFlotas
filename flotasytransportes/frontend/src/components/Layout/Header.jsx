import { NavLink } from 'react-router-dom'

function Header() {
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
        </nav>
        
        <div className="header-actions">
          <div className="user-menu">
            <div className="user-avatar">A</div>
            <span className="user-name">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header