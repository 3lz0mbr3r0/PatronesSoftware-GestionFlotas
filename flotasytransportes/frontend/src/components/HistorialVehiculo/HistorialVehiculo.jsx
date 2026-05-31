import { useState, useEffect, useRef } from 'react'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'
import { OriginadorHistorial } from '../../patterns/memento/OriginadorHistorial'
import { CuidadorHistorial } from '../../patterns/memento/CuidadorHistorial'

const estadoColors = {
  DISPONIBLE: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent-primary)' },
  EN_RUTA: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  MANTENIMIENTO: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
}

const riesgoColors = {
  CRITICO: '#ef4444',
  ALTO: '#f59e0b',
  MEDIO: '#8b5cf6',
  BAJO: 'var(--accent-primary)'
}

function HistorialVehiculo() {
  const [vehiculos, setVehiculos] = useState([])
  const [selectedPlaca, setSelectedPlaca] = useState('')
  const [vehiculo, setVehiculo] = useState(null)
  const [reportes, setReportes] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [proyeccion, setProyeccion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [puedeDeshacer, setPuedeDeshacer] = useState(false)
  const [puedeRehacer, setPuedeRehacer] = useState(false)
  const [historialSnapshots, setHistorialSnapshots] = useState([])
  const originadorRef = useRef(null)
  const cuidadorRef = useRef(null)

  useEffect(() => {
    const originador = new OriginadorHistorial()
    const cuidador = new CuidadorHistorial(originador)
    originadorRef.current = originador
    cuidadorRef.current = cuidador
  }, [])

  useEffect(() => {
    vehiculosService.getAll()
      .then(setVehiculos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const guardarSnapshot = (placa) => {
    const originador = originadorRef.current
    const cuidador = cuidadorRef.current
    if (!originador || !cuidador) return
    originador.setEstado({ placa, vehiculo, reportes, ordenes, proyeccion })
    cuidador.guardar(`Vehículo: ${placa}`)
    setPuedeDeshacer(cuidador.puedeDeshacer())
    setPuedeRehacer(cuidador.puedeRehacer())
    setHistorialSnapshots(cuidador.obtenerHistorial())
  }

  const cargarHistorial = async (placa) => {
    if (!placa) {
      setVehiculo(null)
      setReportes([])
      setOrdenes([])
      setProyeccion(null)
      return
    }
    setLoadingDetail(true)
    try {
      const [v, todosReportes, ords, proy] = await Promise.all([
        vehiculosService.getByPlaca(placa),
        reportesService.getAll(),
        ordenesService.getByPlaca(placa),
        reportesService.proyectar(placa)
      ])
      setVehiculo(v)
      setReportes(todosReportes.filter(r => r.placaVehiculo === placa))
      setOrdenes(ords)
      setProyeccion(proy)
    } catch (error) {
      console.error('Error cargando historial:', error)
    } finally {
      setLoadingDetail(false)
    }
  }

  useEffect(() => {
    if (!selectedPlaca || !vehiculo) return
    if (!loadingDetail) {
      guardarSnapshot(selectedPlaca)
    }
  }, [selectedPlaca, vehiculo, reportes, ordenes, proyeccion, loadingDetail])

  const handleSelect = (placa) => {
    setSelectedPlaca(placa)
    cargarHistorial(placa)
  }

  const aplicarEstadoMemento = (estado) => {
    setSelectedPlaca(estado.placa)
    setVehiculo(estado.vehiculo)
    setReportes(estado.reportes)
    setOrdenes(estado.ordenes)
    setProyeccion(estado.proyeccion)
  }

  const handleDeshacer = () => {
    const cuidador = cuidadorRef.current
    if (!cuidador) return
    const memento = cuidador.deshacer()
    if (memento) {
      aplicarEstadoMemento(memento.getEstado())
      setPuedeDeshacer(cuidador.puedeDeshacer())
      setPuedeRehacer(cuidador.puedeRehacer())
      setHistorialSnapshots(cuidador.obtenerHistorial())
    }
  }

  const handleRehacer = () => {
    const cuidador = cuidadorRef.current
    if (!cuidador) return
    const memento = cuidador.rehacer()
    if (memento) {
      aplicarEstadoMemento(memento.getEstado())
      setPuedeDeshacer(cuidador.puedeDeshacer())
      setPuedeRehacer(cuidador.puedeRehacer())
      setHistorialSnapshots(cuidador.obtenerHistorial())
    }
  }

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>
  }

  const pct = vehiculo?.kilometrajeActual && vehiculo?.limiteMantenimiento
    ? Math.min((vehiculo.kilometrajeActual / vehiculo.limiteMantenimiento) * 100, 100)
    : 0

  const pctColor = pct >= 80 ? '#ef4444' : pct >= 50 ? '#f59e0b' : 'var(--accent-primary)'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Historial por Vehículo</h1>
      </div>

      <div className="stat-card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
              Seleccionar vehículo
            </label>
            <select
              value={selectedPlaca}
              onChange={(e) => handleSelect(e.target.value)}
              style={{
                width: '100%', maxWidth: '400px', padding: '0.75rem 1rem',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="">— Seleccione un vehículo —</option>
              {vehiculos.map(v => (
                <option key={v.placa} value={v.placa}>{v.placa} — {v.tipo || 'CAMION'} • {v.estado}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {historialSnapshots.length} snapshot{historialSnapshots.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleDeshacer}
              disabled={!puedeDeshacer}
              title="Deshacer (anterior vehículo)"
              style={{
                padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                border: '1px solid var(--border-color)',
                background: puedeDeshacer ? 'var(--bg-secondary)' : 'transparent',
                color: puedeDeshacer ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: puedeDeshacer ? 'pointer' : 'not-allowed',
                opacity: puedeDeshacer ? 1 : 0.4
              }}
            >◀ Anterior</button>
            <button
              onClick={handleRehacer}
              disabled={!puedeRehacer}
              title="Rehacer (siguiente vehículo)"
              style={{
                padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                border: '1px solid var(--border-color)',
                background: puedeRehacer ? 'var(--bg-secondary)' : 'transparent',
                color: puedeRehacer ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: puedeRehacer ? 'pointer' : 'not-allowed',
                opacity: puedeRehacer ? 1 : 0.4
              }}
            >Siguiente ▶</button>
          </div>
        </div>
        {historialSnapshots.length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Historial:</span>
            {historialSnapshots.map((s, i) => (
              <span key={s.id} style={{
                fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                background: i === historialSnapshots.length - 1 ? 'rgba(0,212,170,0.15)' : 'transparent',
                border: '1px solid var(--border-subtle)',
                color: i === historialSnapshots.length - 1 ? 'var(--accent-primary)' : 'var(--text-muted)',
                whiteSpace: 'nowrap'
              }}>
                {i + 1}. {s.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      {loadingDetail && (
        <div className="loading" style={{ padding: '2rem' }}>
          <div className="loading-spinner"></div>
        </div>
      )}

      {!loadingDetail && vehiculo && (
        <>
          <div className="stat-card" style={{
            marginBottom: '2rem',
            borderLeft: `4px solid ${vehiculo.estado === 'DISPONIBLE' ? 'var(--accent-primary)' : vehiculo.estado === 'EN_RUTA' ? '#3b82f6' : '#f59e0b'}`
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Placa</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{vehiculo.placa}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Tipo</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{vehiculo.tipo || 'CAMION'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estado</div>
                <span style={{
                  padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem',
                  ...(estadoColors[vehiculo.estado] || estadoColors.DISPONIBLE)
                }}>
                  ● {vehiculo.estado}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Energía</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{vehiculo.tipoEnergia || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Kilometraje Actual</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: pctColor }}>
                  {vehiculo.kilometrajeActual?.toLocaleString()} km
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Límite Mantenimiento</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {vehiculo.limiteMantenimiento?.toLocaleString()} km
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <span>Vida útil</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: pctColor, borderRadius: '4px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1rem' }}>
              Proyección de Mantenimiento
              {proyeccion?.riesgo && (
                <span style={{
                  marginLeft: '1rem', padding: '0.25rem 0.75rem', borderRadius: '4px',
                  fontSize: '0.75rem', fontWeight: 600,
                  background: `${riesgoColors[proyeccion.riesgo]}20`,
                  color: riesgoColors[proyeccion.riesgo] || 'var(--text-muted)'
                }}>
                  {proyeccion.riesgo}
                </span>
              )}
            </h3>
            {proyeccion?.riesgo === 'SIN_DATOS' ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0.5rem 0' }}>
                No hay datos suficientes para proyectar mantenimiento de este vehículo
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Último Reporte</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {proyeccion?.ultimoKmReporte ? `${Math.round(proyeccion.ultimoKmReporte).toLocaleString()} km` : 'Sin reportes previos'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Intervalo Promedio</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {proyeccion?.promedioIntervaloKm ? `${Math.round(proyeccion.promedioIntervaloKm).toLocaleString()} km` : '2+ reportes requeridos'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Próximo Estimado</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {proyeccion?.proximoEstimadoKm ? `${Math.round(proyeccion.proximoEstimadoKm).toLocaleString()} km` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Km Restantes</div>
                  <div style={{
                    fontSize: '0.9rem', fontWeight: 600,
                    color: proyeccion?.kmRestantes <= 0 ? '#ef4444' : 'var(--text-primary)'
                  }}>
                    {proyeccion?.kmRestantes != null
                      ? (proyeccion.kmRestantes <= 0
                        ? `${Math.abs(proyeccion.kmRestantes).toLocaleString()} km vencido`
                        : `${Math.round(proyeccion.kmRestantes).toLocaleString()} km`)
                      : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Días Estimados</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: proyeccion?.kmRestantes <= 0 ? '#ef4444' : 'var(--text-primary)' }}>
                    {proyeccion?.diasEstimados != null
                      ? `≈ ${proyeccion.diasEstimados} día${proyeccion.diasEstimados !== 1 ? 's' : ''}`
                      : 'Sin datos suficientes'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <section>
              <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
                Reportes de Mantenimiento ({reportes.length})
              </h2>
              {reportes.length === 0 ? (
                <div className="empty-state" style={{ padding: '1.5rem' }}>
                  <div className="empty-state-text" style={{ fontSize: '0.9rem' }}>Sin reportes</div>
                </div>
              ) : (
                <div className="activity-list">
                  {[...reportes]
                    .sort((a, b) => b.fecha.localeCompare(a.fecha))
                    .map((r, i) => {
                      const prioridadColors = {
                        BAJA: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent-primary)' },
                        MEDIA: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
                        ALTA: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
                        CRITICA: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' }
                      }
                      const pc = prioridadColors[r.prioridad] || prioridadColors.MEDIA
                      return (
                        <div key={r.fecha + '-' + i} className="activity-item" style={{ marginBottom: 0 }}>
                          <div className="activity-icon mantenimiento">◳</div>
                          <div className="activity-content" style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span className="activity-title">{r.tipoMantenimiento}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.fecha}</span>
                            </div>
                            <span className="activity-time" style={{ fontSize: '0.8rem' }}>
                              {r.kilometraje?.toLocaleString()} km
                              {r.taller ? ` • ${r.taller}` : ''}
                              {r.costoEstimado ? ` • $${r.costoEstimado.toLocaleString()}` : ''}
                            </span>
                            {r.observaciones && (
                              <span className="activity-time" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                "{r.observaciones.substring(0, 80)}{r.observaciones.length > 80 ? '...' : ''}"
                              </span>
                            )}
                          </div>
                          <div style={{
                            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem',
                            background: pc.bg, color: pc.color
                          }}>
                            {r.prioridad || 'MEDIA'}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </section>

            <section>
              <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
                Órdenes de Transporte ({ordenes.length})
              </h2>
              {ordenes.length === 0 ? (
                <div className="empty-state" style={{ padding: '1.5rem' }}>
                  <div className="empty-state-text" style={{ fontSize: '0.9rem' }}>Sin órdenes asignadas</div>
                </div>
              ) : (
                <div className="activity-list">
                  {[...ordenes]
                    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
                    .map((o, i) => {
                      const estadoOrdColors = {
                        CREADA: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
                        ASIGNADA: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
                        COMPLETADA: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent-primary)' }
                      }
                      const oc = estadoOrdColors[o.estado] || estadoOrdColors.CREADA
                      return (
                        <div key={o.codigoOrden} className="activity-item" style={{ marginBottom: 0 }}>
                          <div className="activity-icon" style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', background: oc.bg, color: oc.color, flexShrink: 0
                          }}>◬</div>
                          <div className="activity-content" style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span className="activity-title">{o.codigoOrden}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {o.fechaCreacion ? new Date(o.fechaCreacion).toLocaleDateString() : '—'}
                              </span>
                            </div>
                            {o.origenLat && o.destinoLat && (
                              <span className="activity-time">
                                {o.origenLat.toFixed(4)},{o.origenLng?.toFixed(4)} → {o.destinoLat.toFixed(4)},{o.destinoLng?.toFixed(4)}
                              </span>
                            )}
                          </div>
                          <span style={{
                            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem',
                            background: oc.bg, color: oc.color
                          }}>
                            {o.estado}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {!loadingDetail && !vehiculo && selectedPlaca && (
        <div className="empty-state">
          <div className="empty-state-text">No se encontró el vehículo</div>
        </div>
      )}
    </div>
  )
}

export default HistorialVehiculo
