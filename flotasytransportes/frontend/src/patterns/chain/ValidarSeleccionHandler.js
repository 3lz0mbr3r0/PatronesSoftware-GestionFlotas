import { ManejadorComparacion } from './ManejadorComparacion'

export class ValidarSeleccionHandler extends ManejadorComparacion {
  async manejar(contexto) {
    if (!contexto.selected || contexto.selected.length < 2) {
      console.log(`[CoR] ValidarSeleccionHandler: ❌ solo ${contexto.selected?.length || 0} seleccionados, mínimo 2`)
      throw new Error('Selecciona al menos 2 vehículos para comparar')
    }
    if (contexto.selected.length > 5) {
      console.log(`[CoR] ValidarSeleccionHandler: ❌ ${contexto.selected.length} seleccionados, máximo 5`)
      throw new Error('Máximo 5 vehículos para comparar')
    }
    console.log(`[CoR] ValidarSeleccionHandler: ✅ ${contexto.selected.length} vehículos OK → pasando...`)
    return super.manejar(contexto)
  }
}
