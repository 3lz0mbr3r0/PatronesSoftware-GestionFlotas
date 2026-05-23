import { useState, useEffect } from 'react'
import { ordenesService } from '../../services/api'
import commandHistory, { CrearOrdenCommand } from '../../patterns/comandos'

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

const ESTADOS = {
  CREADA: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
  ASIGNADA: { bg: 'rgba(0, 212, 170, 0.15)', color: 'var(--accent-primary)' },
  EN_RUTA: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  COMPLETADA: { bg: 'rgba(0, 212, 170, 0.15)', color: 'var(--accent-primary)' }
}

function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [formData, setFormData] = useState({
    origenLat: '',
    origenLng: '',
    destinoLat: '',
    destinoLng: ''
  })

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    try {
      const data = await ordenesService.getAll()
      setOrdenes(data)
    } catch (error) {
      console.error('Error cargando órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)
    setResultado(null)
    try {
      const ordenData = {
        origenLat: parseFloat(formData.origenLat),
        origenLng: parseFloat(formData.origenLng),
        destinoLat: parseFloat(formData.destinoLat),
        destinoLng: parseFloat(formData.destinoLng)
      }
      const cmd = new CrearOrdenCommand(ordenData)
      const res = await commandHistory.ejecutar(cmd)
      setResultado(res)
      await cargarOrdenes()
      setShowForm(false)
      setFormData({ origenLat: '', origenLng: '', destinoLat: '', destinoLng: '' })
    } catch (error) {
      console.error('Error creando orden:', error)
      alert('Error al crear orden: ' + error.message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Órdenes de Transporte</h1>
        <button className="action-card" onClick={() => setShowForm(!showForm)} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          <span className="action-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>➜</span>
          <span className="action-title">Nueva Orden</span>
        </button>
      </div>

      {resultado && (
        <div className="stat-card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-primary)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>✓ Orden Creada</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Código</span>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{resultado.codigoOrden}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Vehículo Asignado</span>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{resultado.vehiculoPlaca}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Estado</span>
              <p style={{ color: 'var(--text-primary)' }}>{resultado.estado}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Coordenadas</span>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                {resultado.origenLat},{resultado.origenLng} → {resultado.destinoLat},{resultado.destinoLng}
              </p>
            </div>
          </div>
          {resultado.generarLinkNavegacion && (
            <a
              href={resultado.generarLinkNavegacion}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              Ver ruta en Google Maps →
            </a>
          )}
          <button
            onClick={() => setResultado(null)}
            style={{
              marginTop: '0.75rem',
              marginLeft: '0.5rem',
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

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Crear Nueva Orden</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            El código de orden se generará automáticamente.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ ...labelStyle }}>Latitud Origen *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.origenLat}
                  onChange={(e) => setFormData({ ...formData, origenLat: e.target.value })}
                  placeholder="4.7110"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Longitud Origen *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.origenLng}
                  onChange={(e) => setFormData({ ...formData, origenLng: e.target.value })}
                  placeholder="-74.0721"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Latitud Destino *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.destinoLat}
                  onChange={(e) => setFormData({ ...formData, destinoLat: e.target.value })}
                  placeholder="6.2476"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Longitud Destino *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.destinoLng}
                  onChange={(e) => setFormData({ ...formData, destinoLng: e.target.value })}
                  placeholder="-75.5658"
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
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
                {loadingSubmit ? 'Creando...' : 'Crear y Asignar'}
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

      {ordenes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◬</div>
          <div className="empty-state-text">No hay órdenes registradas</div>
          <div className="empty-state-subtext">Crea tu primera orden de transporte</div>
        </div>
      ) : (
        <div className="activity-list">
          {ordenes.map(orden => {
            const estadoStyle = ESTADOS[orden.estado] || { bg: 'var(--bg-tertiary)', color: 'var(--text-muted)' }
            return (
              <div key={orden.codigoOrden} className="activity-item">
                <div className="activity-icon orden">◬</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <span className="activity-title">{orden.codigoOrden}</span>
                  <span className="activity-time">
                    {orden.origenLat},{orden.origenLng} → {orden.destinoLat},{orden.destinoLng}
                    {orden.vehiculoPlaca && ` • ${orden.vehiculoPlaca}`}
                  </span>
                  <span className="activity-time" style={{ fontSize: '0.7rem' }}>
                    {formatFecha(orden.fechaCreacion)}
                  </span>
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  background: estadoStyle.bg,
                  color: estadoStyle.color,
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  {orden.estado}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ListaOrdenes