"use client"

import { useEffect, useRef, ReactNode, memo } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export const SmoothScroll = memo(function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const targetScroll = useRef(0)
  const currentScroll = useRef(0)
  const rafRef = useRef<number | null>(null)
  const isScrolling = useRef(false)
  const ease = 0.08

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollTimeout: NodeJS.Timeout

    const updateScroll = () => {
      const diff = targetScroll.current - currentScroll.current
      
      // Stop animation when difference is negligible
      if (Math.abs(diff) < 0.5) {
        currentScroll.current = targetScroll.current
        if (scrollContainer) {
          scrollContainer.style.transform = `translate3d(0, ${-currentScroll.current}px, 0)`
        }
        isScrolling.current = false
        return
      }
      
      currentScroll.current += diff * ease
      
      if (scrollContainer) {
        scrollContainer.style.transform = `translate3d(0, ${-currentScroll.current}px, 0)`
      }
      
      rafRef.current = requestAnimationFrame(updateScroll)
    }

    const handleScroll = () => {
      targetScroll.current = window.scrollY
      
      // Only start RAF loop if not already running
      if (!isScrolling.current) {
        isScrolling.current = true
        rafRef.current = requestAnimationFrame(updateScroll)
      }
      
      // Reset timeout for scroll end detection
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling.current = false
      }, 150)
    }

    const setBodyHeight = () => {
      if (scrollContainer) {
        document.body.style.height = `${scrollContainer.scrollHeight}px`
      }
    }

    // Use ResizeObserver instead of resize event for better performance
    const resizeObserver = new ResizeObserver(() => {
      setBodyHeight()
    })

    setBodyHeight()
    resizeObserver.observe(scrollContainer)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.height = 'auto'
    }
  }, [])

  return (
    <div 
      ref={scrollRef}
      className="fixed top-0 left-0 w-full"
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
})
