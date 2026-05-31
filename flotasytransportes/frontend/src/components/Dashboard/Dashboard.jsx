import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'
import eventBus from '../../services/EventBus'
import RouteMap from '../Map/RouteMap'
import DonutChart from './DonutChart'

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
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHistorial, setShowHistorial] = useState(false)
  const [proyecciones, setProyecciones] = useState([])
  const [actividadEventos, setActividadEventos] = useState(() => {
    try {
      const saved = localStorage.getItem('actividadEventos')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    console.log('[Dashboard] useEffect - MONTAJE')
    cargarDatos()
    const agregarEvento = (tipo, titulo, detalle) => {
      const nuevoEvento = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tipo,
        icon: tipo === 'vehiculo' ? '⬡' : tipo === 'reporte' ? '◳' : '◬',
        titulo,
        detalle,
        fecha: new Date().toISOString()
      }
      setActividadEventos(prev => {
        const nuevos = [nuevoEvento, ...prev].slice(0, 30)
        try { localStorage.setItem('actividadEventos', JSON.stringify(nuevos)) } catch {}
        return nuevos
      })
    }
    const unsub1 = eventBus.subscribe('vehiculo:created', (data) => {
      cargarDatos()
      agregarEvento('vehiculo', `Vehículo Creado: ${data.placa || data?.placaVehiculo || ''}`, '')
    })
    const unsub2 = eventBus.subscribe('vehiculo:deleted', (data) => {
      cargarDatos()
      agregarEvento('vehiculo', `Vehículo Eliminado: ${data?.placa || ''}`, '')
    })
    const unsub3 = eventBus.subscribe('vehiculo:estadoChanged', (data) => {
      cargarDatos()
    })
    const unsub4 = eventBus.subscribe('orden:created', (data) => {
      cargarDatos()
      agregarEvento('orden', `Orden Creada: ${data.codigoOrden || ''}`, data.vehiculoPlaca ? `Vehículo: ${data.vehiculoPlaca}` : '')
    })
    const unsub5 = eventBus.subscribe('reporte:created', (data) => {
      cargarDatos()
      agregarEvento('reporte', `Reporte Creado: ${data.tipoMantenimiento || ''}`, data.placaVehiculo ? `Vehículo: ${data.placaVehiculo}` : '')
    })
    const unsub6 = eventBus.subscribe('orden:deleted', (data) => {
      cargarDatos()
    })
    const unsub7 = eventBus.subscribe('reporte:deleted', (data) => {
      cargarDatos()
    })
    const unsub8 = eventBus.subscribe('orden:completada', (data) => {
      cargarDatos()
      agregarEvento('orden', `Orden Completada: ${data.codigoOrden || ''}`, data.vehiculoPlaca ? `Vehículo: ${data.vehiculoPlaca}` : '')
    })
    return () => {
      console.log('[Dashboard] useEffect - LIMPIEZA')
      unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7(); unsub8()
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
      const placas = [...new Set(reportesData.map(r => r.placaVehiculo).filter(Boolean))]
      if (placas.length > 0) {
        Promise.all(
          placas.map(placa =>
            reportesService.proyectar(placa).catch(() => null)
          )
        ).then(res => setProyecciones(res.filter(Boolean)))
          .catch(() => {})
      }
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
  const actividadReciente = actividadEventos
    .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
    .slice(0, 5)

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
          {stats.mantenimiento === 0 && reportes.length > 0 && (
            <div className="hero-info">
              <span className="hero-info-icon">◳</span>
              <span className="hero-info-text">{reportes.length} reporte{reportes.length > 1 ? 's' : ''} de mantenimiento registrado{reportes.length > 1 ? 's' : ''} — los vehículos ya fueron marcados como disponibles</span>
            </div>
          )}
        </div>
        <div className="hero-visual">
          <div className="map-placeholder">
            <RouteMap vehiculos={vehiculos} ordenes={ordenes} />
          </div>
        </div>
      </section>

      {/* <QuickActions onAction={handleAction} /> */}

      {/* #1: Actividad Reciente Real */}
      <section className="recent-activity">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Actividad Reciente</h2>
          {actividadEventos.length > 5 && (
            <button
              onClick={() => setShowHistorial(true)}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem',
                border: '1px solid var(--border-subtle)',
                background: 'transparent', color: 'var(--accent-primary)',
                cursor: 'pointer'
              }}
            >Ver historial completo →</button>
          )}
        </div>
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
                    <span className="activity-time">{item.detalle} • {formatTiempo(item.fecha)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Predicciones */}
      {proyecciones.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2 className="section-title">Predicciones de Mantenimiento</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {proyecciones.map(p => {
              const riesgoColors = {
                CRITICO: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '#ef4444' },
                ALTO: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '#f59e0b' },
                MEDIO: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '#8b5cf6' },
                BAJO: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent-primary)', border: 'var(--accent-primary)' }
              }
              const rc = riesgoColors[p.nivelRiesgo] || riesgoColors.BAJO
              return (
                <div key={p.placa} className="stat-card" style={{ borderColor: rc.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{p.placa}</strong>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', background: rc.bg, color: rc.color }}>
                      {p.nivelRiesgo}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {p.ultimoKmReporte && <div>Último reporte: {Math.round(p.ultimoKmReporte).toLocaleString()} km</div>}
                    {p.promedioIntervaloKm && <div>Intervalo promedio: {Math.round(p.promedioIntervaloKm).toLocaleString()} km</div>}
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                      Próximo estimado: {Math.round(p.proximoEstimadoKm).toLocaleString()} km
                    </div>
                    {p.kmRestantes != null && (
                      <div style={{ color: p.kmRestantes <= 0 ? '#ef4444' : 'var(--text-primary)' }}>
                        {p.kmRestantes <= 0
                          ? `⚠ ${Math.abs(p.kmRestantes).toLocaleString()} km vencido`
                          : `${Math.round(p.kmRestantes).toLocaleString()} km restantes`
                        }
                      </div>
                    )}
                    {p.diasEstimados != null && (
                      <div style={{ color: 'var(--accent-primary)' }}>
                        ≈ {p.diasEstimados} día{p.diasEstimados !== 1 ? 's' : ''} estimados
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

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
        <div className="donut-grid">
          <DonutChart
            data={Object.entries(distribucionTipos).map(([label, value]) => ({ label, value }))}
            total={vehiculos.length}
            title="Por Tipo"
            colors={['#00d4aa', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6']} />
          <DonutChart
            data={Object.entries(distribucionEnergia).map(([label, value]) => ({ label, value }))}
            total={vehiculos.length}
            title="Por Energía"
            colors={['#f59e0b', '#ef4444', '#00d4aa', '#8b5cf6']} />
          <DonutChart
            data={Object.entries(distribucionEstado).map(([label, value]) => ({ label, value }))}
            total={vehiculos.length}
            title="Por Estado"
            colors={['#00d4aa', '#8b5cf6', '#ef4444']} />
        </div>
      </section>

      {/* Historial completo modal */}
      {showHistorial && (() => {
        const historialCompleto = [...actividadEventos]
          .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))

        return (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }} onClick={() => setShowHistorial(false)}>
            <div className="stat-card" style={{
              maxWidth: '700px', width: '100%', maxHeight: '80vh',
              overflow: 'auto', margin: 0
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Historial Completo</h2>
                <button
                  onClick={() => setShowHistorial(false)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    border: '1px solid var(--border-subtle)',
                    background: 'transparent', color: 'var(--text-muted)',
                    cursor: 'pointer', fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >✕</button>
              </div>
              <div className="activity-list">
                {historialCompleto.length === 0 ? (
                  <div className="activity-empty">
                    <span className="activity-icon-small">◌</span>
                    <span className="activity-text">No hay actividad registrada</span>
                  </div>
                ) : (
                  historialCompleto.map(item => (
                    <div key={item.id} className="activity-item">
                      <div className={`activity-icon ${item.tipo}`}>{item.icon}</div>
                      <div className="activity-content">
                        <span className="activity-title">{item.titulo}</span>
                        <span className="activity-time">{item.detalle} • {formatTiempo(item.fecha)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )
      })()}


    </>
  )
}

export default Dashboard