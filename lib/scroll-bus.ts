// Shared scroll event bus — one RAF per frame regardless of how many components subscribe
// Replaces N independent scroll listeners + N RAF chains with a single one

type Listener = (y: number) => void

const listeners = new Set<Listener>()
let rafId: number | null = null
let booted = false

function boot() {
  if (booted || typeof window === 'undefined') return
  booted = true
  window.addEventListener(
    'scroll',
    () => {
      if (rafId !== null) return // already scheduled — skip
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        listeners.forEach((fn) => fn(y))
        rafId = null
      })
    },
    { passive: true }
  )
}

export function subscribeScroll(fn: Listener): () => void {
  boot()
  listeners.add(fn)
  // call immediately with current position
  if (typeof window !== 'undefined') {
    requestAnimationFrame(() => fn(window.scrollY))
  }
  return () => listeners.delete(fn)
}
