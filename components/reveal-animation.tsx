"use client"

import { useEffect, useRef, ReactNode, useState, memo, useMemo } from 'react'

// ─── Shared singleton observer ────────────────────────────────────────────
// One IntersectionObserver for ALL Reveal instances on the page instead of N observers.
let _observer: IntersectionObserver | null = null
const _callbacks = new Map<Element, () => void>()

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (!_observer) {
    _observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const cb = _callbacks.get(entry.target)
          if (cb) {
            cb()
            _callbacks.delete(entry.target)
            _observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
  }
  return _observer
}

// ─── Component ────────────────────────────────────────────────────────────
interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  className?: string
}

function RevealComponent({ children, delay = 0, direction = 'up', className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = getObserver()
    if (!observer) { setIsRevealed(true); return }

    let tid: ReturnType<typeof setTimeout>
    _callbacks.set(el, () => {
      if (delay > 0) {
        tid = setTimeout(() => requestAnimationFrame(() => setIsRevealed(true)), delay)
      } else {
        requestAnimationFrame(() => setIsRevealed(true))
      }
    })
    observer.observe(el)

    return () => {
      _callbacks.delete(el)
      observer.unobserve(el)
      clearTimeout(tid)
    }
  }, [delay])

  const style = useMemo((): React.CSSProperties => {
    const base: React.CSSProperties = {
      opacity: isRevealed ? 1 : 0,
      transition: isRevealed
        ? 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16,1,0.3,1)'
        : 'none',
      // Only set will-change when not yet revealed
      willChange: isRevealed ? 'auto' : 'opacity, transform',
    }
    if (!isRevealed) {
      switch (direction) {
        case 'up':    base.transform = 'translateY(30px)'; break
        case 'down':  base.transform = 'translateY(-30px)'; break
        case 'left':  base.transform = 'translateX(30px)'; break
        case 'right': base.transform = 'translateX(-30px)'; break
        case 'scale': base.transform = 'scale(0.95)'; break
      }
    }
    return base
  }, [isRevealed, direction])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

export const Reveal = memo(RevealComponent)
