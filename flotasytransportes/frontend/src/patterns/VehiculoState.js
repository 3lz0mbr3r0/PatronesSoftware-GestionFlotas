class VehiculoEstado {
  getColor() { return { bg: 'rgba(0, 212, 170, 0.15)', color: 'var(--accent-primary)' } }
  getLabel() { return 'DESCONOCIDO' }
  canEdit() { return false }
  canDelete() { return false }
  canAssignOrder() { return false }
  canMarkAsDisponible() { return false }
  getAcciones() { return [] }
}

class DisponibleState extends VehiculoEstado {
  getColor() { return { bg: 'rgba(0, 212, 170, 0.15)', color: 'var(--accent-primary)' } }
  getLabel() { return 'DISPONIBLE' }
  canEdit() { return true }
  canDelete() { return true }
  canAssignOrder() { return true }
  getAcciones() { return [] }
}

class EnRutaState extends VehiculoEstado {
  getColor() { return { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' } }
  getLabel() { return 'EN_RUTA' }
  canEdit() { return false }
  canDelete() { return false }
  canAssignOrder() { return false }
  getAcciones() { return [] }
}

class MantenimientoState extends VehiculoEstado {
  getColor() { return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' } }
  getLabel() { return 'MANTENIMIENTO' }
  canEdit() { return false }
  canDelete() { return true }
  canAssignOrder() { return false }
  canMarkAsDisponible() { return true }
  getAcciones() {
    return [
      { label: '✓ Disponible', accion: 'MARCAR_DISPONIBLE', color: 'var(--accent-primary)' }
    ]
  }
}

const stateMap = {
  DISPONIBLE: DisponibleState,
  EN_RUTA: EnRutaState,
  MANTENIMIENTO: MantenimientoState
}

export function getVehiculoState(estado) {
  const StateClass = stateMap[estado] || DisponibleState
  return new StateClass()
}

export { DisponibleState, EnRutaState, MantenimientoState }
