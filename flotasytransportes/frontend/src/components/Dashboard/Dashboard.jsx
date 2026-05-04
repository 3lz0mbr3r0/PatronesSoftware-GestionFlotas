import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehiculosService, ordenesService } from '../../services/api'

function StatCard({ number, label }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const duracion = 1000
    const paso = Math.ceil(number / (duracion / 16))
    let valorActual = 0
    const intervalo = setInterval(() => {
      valorActual += paso
      if (valorActual >= number) {
        valorActual = number
        clearInterval(intervalo)
      }
      setValue(valorActual)
    }, 16)
    return () => clearInterval(intervalo)
  }, [number])

  return (
    <div className="stat-card">
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function QuickActions({ onAction }) {
  const actions = [
    { id: 'nueva-orden', icon: '➜', title: 'Nueva Orden', desc: 'Crear orden de transporte' },
    { id: 'registrar-vehiculo', icon: '⬡', title: 'Registrar Vehículo', desc: 'Agregar nuevo vehículo' },
    { id: 'generar-reporte', icon: '⬳', title: 'Generar Reporte', desc: 'Reportes de mantenimiento' },
    { id: 'ver-rutas', icon: '⬢', title: 'Ver Rutas', desc: 'Optimizar rutas activas' }
  ]

  return (
    <section className="quick-actions">
      <h2 className="section-title">Acciones Rápidas</h2>
      <div className="actions-grid">
        {actions.map(action => (
          <button key={action.id} className="action-card" onClick={() => onAction(action.id)}>
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <span className="action-title">{action.title}</span>
              <span className="action-desc">{action.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [vehiculos, setVehiculos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [vehiculosData, ordenesData] = await Promise.all([
        vehiculosService.getAll(),
        ordenesService.getAll()
      ])
      setVehiculos(vehiculosData)
      setOrdenes(ordenesData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    vehiculos: vehiculos.length,
    ordenesHoy: ordenes.filter(o => {
      const fecha = new Date(o.fechaCreacion)
      const hoy = new Date()
      return fecha.toDateString() === hoy.toDateString()
    }).length,
    enRuta: vehiculos.filter(v => v.estado === 'EN_RUTA').length,
    mantenimiento: vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length
  }

  const handleAction = (actionId) => {
    switch (actionId) {
      case 'nueva-orden':
        navigate('/ordenes')
        break
      case 'registrar-vehiculo':
        navigate('/vehiculos')
        break
      case 'generar-reporte':
        navigate('/reportes')
        break
      case 'ver-rutas':
        navigate('/reportes')
        break
      default:
        console.log('Acción:', actionId)
    }
  }

  const actividadReciente = [
    { id: 1, tipo: 'orden', titulo: 'Orden ORD-001 creada', tiempo: ' hace 5 minutos' },
    { id: 2, tipo: 'vehiculo', titulo: 'Vehículo ABC-123 asignado', tiempo: ' hace 15 minutos' },
    { id: 3, tipo: 'mantenimiento', titulo: 'Mantenimiento programado', tiempo: ' hace 1 hora' }
  ]

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Sistema de <span className="gradient-text">Gestión</span> de Flotas
          </h1>
          <p className="hero-subtitle">
            Optimiza tus operaciones de transporte con monitoreo en tiempo real, 
            optimización de rutas y mantenimiento predictivo.
          </p>
          <div className="hero-stats">
            <StatCard number={stats.vehiculos} label="Vehículos Activos" />
            <StatCard number={stats.ordenesHoy} label="Órdenes Hoy" />
            <StatCard number={stats.enRuta} label="En Ruta" />
            <StatCard number={stats.mantenimiento} label="En Mantenimiento" />
          </div>
        </div>
        <div className="hero-visual">
          <div className="map-placeholder">
            <div className="map-grid">
              <div className="map-route" style={{ '--delay': '0s', '--x': '20%', '--y': '30%' }}>
                <div className="route-point origin"></div>
                <div className="route-line"></div>
                <div className="route-point destination"></div>
              </div>
              <div className="map-route" style={{ '--delay': '1s', '--x': '60%', '--y': '50%' }}>
                <div className="route-point origin"></div>
                <div className="route-line"></div>
                <div className="route-point destination"></div>
              </div>
              <div className="map-route" style={{ '--delay': '2s', '--x': '40%', '--y': '70%' }}>
                <div className="route-point origin"></div>
                <div className="route-line"></div>
                <div className="route-point destination"></div>
              </div>
            </div>
            <div className="map-overlay">
              <span>Mapa de Rutas</span>
            </div>
          </div>
        </div>
      </section>

      <QuickActions onAction={handleAction} />

      <section className="recent-activity">
        <h2 className="section-title">Actividad Reciente</h2>
        <div className="activity-list">
          {actividadReciente.length === 0 ? (
            <div className="activity-empty">
              <span className="activity-icon-small">◌</span>
              <span className="activity-text">No hay actividad reciente</span>
            </div>
          ) : (
            actividadReciente.map(item => (
              <div key={item.id} className="activity-item">
                <div className={`activity-icon ${item.tipo}`}>
                  {item.tipo === 'orden' ? '◬' : item.tipo === 'vehiculo' ? '◭' : '◳'}
                </div>
                <div className="activity-content">
                  <span className="activity-title">{item.titulo}</span>
                  <span className="activity-time">{item.tiempo}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

export default Dashboard