"use client"

import { useEffect, useRef, ReactNode, memo } from 'react'

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export const Parallax = memo(function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)
  const isInView = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    // Use IntersectionObserver to only animate when in view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isInView.current = entries[0].isIntersecting
      },
      { threshold: 0, rootMargin: '100px' }
    )

    intersectionObserver.observe(container)

    const handleScroll = () => {
      // Skip if not in view
      if (!isInView.current) return
      
      if (rafId.current) cancelAnimationFrame(rafId.current)
      
      rafId.current = requestAnimationFrame(() => {
        if (!container || !inner) return
        
        const rect = container.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
        const parallaxOffset = (scrollProgress - 0.5) * 100 * speed
        
        // Direct DOM manipulation - no React state updates
        inner.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      intersectionObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
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
