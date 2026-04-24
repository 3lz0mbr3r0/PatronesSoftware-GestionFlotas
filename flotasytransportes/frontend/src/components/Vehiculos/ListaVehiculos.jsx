import { useState, useEffect } from 'react'
import { vehiculosService } from '../../services/api'

function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    marca: '',
    tipo: 'CAMION',
    tipoEnergia: 'DIESEL',
    capacidad: 0,
    estado: 'DISPONIBLE'
  })

  useEffect(() => {
    cargarVehiculos()
  }, [])

  const cargarVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll()
      setVehiculos(data)
    } catch (error) {
      console.error('Error cargando vehículos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)
    try {
      await vehiculosService.create(formData)
      await cargarVehiculos()
      setShowForm(false)
      setFormData({ placa: '', modelo: '', marca: '', tipo: 'CAMION', tipoEnergia: 'DIESEL', capacidad: 0, estado: 'DISPONIBLE' })
    } catch (error) {
      console.error('Error creando vehículo:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleDelete = async (placa) => {
    if (window.confirm(`¿Eliminar vehículo ${placa}?`)) {
      try {
        await vehiculosService.delete(placa)
        await cargarVehiculos()
      } catch (error) {
        console.error('Error eliminando vehículo:', error)
      }
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
        <h1 className="section-title" style={{ marginBottom: 0 }}>Vehículos</h1>
        <button className="action-card" onClick={() => setShowForm(!showForm)} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          <span className="action-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>⬡</span>
          <span className="action-title">Nuevo Vehículo</span>
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Registrar Nuevo Vehículo</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Placa</label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Marca</label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Modelo</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                >
                  <option value="CAMION">Camión</option>
                  <option value="FURGON">Furgón</option>
                  <option value="MOTO">Motocicleta</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tipo Energía</label>
                <select
                  value={formData.tipoEnergia}
                  onChange={(e) => setFormData({ ...formData, tipoEnergia: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                >
                  <option value="DIESEL">Diésel</option>
                  <option value="GASOLINA">Gasolina</option>
                  <option value="ELECTRICO">Eléctrico</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Capacidad (kg)</label>
                <input
                  type="number"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
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
                {loadingSubmit ? 'Creando...' : 'Registrar Vehículo'}
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

      {vehiculos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◭</div>
          <div className="empty-state-text">No hay vehículos registrados</div>
          <div className="empty-state-subtext">Registra tu primer vehículo</div>
        </div>
      ) : (
        <div className="activity-list">
          {vehiculos.map(vehiculo => (
            <div key={vehiculo.placa} className="activity-item">
              <div className="activity-icon vehiculo">◭</div>
              <div className="activity-content">
                <span className="activity-title">{vehiculo.placa}</span>
                <span className="activity-time">{vehiculo.marca} {vehiculo.modelo}</span>
              </div>
              <div style={{ 
                marginLeft: 'auto', 
                padding: '0.25rem 0.75rem', 
                background: vehiculo.estado === 'DISPONIBLE' ? 'rgba(0, 212, 170, 0.15)' : vehiculo.estado === 'EN_RUTA' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                color: vehiculo.estado === 'DISPONIBLE' ? 'var(--accent-primary)' : vehiculo.estado === 'EN_RUTA' ? '#8b5cf6' : '#f59e0b',
                borderRadius: '4px', 
                fontSize: '0.75rem' 
              }}>
                {vehiculo.estado}
              </div>
              <button 
                onClick={() => handleDelete(vehiculo.placa)}
                style={{ 
                  marginLeft: '1rem',
                  padding: '0.5rem',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaVehiculos