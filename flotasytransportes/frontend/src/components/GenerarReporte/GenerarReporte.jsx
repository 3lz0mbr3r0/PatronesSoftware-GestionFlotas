import { useState, useEffect } from 'react'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'
import './reporte-print.css'

const inputStyle = {
  padding: '0.5rem 0.75rem',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  fontSize: '0.85rem'
}

const labelStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  marginBottom: '0.3rem',
  display: 'block'
}

const SECCIONES = [
  { id: 'resumen', label: 'Resumen General', icon: '◫' },
  { id: 'vehiculos', label: 'Vehículos', icon: '◭' },
  { id: 'ordenes', label: 'Órdenes de Transporte', icon: '◬' },
  { id: 'reportes', label: 'Reportes de Mantenimiento', icon: '◳' },
  { id: 'proximos', label: 'Próximos Mantenimientos', icon: '⚠' }
]

function formatFecha(fecha) {
  if (!fecha) return '—'
  try {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return fecha
  }
}

function GenerarReporte() {
  const [vehiculos, setVehiculos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [reportes, setReportes] = useState([])
  const [proximos, setProximos] = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(false)

  const [secciones, setSecciones] = useState(SECCIONES.map(s => s.id))
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [filtroPlaca, setFiltroPlaca] = useState('')

  useEffect(() => {
    Promise.all([
      vehiculosService.getAll(),
      ordenesService.getAll(),
      reportesService.getAll(),
      reportesService.getVehiculosProximos(5000)
    ])
      .then(([v, o, r, p]) => {
        setVehiculos(v)
        setOrdenes(o)
        setReportes(r)
        setProximos(p)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleSeccion = (id) => {
    setSecciones(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const ordenesFiltradas = ordenes.filter(o => {
    if (filtroPlaca && o.vehiculoPlaca !== filtroPlaca) return false
    if (fechaDesde && o.fechaCreacion) {
      const f = new Date(o.fechaCreacion).toISOString().split('T')[0]
      if (f < fechaDesde) return false
    }
    if (fechaHasta && o.fechaCreacion) {
      const f = new Date(o.fechaCreacion).toISOString().split('T')[0]
      if (f > fechaHasta) return false
    }
    return true
  })

  const reportesFiltrados = reportes.filter(r => {
    if (filtroPlaca && r.placaVehiculo !== filtroPlaca) return false
    if (fechaDesde && r.fecha < fechaDesde) return false
    if (fechaHasta && r.fecha > fechaHasta) return false
    return true
  })

  const vehiculosFiltrados = filtroPlaca
    ? vehiculos.filter(v => v.placa === filtroPlaca)
    : vehiculos

  const totalCosto = reportesFiltrados.reduce((s, r) => s + (r.costoEstimado || 0), 0)
  const ordenesCompletadas = ordenesFiltradas.filter(o => o.estado === 'COMPLETADA').length
  const fechaGeneracion = new Date().toLocaleString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>
  }

  const contenidoReporte = preview && (
    <div className="report-print-layout">
      <div className="report-header">
        <h1>Flotas y Transportes</h1>
        <p className="report-subtitle">Reporte General</p>
        <p className="report-date">Generado: {fechaGeneracion}</p>
        {(fechaDesde || fechaHasta || filtroPlaca) && (
          <p className="report-filters">
            Filtros:{fechaDesde ? ` Desde: ${formatFecha(fechaDesde)}` : ''}{fechaHasta ? ` Hasta: ${formatFecha(fechaHasta)}` : ''}{filtroPlaca ? ` Vehículo: ${filtroPlaca}` : ''}
          </p>
        )}
      </div>

      {secciones.includes('resumen') && (
        <section className="report-section">
          <h2>Resumen General</h2>
          <div className="report-grid-4">
            <div className="report-stat"><span className="report-stat-num">{vehiculosFiltrados.length}</span><span className="report-stat-label">Vehículos</span></div>
            <div className="report-stat"><span className="report-stat-num">{ordenesFiltradas.length}</span><span className="report-stat-label">Órdenes</span></div>
            <div className="report-stat"><span className="report-stat-num">{reportesFiltrados.length}</span><span className="report-stat-label">Reportes</span></div>
            <div className="report-stat"><span className="report-stat-num">${Math.round(totalCosto).toLocaleString()}</span><span className="report-stat-label">Costo Total</span></div>
          </div>
        </section>
      )}

      {secciones.includes('vehiculos') && (
        <section className="report-section">
          <h2>Vehículos ({vehiculosFiltrados.length})</h2>
          <table>
            <thead>
              <tr><th>Placa</th><th>Tipo</th><th>Estado</th><th>Energía</th><th>Km Actual</th><th>% Vida</th></tr>
            </thead>
            <tbody>
              {vehiculosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="report-empty">Sin vehículos</td></tr>
              ) : (
                vehiculosFiltrados.map(v => {
                  const pct = v.limiteMantenimiento ? Math.min((v.kilometrajeActual / v.limiteMantenimiento) * 100, 100) : 0
                  return (
                    <tr key={v.placa}>
                      <td>{v.placa}</td>
                      <td>{v.tipo || 'CAMION'}</td>
                      <td>{v.estado}</td>
                      <td>{v.tipoEnergia || '—'}</td>
                      <td className="report-num">{v.kilometrajeActual?.toLocaleString()}</td>
                      <td className="report-num">{Math.round(pct)}%</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </section>
      )}

      {secciones.includes('ordenes') && (
        <section className="report-section">
          <h2>Órdenes de Transporte ({ordenesFiltradas.length})</h2>
          <table>
            <thead>
              <tr><th>Código</th><th>Vehículo</th><th>Origen → Destino</th><th>Estado</th><th>Fecha Creación</th></tr>
            </thead>
            <tbody>
              {ordenesFiltradas.length === 0 ? (
                <tr><td colSpan={5} className="report-empty">Sin órdenes</td></tr>
              ) : (
                ordenesFiltradas
                  .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
                  .map(o => (
                    <tr key={o.codigoOrden}>
                      <td>{o.codigoOrden}</td>
                      <td>{o.vehiculoPlaca || '—'}</td>
                      <td className="report-small">
                        {o.origenLat != null
                          ? `${o.origenLat.toFixed(3)},${o.origenLng?.toFixed(3)} → ${o.destinoLat.toFixed(3)},${o.destinoLng?.toFixed(3)}`
                          : '—'}
                      </td>
                      <td>{o.estado}</td>
                      <td className="report-num">{o.fechaCreacion ? new Date(o.fechaCreacion).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          <p className="report-total">Completadas: {ordenesCompletadas} / {ordenesFiltradas.length}</p>
        </section>
      )}

      {secciones.includes('reportes') && (
        <section className="report-section">
          <h2>Reportes de Mantenimiento ({reportesFiltrados.length})</h2>
          <table>
            <thead>
              <tr><th>Fecha</th><th>Placa</th><th>Tipo</th><th>Taller</th><th>Costo</th><th>Prioridad</th></tr>
            </thead>
            <tbody>
              {reportesFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="report-empty">Sin reportes</td></tr>
              ) : (
                reportesFiltrados
                  .sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .map((r, i) => (
                    <tr key={i}>
                      <td className="report-num">{formatFecha(r.fecha)}</td>
                      <td>{r.placaVehiculo}</td>
                      <td>{r.tipoMantenimiento}</td>
                      <td>{r.taller || '—'}</td>
                      <td className="report-num">{r.costoEstimado ? `$${r.costoEstimado.toLocaleString()}` : '—'}</td>
                      <td>{r.prioridad || 'MEDIA'}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {secciones.includes('proximos') && proximos.length > 0 && (
        <section className="report-section">
          <h2>Próximos Mantenimientos ({proximos.length})</h2>
          <table>
            <thead>
              <tr><th>Placa</th><th>Tipo</th><th>Km Restante</th><th>%</th><th>Riesgo</th></tr>
            </thead>
            <tbody>
              {proximos.map(v => (
                <tr key={v.placa}>
                  <td>{v.placa}</td>
                  <td>{v.tipo}</td>
                  <td className="report-num">{v.kmRestantes?.toLocaleString()} km</td>
                  <td className="report-num">{Math.round(v.porcentaje)}%</td>
                  <td>{v.nivelRiesgo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Generar Reporte</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setPreview(true)}
            disabled={secciones.length === 0}
            className="action-card"
            style={{
              width: 'auto', padding: '0.65rem 1.25rem',
              opacity: secciones.length === 0 ? 0.5 : 1,
              cursor: secciones.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="action-icon">◰</span>
            {preview ? 'Actualizar Vista' : 'Vista Previa'}
          </button>
          {preview && (
            <button
              onClick={() => {
                const desde = fechaDesde ? fechaDesde.replace(/-/g, '') : ''
                const hasta = fechaHasta ? fechaHasta.replace(/-/g, '') : ''
                const originalTitle = document.title
                document.title = `reporte${desde}${hasta}`
                window.print()
                setTimeout(() => { document.title = originalTitle }, 100)
              }}
              className="action-card"
              style={{
                width: 'auto', padding: '0.65rem 1.25rem',
                background: 'var(--accent-primary)', color: 'var(--bg-primary)',
                border: 'none'
              }}
            >
              <span className="action-icon" style={{ color: 'var(--bg-primary)' }}>📄</span>
              Imprimir / PDF
            </button>
          )}
        </div>
      </div>

      <div className="stat-card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Secciones a incluir
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SECCIONES.map(s => {
              const incluye = secciones.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSeccion(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem',
                    border: incluye ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: incluye ? 'rgba(0,212,170,0.1)' : 'transparent',
                    color: incluye ? 'var(--accent-primary)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: incluye ? 'var(--accent-primary)' : 'transparent',
                    border: incluye ? 'none' : '2px solid var(--border-color)',
                    color: incluye ? 'var(--bg-primary)' : 'transparent',
                    fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {incluye ? '✓' : ''}
                  </span>
                  {s.icon} {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Filtros
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Fecha desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Fecha hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Vehículo (opcional)</label>
              <select
                value={filtroPlaca}
                onChange={(e) => setFiltroPlaca(e.target.value)}
                style={{ ...inputStyle, minWidth: '180px', cursor: 'pointer' }}
              >
                <option value="">Todos los vehículos</option>
                {vehiculos.map(v => (
                  <option key={v.placa} value={v.placa}>{v.placa} — {v.tipo}</option>
                ))}
              </select>
            </div>
            {(fechaDesde || fechaHasta || filtroPlaca) && (
              <button
                onClick={() => { setFechaDesde(''); setFechaHasta(''); setFiltroPlaca('') }}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem',
                  border: '1px solid var(--border-color)', background: 'transparent',
                  color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >Limpiar filtros</button>
            )}
          </div>
        </div>
      </div>

      {preview && contenidoReporte}

      {!preview && (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: '2rem' }}>◰</div>
          <div className="empty-state-text">Selecciona las secciones y presiona "Vista Previa"</div>
          <div className="empty-state-subtext">Luego podrás imprimir o exportar a PDF</div>
        </div>
      )}
    </div>
  )
}

export default GenerarReporte
