import eventBus from '../../services/EventBus'
import { vehiculosService, ordenesService, reportesService } from '../../services/api'

class Command {
  execute() { throw new Error('execute() must be implemented') }
  undo() { throw new Error('undo() must be implemented') }
  getDescripcion() { return '' }
}

class CrearVehiculoCommand extends Command {
  constructor(tipo, vehiculoData) {
    super()
    this.tipo = tipo
    this.vehiculoData = vehiculoData
    this.placaCreada = null
  }

  async execute() {
    const res = await vehiculosService.createByTipo(this.tipo, this.vehiculoData)
    this.placaCreada = res.placa
    eventBus.emit('vehiculo:created', res)
    return res
  }

  async undo() {
    if (this.placaCreada) {
      await vehiculosService.delete(this.placaCreada)
      eventBus.emit('vehiculo:deleted', { placa: this.placaCreada })
    }
  }

  getDescripcion() { return `Crear vehículo ${this.tipo} - ${this.placaCreada || '...'}` }
}

class EliminarVehiculoCommand extends Command {
  constructor(placa) {
    super()
    this.placa = placa
  }

  async execute() {
    await vehiculosService.delete(this.placa)
    eventBus.emit('vehiculo:deleted', { placa: this.placa })
  }

  async undo() {
    // Cannot undo delete without data
    throw new Error('No se puede deshacer una eliminación')
  }

  getDescripcion() { return `Eliminar vehículo ${this.placa}` }
}

class CambiarEstadoCommand extends Command {
  constructor(placa, nuevoEstado, estadoAnterior) {
    super()
    this.placa = placa
    this.nuevoEstado = nuevoEstado
    this.estadoAnterior = estadoAnterior
  }

  async execute() {
    await vehiculosService.updateEstado(this.placa, this.nuevoEstado)
    eventBus.emit('vehiculo:estadoChanged', { placa: this.placa, estado: this.nuevoEstado })
  }

  async undo() {
    if (this.estadoAnterior) {
      await vehiculosService.updateEstado(this.placa, this.estadoAnterior)
      eventBus.emit('vehiculo:estadoChanged', { placa: this.placa, estado: this.estadoAnterior })
    }
  }

  getDescripcion() { return `Cambiar estado ${this.placa} → ${this.nuevoEstado}` }
}

class CrearOrdenCommand extends Command {
  constructor(ordenData) {
    super()
    this.ordenData = ordenData
    this.resultado = null
  }

  async execute() {
    const res = await ordenesService.crearYAsignar(this.ordenData)
    this.resultado = res
    eventBus.emit('orden:created', res)
    return res
  }

  async undo() {
    // No delete endpoint for orders
    throw new Error('No se puede deshacer una creación de orden')
  }

  getDescripcion() { return `Crear orden ${this.resultado?.codigoOrden || '...'}` }
}

class CrearReporteCommand extends Command {
  constructor(dto) {
    super()
    this.dto = dto
    this.resultado = null
  }

  async execute() {
    const res = await reportesService.create(this.dto)
    this.resultado = res
    eventBus.emit('reporte:created', res)
    return res
  }

  async undo() {
    throw new Error('No se puede deshacer una creación de reporte')
  }

  getDescripcion() { return `Crear reporte para ${this.dto.placaVehiculo} - ${this.dto.tipoMantenimiento}` }
}

class CommandHistory {
  constructor() {
    this.history = []
    this.listeners = []
  }

  async ejecutar(command) {
    try {
      const resultado = await command.execute()
      this.history.push(command)
      this._notify()
      return resultado
    } catch (error) {
      console.error('Error ejecutando comando:', error)
      throw error
    }
  }

  async deshacer() {
    if (this.history.length === 0) {
      throw new Error('No hay comandos para deshacer')
    }
    const command = this.history.pop()
    try {
      await command.undo()
      this._notify()
    } catch (error) {
      this.history.push(command)
      throw error
    }
  }

  getHistorial() {
    return [...this.history]
  }

  onCambio(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  _notify() {
    this.listeners.forEach(cb => cb())
  }
}

const commandHistory = new CommandHistory()
export default commandHistory

export {
  Command,
  CrearVehiculoCommand,
  EliminarVehiculoCommand,
  CambiarEstadoCommand,
  CrearOrdenCommand,
  CrearReporteCommand,
  CommandHistory
}
