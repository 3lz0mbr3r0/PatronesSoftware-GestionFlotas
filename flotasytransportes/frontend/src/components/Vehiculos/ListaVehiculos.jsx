import { useState, useEffect } from 'react'
import { vehiculosService } from '../../services/api'

const ESTADOS = ['DISPONIBLE', 'EN_RUTA', 'MANTENIMIENTO']
const TIPOS = ['CAMION', 'MOTO', 'FURGON']
const TIPOS_ENERGIA = ['GASOLINA', 'ELECTRICO']

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

function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [formData, setFormData] = useState({
    placa: '',
    latitud: '',
    longitud: '',
    tipo: 'CAMION',
    tipoEnergia: 'GASOLINA',
    kilometrajeActual: '',
    limiteMantenimiento: '',
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
      const vehiculoData = {
        placa: formData.placa,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        tipoEnergia: formData.tipoEnergia,
        kilometrajeActual: formData.kilometrajeActual ? parseFloat(formData.kilometrajeActual) : 0,
        limiteMantenimiento: formData.limiteMantenimiento ? parseFloat(formData.limiteMantenimiento) : 10000,
        estado: formData.estado
      }
      await vehiculosService.createByTipo(formData.tipo, vehiculoData)
      await cargarVehiculos()
      setShowForm(false)
      setFormData({
        placa: '',
        latitud: '',
        longitud: '',
        tipo: 'CAMION',
        tipoEnergia: 'GASOLINA',
        kilometrajeActual: '',
        limiteMantenimiento: '',
        estado: 'DISPONIBLE'
      })
    } catch (error) {
      console.error('Error creando vehículo:', error)
      alert('Error al crear vehículo: ' + error.message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleEstadoChange = async (placa, nuevoEstado) => {
    try {
      await vehiculosService.updateEstado(placa, nuevoEstado)
      await cargarVehiculos()
    } catch (error) {
      console.error('Error cambiando estado:', error)
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

  const getEstadoColor = (estado) => {
    const colors = {
      DISPONIBLE: { bg: 'rgba(0, 212, 170, 0.15)', color: 'var(--accent-primary)' },
      EN_RUTA: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
      MANTENIMIENTO: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }
    }
    return colors[estado] || colors.DISPONIBLE
  }

  const getTipoIcon = (tipo) => {
    const icons = {
      CAMION: '◭',
      MOTO: '◬',
      FURGON: '◰'
    }
    return icons[tipo] || '◭'
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
                <label style={{ ...labelStyle }}>Placa *</label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                  placeholder="ABC-123"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Tipo de Vehículo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                  style={inputStyle}
                >
                  {TIPOS.map(t => (
                    <option key={t} value={t}>{t === 'CAMION' ? 'Camión' : t === 'MOTO' ? 'Motocicleta' : 'Furgón'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle }}>Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitud}
                  onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                  placeholder="4.7110"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitud}
                  onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                  placeholder="-74.0721"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Tipo de Energía *</label>
                <select
                  value={formData.tipoEnergia}
                  onChange={(e) => setFormData({ ...formData, tipoEnergia: e.target.value })}
                  required
                  style={inputStyle}
                >
                  {TIPOS_ENERGIA.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle }}>Estado inicial</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  style={inputStyle}
                >
                  {ESTADOS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle }}>Kilometraje inicial</label>
                <input
                  type="number"
                  step="any"
                  value={formData.kilometrajeActual}
                  onChange={(e) => setFormData({ ...formData, kilometrajeActual: e.target.value })}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ ...labelStyle }}>Límite mantenimiento (km)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.limiteMantenimiento}
                  onChange={(e) => setFormData({ ...formData, limiteMantenimiento: e.target.value })}
                  placeholder="10000"
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
          {vehiculos.map(vehiculo => {
            const estadoStyle = getEstadoColor(vehiculo.estado)
            return (
              <div key={vehiculo.placa} className="activity-item">
                <div className="activity-icon vehiculo">{getTipoIcon(vehiculo.tipo || 'CAMION')}</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <span className="activity-title">{vehiculo.placa}</span>
                  <span className="activity-time">
                    {vehiculo.tipo || 'CAMION'} • {vehiculo.tipoEnergia || 'GASOLINA'} • {vehiculo.kilometrajeActual || 0} km
                  </span>
                </div>
                <div style={{ 
                  marginRight: '0.5rem',
                  padding: '0.25rem 0.75rem', 
                  background: estadoStyle.bg, 
                  color: estadoStyle.color,
                  borderRadius: '4px', 
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {vehiculo.estado}
                </div>
                {vehiculo.estado === 'MANTENIMIENTO' && (
                  <button
                    onClick={() => handleEstadoChange(vehiculo.placa, 'DISPONIBLE')}
                    style={{ 
                      marginRight: '1rem',
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(0, 212, 170, 0.15)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--accent-primary)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Marcar como disponible"
                  >
                    ✓ Disponible
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(vehiculo.placa)}
                  style={{ 
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
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ListaVehiculos