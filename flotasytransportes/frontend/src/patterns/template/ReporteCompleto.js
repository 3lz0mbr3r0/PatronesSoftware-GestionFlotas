import { PlantillaReporte } from './PlantillaReporte'

export class ReporteCompleto extends PlantillaReporte {
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

    const proxFiltrados = filtroPlaca
      ? (proximos || []).filter(v => v.placa === filtroPlaca)
      : (proximos || [])

    return { vehiculosFiltrados, ordenesFiltradas, reportesFiltrados, proximos: proxFiltrados }
  }

  calcularMetricas(datos) {
    const { vehiculosFiltrados, ordenesFiltradas, reportesFiltrados, proximos } = datos
    const totalCosto = reportesFiltrados.reduce((s, r) => s + (r.costoEstimado || 0), 0)
    const ordenesCompletadas = ordenesFiltradas.filter(o => o.estado === 'COMPLETADA').length
    const totalHorasMtto = reportesFiltrados.reduce((s, r) => s + (r.tiempoEstimadoHoras || 0), 0)
    const costoPromedio = reportesFiltrados.length > 0
      ? totalCosto / reportesFiltrados.length : 0

    return {
      vehiculosFiltrados,
      ordenesFiltradas,
      reportesFiltrados,
      proximos,
      totalCosto,
      ordenesCompletadas,
      totalHorasMtto,
      costoPromedio,
      totalVehiculos: vehiculosFiltrados.length,
      totalOrdenes: ordenesFiltradas.length,
      totalReportes: reportesFiltrados.length
    }
  }

  construirSecciones(metricas, filtros) {
    const secciones = []
    const incluye = (id) => filtros.secciones.includes(id)

    if (incluye('resumen')) {
      secciones.push({
        id: 'resumen',
        titulo: 'Resumen General',
        tipo: 'stats',
        stats: [
          { label: 'Vehículos', value: metricas.totalVehiculos },
          { label: 'Órdenes', value: metricas.totalOrdenes },
          { label: 'Reportes', value: metricas.totalReportes },
          { label: 'Costo Total', value: `$${Math.round(metricas.totalCosto).toLocaleString()}` }
        ]
      })
    }

    if (incluye('vehiculos')) {
      secciones.push({
        id: 'vehiculos',
        titulo: `Vehículos (${metricas.totalVehiculos})`,
        tipo: 'tabla',
        headers: ['Placa', 'Tipo', 'Estado', 'Energía', 'Km Actual', '% Vida'],
        rows: metricas.vehiculosFiltrados.map(v => {
          const pct = v.limiteMantenimiento
            ? Math.min((v.kilometrajeActual / v.limiteMantenimiento) * 100, 100) : 0
          return [
            v.placa,
            v.tipo || 'CAMION',
            v.estado,
            v.tipoEnergia || '—',
            { text: v.kilometrajeActual?.toLocaleString(), className: 'report-num' },
            { text: `${Math.round(pct)}%`, className: 'report-num' }
          ]
        })
      })
    }

    if (incluye('ordenes')) {
      const ordenes = [...metricas.ordenesFiltradas]
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      secciones.push({
        id: 'ordenes',
        titulo: `Órdenes de Transporte (${metricas.totalOrdenes})`,
        tipo: 'tabla',
        headers: ['Código', 'Vehículo', 'Origen → Destino', 'Estado', 'Fecha Creación'],
        rows: ordenes.map(o => [
          o.codigoOrden,
          o.vehiculoPlaca || '—',
          o.origenLat != null
            ? `${o.origenLat.toFixed(3)},${o.origenLng?.toFixed(3)} → ${o.destinoLat.toFixed(3)},${o.destinoLng?.toFixed(3)}`
            : '—',
          o.estado,
          { text: o.fechaCreacion ? new Date(o.fechaCreacion).toLocaleDateString() : '—', className: 'report-num' }
        ]),
        total: `Completadas: ${metricas.ordenesCompletadas} / ${metricas.totalOrdenes}`
      })
    }

    if (incluye('reportes')) {
      const reportes = [...metricas.reportesFiltrados]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
      secciones.push({
        id: 'reportes',
        titulo: `Reportes de Mantenimiento (${metricas.totalReportes})`,
        tipo: 'tabla',
        headers: ['Fecha', 'Placa', 'Tipo', 'Taller', 'Costo', 'Prioridad'],
        rows: reportes.map(r => [
          { text: r.fecha ? new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '—', className: 'report-num' },
          r.placaVehiculo,
          r.tipoMantenimiento,
          r.taller || '—',
          { text: r.costoEstimado ? `$${r.costoEstimado.toLocaleString()}` : '—', className: 'report-num' },
          r.prioridad || 'MEDIA'
        ])
      })
    }

    if (incluye('proximos') && metricas.proximos?.length > 0) {
      secciones.push({
        id: 'proximos',
        titulo: `Próximos Mantenimientos (${metricas.proximos.length})`,
        tipo: 'tabla',
        headers: ['Placa', 'Tipo', 'Km Restante', '%', 'Riesgo'],
        rows: metricas.proximos.map(v => [
          v.placa,
          v.tipo,
          { text: `${v.kmRestantes?.toLocaleString()} km`, className: 'report-num' },
          { text: `${Math.round(v.porcentaje)}%`, className: 'report-num' },
          v.nivelRiesgo
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
