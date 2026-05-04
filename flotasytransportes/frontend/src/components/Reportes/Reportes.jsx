import { useState, useEffect } from 'react'
import { reportesService } from '../../services/api'

function Reportes() {
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    try {
      const data = await reportesService.getMantenimiento()
      setReportes(data)
    } catch (error) {
      console.error('Error cargando reportes:', error)
      setReportes([])
    } finally {
      setLoading(false)
    }
  }

  const statsMantenimiento = {
    total: reportes.length,
    pendiente: reportes.filter(r => r.estado === 'PENDIENTE').length,
    enProceso: reportes.filter(r => r.estado === 'EN_PROCESO').length,
    completado: reportes.filter(r => r.estado === 'COMPLETADO').length
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Reportes de Mantenimiento</h1>

      <div className="hero-stats" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-number">{statsMantenimiento.total}</span>
          <span className="stat-label">Total Reportes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#f59e0b' }}>{statsMantenimiento.pendiente}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#8b5cf6' }}>{statsMantenimiento.enProceso}</span>
          <span className="stat-label">En Proceso</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: 'var(--accent-primary)' }}>{statsMantenimiento.completado}</span>
          <span className="stat-label">Completados</span>
        </div>
      </div>

      {reportes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◳</div>
          <div className="empty-state-text">No hay reportes de mantenimiento</div>
          <div className="empty-state-subtext">Los reportes aparecerán aquí</div>
        </div>
      ) : (
        <div className="activity-list">
          {reportes.map(reporte => (
            <div key={reporte.id || reporte.codigoReporte} className="activity-item">
              <div className="activity-icon mantenimiento">◳</div>
              <div className="activity-content">
                <span className="activity-title">{reporte.codigoReporte || `Reporte #${reporte.id}`}</span>
                <span className="activity-time">{reporte.vehiculoPlaca || 'Sin vehículo'} - {reporte.tipoMantenimiento || 'General'}</span>
              </div>
              <div style={{ 
                marginLeft: 'auto', 
                padding: '0.25rem 0.75rem', 
                background: reporte.estado === 'PENDIENTE' ? 'rgba(245, 158, 11, 0.15)' : reporte.estado === 'EN_PROCESO' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0, 212, 170, 0.15)', 
                color: reporte.estado === 'PENDIENTE' ? '#f59e0b' : reporte.estado === 'EN_PROCESO' ? '#8b5cf6' : 'var(--accent-primary)',
                borderRadius: '4px', 
                fontSize: '0.75rem' 
              }}>
                {reporte.estado}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reportes