import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'
import eventBus from '../../services/EventBus'
import RouteMap from '../Map/RouteMap'

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

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 1s ease' }}></div>
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [vehiculos, setVehiculos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[Dashboard] useEffect - MONTAJE')
    cargarDatos()
    const unsub1 = eventBus.subscribe('vehiculo:created', (data) => {
      cargarDatos()
    })
    const unsub2 = eventBus.subscribe('vehiculo:deleted', (data) => {
      cargarDatos()
    })
    const unsub3 = eventBus.subscribe('vehiculo:estadoChanged', (data) => {
      cargarDatos()
    })
    const unsub4 = eventBus.subscribe('orden:created', (data) => {
      cargarDatos()
    })
    const unsub5 = eventBus.subscribe('reporte:created', (data) => {
      cargarDatos()
    })
    return () => {
      console.log('[Dashboard] useEffect - LIMPIEZA')
      unsub1(); unsub2(); unsub3(); unsub4(); unsub5()
    }
  }, [])

  const cargarDatos = async () => {
    console.log('[Dashboard] cargarDatos() ejecutándose')
    try {
      const [vehiculosData, ordenesData, reportesData] = await Promise.all([
        vehiculosService.getAll(),
        ordenesService.getAll(),
        reportesService.getAll()
      ])
      console.log('[Dashboard] Datos cargados:', { vehiculos: vehiculosData.length, ordenes: ordenesData.length, reportes: reportesData.length })
      setVehiculos(vehiculosData)
      setOrdenes(ordenesData)
      setReportes(reportesData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTiempo = (fechaStr) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr)
    const ahora = new Date()
    const diffMs = ahora - fecha
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'hace unos segundos'
    if (diffMin < 60) return `hace ${diffMin} min`
    const diffHoras = Math.floor(diffMin / 60)
    if (diffHoras < 24) return `hace ${diffHoras} h`
    const diffDias = Math.floor(diffHoras / 24)
    return `hace ${diffDias} día${diffDias > 1 ? 's' : ''}`
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

  // #1: Actividad Reciente Real
  const actividadReciente = [
    ...ordenes.map(o => {
      const coords = o.origenLat ? `(${o.origenLat}, ${o.origenLng}) → (${o.destinoLat}, ${o.destinoLng})` : ''
      return {
        id: `ord-${o.codigoOrden}`,
        tipo: 'orden',
        icon: '◬',
        titulo: `Orden ${o.codigoOrden}`,
        detalle: `${o.estado || 'CREADA'}${o.vehiculoPlaca ? ` • Vehículo: ${o.vehiculoPlaca}` : ' • Sin asignar'}${coords ? ` • ${coords}` : ''}`,
        tiempo: formatTiempo(o.fechaCreacion),
        fecha: o.fechaCreacion
      }
    }),
    ...reportes.map((r, i) => ({
      id: `rep-${r.placaVehiculo}-${i}`,
      tipo: 'mantenimiento',
      icon: '◳',
      titulo: `${r.tipoMantenimiento} - ${r.placaVehiculo}`,
      detalle: [
        r.prioridad ? `Prioridad: ${r.prioridad}` : '',
        r.costoEstimado ? `$${r.costoEstimado.toLocaleString()}` : '',
        r.taller ? `Taller: ${r.taller}` : '',
        r.nivelDesgaste ? `Desgaste: ${r.nivelDesgaste}` : ''
      ].filter(Boolean).join(' • '),
      tiempo: formatTiempo(r.fecha),
      fecha: r.fecha
    }))
  ].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)).slice(0, 5)

  // #2: Vehículos próximos a mantenimiento
  const vehiculosMantenimiento = vehiculos
    .filter(v => v.kilometrajeActual && v.limiteMantenimiento)
    .map(v => ({
      ...v,
      pctMantenimiento: (v.kilometrajeActual / v.limiteMantenimiento) * 100
    }))
    .filter(v => v.pctMantenimiento >= 70)
    .sort((a, b) => b.pctMantenimiento - a.pctMantenimiento)
    .slice(0, 5)

  const getMantenimientoColor = (pct) => {
    if (pct >= 95) return '#ef4444'
    if (pct >= 80) return '#f59e0b'
    return '#8b5cf6'
  }

  // #3: Top vehículos por kilometraje
  const topKilometraje = [...vehiculos]
    .filter(v => v.kilometrajeActual)
    .sort((a, b) => (b.kilometrajeActual || 0) - (a.kilometrajeActual || 0))
    .slice(0, 5)
  const maxKm = topKilometraje.length > 0 ? topKilometraje[0].kilometrajeActual : 1

  // #4: Distribución de flota
  const distribucionTipos = {}
  const distribucionEnergia = {}
  const distribucionEstado = {}
  vehiculos.forEach(v => {
    const tipo = v.tipo || 'CAMION'
    distribucionTipos[tipo] = (distribucionTipos[tipo] || 0) + 1
    const energia = v.tipoEnergia || 'GASOLINA'
    distribucionEnergia[energia] = (distribucionEnergia[energia] || 0) + 1
    distribucionEstado[v.estado] = (distribucionEstado[v.estado] || 0) + 1
  })

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
    }
  }

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
            <RouteMap vehiculos={vehiculos} ordenes={ordenes} />
          </div>
        </div>
      </section>

      <QuickActions onAction={handleAction} />

      {/* #1: Actividad Reciente Real */}
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
                <div className={`activity-icon ${item.tipo}`}>{item.icon}</div>
                <div className="activity-content">
                  <span className="activity-title">{item.titulo}</span>
                  <span className="activity-time">{item.detalle} • {item.tiempo}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* #2: Vehículos próximos a mantenimiento */}
        <section>
          <h2 className="section-title">Vehículos Próximos a Mantenimiento</h2>
          {vehiculosMantenimiento.length === 0 ? (
            <div className="stat-card">
              <p style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>✓ Todos los vehículos están dentro del límite</p>
            </div>
          ) : (
            <div className="activity-list">
              {vehiculosMantenimiento.map(v => (
                <div key={v.placa} className="activity-item">
                  <div className="activity-icon vehiculo" style={{ background: getMantenimientoColor(v.pctMantenimiento) + '22', color: getMantenimientoColor(v.pctMantenimiento) }}>◭</div>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <span className="activity-title">{v.placa}</span>
                    <span className="activity-time">{v.tipo || 'CAMION'} • {v.tipoEnergia || 'GASOLINA'}</span>
                    <span className="activity-time">{Math.round(v.kilometrajeActual).toLocaleString()} / {Math.round(v.limiteMantenimiento).toLocaleString()} km</span>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '0.25rem', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(v.pctMantenimiento, 100)}%`, height: '100%', background: getMantenimientoColor(v.pctMantenimiento), borderRadius: '3px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: getMantenimientoColor(v.pctMantenimiento) }}>
                    {Math.round(v.pctMantenimiento)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* #3: Top vehículos por kilometraje */}
        <section>
          <h2 className="section-title">Top Kilometraje</h2>
          {topKilometraje.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-text">Sin datos de kilometraje</div>
            </div>
          ) : (
            <div className="activity-list">
              {topKilometraje.map((v, i) => (
                <div key={v.placa} className="activity-item">
                  <div style={{ width: '24px', textAlign: 'center', fontWeight: 700, color: i === 0 ? 'var(--accent-primary)' : i < 3 ? '#f59e0b' : 'var(--text-muted)', fontSize: '0.875rem' }}>
                    #{i + 1}
                  </div>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <span className="activity-title">{v.placa}</span>
                    <span className="activity-time">{v.tipo || 'CAMION'} • {v.tipoEnergia || 'GASOLINA'} • {v.estado}</span>
                    <span className="activity-time">
                      {Math.round(v.kilometrajeActual).toLocaleString()} km
                      {v.limiteMantenimiento ? ` (${Math.round((v.kilometrajeActual / v.limiteMantenimiento) * 100)}% del límite)` : ''}
                    </span>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '0.25rem', overflow: 'hidden' }}>
                      <div style={{ width: `${(v.kilometrajeActual / maxKm) * 100}%`, height: '100%', background: i === 0 ? 'var(--accent-primary)' : i < 3 ? '#8b5cf6' : 'var(--text-muted)', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {Math.round(v.kilometrajeActual).toLocaleString()} km
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* #4: Distribución de la flota */}
      <section style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Distribución de la Flota</h2>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Por Tipo</span>
          </div>
          {Object.entries(distribucionTipos).map(([tipo, count]) => {
            const pct = Math.round((count / vehiculos.length) * 100)
            return <Bar key={tipo} label={`${tipo} (${pct}%)`} value={count} max={vehiculos.length} color="var(--accent-primary)" />
          })}
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#8b5cf6' }}>Por Energía</span>
          </div>
          {Object.entries(distribucionEnergia).map(([energia, count]) => {
            const pct = Math.round((count / vehiculos.length) * 100)
            return <Bar key={energia} label={`${energia} (${pct}%)`} value={count} max={vehiculos.length} color="#8b5cf6" />
          })}
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>Por Estado</span>
          </div>
          {Object.entries(distribucionEstado).map(([estado, count]) => {
            const colores = { DISPONIBLE: 'var(--accent-primary)', EN_RUTA: '#8b5cf6', MANTENIMIENTO: '#f59e0b' }
            const pct = Math.round((count / vehiculos.length) * 100)
            return <Bar key={estado} label={`${estado} (${pct}%)`} value={count} max={vehiculos.length} color={colores[estado] || 'var(--text-muted)'} />
          })}
        </div>
      </section>


    </>
  )
}

export default Dashboard