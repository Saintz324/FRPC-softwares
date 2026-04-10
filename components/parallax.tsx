"use client"

import { useEffect, useRef, ReactNode, memo } from 'react'
import { subscribeScroll } from '@/lib/scroll-bus'

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export const Parallax = memo(function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const isInView = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    // Visibility gate — skip updates when off-screen
    const io = new IntersectionObserver(
      ([entry]) => { isInView.current = entry.isIntersecting },
      { threshold: 0, rootMargin: '100px' }
    )
    io.observe(container)

    // Use shared scroll bus instead of own listener
    const unsub = subscribeScroll(() => {
      if (!isInView.current) return
      const rect = container.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = (windowH - rect.top) / (windowH + rect.height)
      inner.style.transform = `translate3d(0,${(progress - 0.5) * 100 * speed}px,0)`
    })

    return () => {
      io.disconnect()
      unsub()
    }
  }, [speed])

  return (
    <div ref={containerRef} className={className}>
      <div ref={innerRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
})
