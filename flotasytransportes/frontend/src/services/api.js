const API_BASE = 'http://localhost:8080/api'

export const vehiculosService = {
  async getAll() {
    const response = await fetch(`${API_BASE}/vehiculos`)
    if (!response.ok) throw new Error('Error fetching vehículos')
    return response.json()
  },

  async create(vehiculo) {
    const response = await fetch(`${API_BASE}/vehiculos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehiculo)
    })
    if (!response.ok) throw new Error('Error creating vehículo')
    return response.json()
  },

  async update(placa, vehiculo) {
    const response = await fetch(`${API_BASE}/vehiculos/${placa}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehiculo)
    })
    if (!response.ok) throw new Error('Error updating vehículo')
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
    if (!response.ok) throw new Error('Error creating order')
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