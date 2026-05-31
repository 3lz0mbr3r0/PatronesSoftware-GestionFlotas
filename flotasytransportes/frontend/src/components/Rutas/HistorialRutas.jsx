import { useState, useEffect } from 'react'
import { vehiculosService, ordenesService } from '../../services/api'
import RouteMap from '../Map/RouteMap'

function HistorialRutas() {
  const [vehiculos, setVehiculos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [selectedPlaca, setSelectedPlaca] = useState('')
  const [ordenesVehiculo, setOrdenesVehiculo] = useState([])
  const [loadingVehiculos, setLoadingVehiculos] = useState(true)
  const [loadingOrdenes, setLoadingOrdenes] = useState(false)

  useEffect(() => {
    vehiculosService.getAll()
      .then(data => {
        setVehiculos(data)
        if (data.length > 0) setSelectedPlaca(data[0].placa)
      })
      .catch(console.error)
      .finally(() => setLoadingVehiculos(false))
  }, [])

  useEffect(() => {
    if (!selectedPlaca) return
    setLoadingOrdenes(true)
    ordenesService.getByPlaca(selectedPlaca)
      .then(data => setOrdenesVehiculo(data))
      .catch(() => setOrdenesVehiculo([]))
      .finally(() => setLoadingOrdenes(false))
  }, [selectedPlaca])

  const vehiculo = vehiculos.find(v => v.placa === selectedPlaca)

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return ''
    const d = new Date(fechaStr)
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="section-title" style={{ marginBottom: 0, fontSize: '1.5rem' }}>Historial de Rutas</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Vehículo:</label>
            <select
              value={selectedPlaca}
              onChange={(e) => setSelectedPlaca(e.target.value)}
              style={{
                padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.875rem',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', minWidth: '160px'
              }}
            >
              {vehiculos.map(v => (
                <option key={v.placa} value={v.placa}>{v.placa} — {v.tipo || 'CAMION'}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {loadingVehiculos ? (
        <div className="loading"><div className="loading-spinner"></div></div>
      ) : !vehiculo ? (
        <div className="empty-state"><div className="empty-state-text">No hay vehículos registrados</div></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <section>
              <div className="stat-card" style={{ height: '400px', padding: 0, overflow: 'hidden' }}>
                <RouteMap vehiculos={[vehiculo]} ordenes={ordenesVehiculo} />
              </div>
            </section>
            <section>
              <div className="stat-card" style={{ height: '400px', overflow: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className={`activity-icon vehiculo`}>◭</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{vehiculo.placa}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {vehiculo.tipo || 'CAMION'} · {vehiculo.tipoEnergia || 'GASOLINA'} · {vehiculo.estado}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {Math.round(vehiculo.kilometrajeActual || 0).toLocaleString()} km
                      </div>
                    </div>
                  </div>
                  {loadingOrdenes ? (
                    <div className="loading"><div className="loading-spinner"></div></div>
                  ) : ordenesVehiculo.length === 0 ? (
                    <div className="activity-empty">
                      <span className="activity-icon-small">◌</span>
                      <span className="activity-text">Sin órdenes registradas</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        {ordenesVehiculo.length} órden{ordenesVehiculo.length !== 1 ? 'es' : ''} encontrada{ordenesVehiculo.length !== 1 ? 's' : ''}
                      </div>
                      {ordenesVehiculo.map(o => (
                        <div key={o.codigoOrden} className="activity-item" style={{ marginBottom: 0 }}>
                          <div className={`activity-icon ${o.estado === 'COMPLETADA' ? 'orden' : 'vehiculo'}`}>
                            {o.estado === 'COMPLETADA' ? '◬' : '◭'}
                          </div>
                          <div className="activity-content">
                            <span className="activity-title">{o.codigoOrden}</span>
                            <span className="activity-time">
                              {o.estado} • {formatFecha(o.fechaCreacion)}
                            </span>
                            {o.origenLat != null && o.destinoLat != null && (
                              <span className="activity-time">
                                {o.origenLat.toFixed(4)},{o.origenLng?.toFixed(4)} → {o.destinoLat.toFixed(4)},{o.destinoLng?.toFixed(4)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {ordenesVehiculo.length > 0 && (
            <section>
              <h2 className="section-title" style={{ fontSize: '1.1rem' }}>Todas las Rutas de {selectedPlaca}</h2>
              <div className="activity-list">
                {ordenesVehiculo.map((o, i) => {
                  const posiciones = []
                  if (o.origenLat != null && o.origenLng != null) {
                    posiciones.push([o.origenLat, o.origenLng])
                  }
                  if (o.destinoLat != null && o.destinoLng != null) {
                    posiciones.push([o.destinoLat, o.destinoLng])
                  }
                  const link = posiciones.length === 2
                    ? `https://www.google.com/maps/dir/${posiciones[0][0]},${posiciones[0][1]}/${posiciones[1][0]},${posiciones[1][1]}`
                    : null
                  return (
                    <div key={o.codigoOrden} className="activity-item">
                      <div className="activity-icon orden">◬</div>
                      <div className="activity-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="activity-title">{o.codigoOrden}</span>
                          <span style={{
                            fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
                            background: o.estado === 'COMPLETADA' ? 'rgba(0,212,170,0.15)' : 'rgba(139,92,246,0.15)',
                            color: o.estado === 'COMPLETADA' ? 'var(--accent-primary)' : '#8b5cf6'
                          }}>{o.estado}</span>
                        </div>
                        <span className="activity-time">{formatFecha(o.fechaCreacion)}</span>
                        {posiciones.length === 2 && (
                          <span className="activity-time">
                            Origen: {posiciones[0][0].toFixed(4)},{posiciones[0][1].toFixed(4)} — Destino: {posiciones[1][0].toFixed(4)},{posiciones[1][1].toFixed(4)}
                          </span>
                        )}
                        {link && (
                          <a href={link} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem', display: 'inline-block' }}
                          >Ver en Google Maps →</a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default HistorialRutas
