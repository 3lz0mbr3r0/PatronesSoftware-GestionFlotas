const API_BASE = 'http://localhost:8080'

export const vehiculosService = {
  async getAll() {
    const response = await fetch(`${API_BASE}/vehiculos`)
    if (!response.ok) throw new Error('Error fetching vehículos')
    return response.json()
  },

  async getByPlaca(placa) {
    const response = await fetch(`${API_BASE}/vehiculos/${placa}`)
    if (!response.ok) throw new Error('Error fetching vehículo')
    return response.json()
  },

  async createByTipo(tipo, vehiculo) {
    const response = await fetch(`${API_BASE}/vehiculos/${tipo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehiculo)
    })
    if (!response.ok) throw new Error('Error creating vehículo')
    return response.json()
  },

  async updateUbicacion(placa, lat, lng) {
    const response = await fetch(`${API_BASE}/vehiculos/${placa}/ubicacion?lat=${lat}&lng=${lng}`, {
      method: 'PUT'
    })
    if (!response.ok) throw new Error('Error updating ubicación')
    return response.json()
  },

  async updateKilometraje(placa, km) {
    const response = await fetch(`${API_BASE}/vehiculos/${placa}/kilometraje?km=${km}`, {
      method: 'PUT'
    })
    if (!response.ok) throw new Error('Error updating kilometraje')
    return response.json()
  },

  async delete(placa) {
    const response = await fetch(`${API_BASE}/vehiculos/${placa}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error deleting vehículo')
  }
}

export const ordenesService = {
  async getAll() {
    const response = await fetch(`${API_BASE}/ordenes`)
    if (!response.ok) throw new Error('Error fetching órdenes')
    return response.json()
  },

  async crearYAsignar(orden) {
    const response = await fetch(`${API_BASE}/ordenes/asignar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden)
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Error creando orden')
    }
    return response.json()
  }
}

export const reportesService = {
  async getMantenimiento() {
    const response = await fetch(`${API_BASE}/reportes/mantenimiento`)
    if (!response.ok) throw new Error('Error fetching reportes')
    return response.json()
  }
}