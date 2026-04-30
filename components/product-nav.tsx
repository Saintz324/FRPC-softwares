"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from './language-provider'
import Ico from '@/components/icons'

export function ProductNav({ externalUrl, tryLabel = 'Experimentar' }: { externalUrl: string; tryLabel?: string }) {
  const { t, toggleLanguage, isSwitching } = useLanguage()
  const navRef = useRef<HTMLElement>(null)

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

  return (
    <header ref={navRef} className="nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'background 0.35s, border-color 0.35s' }}>
      <div className="row gap-12">
        <Link href="/" className="logo" aria-label="FRPC"><Ico.Logo size={20} /></Link>
      </div>
      <nav className="nav-pill" aria-label="Primary">
        <Link href="/">Início</Link>
        <Link href="/produtos/calendario-de-ferias">Produtos</Link>
        <Link href="/pricing">Preços</Link>
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="badge">
          {tryLabel} <Ico.ArrowUpRight size={11} />
        </a>
        <span className="shield" title="Verificado"><Ico.Shield size={14} color="#0a0a0a" /></span>
      </nav>
      <div className="acct">
        <button
          onClick={toggleLanguage}
          disabled={isSwitching}
          className="btn btn-ghost"
          style={{ padding: '8px 14px', fontSize: 13 }}
        >
          {t.nav.language}
        </button>
      </div>
    </header>
  )
}
