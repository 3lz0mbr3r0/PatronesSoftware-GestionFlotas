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

  async updateEstado(placa, estado) {
    const response = await fetch(`${API_BASE}/vehiculos/${placa}/estado?estado=${estado}`, {
      method: 'PUT'
    })
    if (!response.ok) throw new Error('Error updating estado')
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
  },

  async delete(codigoOrden) {
    const response = await fetch(`${API_BASE}/ordenes/${codigoOrden}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error eliminando orden')
  },

  async completar(codigoOrden) {
    const response = await fetch(`${API_BASE}/ordenes/${codigoOrden}/completar`, {
      method: 'PUT'
    })
    if (!response.ok) throw new Error('Error completando orden')
    return response.json()
  },

  async getByPlaca(placa) {
    const response = await fetch(`${API_BASE}/ordenes/por-placa/${placa}`)
    if (!response.ok) throw new Error('Error fetching órdenes por placa')
    return response.json()
  }
}

export const reportesService = {
  async getAll() {
    const response = await fetch(`${API_BASE}/reportes`)
    if (!response.ok) throw new Error('Error fetching reportes')
    return response.json()
  },

  async create(dto) {
    const response = await fetch(`${API_BASE}/reportes/mantenimiento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Error creando reporte')
    }
    return response.json()
  },

  async delete(placaVehiculo, tipoMantenimiento, fecha) {
    const params = new URLSearchParams({ placaVehiculo, tipoMantenimiento, fecha })
    const response = await fetch(`${API_BASE}/reportes?${params}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error eliminando reporte')
  },

  async getOrdenadosPorFecha(dir = 'desc') {
    const response = await fetch(`${API_BASE}/reportes/ordenados-por-fecha?dir=${dir}`)
    if (!response.ok) throw new Error('Error fetching reportes ordenados')
    return response.json()
  },

  async getPorRango(fechaDesde, fechaHasta) {
    const params = new URLSearchParams({ fechaDesde, fechaHasta })
    const response = await fetch(`${API_BASE}/reportes/por-rango?${params}`)
    if (!response.ok) throw new Error('Error fetching reportes por rango')
    return response.json()
  },

  async getProximos(kmUmbral = 5000) {
    const response = await fetch(`${API_BASE}/reportes/proximos?kmUmbral=${kmUmbral}`)
    if (!response.ok) throw new Error('Error fetching reportes próximos')
    return response.json()
  },

  async getVehiculosProximos(kmUmbral = 5000) {
    const response = await fetch(`${API_BASE}/reportes/vehiculos-proximos?kmUmbral=${kmUmbral}`)
    if (!response.ok) throw new Error('Error fetching vehículos próximos')
    return response.json()
  },

  async proyectar(placa) {
    const response = await fetch(`${API_BASE}/reportes/proyeccion/${placa}`)
    if (!response.ok) throw new Error('Error proyecting mantenimiento')
    return response.json()
  }
}