class EventBus {
  constructor() {
    this.wrappers = {}
  }

  subscribe(event, callback) {
    const wrapper = (e) => callback(e.detail)
    if (!this.wrappers[event]) {
      this.wrappers[event] = new Map()
    }
    this.wrappers[event].set(callback, wrapper)
    window.addEventListener(event, wrapper)
    return () => this.unsubscribe(event, callback)
  }

  unsubscribe(event, callback) {
    const map = this.wrappers[event]
    if (!map) return
    const wrapper = map.get(callback)
    if (wrapper) {
      window.removeEventListener(event, wrapper)
      map.delete(callback)
    }
  }

  emit(event, data) {
    console.log(`[EventBus] Emitiendo: ${event}`, data)
    window.dispatchEvent(new CustomEvent(event, { detail: data }))
  }
}

const eventBus = new EventBus()
export default eventBus
