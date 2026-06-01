import { ManejadorComparacion } from './ManejadorComparacion'

const METRICAS_NUMERICAS = [
  { key: 'pctVida', menorEsMejor: true, label: '% Vida Útil' },
  { key: 'totalReportes', menorEsMejor: true, label: 'Reportes' },
  { key: 'costoTotal', menorEsMejor: true, label: 'Costo Total' },
  { key: 'costoPromedio', menorEsMejor: true, label: 'Costo Promedio' },
  { key: 'ordenesCompletadas', menorEsMejor: false, label: 'Órdenes Complet.' },
  { key: 'totalOrdenes', menorEsMejor: false, label: 'Total Órdenes' },
  { key: 'horasMantenimiento', menorEsMejor: true, label: 'Horas Mtto.' }
]

export class FormatearResultadoHandler extends ManejadorComparacion {
  async manejar(contexto) {
    const { resultados, mejores } = contexto

    if (!resultados) {
      console.log(`[CoR] FormatearResultadoHandler: sin datos para formatear`)
      return contexto
    }

    console.log(`[CoR] FormatearResultadoHandler: formateando ${resultados.length} resultados...`)

    const output = resultados.map(r => ({
      ...r,
      _mejores: {}
    }))

    if (mejores) {
      output.forEach(r => {
        Object.entries(mejores).forEach(([key, mejorValor]) => {
          r._mejores[key] = r[key] != null && r[key] === mejorValor
        })
      })
    }

    contexto.output = output
    console.log(`[CoR] FormatearResultadoHandler: ✅ listo`)
    return contexto
  }
}
