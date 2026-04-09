"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { MagneticButton } from './magnetic-button'
import { useLanguage } from './language-provider'

export function ProductNav({ externalUrl, tryLabel = 'Experimentar' }: { externalUrl: string; tryLabel?: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, toggleLanguage, isSwitching } = useLanguage()

  useEffect(() => {
    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => setIsScrolled(window.scrollY > 50))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-md bg-black/20' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Left: back + logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="hidden sm:block tracking-[0.2em] uppercase text-xs">Voltar</span>
          </Link>

          <div className="w-px h-4 bg-white/20" />

          <Link
            href="/"
            className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            FRPC
          </Link>
        </div>

        {/* Right: language + try */}
        <div className="flex items-center gap-3">
          <MagneticButton
            onClick={toggleLanguage}
            disabled={isSwitching}
            className={`relative overflow-hidden px-4 py-2 bg-transparent border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-300 ${
              isSwitching ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <span
              className={`inline-block transition-all duration-300 ${
                isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {t.nav.language}
            </span>
          </MagneticButton>

          <a href={externalUrl} target="_blank" rel="noopener noreferrer">
            <MagneticButton className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors">
              {tryLabel}
              <ExternalLink className="w-3.5 h-3.5" />
            </MagneticButton>
          </a>
        </div>
      </div>
    </nav>
  )
}
