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

export class DeterminarMejorHandler extends ManejadorComparacion {
  async manejar(contexto) {
    const { resultados } = contexto

    if (!resultados || resultados.length === 0) {
      console.log(`[CoR] DeterminarMejorHandler: sin resultados, saltando...`)
      return super.manejar(contexto)
    }

    console.log(`[CoR] DeterminarMejorHandler: identificando mejores valores...`)
    const mejores = {}

    METRICAS_NUMERICAS.forEach(({ key, menorEsMejor }) => {
      const nums = resultados.filter(r => r[key] != null).map(r => r[key])
      if (nums.length > 0) {
        mejores[key] = menorEsMejor ? Math.min(...nums) : Math.max(...nums)
        console.log(`[CoR] DeterminarMejorHandler: ★ mejor "${key}" = ${mejores[key]}${menorEsMejor ? ' (menor es mejor)' : ' (mayor es mejor)'}`)
      }
    })

    contexto.mejores = mejores
    console.log(`[CoR] DeterminarMejorHandler: ✅ mejores identificados → pasando...`)
    return super.manejar(contexto)
  }
}
