import { useState, useEffect } from 'react'
import { ordenesService } from '../../services/api'

function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [formData, setFormData] = useState({
    codigoOrden: '',
    origen: '',
    destino: '',
    cliente: '',
    descripcion: ''
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
    try {
      await ordenesService.crearYAsignar(formData)
      await cargarOrdenes()
      setShowForm(false)
      setFormData({ codigoOrden: '', origen: '', destino: '', cliente: '', descripcion: '' })
    } catch (error) {
      console.error('Error creando orden:', error)
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Órdenes de Transporte</h1>
        <button className="action-card" onClick={() => setShowForm(!showForm)} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          <span className="action-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>➜</span>
          <span className="action-title">Nueva Orden</span>
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Crear Nueva Orden</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Código Orden</label>
                <input
                  type="text"
                  value={formData.codigoOrden}
                  onChange={(e) => setFormData({ ...formData, codigoOrden: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cliente</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Origen</label>
                <input
                  type="text"
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Destino</label>
                <input
                  type="text"
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
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
                {loadingSubmit ? 'Creando...' : 'Crear Orden'}
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
          {ordenes.map(orden => (
            <div key={orden.codigoOrden || orden.id} className="activity-item">
              <div className="activity-icon orden">◬</div>
              <div className="activity-content">
                <span className="activity-title">{orden.codigoOrden || `Orden #${orden.id}`}</span>
                <span className="activity-time">{orden.origen} → {orden.destino}</span>
              </div>
              <div style={{ marginLeft: 'auto', padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem' }}>
                {orden.estado || 'PENDIENTE'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaOrdenes