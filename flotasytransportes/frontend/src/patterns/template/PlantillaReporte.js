export class PlantillaReporte {
  async generar(datosCrudos, filtros) {
    console.log(`[Template Method] ▶ ${this.constructor.name}`)
    console.log(`[Template Method] 1. ${this.constructor.name}.validarParametros`)
    this.validarParametros(datosCrudos, filtros)

    console.log(`[Template Method] 2. ${this.constructor.name}.aplicarFiltros`)
    const datosFiltrados = this.aplicarFiltros(datosCrudos, filtros)

    console.log(`[Template Method] 3. ${this.constructor.name}.calcularMetricas`)
    const metricas = this.calcularMetricas(datosFiltrados)

    console.log(`[Template Method] 4. ${this.constructor.name}.hookPreConstruir`)
    this.hookPreConstruir(metricas)

    console.log(`[Template Method] 5. ${this.constructor.name}.construirSecciones`)
    const secciones = this.construirSecciones(metricas, filtros)

    console.log(`[Template Method] 6. ${this.constructor.name}.hookPostConstruir`)
    this.hookPostConstruir(secciones)

    console.log(`[Template Method] ✅ ${this.constructor.name} completado`)
    return secciones
  }

  validarParametros(datos, filtros) {
    if (!datos.vehiculos || !datos.ordenes) {
      throw new Error('Datos insuficientes para generar reporte')
    }
  }

  aplicarFiltros(datos, filtros) {
    throw new Error(`[Template] ${this.constructor.name} debe implementar aplicarFiltros()`)
  }

  calcularMetricas(datos) {
    throw new Error(`[Template] ${this.constructor.name} debe implementar calcularMetricas()`)
  }

  construirSecciones(metricas, filtros) {
    throw new Error(`[Template] ${this.constructor.name} debe implementar construirSecciones()`)
  }

  hookPreConstruir(metricas) {
  }

  hookPostConstruir(secciones) {
  }
}
