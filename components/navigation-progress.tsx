'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function NavigationProgress() {
  const pathname = usePathname()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setVisible(true)
    setWidth(0)
    timers.current.push(setTimeout(() => setWidth(72), 30))
    timers.current.push(setTimeout(() => setWidth(100), 450))
    timers.current.push(setTimeout(() => setVisible(false), 750))
    return () => timers.current.forEach(clearTimeout)
  }, [pathname])

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        height: 2,
        width: `${width}%`,
        background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)',
        boxShadow: '0 0 10px rgba(96,165,250,0.5)',
        transition: width === 0 ? 'none' : width === 72 ? 'width 0.4s cubic-bezier(.2,.7,.3,1)' : 'width 0.25s ease-out',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    />
  )
}
