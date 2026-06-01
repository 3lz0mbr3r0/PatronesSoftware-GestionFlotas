import { useState, useEffect } from 'react'
import { reportesService } from '../../services/api'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const riesgoColors = {
  CRITICO: { bg: 'rgba(239,68,68,0.2)', color: '#ef4444' },
  ALTO: { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
  MEDIO: { bg: 'rgba(139,92,246,0.2)', color: '#8b5cf6' },
  BAJO: { bg: 'rgba(0,212,170,0.2)', color: 'var(--accent-primary)' }
}

const prioridadColors = {
  BAJA: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent-primary)' },
  MEDIA: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
  ALTA: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  CRITICA: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' }
}

function CalendarioMantenimiento() {
  const [reportes, setReportes] = useState([])
  const [proximos, setProximos] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedMonth, setExpandedMonth] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)

  useEffect(() => {
    Promise.all([
      reportesService.getAll(),
      reportesService.getVehiculosProximos(5000)
    ])
      .then(([r, p]) => {
        setReportes(r)
        setProximos(p)
        const years = [...new Set(r.map(rp => rp.fecha?.split('-')[0]).filter(Boolean))].sort()
        if (years.length > 0) setSelectedYear(years[years.length - 1])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const years = [...new Set(reportes.map(r => r.fecha?.split('-')[0]).filter(Boolean))].sort()

  const reportesPorMes = {}
  reportes.forEach(r => {
    if (!r.fecha) return
    const [year, month] = r.fecha.split('-')
    if (!reportesPorMes[year]) reportesPorMes[year] = {}
    const key = `${year}-${month}`
    if (!reportesPorMes[year][key]) reportesPorMes[year][key] = { month: parseInt(month), items: [] }
    reportesPorMes[year][key].items.push(r)
  })

  Object.keys(reportesPorMes).forEach(year => {
    const sorted = Object.entries(reportesPorMes[year])
      .sort(([, a], [, b]) => b.month - a.month)
    const ordered = {}
    sorted.forEach(([key, val]) => { ordered[key] = val })
    reportesPorMes[year] = ordered
  })

  const toggleMonth = (key) => {
    setExpandedMonth(expandedMonth === key ? null : key)
  }

  const proximosFiltrados = proximos.filter(v => v.nivelRiesgo === 'CRITICO' || v.nivelRiesgo === 'ALTO')

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Calendario de Mantenimiento</h1>
        {years.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem',
                  border: selectedYear === y ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: selectedYear === y ? 'rgba(0,212,170,0.1)' : 'transparent',
                  color: selectedYear === y ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >{y}</button>
            ))}
          </div>
        )}
      </div>

      {proximosFiltrados.length > 0 && (
        <div className="stat-card" style={{
          marginBottom: '2rem',
          borderColor: 'var(--accent-primary)',
          background: 'rgba(0, 212, 170, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠</span>
            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Próximos Eventos</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {proximosFiltrados.length} vehículo{proximosFiltrados.length !== 1 ? 's' : ''} próximo{proximosFiltrados.length !== 1 ? 's' : ''} a mantenimiento
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {proximosFiltrados.map(v => {
              const rc = riesgoColors[v.nivelRiesgo] || riesgoColors.BAJO
              return (
                <div key={v.placa} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 1rem', borderRadius: '8px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{v.placa}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{v.tipo}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ color: '#f59e0b' }}>
                    {v.kmRestantes <= 0
                      ? `${Math.abs(v.kmRestantes).toLocaleString()} km vencido`
                      : `${v.kmRestantes.toLocaleString()} km`}
                  </span>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem',
                    background: rc.bg, color: rc.color
                  }}>
                    {v.nivelRiesgo}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {reportes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◳</div>
          <div className="empty-state-text">No hay reportes de mantenimiento registrados</div>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          <div style={{
            position: 'absolute', left: '10px', top: '0', bottom: '0',
            width: '2px', background: 'var(--border-subtle)'
          }} />

          {years.filter(y => !selectedYear || y === selectedYear).map(year => {
            const months = Object.entries(reportesPorMes[year] || {})
            return months.map(([key, { month, items }]) => {
              const isExpanded = expandedMonth === key
              const monthName = meses[month - 1]
              const totalCost = items.reduce((s, r) => s + (r.costoEstimado || 0), 0)

              return (
                <div key={key} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '-1.65rem', top: '0.5rem',
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: 'var(--accent-primary)', border: '3px solid var(--bg-primary)',
                    zIndex: 1
                  }} />

                  <div
                    onClick={() => toggleMonth(key)}
                    className="stat-card"
                    style={{
                      cursor: 'pointer', padding: '0.75rem 1.25rem',
                      borderColor: isExpanded ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          {monthName} {year}
                        </span>
                        <span style={{
                          padding: '0.2rem 0.7rem', borderRadius: '10px',
                          background: 'rgba(0,212,170,0.1)', color: 'var(--accent-primary)',
                          fontSize: '0.8rem', fontWeight: 600
                        }}>
                          {items.length} reporte{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {totalCost > 0 && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            ${totalCost.toLocaleString()}
                          </span>
                        )}
                        <span style={{
                          fontSize: '0.75rem', color: 'var(--text-muted)',
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '0.75rem', marginLeft: '0.5rem' }}>
                      {items
                        .sort((a, b) => b.fecha?.localeCompare(a.fecha))
                        .map((r, i) => {
                          const pc = prioridadColors[r.prioridad] || prioridadColors.MEDIA
                          return (
                            <div key={i} className="activity-item" style={{
                              marginBottom: '0.5rem', borderLeft: '3px solid var(--accent-primary)'
                            }}>
                              <div className="activity-icon mantenimiento">◳</div>
                              <div className="activity-content" style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span className="activity-title">{r.placaVehiculo}</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {r.kilometraje?.toLocaleString()} km
                                  </span>
                                </div>
                                <span className="activity-time">
                                  {r.tipoMantenimiento}
                                  {r.taller ? ` • ${r.taller}` : ''}
                                  {r.tecnicoResponsable ? ` • ${r.tecnicoResponsable}` : ''}
                                  {r.costoEstimado ? ` • $${r.costoEstimado.toLocaleString()}` : ''}
                                  {r.tiempoEstimadoHoras ? ` • ${r.tiempoEstimadoHoras}h` : ''}
                                </span>
                                {r.observaciones && (
                                  <span className="activity-time" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    "{r.observaciones.substring(0, 100)}{r.observaciones.length > 100 ? '...' : ''}"
                                  </span>
                                )}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                                  {r.nivelDesgaste && (
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', padding: '0.15rem 0.4rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                                      Desgaste: {r.nivelDesgaste}
                                    </span>
                                  )}
                                  {r.requiereRepuestos && (
                                    <span style={{ fontSize: '0.65rem', color: '#f59e0b', padding: '0.15rem 0.4rem', background: 'rgba(245,158,11,0.1)', borderRadius: '4px' }}>
                                      Requiere repuestos
                                    </span>
                                  )}
                                  {r.proximoMantenimientoKm && (
                                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', padding: '0.15rem 0.4rem', background: 'rgba(0,212,170,0.1)', borderRadius: '4px' }}>
                                      Próx: {r.proximoMantenimientoKm.toLocaleString()} km
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div style={{
                                padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem',
                                background: pc.bg, color: pc.color, whiteSpace: 'nowrap'
                              }}>
                                {r.prioridad || 'MEDIA'}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              )
            })
          })}
        </div>
      )}
    </div>
  )
}

export default CalendarioMantenimiento
