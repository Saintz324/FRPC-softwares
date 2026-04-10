"use client"

import { useState, useEffect } from 'react'
import { subscribeScroll } from '@/lib/scroll-bus'
import Link from 'next/link'
import { MagneticButton } from './magnetic-button'
import { useLang, useSwitch } from './language-provider'
import { ScrambleText } from './scramble-text'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, toggleLanguage } = useLang()
  const { isSwitching } = useSwitch()

  useEffect(() => {
    return subscribeScroll((y) => setIsScrolled(y > 50))
  }, [])

  const navItems = [
    { key: 'about', label: t.nav.about, href: '#about' },
    { key: 'projects', label: t.nav.projects, href: '#projects' },
    { key: 'services', label: t.nav.services, href: '#services' },
    { key: 'contact', label: t.nav.contact, href: '#contact' },
    { key: 'pricing', label: t.nav.pricing, href: '/pricing' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-[backdrop-filter,background-color] duration-500 ${
          isScrolled ? 'backdrop-blur-md bg-black/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <a
            href="#"
            className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            FRPC
          </a>

          <div className="hidden md:flex items-center gap-20">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm uppercase tracking-[0.24em] text-white/80 hover:text-white transition-colors duration-300"
              >
                <ScrambleText text={item.label} />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <MagneticButton
              onClick={toggleLanguage}
              disabled={isSwitching}
              aria-busy={isSwitching}
              className={`relative overflow-hidden px-4 py-2 bg-transparent border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-300 ${
                isSwitching ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <span className={`inline-block transition-[opacity,transform] duration-300 ease-out ${
                isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                {t.nav.language}
              </span>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none transition-opacity duration-200 ${
                isSwitching ? 'opacity-100 animate-glitch-text' : 'opacity-0'
              }`}>
                {t.nav.language}
              </span>
            </MagneticButton>
            <MagneticButton className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors">
              <ScrambleText text={t.nav.startProject} />
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="md:hidden flex h-8 w-10 flex-col items-center justify-between"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-full bg-white transition-transform duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-full bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block h-0.5 w-full bg-white transition-transform duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 text-white transition-opacity duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-3xl font-serif uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors duration-300"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <ScrambleText text={item.label} />
          </Link>
        ))}

        <div className="mt-8 flex flex-col items-center gap-4">
          <MagneticButton
            onClick={() => {
              toggleLanguage()
              setIsMenuOpen(false)
            }}
            disabled={isSwitching}
            aria-busy={isSwitching}
            className={`relative overflow-hidden px-8 py-3 bg-transparent border border-white/30 text-white text-base font-medium rounded-full hover:bg-white/10 transition-all duration-300 ${
              isSwitching ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <span className={`inline-block transition-all duration-300 ease-out ${
              isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {t.nav.language}
            </span>
            <span className={`absolute inset-0 flex items-center justify-center text-base font-medium pointer-events-none transition-opacity duration-200 ${
              isSwitching ? 'opacity-100 animate-glitch-text' : 'opacity-0'
            }`}>
              {t.nav.language}
            </span>
          </MagneticButton>
          <MagneticButton className="px-8 py-3 bg-white text-black text-base font-medium rounded-full hover:bg-white/90 transition-colors">
            <ScrambleText text={t.nav.startProject} />
          </MagneticButton>
        </div>
      </div>
    </>
  )
}
