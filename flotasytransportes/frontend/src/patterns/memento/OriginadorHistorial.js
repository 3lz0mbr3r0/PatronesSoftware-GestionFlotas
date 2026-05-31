import { MementoHistorial } from './MementoHistorial'

export class OriginadorHistorial {
  constructor() {
    this.estado = {
      placa: '',
      vehiculo: null,
      reportes: [],
      ordenes: [],
      proyeccion: null
    }
  }

  setEstado(nuevoEstado) {
    this.estado = {
      placa: nuevoEstado.placa || '',
      vehiculo: nuevoEstado.vehiculo || null,
      reportes: nuevoEstado.reportes || [],
      ordenes: nuevoEstado.ordenes || [],
      proyeccion: nuevoEstado.proyeccion || null
    }
  }

  crearMemento(nombre) {
    console.log(`[Memento] 📸 Snapshot guardado: "${nombre}"`)
    return new MementoHistorial({
      placa: this.estado.placa,
      vehiculo: this.estado.vehiculo,
      reportes: this.estado.reportes,
      ordenes: this.estado.ordenes,
      proyeccion: this.estado.proyeccion
    }, nombre)
  }

  restaurar(memento) {
    const estado = memento.getEstado()
    console.log(`[Memento] ↩ Restaurando: "${memento.getNombre()}" (${memento.getTimestamp()})`)
    this.estado = {
      placa: estado.placa,
      vehiculo: estado.vehiculo,
      reportes: estado.reportes,
      ordenes: estado.ordenes,
      proyeccion: estado.proyeccion
    }
  }
}
