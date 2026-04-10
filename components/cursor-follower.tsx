"use client"

import { useEffect, useRef, useState, memo } from 'react'

export const CursorFollower = memo(function CursorFollower() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const posRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)
  const visRef = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    setMounted(true)

    const sync = () => {
      const el = outerRef.current
      if (!el) return
      el.style.transform = `translate3d(${posRef.current.x}px,${posRef.current.y}px,0) translate(-50%,-50%)`
      el.style.opacity = visRef.current ? '1' : '0'
    }

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      visRef.current = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(sync)
    }

    // Hover state via direct DOM — no React setState
    const onOver = (e: MouseEvent) => {
      const inner = innerRef.current
      if (!inner) return
      if ((e.target as HTMLElement).closest('a, button, [data-cursor-hover]')) {
        inner.style.width = '48px'
        inner.style.height = '48px'
        inner.style.opacity = '0.3'
      }
    }
    const onOut = (e: MouseEvent) => {
      const inner = innerRef.current
      if (!inner) return
      if ((e.target as HTMLElement).closest('a, button, [data-cursor-hover]')) {
        inner.style.width = '12px'
        inner.style.height = '12px'
        inner.style.opacity = '1'
      }
    }
    const onLeave = () => {
      visRef.current = false
      if (outerRef.current) outerRef.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={outerRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform', opacity: 0, transition: 'opacity 0.2s' }}
    >
      <div
        ref={innerRef}
        className="rounded-full bg-white"
        style={{
          width: 12, height: 12, opacity: 1,
          transition: 'width 0.2s ease-out, height 0.2s ease-out, opacity 0.2s ease-out',
        }}
      />
    </div>
  )
})
