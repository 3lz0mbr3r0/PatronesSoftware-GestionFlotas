import { PlantillaReporte } from './PlantillaReporte'

export class ReporteResumido extends PlantillaReporte {
  aplicarFiltros(datos, filtros) {
    const { vehiculos, ordenes, reportes, proximos } = datos
    const { fechaDesde, fechaHasta, filtroPlaca } = filtros

    const ordenesFiltradas = ordenes.filter(o => {
      if (filtroPlaca && o.vehiculoPlaca !== filtroPlaca) return false
      if (fechaDesde && o.fechaCreacion) {
        const f = new Date(o.fechaCreacion).toISOString().split('T')[0]
        if (f < fechaDesde) return false
      }
      if (fechaHasta && o.fechaCreacion) {
        const f = new Date(o.fechaCreacion).toISOString().split('T')[0]
        if (f > fechaHasta) return false
      }
      return true
    })

    const reportesFiltrados = reportes.filter(r => {
      if (filtroPlaca && r.placaVehiculo !== filtroPlaca) return false
      if (fechaDesde && r.fecha < fechaDesde) return false
      if (fechaHasta && r.fecha > fechaHasta) return false
      return true
    })

    const vehiculosFiltrados = filtroPlaca
      ? vehiculos.filter(v => v.placa === filtroPlaca)
      : vehiculos

    return { vehiculosFiltrados, ordenesFiltradas, reportesFiltrados, proximos: proximos || [] }
  }

  calcularMetricas(datos) {
    const { vehiculosFiltrados, ordenesFiltradas, reportesFiltrados, proximos } = datos
    const totalCosto = reportesFiltrados.reduce((s, r) => s + (r.costoEstimado || 0), 0)
    const ordenesCompletadas = ordenesFiltradas.filter(o => o.estado === 'COMPLETADA').length
    const countPorPrioridad = {}
    reportesFiltrados.forEach(r => {
      const p = r.prioridad || 'MEDIA'
      countPorPrioridad[p] = (countPorPrioridad[p] || 0) + 1
    })

    return {
      vehiculosFiltrados,
      ordenesFiltradas,
      reportesFiltrados,
      proximos,
      totalCosto,
      ordenesCompletadas,
      totalVehiculos: vehiculosFiltrados.length,
      totalOrdenes: ordenesFiltradas.length,
      totalReportes: reportesFiltrados.length,
      countPorPrioridad,
      vehiculosEnMantenimiento: vehiculosFiltrados.filter(v => v.estado === 'MANTENIMIENTO').length,
      vehiculosEnRuta: vehiculosFiltrados.filter(v => v.estado === 'EN_RUTA').length,
      vehiculosDisponibles: vehiculosFiltrados.filter(v => v.estado === 'DISPONIBLE').length
    }
  }

  construirSecciones(metricas) {
    const secciones = []

    secciones.push({
      id: 'resumen',
      titulo: 'Resumen Ejecutivo',
      tipo: 'stats',
      stats: [
        { label: 'Vehículos', value: metricas.totalVehiculos },
        { label: 'Órdenes', value: metricas.totalOrdenes },
        { label: 'Reportes Mtto.', value: metricas.totalReportes },
        { label: 'Costo Total', value: `$${Math.round(metricas.totalCosto).toLocaleString()}` },
        { label: 'Completadas', value: metricas.ordenesCompletadas },
        { label: 'En Mantenimiento', value: metricas.vehiculosEnMantenimiento }
      ]
    })

    if (Object.keys(metricas.countPorPrioridad).length > 0) {
      secciones.push({
        id: 'prioridades',
        titulo: 'Reportes por Prioridad',
        tipo: 'tabla',
        headers: ['Prioridad', 'Cantidad'],
        rows: Object.entries(metricas.countPorPrioridad).map(([p, c]) => [p, { text: `${c}`, className: 'report-num' }])
      })
    }

    if (metricas.proximos.length > 0) {
      secciones.push({
        id: 'proximos',
        titulo: `Próximos Mantenimientos (${metricas.proximos.length})`,
        tipo: 'tabla',
        headers: ['Placa', 'Km Restante', 'Riesgo'],
        rows: metricas.proximos.slice(0, 5).map(v => [
          v.placa,
          { text: `${v.kmRestantes?.toLocaleString()} km`, className: 'report-num' },
          v.nivelRiesgo
        ])
      })
    }

    return secciones
  }
}
