export class CuidadorHistorial {
  constructor(originador, maxHistorial = 20) {
    this.originador = originador
    this.maxHistorial = maxHistorial
    this.undoStack = []
    this.redoStack = []
  }

  guardar(nombre) {
    this.redoStack = []
    const memento = this.originador.crearMemento(nombre)
    this.undoStack.push(memento)
    if (this.undoStack.length > this.maxHistorial) {
      this.undoStack.shift()
    }
    console.log(`[Memento] Stack → undo: ${this.undoStack.length}, redo: ${this.redoStack.length}`)
    return memento
  }

  deshacer() {
    if (this.undoStack.length <= 1) {
      console.log(`[Memento] No hay más snapshots para deshacer`)
      return null
    }
    const actual = this.originador.crearMemento(`Antes de deshacer: ${this.originador.getPlaca()}`)
    this.redoStack.push(actual)
    this.undoStack.pop()
    const anterior = this.undoStack[this.undoStack.length - 1]
    this.originador.restaurar(anterior)
    console.log(`[Memento] Stack → undo: ${this.undoStack.length}, redo: ${this.redoStack.length}`)
    return anterior
  }

  rehacer() {
    if (this.redoStack.length === 0) {
      console.log(`[Memento] No hay más snapshots para rehacer`)
      return null
    }
    const actual = this.originador.crearMemento(`Antes de rehacer: ${this.originador.getPlaca()}`)
    this.undoStack.push(actual)
    const siguiente = this.redoStack.pop()
    this.originador.restaurar(siguiente)
    console.log(`[Memento] Stack → undo: ${this.undoStack.length}, redo: ${this.redoStack.length}`)
    return siguiente
  }

  puedeDeshacer() {
    return this.undoStack.length > 1
  }

  puedeRehacer() {
    return this.redoStack.length > 0
  }

  obtenerHistorial() {
    return [...this.undoStack]
  }

  obtenerRedoHistorial() {
    return [...this.redoStack]
  }

  obtenerNombreUltimo() {
    if (this.undoStack.length === 0) return null
    return this.undoStack[this.undoStack.length - 1].getNombre()
  }
}
