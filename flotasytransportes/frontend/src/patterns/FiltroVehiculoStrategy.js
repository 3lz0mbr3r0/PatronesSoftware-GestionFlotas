class FiltroStrategy {
  getNombre() { return '' }
  filtrar(vehiculos) { return vehiculos }
}

class FiltroTodosStrategy extends FiltroStrategy {
  getNombre() { return 'Todos' }
  filtrar(vehiculos) { return vehiculos }
}

class FiltroPorTipoStrategy extends FiltroStrategy {
  constructor(tipo) {
    super()
    this.tipo = tipo
  }
  getNombre() { return `Tipo: ${this.tipo}` }
  filtrar(vehiculos) {
    return vehiculos.filter(v => v.tipo === this.tipo)
  }
}

class FiltroPorEnergiaStrategy extends FiltroStrategy {
  constructor(energia) {
    super()
    this.energia = energia
  }
  getNombre() { return `Energía: ${this.energia}` }
  filtrar(vehiculos) {
    return vehiculos.filter(v => v.tipoEnergia === this.energia)
  }
}

class FiltroPorEstadoStrategy extends FiltroStrategy {
  constructor(estado) {
    super()
    this.estado = estado
  }
  getNombre() { return `Estado: ${this.estado}` }
  filtrar(vehiculos) {
    return vehiculos.filter(v => v.estado === this.estado)
  }
}

class FiltroPorKilometrajeStrategy extends FiltroStrategy {
  constructor(minKm, maxKm) {
    super()
    this.minKm = minKm
    this.maxKm = maxKm
  }
  getNombre() { return `Km: ${this.minKm}-${this.maxKm}` }
  filtrar(vehiculos) {
    return vehiculos.filter(v => {
      const km = v.kilometrajeActual || 0
      return km >= this.minKm && km <= this.maxKm
    })
  }
}

class FiltroProximoMantenimientoStrategy extends FiltroStrategy {
  constructor(umbralPct = 70) {
    super()
    this.umbralPct = umbralPct
  }
  getNombre() { return `Próximo a mantenimiento (≥${this.umbralPct}%)` }
  filtrar(vehiculos) {
    return vehiculos.filter(v => {
      if (!v.kilometrajeActual || !v.limiteMantenimiento) return false
      return (v.kilometrajeActual / v.limiteMantenimiento) * 100 >= this.umbralPct
    })
  }
}

export function crearEstrategiasDisponibles(vehiculos) {
  const tipos = [...new Set(vehiculos.map(v => v.tipo).filter(Boolean))]
  const energias = [...new Set(vehiculos.map(v => v.tipoEnergia).filter(Boolean))]
  const estados = [...new Set(vehiculos.map(v => v.estado).filter(Boolean))]

  const estrategias = [new FiltroTodosStrategy()]

  tipos.forEach(tipo => estrategias.push(new FiltroPorTipoStrategy(tipo)))
  energias.forEach(energia => estrategias.push(new FiltroPorEnergiaStrategy(energia)))
  estados.forEach(estado => estrategias.push(new FiltroPorEstadoStrategy(estado)))

  estrategias.push(new FiltroProximoMantenimientoStrategy(70))
  estrategias.push(new FiltroPorKilometrajeStrategy(0, 50000))

  return estrategias
}

export {
  FiltroStrategy,
  FiltroTodosStrategy,
  FiltroPorTipoStrategy,
  FiltroPorEnergiaStrategy,
  FiltroPorEstadoStrategy,
  FiltroPorKilometrajeStrategy,
  FiltroProximoMantenimientoStrategy
}
