import { ManejadorComparacion } from './ManejadorComparacion'

export class CalcularMetricasHandler extends ManejadorComparacion {
  async manejar(contexto) {
    const { selected, vehiculos, reportes, ordenes } = contexto

    console.log(`[CoR] CalcularMetricasHandler: calculando ${selected.length} vehículos...`)
    const resultados = selected.map(placa => {
      const v = vehiculos.find(v => v.placa === placa)
      const reps = reportes.filter(r => r.placaVehiculo === placa)
      const ords = ordenes.filter(o => o.vehiculoPlaca === placa)

      return {
        placa,
        tipo: v?.tipo || 'CAMION',
        estado: v?.estado || '—',
        energia: v?.tipoEnergia || '—',
        kmActual: v?.kilometrajeActual,
        limiteMantenimiento: v?.limiteMantenimiento,
        pctVida: v?.limiteMantenimiento
          ? Math.min((v.kilometrajeActual / v.limiteMantenimiento) * 100, 100)
          : null,
        totalReportes: reps.length,
        costoTotal: reps.reduce((s, r) => s + (r.costoEstimado || 0), 0),
        costoPromedio: reps.length > 0
          ? reps.reduce((s, r) => s + (r.costoEstimado || 0), 0) / reps.length
          : 0,
        ordenesCompletadas: ords.filter(o => o.estado === 'COMPLETADA').length,
        totalOrdenes: ords.length,
        horasMantenimiento: reps.reduce((s, r) => s + (r.tiempoEstimadoHoras || 0), 0),
        ultimoReporte: reps.length > 0
          ? reps.sort((a, b) => b.fecha.localeCompare(a.fecha))[0].fecha
          : '—'
      }
    })

    contexto.resultados = resultados
    console.log(`[CoR] CalcularMetricasHandler: ✅ métricas calculadas → pasando...`)
    return super.manejar(contexto)
  }
}
