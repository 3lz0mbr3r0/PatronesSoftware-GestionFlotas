import { ManejadorComparacion } from './ManejadorComparacion'
import { reportesService, ordenesService } from '../../services/api'

export class EnriquecerDatosHandler extends ManejadorComparacion {
  async manejar(contexto) {
    const { selected, vehiculos } = contexto

    if (!contexto.reportes || !contexto.ordenes) {
      console.log(`[CoR] EnriquecerDatosHandler: consultando reportes y órdenes...`)
      const [reportes, ordenes] = await Promise.all([
        reportesService.getAll(),
        ordenesService.getAll()
      ])
      contexto.reportes = reportes
      contexto.ordenes = ordenes
      console.log(`[CoR] EnriquecerDatosHandler: ✅ ${reportes.length} reportes, ${ordenes.length} órdenes → pasando...`)
    } else {
      console.log(`[CoR] EnriquecerDatosHandler: datos ya presentes, saltando...`)
    }

    return super.manejar(contexto)
  }
}
