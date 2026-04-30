'use client'

import { useEffect, useRef } from 'react'
import { ChatWidget } from '@/components/chat-widget'
import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { InsightsSection } from '@/components/sections/insights'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { WorkspaceSection } from '@/components/sections/workspace'
import { CTASection } from '@/components/sections/cta'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let entered = false
    const fn = (e: MouseEvent) => {
      if (!cursorRef.current) return
      if (!entered) { entered = true; cursorRef.current.style.opacity = '1' }
      cursorRef.current.style.transform = `translate(${e.clientX - 300}px,${e.clientY - 300}px)`
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <>
      {/* cursor glow */}
      <div ref={cursorRef} style={{
        position: 'fixed', top: 0, left: 0, width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(135,115,170,0.055) 0%,transparent 70%)',
        pointerEvents: 'none', zIndex: 9990, opacity: 0,
        transition: 'transform 0.18s cubic-bezier(.2,.7,.3,1)',
        mixBlendMode: 'screen',
      }} />

      {/* film grain */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: GRAIN, backgroundSize: '200px 200px',
        opacity: 0.032, pointerEvents: 'none',
        zIndex: 9991, mixBlendMode: 'overlay',
      }} />

      <div style={{ width: '100%' }}>
        <div style={{ height: '100dvh' }}><HeroSection /></div>
        <FeaturesSection />
        <InsightsSection />
        <TestimonialsSection />
        <WorkspaceSection />
        <CTASection />
      </div>

      <ChatWidget />
    </>
  )
}
