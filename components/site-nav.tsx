"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, X, Menu } from 'lucide-react'
import { useLang, useSwitch } from '@/components/language-provider'
import Ico from '@/components/icons'


interface SiteNavProps {
  badgeLabel?: string
  badgeHref?: string
  badgeExternal?: boolean
}

export function SiteNav({ badgeLabel, badgeHref, badgeExternal }: SiteNavProps = {}) {
  const { lang, t, toggleLanguage } = useLang()
  const { isSwitching } = useSwitch()
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isPt = lang === 'pt'

  useEffect(() => {
    const fn = () => {
      if (!navRef.current) return
      const s = window.scrollY > 30
      navRef.current.style.background = s ? 'rgba(5,5,5,0.82)' : 'transparent'
      navRef.current.style.backdropFilter = s ? 'blur(22px) saturate(180%)' : 'none'
      navRef.current.style.borderBottom = s ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent'
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isHome = pathname === '/'
  const isProjects = pathname.startsWith('/projetos') || pathname.startsWith('/produtos')
  const isPricing = pathname === '/pricing'

  const ctaLabel = badgeLabel ?? (isPt ? 'Pedir Orçamento' : 'Request Quote')
  const ctaHref = badgeHref ?? '/pricing'

  const mobileLinks = [
    { label: isPt ? 'Início' : 'Home', href: '/', active: isHome },
    { label: isPt ? 'Projetos' : 'Projects', href: '/projetos', active: isProjects },
  ]

  return (
    <>
      <header
        ref={navRef}
        className="nav"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'background 0.35s, border-color 0.35s' }}
      >
        <div className="row gap-12">
          <Link href="/" className="logo" aria-label="FRPC"><img src="/logo-software.svg" alt="FRPC" height={28} /></Link>
        </div>

        {/* Desktop pill nav */}
        <nav className="nav-pill" aria-label="Primary">
          <Link href="/" className={isHome ? 'active' : ''}>{isPt ? 'Início' : 'Home'}</Link>
          <Link href="/projetos" className={isProjects ? 'active' : ''}>{isPt ? 'Projetos' : 'Projects'}</Link>
          {badgeExternal ? (
            <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="badge">
              {ctaLabel} <Ico.ArrowUpRight size={11} />
            </a>
          ) : (
            <Link href={ctaHref} className={`badge${isPricing ? ' active' : ''}`}>
              {ctaLabel} <Ico.ArrowUpRight size={11} />
            </Link>
          )}
          <span className="shield" title="Verificado"><Ico.Shield size={14} color="#0a0a0a" /></span>
        </nav>

        <div className="acct" style={{ gap: 8 }}>
          <button
            onClick={toggleLanguage}
            disabled={isSwitching}
            className="btn btn-ghost"
            style={{ padding: '8px 14px', fontSize: 13, position: 'relative', overflow: 'hidden', minWidth: 48 }}
          >
            <span style={{ display: 'inline-block', transition: 'opacity 0.2s, transform 0.2s', opacity: isSwitching ? 0 : 1, transform: isSwitching ? 'scale(0.9)' : 'scale(1)' }}>
              {t.nav.language}
            </span>
            {isSwitching && (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, animation: 'glitchPulse 0.15s steps(1) infinite' }}>
                {t.nav.language}
              </span>
            )}
          </button>

          {/* Hamburger — visible on mobile only */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className="mobile-nav-overlay"
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(5,5,5,0.97)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '100px',
          paddingBottom: '40px',
          paddingLeft: '24px',
          paddingRight: '24px',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s cubic-bezier(.2,.7,.3,1)',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {mobileLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                fontSize: 18,
                fontWeight: 500,
                textDecoration: 'none',
                color: link.active ? 'var(--ink)' : 'rgba(255,255,255,0.55)',
                background: link.active ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => { toggleLanguage(); setMobileOpen(false) }}
            disabled={isSwitching}
            style={{
              padding: '12px 16px',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 500,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.55)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            {t.nav.language}
          </button>

          <Link
            href={ctaHref}
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px 24px',
              borderRadius: 999,
              background: 'var(--ink)',
              color: '#0a0a0a',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            {ctaLabel}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 721px) {
          .mobile-nav-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}
