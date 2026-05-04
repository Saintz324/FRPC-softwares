"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Kanban, ChevronDown, ArrowUpRight } from 'lucide-react'
import { useLang, useSwitch } from '@/components/language-provider'
import Ico from '@/components/icons'

type DropItem = { label: string; desc: string; href: string; accent: string; icon: React.ReactNode }

function PillDropdown({ label, items, isActive }: { label: string; items: DropItem[]; isActive?: boolean }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const open_ = () => { if (timer.current) clearTimeout(timer.current); setOpen(true) }
  const close_ = () => { timer.current = setTimeout(() => setOpen(false), 130) }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={open_} onMouseLeave={close_}>
      <button
        className={isActive ? 'active' : ''}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          color: isActive ? 'var(--ink)' : 'var(--ink-dim)',
          background: isActive ? 'rgba(255,255,255,0.06)' : 'none',
          border: 'none', fontSize: 13, padding: '8px 12px',
          borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'color .15s, background .15s',
        }}
        onMouseEnter={e => { const b = e.currentTarget; b.style.color = 'var(--ink)'; if (!isActive) b.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { const b = e.currentTarget; b.style.color = isActive ? 'var(--ink)' : 'var(--ink-dim)'; if (!isActive) b.style.background = 'none' }}
      >
        {label}
        <ChevronDown size={11} style={{ opacity: 0.5, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <div style={{
        position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
        transform: `translateX(-50%) translateY(${open ? 0 : -6}px)`,
        width: 280,
        background: 'rgba(8,8,14,0.97)',
        backdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 6,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.2s cubic-bezier(.2,.7,.3,1), transform 0.2s cubic-bezier(.2,.7,.3,1)',
        zIndex: 200,
      }}>
        {/* arrow tip */}
        <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 10, height: 5, overflow: 'hidden' }}>
          <div style={{ width: 8, height: 8, background: 'rgba(8,8,14,0.97)', border: '1px solid rgba(255,255,255,0.1)', transform: 'rotate(45deg)', marginTop: 2, marginLeft: 1 }} />
        </div>
        {items.map((it, i) => (
          <Link key={i} href={it.href} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 11, transition: 'background 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: it.accent + '1a', border: `1px solid ${it.accent}28`, color: it.accent, flexShrink: 0 }}>
                {it.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 1 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.3 }}>{it.desc}</div>
              </div>
              <ArrowUpRight size={11} style={{ color: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface SiteNavProps {
  /** Override the badge/CTA button (for product pages with external links) */
  badgeLabel?: string
  badgeHref?: string
  badgeExternal?: boolean
}

export function SiteNav({ badgeLabel, badgeHref, badgeExternal }: SiteNavProps = {}) {
  const { lang, t, toggleLanguage } = useLang()
  const { isSwitching } = useSwitch()
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
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

  const pricingItems: DropItem[] = [
    { label: isPt ? 'Calendário de Férias' : 'Vacation Calendar', desc: isPt ? 'Gestão de férias e ausências' : 'Vacation & absence management', href: '/pricing#calendar', accent: '#60a5fa', icon: <Calendar size={15} /> },
    { label: 'Project Manager', desc: isPt ? 'Projetos, tarefas e equipas' : 'Projects, tasks & teams', href: '/pricing#manager', accent: '#34d399', icon: <Kanban size={15} /> },
  ]

  const tutoriaisItems: DropItem[] = [
    { label: isPt ? 'Calendário de Férias' : 'Vacation Calendar', desc: isPt ? 'Guia passo a passo' : 'Step-by-step guide', href: '/tutoriais?p=calendario', accent: '#60a5fa', icon: <Calendar size={15} /> },
    { label: 'Project Manager', desc: isPt ? 'Início rápido' : 'Quick start guide', href: '/tutoriais?p=project-manager', accent: '#34d399', icon: <Kanban size={15} /> },
  ]

  const isHome = pathname === '/'
  const isPricing = pathname === '/pricing'
  const isTutoriais = pathname === '/tutoriais'
  const isProjects = pathname.startsWith('/produtos')
  const isStudio = pathname === '/start'

  const ctaLabel = badgeLabel ?? (isPt ? 'Contacto' : 'Contact')
  const ctaHref = badgeHref ?? '/start'

  return (
    <header
      ref={navRef}
      className="nav"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'background 0.35s, border-color 0.35s' }}
    >
      <div className="row gap-12">
        <Link href="/" className="logo" aria-label="FRPC"><Ico.Logo size={20} /></Link>
      </div>

      <nav className="nav-pill" aria-label="Primary">
        <Link href="/" className={isHome ? 'active' : ''}>{isPt ? 'Início' : 'Home'}</Link>
        <Link href="/start" className={isStudio ? 'active' : ''}>{isPt ? 'Studio' : 'Studio'}</Link>
        <Link href="/produtos/calendario-de-ferias" className={isProjects ? 'active' : ''}>{isPt ? 'Projetos' : 'Projects'}</Link>
        <PillDropdown label={isPt ? 'Preços' : 'Pricing'} items={pricingItems} isActive={isPricing} />
        <PillDropdown label={isPt ? 'Tutoriais' : 'Tutorials'} items={tutoriaisItems} isActive={isTutoriais} />
        {badgeExternal ? (
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="badge">
            {ctaLabel} <Ico.ArrowUpRight size={11} />
          </a>
        ) : (
          <Link href={ctaHref} className="badge">
            {ctaLabel} <Ico.ArrowUpRight size={11} />
          </Link>
        )}
        <span className="shield" title="Verificado"><Ico.Shield size={14} color="#0a0a0a" /></span>
      </nav>

      <div className="acct">
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
      </div>
    </header>
  )
}
