import { useState, useEffect } from 'react'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'
import { ReporteCompleto } from '../../patterns/template/ReporteCompleto'
import { ReporteResumido } from '../../patterns/template/ReporteResumido'
import { ReporteProyeccion } from '../../patterns/template/ReporteProyeccion'
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
  const [tipoReporte, setTipoReporte] = useState('COMPLETO')
  const [seccionesRender, setSeccionesRender] = useState([])

  const factoryTemplate = {
    COMPLETO: () => new ReporteCompleto(),
    RESUMIDO: () => new ReporteResumido(),
    PROYECCION: () => new ReporteProyeccion()
  }

  const handlePreview = async () => {
    const template = factoryTemplate[tipoReporte]()
    const datos = { vehiculos, ordenes, reportes, proximos }
    const filtros = { fechaDesde, fechaHasta, filtroPlaca, secciones }
    const resultado = await template.generar(datos, filtros)
    setSeccionesRender(resultado)
    setPreview(true)
  }

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

  const fechaGeneracion = new Date().toLocaleString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>
  }

  const renderSeccion = (seccion) => {
    if (seccion.tipo === 'stats') {
      return (
        <section className="report-section" key={seccion.id}>
          <h2>{seccion.titulo}</h2>
          <div className="report-grid-4">
            {seccion.stats.map((stat, i) => (
              <div className="report-stat" key={i}>
                <span className={`report-stat-num${stat.className ? ' ' + stat.className : ''}`}>{stat.value}</span>
                <span className="report-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )
    }
    if (seccion.tipo === 'tabla') {
      return (
        <section className="report-section" key={seccion.id}>
          <h2>{seccion.titulo}</h2>
          <table>
            <thead>
              <tr>{seccion.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {seccion.rows.length === 0 ? (
                <tr><td colSpan={seccion.headers.length} className="report-empty">Sin datos</td></tr>
              ) : (
                seccion.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => {
                      const val = typeof cell === 'object' ? cell.text : cell
                      const cls = typeof cell === 'object' ? cell.className || '' : ''
                      return <td key={ci} className={cls}>{val}</td>
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {seccion.total && <p className="report-total">{seccion.total}</p>}
        </section>
      )
    }
    return null
  }

  const contenidoReporte = preview && (
    <div className="report-print-layout">
      <div className="report-header">
        <h1>Flotas y Transportes</h1>
        <p className="report-subtitle">{tipoReporte === 'COMPLETO' ? 'Reporte Completo de Mantenimiento' : tipoReporte === 'RESUMIDO' ? 'Reporte Resumido' : 'Proyección de Mantenimiento'}</p>
        <p className="report-date">Generado: {fechaGeneracion}</p>
        {(fechaDesde || fechaHasta || filtroPlaca) && (
          <p className="report-filters">
            Filtros:{fechaDesde ? ` Desde: ${formatFecha(fechaDesde)}` : ''}{fechaHasta ? ` Hasta: ${formatFecha(fechaHasta)}` : ''}{filtroPlaca ? ` Vehículo: ${filtroPlaca}` : ''}
          </p>
        )}
      </div>

      {seccionesRender.map(renderSeccion)}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Generar Reporte</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePreview}
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
            Tipo de Reporte
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'COMPLETO', label: '◫ Completo', desc: 'Todas las secciones' },
              { id: 'RESUMIDO', label: '◱ Resumido', desc: 'Solo KPIs principales' },
              { id: 'PROYECCION', label: '◷ Proyección', desc: 'Enfoque en mantenimiento futuro' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTipoReporte(t.id)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem',
                  border: tipoReporte === t.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: tipoReporte === t.id ? 'rgba(0,212,170,0.1)' : 'transparent',
                  color: tipoReporte === t.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: tipoReporte === t.id ? 700 : 400 }}>{t.label}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

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
