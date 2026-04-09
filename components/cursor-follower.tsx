"use client"

import { useEffect, useRef, useState, memo } from 'react'

export const CursorFollower = memo(function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const positionRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Check if device supports hover (not touch)
    const mediaQuery = window.matchMedia('(hover: hover)')
    if (!mediaQuery.matches) return

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      
      if (!isVisible) setIsVisible(true)
      
      // Cancel previous frame and request new one
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateCursorPosition)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(false)
      }
    }

    const handleMouseOut = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseEnter, { passive: true })
    document.addEventListener('mouseout', handleMouseLeave, { passive: true })
    document.addEventListener('mouseleave', handleMouseOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.removeEventListener('mouseleave', handleMouseOut)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform' }}
    >
      <div
        ref={cursorDotRef}
        className={`rounded-full bg-white transition-all duration-200 ease-out ${
          isHovering ? 'w-12 h-12 opacity-30' : 'w-3 h-3 opacity-100'
        }`}
      />
    </div>
  )
})
