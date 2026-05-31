import { useState, useEffect } from 'react'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'
import DonutChart from '../Dashboard/DonutChart'

function StatCard({ number, label, prefix, suffix, color }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const duracion = 800
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
    <div className="stat-card" style={{ textAlign: 'center' }}>
      <span className="stat-number" style={color ? { color } : undefined}>
        {prefix || ''}{typeof value === 'number' ? Math.round(value).toLocaleString() : value}{suffix || ''}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function Analytics() {
  const [vehiculos, setVehiculos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      vehiculosService.getAll(),
      ordenesService.getAll(),
      reportesService.getAll()
    ]).then(([v, o, r]) => {
      setVehiculos(v)
      setOrdenes(o)
      setReportes(r)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>
  }

  const totalCostoEstimado = reportes.reduce((sum, r) => sum + (r.costoEstimado || 0), 0)
  const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA').length
  const tasaCompletacion = ordenes.length > 0 ? (ordenesCompletadas / ordenes.length) * 100 : 0
  const promedioKm = vehiculos.length > 0
    ? vehiculos.reduce((sum, v) => sum + (v.kilometrajeActual || 0), 0) / vehiculos.length
    : 0

  const ordenesPorEstado = {}
  ordenes.forEach(o => {
    const est = o.estado || 'CREADA'
    ordenesPorEstado[est] = (ordenesPorEstado[est] || 0) + 1
  })

  const costoPorTipo = {}
  reportes.forEach(r => {
    const tipo = r.tipoMantenimiento || 'General'
    costoPorTipo[tipo] = (costoPorTipo[tipo] || 0) + (r.costoEstimado || 0)
  })
  const costosSorted = Object.entries(costoPorTipo)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
  const maxCosto = costosSorted.length > 0 ? costosSorted[0].value : 1

  const reportesPorVehiculo = {}
  reportes.forEach(r => {
    const placa = r.placaVehiculo || 'Sin placa'
    reportesPorVehiculo[placa] = (reportesPorVehiculo[placa] || 0) + 1
  })
  const reportesVehiculoSorted = Object.entries(reportesPorVehiculo)
    .map(([placa, count]) => ({ placa, count }))
    .sort((a, b) => b.count - a.count)
  const maxReportes = reportesVehiculoSorted.length > 0 ? reportesVehiculoSorted[0].count : 1

  const ordenesPorVehiculo = {}
  ordenes.forEach(o => {
    const placa = o.vehiculoPlaca || 'Sin asignar'
    ordenesPorVehiculo[placa] = (ordenesPorVehiculo[placa] || 0) + 1
  })
  const utilizacionSorted = Object.entries(ordenesPorVehiculo)
    .map(([placa, count]) => ({ placa, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const maxUtil = utilizacionSorted.length > 0 ? utilizacionSorted[0].count : 1

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard number={totalCostoEstimado} label="Costo Estimado Total" prefix="$" color="var(--accent-primary)" />
        <StatCard number={tasaCompletacion} label="Tasa Completación Órdenes" suffix="%" color="#8b5cf6" />
        <StatCard number={promedioKm} label="Promedio km / Vehículo" suffix=" km" color="#f59e0b" />
        <StatCard number={reportes.length} label="Reportes Mantenimiento" color="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <section>
          <h2 className="section-title">Órdenes por Estado</h2>
          <div style={{ maxWidth: '350px', margin: '0 auto' }}>
            <DonutChart
              data={Object.entries(ordenesPorEstado).map(([label, value]) => ({ label, value }))}
              total={ordenes.length}
              title="Órdenes"
              colors={['#00d4aa', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6']}
            />
          </div>
        </section>

        <section>
          <h2 className="section-title">Costo Estimado por Tipo de Mantenimiento</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {costosSorted.length === 0 ? (
              <div className="activity-empty">
                <span className="activity-icon-small">◌</span>
                <span className="activity-text">Sin datos de costos</span>
              </div>
            ) : (
              costosSorted.map(c => (
                <div key={c.label} className="activity-item" style={{ marginBottom: 0 }}>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="activity-title">{c.label}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        ${Math.round(c.value).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(c.value / maxCosto) * 100}%`, height: '100%',
                        background: 'var(--accent-primary)', borderRadius: '4px',
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <section>
          <h2 className="section-title">Top Utilización de Vehículos</h2>
          {utilizacionSorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-text">Sin órdenes asignadas</div>
            </div>
          ) : (
            <div className="activity-list">
              {utilizacionSorted.map((item, i) => (
                <div key={item.placa} className="activity-item" style={{ marginBottom: 0 }}>
                  <div style={{ width: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.875rem',
                    color: i === 0 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    #{i + 1}
                  </div>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <span className="activity-title">{item.placa}</span>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginTop: '0.25rem' }}>
                      <div style={{
                        width: `${(item.count / maxUtil) * 100}%`, height: '100%',
                        background: i === 0 ? 'var(--accent-primary)' : '#8b5cf6',
                        borderRadius: '3px', transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.count} órden{item.count !== 1 ? 'es' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="section-title">Reportes por Vehículo</h2>
          {reportesVehiculoSorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-text">Sin reportes registrados</div>
            </div>
          ) : (
            <div className="activity-list">
              {reportesVehiculoSorted.slice(0, 8).map((item, i) => (
                <div key={item.placa} className="activity-item" style={{ marginBottom: 0 }}>
                  <div className="activity-icon mantenimiento">◳</div>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <span className="activity-title">{item.placa}</span>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginTop: '0.25rem' }}>
                      <div style={{
                        width: `${(item.count / maxReportes) * 100}%`, height: '100%',
                        background: '#f59e0b', borderRadius: '3px',
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>
                    {item.count} reporte{item.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <h2 className="section-title">Kilometraje por Vehículo</h2>
        {vehiculos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">Sin vehículos registrados</div>
          </div>
        ) : (
          <div className="activity-list">
            {[...vehiculos]
              .filter(v => v.kilometrajeActual)
              .sort((a, b) => (b.kilometrajeActual || 0) - (a.kilometrajeActual || 0))
              .slice(0, 10)
              .map((v, i) => {
                const pct = v.limiteMantenimiento
                  ? Math.min((v.kilometrajeActual / v.limiteMantenimiento) * 100, 100)
                  : 0
                return (
                  <div key={v.placa} className="activity-item" style={{ marginBottom: 0 }}>
                    <div style={{ width: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.875rem',
                      color: i === 0 ? 'var(--accent-primary)' : i < 3 ? '#8b5cf6' : 'var(--text-muted)' }}>
                      #{i + 1}
                    </div>
                    <div className="activity-content" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="activity-title">{v.placa}</span>
                        <span style={{ fontSize: '0.75rem', color: pct >= 80 ? '#ef4444' : pct >= 50 ? '#f59e0b' : 'var(--text-muted)' }}>
                          {Math.round(v.kilometrajeActual).toLocaleString()} km
                          {v.limiteMantenimiento ? ` / ${Math.round(v.limiteMantenimiento).toLocaleString()} km` : ''}
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginTop: '0.35rem' }}>
                        <div style={{
                          width: `${pct}%`, height: '100%',
                          background: pct >= 80 ? '#ef4444' : pct >= 50 ? '#f59e0b' : 'var(--accent-primary)',
                          borderRadius: '3px', transition: 'width 1s ease'
                        }}></div>
                      </div>
                      {v.limiteMantenimiento && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {Math.round(pct)}% del límite
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Analytics
