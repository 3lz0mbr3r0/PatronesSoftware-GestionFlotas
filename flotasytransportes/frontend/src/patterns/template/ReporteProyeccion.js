import { PlantillaReporte } from './PlantillaReporte'

export class ReporteProyeccion extends PlantillaReporte {
  aplicarFiltros(datos, filtros) {
    const { vehiculos, ordenes, reportes, proximos } = datos
    const { filtroPlaca } = filtros

    const vehiculosFiltrados = filtroPlaca
      ? vehiculos.filter(v => v.placa === filtroPlaca)
      : vehiculos

    const reportesFiltrados = reportes.filter(r => {
      if (filtroPlaca && r.placaVehiculo !== filtroPlaca) return false
      return true
    })

    const proxFiltrados = filtroPlaca
      ? (proximos || []).filter(v => v.placa === filtroPlaca)
      : (proximos || [])

    return { vehiculosFiltrados, ordenes, reportesFiltrados, proximos: proxFiltrados }
  }

  calcularMetricas(datos) {
    const { vehiculosFiltrados, reportesFiltrados, proximos } = datos

    const vehiculosConProyeccion = vehiculosFiltrados.map(v => {
      const repsVehiculo = reportesFiltrados.filter(r => r.placaVehiculo === v.placa)
      const ultimoKm = repsVehiculo.length > 0
        ? Math.max(...repsVehiculo.map(r => r.kilometraje || 0))
        : 0
      const promedioIntervalo = repsVehiculo.length >= 2
        ? (v.kilometrajeActual - ultimoKm) / repsVehiculo.length
        : null
      const pct = v.limiteMantenimiento
        ? Math.min((v.kilometrajeActual / v.limiteMantenimiento) * 100, 100) : 0
      const proximoEstimado = promedioIntervalo
        ? v.kilometrajeActual + promedioIntervalo
        : v.limiteMantenimiento || 0

      return {
        placa: v.placa,
        tipo: v.tipo || 'CAMION',
        estado: v.estado,
        kmActual: v.kilometrajeActual || 0,
        limite: v.limiteMantenimiento || 0,
        pctVida: pct,
        ultimoKmReporte: ultimoKm,
        promedioIntervaloKm: promedioIntervalo,
        proximoEstimadoKm: proximoEstimado,
        kmRestantes: Math.max(0, v.limiteMantenimiento - v.kilometrajeActual),
        requiereAtencion: pct >= 80 ? 'CRITICO' : pct >= 50 ? 'MEDIO' : 'BAJO'
      }
    })

    const totalCostoProyectado = vehiculosConProyeccion
      .filter(v => v.requiereAtencion !== 'BAJO')
      .reduce((s, v) => s + 500000, 0)

    return {
      vehiculos: vehiculosConProyeccion,
      proximos,
      totalVehiculos: vehiculosConProyeccion.length,
      criticos: vehiculosConProyeccion.filter(v => v.requiereAtencion === 'CRITICO').length,
      medios: vehiculosConProyeccion.filter(v => v.requiereAtencion === 'MEDIO').length,
      costoProyectado: totalCostoProyectado
    }
  }

  construirSecciones(metricas) {
    const secciones = []

    secciones.push({
      id: 'resumen',
      titulo: 'Proyección de Mantenimiento',
      tipo: 'stats',
      stats: [
        { label: 'Vehículos Analizados', value: metricas.totalVehiculos },
        { label: 'CRÍTICOS (≥80%)', value: `${metricas.criticos}`, className: metricas.criticos > 0 ? 'text-danger' : '' },
        { label: 'MEDIO (50-80%)', value: `${metricas.medios}`, className: metricas.medios > 0 ? 'text-warning' : '' },
        { label: 'Costo Proyectado Est.', value: `$${Math.round(metricas.costoProyectado).toLocaleString()}` }
      ]
    })

    const atencion = metricas.vehiculos.filter(v => v.requiereAtencion !== 'BAJO')
    if (atencion.length > 0) {
      secciones.push({
        id: 'atencion',
        titulo: `Vehículos que Requieren Atención (${atencion.length})`,
        tipo: 'tabla',
        headers: ['Placa', 'Tipo', 'Km Actual', 'Límite', '% Vida', 'Próx. Estimado', 'Estado'],
        rows: atencion.map(v => [
          v.placa,
          v.tipo,
          { text: `${v.kmActual.toLocaleString()} km`, className: 'report-num' },
          { text: `${v.limite.toLocaleString()} km`, className: 'report-num' },
          { text: `${Math.round(v.pctVida)}%`, className: 'report-num' },
          { text: `${Math.round(v.proximoEstimadoKm).toLocaleString()} km`, className: 'report-num' },
          v.requiereAtencion
        ])
      })
    }

    return secciones
  }

  hookPostConstruir(secciones) {
    secciones.forEach(s => {
      s.generadoEn = new Date().toISOString()
    })
  }
}
