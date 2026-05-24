import { useState, useEffect } from 'react'
import commandHistory from '../../patterns/comandos'

export default function CommandPanel() {
  const [abierto, setAbierto] = useState(false)
  const [comandos, setComandos] = useState([])
  const [redos, setRedos] = useState([])

  useEffect(() => {
    setComandos(commandHistory.getHistorial())
    setRedos(commandHistory.getRedoHistorial())
    const unsubscribe = commandHistory.onCambio(() => {
      setComandos([...commandHistory.getHistorial()])
      setRedos([...commandHistory.getRedoHistorial()])
    })
    return unsubscribe
  }, [])

  const handleDeshacer = async () => {
    try {
      await commandHistory.deshacer()
    } catch (error) {
      alert(error.message)
    }
  }

  const handleRehacer = async () => {
    try {
      await commandHistory.rehacer()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(!abierto)}
        title="Historial de Comandos"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 1000,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          border: 'none',
          color: 'var(--bg-primary)',
          fontSize: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ⚡
        {comandos.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ef4444',
            fontSize: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }}>
            {comandos.length}
          </span>
        )}
      </button>

      {abierto && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(1.5rem + 56px)',
          right: '1.5rem',
          width: '360px',
          maxHeight: '420px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              ⚡ Historial de Comandos
            </span>
            <button
              onClick={() => setAbierto(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.25rem'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.5rem'
          }}>
            {comandos.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
              }}>
                No hay comandos ejecutados aún
              </div>
            ) : (
              [...comandos].reverse().map((cmd, i) => (
                <div key={comandos.length - 1 - i} style={{
                  padding: '0.6rem 0.75rem',
                  borderBottom: i < comandos.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {cmd.getDescripcion()}
                    </div>
                  </div>
                  {i === 0 && (
                    <button
                      onClick={handleDeshacer}
                      style={{
                        padding: '0.3rem 0.6rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#f59e0b',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                      title="Deshacer último comando"
                    >
                      ↩ Deshacer
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem',
            color: 'var(--text-muted)'
          }}>
            <span>{comandos.length} comando{comandos.length !== 1 ? 's' : ''}</span>
            <button
              onClick={handleRehacer}
              disabled={redos.length === 0}
              style={{
                padding: '0.3rem 0.6rem',
                background: redos.length > 0 ? 'var(--bg-secondary)' : 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: redos.length > 0 ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: redos.length > 0 ? 'pointer' : 'default',
                opacity: redos.length > 0 ? 1 : 0.4
              }}
              title="Rehacer último comando deshecho"
            >
              ⟳ Rehacer
            </button>
          </div>
        </div>
      )}
    </>
  )
}
