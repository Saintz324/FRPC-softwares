"use client"

import { useEffect, useRef, useState, memo } from 'react'

export const CursorFollower = memo(function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)
  const positionRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)')
    if (!mediaQuery.matches) return

    setMounted(true)

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`
        cursorRef.current.style.opacity = isVisibleRef.current ? '1' : '0'
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      isVisibleRef.current = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateCursorPosition)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) setIsHovering(true)
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) setIsHovering(false)
    }

    const handleMouseOut = () => {
      isVisibleRef.current = false
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }

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
  }, []) // empty deps — never re-registers

  if (!mounted) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform', opacity: 0, transition: 'opacity 0.2s' }}
    >
      <div
        className={`rounded-full bg-white transition-all duration-200 ease-out ${
          isHovering ? 'w-12 h-12 opacity-30' : 'w-3 h-3 opacity-100'
        }`}
      />
    </div>
  )
})
