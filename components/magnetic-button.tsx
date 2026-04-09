"use client"

import { useRef, ReactNode, useCallback, memo, useEffect, ButtonHTMLAttributes } from 'react'

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  strength?: number
}

function MagneticButtonComponent({ children, className = '', strength = 0.3, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const rafRef = useRef<number | null>(null)
  const isHovering = useRef(false)

  const updatePosition = useCallback((x: number, y: number, instant = false) => {
    if (!ref.current) return
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    ref.current.style.transition = instant ? 'none' : 'transform 0.3s ease-out'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    isHovering.current = true

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current || !isHovering.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = (e.clientX - centerX) * strength
      const distanceY = (e.clientY - centerY) * strength

      updatePosition(distanceX, distanceY, true)
    })
  }, [strength, updatePosition])

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    updatePosition(0, 0, false)
  }, [updatePosition])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </button>
  )
}

export const MagneticButton = memo(MagneticButtonComponent)
