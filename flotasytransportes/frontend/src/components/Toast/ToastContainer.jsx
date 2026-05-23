import { useState, useEffect } from 'react'
import eventBus from '../../services/EventBus'

export default function ToastContainer() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const unsub1 = eventBus.subscribe('vehiculo:created', (data) => {
      setToast({ mensaje: `Nuevo vehículo registrado — ${data.placa}` })
    })
    const unsub2 = eventBus.subscribe('vehiculo:deleted', (data) => {
      setToast({ mensaje: `Vehículo eliminado — ${data.placa}` })
    })
    const unsub3 = eventBus.subscribe('vehiculo:estadoChanged', (data) => {
      setToast({ mensaje: `Estado actualizado — ${data.placa} → ${data.estado}` })
    })
    const unsub4 = eventBus.subscribe('orden:created', (data) => {
      setToast({ mensaje: `Nueva orden creada — ${data.codigoOrden}` })
    })
    const unsub5 = eventBus.subscribe('reporte:created', (data) => {
      setToast({ mensaje: `Reporte generado — ${data.placaVehiculo} · ${data.tipoMantenimiento}` })
    })
    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5() }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  if (!toast) return null

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1.5rem',
      padding: '0.75rem 1.25rem',
      background: 'linear-gradient(135deg, #00d4aa 0%, #00a88a 100%)',
      color: '#0a0a0f',
      borderRadius: '10px',
      fontWeight: 700,
      fontSize: '0.85rem',
      boxShadow: '0 4px 20px rgba(0,212,170,0.35)',
      border: '1px solid rgba(0,212,170,0.6)',
      zIndex: 1001,
      animation: 'slideIn 0.3s ease'
    }}>
      {toast.mensaje}
    </div>
  )
}
