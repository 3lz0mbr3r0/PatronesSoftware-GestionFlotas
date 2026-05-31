export class MementoHistorial {
  #estado

  constructor(estado, nombre) {
    this.#estado = {
      placa: estado.placa || '',
      vehiculo: estado.vehiculo ? this.#deepClone(estado.vehiculo) : null,
      reportes: estado.reportes ? this.#deepClone(estado.reportes) : [],
      ordenes: estado.ordenes ? this.#deepClone(estado.ordenes) : [],
      proyeccion: estado.proyeccion ? this.#deepClone(estado.proyeccion) : null
    }
    this.nombre = nombre
    this.timestamp = new Date().toISOString()
    this.id = Date.now() + Math.random()
  }

  #deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  getNombre() {
    return this.nombre
  }

  getTimestamp() {
    return this.timestamp
  }

  getId() {
    return this.id
  }

  getEstado() {
    return {
      placa: this.#estado.placa,
      vehiculo: this.#estado.vehiculo ? this.#deepClone(this.#estado.vehiculo) : null,
      reportes: this.#deepClone(this.#estado.reportes),
      ordenes: this.#deepClone(this.#estado.ordenes),
      proyeccion: this.#estado.proyeccion ? this.#deepClone(this.#estado.proyeccion) : null
    }
  }
}
