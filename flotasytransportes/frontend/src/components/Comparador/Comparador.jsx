import { useState, useEffect } from 'react'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'

const estadoColors = {
  DISPONIBLE: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent-primary)' },
  EN_RUTA: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  MANTENIMIENTO: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
}

const TIPO_ICON = {
  CAMION: '⬡',
  FURGON: '▣',
  MOTO: '⬢'
}

function Comparador() {
  const [vehiculos, setVehiculos] = useState([])
  const [selected, setSelected] = useState([])
  const [resultados, setResultados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingCompare, setLoadingCompare] = useState(false)

  useEffect(() => {
    vehiculosService.getAll()
      .then(setVehiculos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleVehiculo = (placa) => {
    setSelected(prev => {
      if (prev.includes(placa)) return prev.filter(p => p !== placa)
      if (prev.length >= 5) return prev
      return [...prev, placa]
    })
  }

  const handleCompare = async () => {
    if (selected.length < 2) return
    setLoadingCompare(true)
    try {
      const [reportes, ordenes] = await Promise.all([
        reportesService.getAll(),
        ordenesService.getAll()
      ])
      const data = selected.map(placa => {
        const v = vehiculos.find(v => v.placa === placa)
        const reps = reportes.filter(r => r.placaVehiculo === placa)
        const ords = ordenes.filter(o => o.vehiculoPlaca === placa)
        return {
          placa,
          tipo: v?.tipo || 'CAMION',
          estado: v?.estado || '—',
          energia: v?.tipoEnergia || '—',
          kmActual: v?.kilometrajeActual,
          limiteMantenimiento: v?.limiteMantenimiento,
          pctVida: v?.limiteMantenimiento
            ? Math.min((v.kilometrajeActual / v.limiteMantenimiento) * 100, 100)
            : null,
          totalReportes: reps.length,
          costoTotal: reps.reduce((s, r) => s + (r.costoEstimado || 0), 0),
          costoPromedio: reps.length > 0
            ? reps.reduce((s, r) => s + (r.costoEstimado || 0), 0) / reps.length
            : 0,
          ordenesCompletadas: ords.filter(o => o.estado === 'COMPLETADA').length,
          totalOrdenes: ords.length,
          horasMantenimiento: reps.reduce((s, r) => s + (r.tiempoEstimadoHoras || 0), 0),
          ultimoReporte: reps.length > 0
            ? reps.sort((a, b) => b.fecha.localeCompare(a.fecha))[0].fecha
            : '—'
        }
      })
      setResultados(data)
    } catch (error) {
      console.error('Error comparando:', error)
    } finally {
      setLoadingCompare(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>
  }

  const mejorValor = (metricas, key, menorEsMejor) => {
    const nums = metricas.filter(m => m[key] != null).map(m => m[key])
    if (nums.length === 0) return null
    return menorEsMejor ? Math.min(...nums) : Math.max(...nums)
  }

  const esMejor = (valor, mejor) => {
    return valor != null && mejor != null && valor === mejor
  }

  const filas = resultados ? [
    { label: 'Tipo', key: 'tipo', type: 'text' },
    { label: 'Estado', key: 'estado', type: 'estado' },
    { label: 'Energía', key: 'energia', type: 'text' },
    { label: 'Km Actual', key: 'kmActual', type: 'number', suffix: ' km', menorEsMejor: false, decimals: 0 },
    { label: 'Límite Mant.', key: 'limiteMantenimiento', type: 'number', suffix: ' km', decimals: 0 },
    { label: '% Vida Útil', key: 'pctVida', type: 'number', suffix: '%', menorEsMejor: true, decimals: 0 },
    { label: 'Reportes', key: 'totalReportes', type: 'number', menorEsMejor: true },
    { label: 'Costo Total', key: 'costoTotal', type: 'currency', menorEsMejor: true },
    { label: 'Costo Promedio', key: 'costoPromedio', type: 'currency', menorEsMejor: true },
    { label: 'Órdenes Complet.', key: 'ordenesCompletadas', type: 'number', menorEsMejor: false },
    { label: 'Total Órdenes', key: 'totalOrdenes', type: 'number', menorEsMejor: false },
    { label: 'Horas Mtto.', key: 'horasMantenimiento', type: 'number', suffix: ' h', menorEsMejor: true },
    { label: 'Último Reporte', key: 'ultimoReporte', type: 'text' }
  ] : []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Comparador de Vehículos</h1>
        <button
          onClick={handleCompare}
          disabled={selected.length < 2 || loadingCompare}
          className="action-card"
          style={{
            width: 'auto', padding: '0.75rem 1.5rem',
            opacity: selected.length < 2 ? 0.5 : 1,
            cursor: selected.length < 2 ? 'not-allowed' : 'pointer'
          }}
        >
          <span className="action-icon">◷</span>
          <span className="action-title">
            {loadingCompare ? 'Comparando...' : `Comparar ${selected.length} vehículo${selected.length !== 1 ? 's' : ''}`}
          </span>
        </button>
      </div>

      <div className="stat-card" style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Selecciona 2 a 5 vehículos para comparar lado a lado
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {vehiculos.map(v => {
            const isSelected = selected.includes(v.placa)
            const ec = estadoColors[v.estado] || estadoColors.DISPONIBLE
            return (
              <button
                key={v.placa}
                onClick={() => toggleVehiculo(v.placa)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(0,212,170,0.1)' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{
                  width: '18px', height: '18px', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? 'var(--accent-primary)' : 'transparent',
                  border: isSelected ? 'none' : '2px solid var(--border-subtle)',
                  color: isSelected ? 'var(--bg-primary)' : 'transparent',
                  fontSize: '0.7rem', fontWeight: 700
                }}>
                  {isSelected ? '✓' : ''}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{v.placa}</span>
                <span style={{ color: 'var(--text-muted)' }}>{TIPO_ICON[v.tipo] || '⬡'} {v.tipo}</span>
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem',
                  background: ec.bg, color: ec.color
                }}>
                  {v.estado}
                </span>
              </button>
            )
          })}
        </div>
        {selected.length >= 2 && (
          <p style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            {selected.length} vehículo{selected.length !== 1 ? 's' : ''} seleccionado{selected.length !== 1 ? 's' : ''}. Presiona "Comparar".
          </p>
        )}
      </div>

      {loadingCompare && (
        <div className="loading" style={{ padding: '2rem' }}>
          <div className="loading-spinner"></div>
        </div>
      )}

      {resultados && !loadingCompare && (
        <div className="stat-card" style={{ overflowX: 'auto', padding: '0' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '600px'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--accent-primary)' }}>
                <th style={{
                  padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)',
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                  position: 'sticky', left: 0, background: 'var(--bg-card)'
                }}>
                  Métrica
                </th>
                {resultados.map(r => (
                  <th key={r.placa} style={{
                    padding: '0.75rem 1rem', textAlign: 'center',
                    color: 'var(--accent-primary)', fontWeight: 700
                  }}>
                    <div style={{ fontSize: '1rem' }}>{TIPO_ICON[r.tipo] || '⬡'}</div>
                    <div>{r.placa}</div>
                    <div style={{
                      fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)'
                    }}>{r.tipo}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map(fila => {
                const valores = resultados.map(r => r[fila.key])
                let mejor = null
                if (fila.menorEsMejor != null) {
                  const nums = valores.filter(v => typeof v === 'number' && v != null)
                  mejor = fila.menorEsMejor ? Math.min(...nums) : Math.max(...nums)
                }
                return (
                  <tr key={fila.key} style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s'
                  }}>
                    <td style={{
                      padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)',
                      fontSize: '0.8rem', position: 'sticky', left: 0,
                      background: 'var(--bg-card)', whiteSpace: 'nowrap'
                    }}>
                      {fila.label}
                    </td>
                    {resultados.map((r, i) => {
                      const valor = r[fila.key]
                      const esMejorValor = mejor != null && valor != null && valor === mejor
                      let display = valor

                      if (fila.type === 'currency') {
                        display = valor != null ? `$${Math.round(valor).toLocaleString()}` : '—'
                      } else if (fila.type === 'number') {
                        display = valor != null
                          ? (fila.decimals != null ? valor.toFixed(fila.decimals) : Math.round(valor).toLocaleString()) + (fila.suffix || '')
                          : '—'
                      } else if (fila.type === 'estado') {
                        display = valor || '—'
                      } else {
                        display = valor || '—'
                      }

                      const ec = fila.type === 'estado' && valor
                        ? estadoColors[valor] || estadoColors.DISPONIBLE
                        : null

                      return (
                        <td key={r.placa} style={{
                          padding: '0.75rem 1rem', textAlign: 'center',
                          fontWeight: esMejorValor ? 700 : 400,
                          color: esMejorValor ? 'var(--accent-primary)' : 'var(--text-primary)',
                          background: esMejorValor ? 'rgba(0,212,170,0.05)' : 'transparent'
                        }}>
                          {fila.type === 'estado' && ec ? (
                            <span style={{
                              padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem',
                              background: ec.bg, color: ec.color
                            }}>
                              ● {display}
                            </span>
                          ) : (
                            <span>
                              {display}
                              {esMejorValor && (
                                <span style={{
                                  display: 'inline-block', marginLeft: '0.35rem',
                                  fontSize: '0.65rem', color: 'var(--accent-primary)',
                                  fontWeight: 700
                                }}>
                                  ★
                                </span>
                              )}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected.length < 2 && resultados === null && !loadingCompare && (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: '2rem' }}>◷</div>
          <div className="empty-state-text">Selecciona al menos 2 vehículos para comparar</div>
          <div className="empty-state-subtext">Elige los vehículos de la lista de arriba</div>
        </div>
      )}
    </div>
  )
}

export default Comparador
