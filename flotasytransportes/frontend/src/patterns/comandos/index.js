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
    this.datos = null
  }

  async execute() {
    this.datos = await vehiculosService.getByPlaca(this.placa)
    await vehiculosService.delete(this.placa)
    eventBus.emit('vehiculo:deleted', { placa: this.placa })
  }

  async undo() {
    if (this.datos) {
      const tipo = this.datos.tipo || 'CAMION'
      await vehiculosService.createByTipo(tipo, this.datos)
      eventBus.emit('vehiculo:created', this.datos)
    }
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
    if (this.resultado?.codigoOrden) {
      await ordenesService.delete(this.resultado.codigoOrden)
      eventBus.emit('orden:deleted', { codigoOrden: this.resultado.codigoOrden })
    }
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
    if (this.resultado) {
      await reportesService.delete(
        this.resultado.placaVehiculo,
        this.resultado.tipoMantenimiento,
        this.resultado.fecha
      )
      eventBus.emit('reporte:deleted', { placa: this.resultado.placaVehiculo })
    }
  }

  getDescripcion() { return `Crear reporte para ${this.dto.placaVehiculo} - ${this.dto.tipoMantenimiento}` }
}

class CommandHistory {
  constructor() {
    this.history = []
    this.redoStack = []
    this.listeners = []
  }

  async ejecutar(command) {
    try {
      this.redoStack = []
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
      this.redoStack.push(command)
      this._notify()
    } catch (error) {
      this.history.push(command)
      throw error
    }
  }

  async rehacer() {
    if (this.redoStack.length === 0) {
      throw new Error('No hay comandos para rehacer')
    }
    const command = this.redoStack.pop()
    try {
      await command.execute()
      this.history.push(command)
      this._notify()
    } catch (error) {
      this.redoStack.push(command)
      throw error
    }
  }

  getHistorial() {
    return [...this.history]
  }

  getRedoHistorial() {
    return [...this.redoStack]
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
