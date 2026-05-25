import React, { useState, useEffect } from 'react'
import { reportesService, vehiculosService } from '../../services/api'
import commandHistory, { CrearReporteCommand } from '../../patterns/comandos'

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '1rem'
}

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)'
}

const TIPOS_MANTENIMIENTO = ['PREVENTIVO', 'CORRECTIVO', 'PREDICTIVO']
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA']
const NIVELES_DESGASTE = ['BUENO', 'REGULAR', 'ALTO', 'CRITICO']

function getPrioridadStyle(prioridad) {
  const colores = {
    BAJA: { bg: 'rgba(0, 212, 170, 0.15)', color: 'var(--accent-primary)' },
    MEDIA: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
    ALTA: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
    CRITICA: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }
  }
  return colores[prioridad] || { bg: 'var(--bg-tertiary)', color: 'var(--text-muted)' }
}

function Reportes() {
  const [reportes, setReportes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [formData, setFormData] = useState({
    placaVehiculo: '',
    kilometraje: '',
    fecha: new Date().toISOString().split('T')[0],
    tipoMantenimiento: 'PREVENTIVO',
    observaciones: '',
    prioridad: 'MEDIA',
    tecnicoResponsable: '',
    taller: '',
    costoEstimado: '',
    tiempoEstimadoHoras: '',
    requiereRepuestos: false,
    nivelDesgaste: 'BUENO',
    proximoMantenimientoKm: ''
  })

  const [viewMode, setViewMode] = useState('all')
  const [ordenDir, setOrdenDir] = useState('desc')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [kmUmbralProximos, setKmUmbralProximos] = useState(5000)
  const [loadingReportes, setLoadingReportes] = useState(false)
  const [vehiculosProximos, setVehiculosProximos] = useState([])
  const [proyeccionSeleccionada, setProyeccionSeleccionada] = useState(null)
  const [proyeccionData, setProyeccionData] = useState(null)
  const [loadingProyeccion, setLoadingProyeccion] = useState(false)

  const verProyeccion = async (placa) => {
    if (proyeccionSeleccionada === placa) {
      setProyeccionSeleccionada(null)
      setProyeccionData(null)
      return
    }
    setProyeccionSeleccionada(placa)
    setLoadingProyeccion(true)
    setProyeccionData(null)
    try {
      const data = await reportesService.proyectar(placa)
      setProyeccionData(data)
    } catch {
      setProyeccionData(null)
    } finally {
      setLoadingProyeccion(false)
    }
  }

  const cargarReportes = async (modo, params) => {
    setLoadingReportes(true)
    try {
      let data
      switch (modo) {
        case 'sorted':
          data = await reportesService.getOrdenadosPorFecha(params?.dir || ordenDir)
          break
        case 'range':
          data = await reportesService.getPorRango(params?.desde || fechaDesde, params?.hasta || fechaHasta)
          break
        case 'proximos':
          data = await reportesService.getVehiculosProximos(params?.kmUmbral || kmUmbralProximos)
          setVehiculosProximos(data)
          setLoadingReportes(false)
          return
        default:
          data = await reportesService.getAll()
      }
      setVehiculosProximos([])
      setReportes(data)
    } catch (error) {
      console.error('Error cargando reportes:', error)
    } finally {
      setLoadingReportes(false)
    }
  }

  useEffect(() => {
    Promise.all([
      reportesService.getAll(),
      vehiculosService.getAll()
    ]).then(([reportesData, vehiculosData]) => {
      setReportes(reportesData)
      setVehiculos(vehiculosData)
    }).catch(error => {
      console.error('Error cargando datos:', error)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)
    setResultado(null)
    try {
      const dto = {
        placaVehiculo: formData.placaVehiculo,
        kilometraje: parseFloat(formData.kilometraje),
        fecha: formData.fecha,
        tipoMantenimiento: formData.tipoMantenimiento,
        observaciones: formData.observaciones || null,
        prioridad: formData.prioridad || null,
        tecnicoResponsable: formData.tecnicoResponsable || null,
        taller: formData.taller || null,
        costoEstimado: formData.costoEstimado ? parseFloat(formData.costoEstimado) : null,
        tiempoEstimadoHoras: formData.tiempoEstimadoHoras ? parseInt(formData.tiempoEstimadoHoras) : null,
        requiereRepuestos: formData.requiereRepuestos,
        nivelDesgaste: formData.nivelDesgaste || null,
        proximoMantenimientoKm: formData.proximoMantenimientoKm ? parseFloat(formData.proximoMantenimientoKm) : null
      }
      const cmd = new CrearReporteCommand(dto)
      const res = await commandHistory.ejecutar(cmd)
      setResultado(res)
      await cargarReportes(viewMode)
      setShowForm(false)
      setFormData({
        placaVehiculo: '',
        kilometraje: '',
        fecha: new Date().toISOString().split('T')[0],
        tipoMantenimiento: 'PREVENTIVO',
        observaciones: '',
        prioridad: 'MEDIA',
        tecnicoResponsable: '',
        taller: '',
        costoEstimado: '',
        tiempoEstimadoHoras: '',
        requiereRepuestos: false,
        nivelDesgaste: 'BUENO',
        proximoMantenimientoKm: ''
      })
    } catch (error) {
      console.error('Error creando reporte:', error)
      alert('Error: ' + error.message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const statsPrioridad = {
    total: reportes.length,
    alta: reportes.filter(r => r.prioridad === 'ALTA' || r.prioridad === 'CRITICA').length,
    media: reportes.filter(r => r.prioridad === 'MEDIA').length,
    baja: reportes.filter(r => r.prioridad === 'BAJA').length
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Reportes de Mantenimiento</h1>
        <button className="action-card" onClick={() => setShowForm(!showForm)} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          <span className="action-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>⬡</span>
          <span className="action-title">Nuevo Reporte</span>
        </button>
      </div>

      {resultado && (
        <div className="stat-card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-primary)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>✓ Reporte Creado</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Vehículo</span>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{resultado.placaVehiculo}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Tipo</span>
              <p style={{ color: 'var(--text-primary)' }}>{resultado.tipoMantenimiento}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Kilometraje</span>
              <p style={{ color: 'var(--text-primary)' }}>{resultado.kilometraje} km</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Prioridad</span>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                ...getPrioridadStyle(resultado.prioridad)
              }}>
                {resultado.prioridad}
              </span>
            </div>
          </div>
          <button
            onClick={() => setResultado(null)}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="hero-stats" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-number">{statsPrioridad.total}</span>
          <span className="stat-label">Total Reportes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#ef4444' }}>{statsPrioridad.alta}</span>
          <span className="stat-label">Alta/Crítica</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#8b5cf6' }}>{statsPrioridad.media}</span>
          <span className="stat-label">Prioridad Media</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: 'var(--accent-primary)' }}>{statsPrioridad.baja}</span>
          <span className="stat-label">Prioridad Baja</span>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
        flexWrap: 'wrap', alignItems: 'center'
      }}>
        <button
          onClick={() => { setViewMode('all'); cargarReportes('all') }}
          style={{
            padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem',
            border: viewMode === 'all' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            background: viewMode === 'all' ? 'rgba(0,212,170,0.1)' : 'transparent',
            color: viewMode === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >Todos</button>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button
            onClick={() => {
              const newDir = ordenDir === 'desc' ? 'asc' : 'desc'
              setOrdenDir(newDir)
              setViewMode('sorted')
              cargarReportes('sorted', { dir: newDir })
            }}
            style={{
              padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem',
              border: viewMode === 'sorted' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: viewMode === 'sorted' ? 'rgba(0,212,170,0.1)' : 'transparent',
              color: viewMode === 'sorted' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >Fecha {ordenDir === 'desc' ? '↓' : '↑'}</button>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            style={{
              padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', width: '140px'
            }}
            placeholder="Desde"
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            style={{
              padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', width: '140px'
            }}
            placeholder="Hasta"
          />
          <button
            onClick={() => {
              if (!fechaDesde || !fechaHasta) return
              setViewMode('range')
              cargarReportes('range', { desde: fechaDesde, hasta: fechaHasta })
            }}
            style={{
              padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem',
              border: viewMode === 'range' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: viewMode === 'range' ? 'rgba(0,212,170,0.1)' : 'transparent',
              color: viewMode === 'range' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >Filtrar</button>
        </div>

        <button
          onClick={() => { setViewMode('proximos'); cargarReportes('proximos') }}
          style={{
            padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem',
            border: viewMode === 'proximos' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            background: viewMode === 'proximos' ? 'rgba(0,212,170,0.1)' : 'transparent',
            color: viewMode === 'proximos' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >Próximos</button>

        {loadingReportes && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            Cargando...
          </span>
        )}

        {viewMode !== 'all' && (
          <button
            onClick={() => { setViewMode('all'); cargarReportes('all') }}
            style={{
              padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem',
              border: '1px solid var(--border-subtle)',
              background: 'transparent', color: 'var(--text-muted)',
              cursor: 'pointer', marginLeft: '0.5rem'
            }}
          >Limpiar filtros</button>
        )}
      </div>

      {viewMode === 'proximos' && (
        <div className="stat-card" style={{
          marginBottom: '1.5rem',
          borderColor: 'var(--accent-primary)',
          background: 'rgba(0, 212, 170, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🔧</span>
            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Vehículos próximos a mantenimiento</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Vehículos cuyo kilometraje actual se acerca al próximo mantenimiento (umbral: {kmUmbralProximos} km)
              </p>
            </div>
          </div>
          {vehiculosProximos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
              No hay vehículos próximos a mantenimiento con el umbral actual.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Placa</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tipo</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Km Actual</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Limite</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Restante</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>%</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculosProximos.map((v) => {
                    const riesgoColors = {
                      CRITICO: { bg: 'rgba(239,68,68,0.2)', color: '#ef4444' },
                      ALTO: { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
                      MEDIO: { bg: 'rgba(139,92,246,0.2)', color: '#8b5cf6' },
                      BAJO: { bg: 'rgba(0,212,170,0.2)', color: 'var(--accent-primary)' }
                    }
                    const rc = riesgoColors[v.nivelRiesgo] || riesgoColors.BAJO
                    const barWidth = Math.min(v.porcentaje, 100)
                    const barColor = v.nivelRiesgo === 'CRITICO' ? '#ef4444'
                      : v.nivelRiesgo === 'ALTO' ? '#f59e0b'
                      : v.nivelRiesgo === 'MEDIO' ? '#8b5cf6'
                      : 'var(--accent-primary)'
                    const expandida = proyeccionSeleccionada === v.placa
                    return (
                      <React.Fragment key={v.placa}>
                        <tr style={{
                          borderBottom: expandida ? 'none' : '1px solid var(--border-subtle)',
                          cursor: 'pointer', transition: 'background 0.15s ease'
                        }}
                          onClick={() => verProyeccion(v.placa)}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                            {v.placa} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{expandida ? '▲' : '▼'}</span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{v.tipo}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--text-primary)' }}>{v.kilometrajeActual?.toLocaleString()}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                            {v.proximoMantenimientoKm ? v.proximoMantenimientoKm?.toLocaleString() : v.limiteMantenimiento?.toLocaleString()}
                          </td>
                          <td style={{
                            padding: '0.75rem 0.5rem', textAlign: 'right',
                            color: v.kmRestantes <= 0 ? '#ef4444' : 'var(--text-primary)',
                            fontWeight: v.kmRestantes <= 0 ? 700 : 400
                          }}>
                            {v.kmRestantes <= 0 ? `${Math.abs(v.kmRestantes).toLocaleString()} vencido` : `${v.kmRestantes.toLocaleString()} km`}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{
                              width: '60px', height: '6px', background: 'var(--bg-tertiary)',
                              borderRadius: '3px', overflow: 'hidden', margin: '0 auto'
                            }}>
                              <div style={{
                                width: `${barWidth}%`, height: '100%', background: barColor,
                                borderRadius: '3px', transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {Math.round(v.porcentaje)}%
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem',
                              background: rc.bg, color: rc.color
                            }}>
                              {v.nivelRiesgo}
                            </span>
                          </td>
                        </tr>
                        {expandida && (
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td colSpan={7} style={{ padding: '0.75rem 1rem' }}>
                              {loadingProyeccion ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                                  Cargando proyección...
                                </div>
                              ) : proyeccionData ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Último Reporte</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                      {proyeccionData.ultimoKmReporte ? `${Math.round(proyeccionData.ultimoKmReporte).toLocaleString()} km` : 'Sin reportes previos'}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Intervalo Promedio</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                      {proyeccionData.promedioIntervaloKm ? `${Math.round(proyeccionData.promedioIntervaloKm).toLocaleString()} km` : '2+ reportes requeridos'}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Próximo Estimado</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                                      {Math.round(proyeccionData.proximoEstimadoKm).toLocaleString()} km
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Km Restantes</div>
                                    <div style={{ fontSize: '0.85rem', color: proyeccionData.kmRestantes <= 0 ? '#ef4444' : 'var(--text-primary)', fontWeight: 600 }}>
                                      {proyeccionData.kmRestantes <= 0
                                        ? `${Math.abs(proyeccionData.kmRestantes).toLocaleString()} km vencido`
                                        : `${Math.round(proyeccionData.kmRestantes).toLocaleString()} km`}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Días Estimados</div>
                                    <div style={{ fontSize: '0.85rem', color: proyeccionData.kmRestantes <= 0 ? '#ef4444' : 'var(--text-primary)', fontWeight: 500 }}>
                                      {proyeccionData.diasEstimados != null ? `≈ ${proyeccionData.diasEstimados} día${proyeccionData.diasEstimados !== 1 ? 's' : ''}` : 'Sin datos suficientes'}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                  Sin datos de proyección para este vehículo
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Crear Reporte de Mantenimiento</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Datos Obligatorios</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ ...labelStyle }}>Placa del Vehículo *</label>
                  <select
                    value={formData.placaVehiculo}
                    onChange={(e) => {
                      const v = vehiculos.find(v => v.placa === e.target.value)
                      setFormData({
                        ...formData,
                        placaVehiculo: e.target.value,
                        kilometraje: v ? v.kilometrajeActual : ''
                      })
                    }}
                    required
                    style={inputStyle}
                  >
                    <option value="">Seleccionar vehículo</option>
                    {vehiculos.map(v => (
                      <option key={v.placa} value={v.placa}>{v.placa} - {v.tipo || 'CAMION'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Kilometraje (km) *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.kilometraje}
                    readOnly
                    required
                    placeholder="Kilometros recorridos"
                    style={{ ...inputStyle, background: 'var(--bg-tertiary)', cursor: 'not-allowed', opacity: 0.7 }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Fecha *</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Tipo de Mantenimiento *</label>
                  <select
                    value={formData.tipoMantenimiento}
                    onChange={(e) => setFormData({ ...formData, tipoMantenimiento: e.target.value })}
                    required
                    style={inputStyle}
                  >
                    {TIPOS_MANTENIMIENTO.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Datos Opcionales</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ ...labelStyle }}>Prioridad</label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                    style={inputStyle}
                  >
                    {PRIORIDADES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Técnico Responsable</label>
                  <input
                    type="text"
                    value={formData.tecnicoResponsable}
                    onChange={(e) => setFormData({ ...formData, tecnicoResponsable: e.target.value })}
                    placeholder="Juan Pérez"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Taller</label>
                  <input
                    type="text"
                    value={formData.taller}
                    onChange={(e) => setFormData({ ...formData, taller: e.target.value })}
                    placeholder="Taller Central"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Costo Estimado ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.costoEstimado}
                    onChange={(e) => setFormData({ ...formData, costoEstimado: e.target.value })}
                    placeholder="500000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Tiempo Estimado (horas)</label>
                  <input
                    type="number"
                    value={formData.tiempoEstimadoHoras}
                    onChange={(e) => setFormData({ ...formData, tiempoEstimadoHoras: e.target.value })}
                    placeholder="4"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Próximo Mantenimiento (km)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.proximoMantenimientoKm}
                    onChange={(e) => setFormData({ ...formData, proximoMantenimientoKm: e.target.value })}
                    placeholder="30000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Nivel de Desgaste</label>
                  <select
                    value={formData.nivelDesgaste}
                    onChange={(e) => setFormData({ ...formData, nivelDesgaste: e.target.value })}
                    style={inputStyle}
                  >
                    {NIVELES_DESGASTE.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="requiereRepuestos"
                    checked={formData.requiereRepuestos}
                    onChange={(e) => setFormData({ ...formData, requiereRepuestos: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                  />
                  <label htmlFor="requiereRepuestos" style={{ ...labelStyle, marginBottom: 0 }}>Requiere Repuestos</label>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ ...labelStyle }}>Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
                placeholder="Detalles adicionales del mantenimiento..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loadingSubmit}
                className="action-card"
                style={{
                  width: 'auto',
                  padding: '0.75rem 2rem',
                  background: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                  border: 'none'
                }}
              >
                {loadingSubmit ? 'Creando...' : 'Crear Reporte'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="action-card"
                style={{ width: 'auto', padding: '0.75rem 2rem' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode !== 'proximos' && (reportes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◳</div>
          <div className="empty-state-text">No hay reportes de mantenimiento</div>
          <div className="empty-state-subtext">Crea tu primer reporte</div>
        </div>
      ) : (
        <div className="activity-list">
          {reportes.map((reporte, idx) => {
            const prioridadStyle = getPrioridadStyle(reporte.prioridad)
            return (
              <div key={reporte.placaVehiculo + '-' + idx} className="activity-item">
                <div className="activity-icon mantenimiento">◳</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <span className="activity-title">{reporte.placaVehiculo}</span>
                  <span className="activity-time">
                    {reporte.tipoMantenimiento} • {reporte.kilometraje} km
                    {reporte.tecnicoResponsable ? ` • ${reporte.tecnicoResponsable}` : ''}
                    {reporte.taller ? ` • ${reporte.taller}` : ''}
                  </span>
                  <span className="activity-time" style={{ fontSize: '0.7rem' }}>
                    {reporte.fecha}
                    {reporte.costoEstimado ? ` • $${reporte.costoEstimado.toLocaleString()}` : ''}
                    {reporte.nivelDesgaste ? ` • ${reporte.nivelDesgaste}` : ''}
                    {reporte.tiempoEstimadoHoras ? ` • ${reporte.tiempoEstimadoHoras}h` : ''}
                  </span>
                  {(reporte.observaciones || reporte.proximoMantenimientoKm || reporte.requiereRepuestos != null) && (
                    <span className="activity-time" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {reporte.observaciones ? `"${reporte.observaciones.substring(0, 60)}${reporte.observaciones.length > 60 ? '...' : ''}"` : ''}
                      {reporte.proximoMantenimientoKm ? `${reporte.observaciones ? ' • ' : ''}Próx: ${reporte.proximoMantenimientoKm} km` : ''}
                      {reporte.requiereRepuestos ? `${(reporte.observaciones || reporte.proximoMantenimientoKm) ? ' • ' : ''}Requiere repuestos` : ''}
                    </span>
                  )}
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  background: prioridadStyle.bg,
                  color: prioridadStyle.color,
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  {reporte.prioridad || 'MEDIA'}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Reportes