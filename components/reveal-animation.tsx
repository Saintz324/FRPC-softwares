"use client"

import { useEffect, useRef, ReactNode, useState, memo, useMemo } from 'react'

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
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealed) {
            const timeoutId = setTimeout(() => {
              requestAnimationFrame(() => setIsRevealed(true))
            }, delay)
            observer.unobserve(entry.target)
            return () => clearTimeout(timeoutId)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, isRevealed])

  const styles = useMemo(() => {
    const base: React.CSSProperties = {
      opacity: isRevealed ? 1 : 0,
      transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      transform: 'none',
      willChange: isRevealed ? 'auto' : 'opacity, transform'
    }

    if (!isRevealed) {
      switch (direction) {
        case 'up':
          base.transform = 'translateY(30px)'
          break
        case 'down':
          base.transform = 'translateY(-30px)'
          break
        case 'left':
          base.transform = 'translateX(30px)'
          break
        case 'right':
          base.transform = 'translateX(-30px)'
          break
        case 'scale':
          base.transform = 'scale(0.95)'
          break
      }
    }

    return base
  }, [isRevealed, direction])

  return (
    <div ref={ref} className={className} style={styles}>
      {children}
    </div>
  )
}

export const Reveal = memo(RevealComponent)
