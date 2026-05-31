export class ManejadorComparacion {
  setSiguiente(handler) {
    this.siguiente = handler
    return handler
  }

  async manejar(contexto) {
    if (this.siguiente) {
      return this.siguiente.manejar(contexto)
    }
    return contexto
  }
}
