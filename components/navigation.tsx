"use client"

import { useState, useEffect, useRef } from 'react'
import { subscribeScroll } from '@/lib/scroll-bus'
import Link from 'next/link'
import { Calendar, Kanban, ChevronDown, ArrowUpRight } from 'lucide-react'
import { MagneticButton } from './magnetic-button'
import { useLang, useSwitch } from './language-provider'
import { ScrambleText } from './scramble-text'

type DropdownItem = {
  label: string
  description: string
  href: string
  accent: string
  icon: React.ReactNode
}

type NavItem = {
  key: string
  label: string
  href: string
  dropdown?: DropdownItem[]
}

function DropdownMenu({ items, visible }: { items: DropdownItem[]; visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 14px)',
        left: '50%',
        width: 300,
        background: 'rgba(8,8,12,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 18,
        padding: 8,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : -8}px)`,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.22s cubic-bezier(.2,.7,.3,1), transform 0.22s cubic-bezier(.2,.7,.3,1)',
        zIndex: 100,
      }}
    >
      {/* Arrow */}
      <div style={{
        position: 'absolute',
        top: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 12,
        height: 6,
        overflow: 'hidden',
      }}>
        <div style={{
          width: 10,
          height: 10,
          background: 'rgba(8,8,12,0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          transform: 'rotate(45deg)',
          marginTop: 3,
          marginLeft: 1,
        }} />
      </div>

      {items.map((item, i) => (
        <Link key={i} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 12,
              transition: 'background 0.18s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: item.accent + '18',
              border: `1px solid ${item.accent}28`,
              flexShrink: 0,
              color: item.accent,
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{item.description}</div>
            </div>
            <ArrowUpRight size={12} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { lang, t, toggleLanguage } = useLang()
  const { isSwitching } = useSwitch()

  useEffect(() => {
    return subscribeScroll((y) => setIsScrolled(y > 50))
  }, [])

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDropdown(key)
  }

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  const calendarIcon = <Calendar size={16} />
  const kanbanIcon = <Kanban size={16} />

  const pricingDropdown: DropdownItem[] = [
    {
      label: lang === 'en' ? 'Vacation Calendar' : 'Calendário de Férias',
      description: lang === 'en' ? 'Vacation & absence management' : 'Gestão de férias e ausências',
      href: '/pricing#calendar',
      accent: '#60a5fa',
      icon: calendarIcon,
    },
    {
      label: 'Project Manager',
      description: lang === 'en' ? 'Projects, tasks & team management' : 'Projetos, tarefas e equipas',
      href: '/pricing#manager',
      accent: '#34d399',
      icon: kanbanIcon,
    },
  ]

  const tutoriaisDropdown: DropdownItem[] = [
    {
      label: lang === 'en' ? 'Vacation Calendar' : 'Calendário de Férias',
      description: lang === 'en' ? 'Step-by-step setup guide' : 'Guia de configuração passo a passo',
      href: '/tutoriais?p=calendario',
      accent: '#60a5fa',
      icon: calendarIcon,
    },
    {
      label: 'Project Manager',
      description: lang === 'en' ? 'Quick start guide' : 'Guia de início rápido',
      href: '/tutoriais?p=project-manager',
      accent: '#34d399',
      icon: kanbanIcon,
    },
  ]

  const navItems: NavItem[] = [
    { key: 'about', label: t.nav.about, href: '/#about' },
    { key: 'projects', label: t.nav.projects, href: '/#projects' },
    { key: 'services', label: t.nav.services, href: '/#services' },
    { key: 'pricing', label: t.nav.pricing, href: '/pricing', dropdown: pricingDropdown },
    { key: 'tutorials', label: t.nav.tutorials, href: '/tutoriais', dropdown: tutoriaisDropdown },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-[backdrop-filter,background-color] duration-500 ${
          isScrolled ? 'backdrop-blur-md bg-black/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            FRPC
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-20">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.key}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => openMenu(item.key)}
                  onMouseLeave={closeMenu}
                >
                  <button
                    className="flex items-center gap-1.5 text-sm uppercase tracking-[0.24em] text-white/80 hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer"
                    onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                  >
                    <ScrambleText text={item.label} />
                    <ChevronDown
                      size={12}
                      style={{
                        transition: 'transform 0.22s',
                        transform: openDropdown === item.key ? 'rotate(180deg)' : 'rotate(0deg)',
                        opacity: 0.5,
                      }}
                    />
                  </button>
                  <DropdownMenu items={item.dropdown} visible={openDropdown === item.key} />
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-sm uppercase tracking-[0.24em] text-white/80 hover:text-white transition-colors duration-300"
                >
                  <ScrambleText text={item.label} />
                </Link>
              )
            )}
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
            <Link href="/start">
              <MagneticButton className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors">
                <ScrambleText text={t.nav.startProject} />
              </MagneticButton>
            </Link>
          </div>

          {/* Hamburger */}
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

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 text-white transition-opacity duration-500 overflow-y-auto py-24 gap-0 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navItems.map((item) => (
          <div key={item.key} className="w-full flex flex-col items-center">
            {item.dropdown ? (
              <>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key)}
                  className="flex items-center gap-2 text-3xl font-serif uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors duration-300 py-3"
                  style={{ fontFamily: 'var(--font-serif)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <ScrambleText text={item.label} />
                  <ChevronDown
                    size={18}
                    style={{
                      transition: 'transform 0.22s',
                      transform: mobileExpanded === item.key ? 'rotate(180deg)' : 'rotate(0deg)',
                      opacity: 0.5,
                    }}
                  />
                </button>
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: mobileExpanded === item.key ? 200 : 0,
                    transition: 'max-height 0.3s cubic-bezier(.2,.7,.3,1)',
                  }}
                >
                  <div className="flex flex-col items-center gap-2 pb-3">
                    {item.dropdown.map((sub, i) => (
                      <Link
                        key={i}
                        href={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2 rounded-xl"
                        style={{ textDecoration: 'none', background: sub.accent + '14' }}
                      >
                        <span style={{ color: sub.accent }}>{sub.icon}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-serif uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors duration-300 py-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <ScrambleText text={item.label} />
              </Link>
            )}
          </div>
        ))}

        <div className="mt-8 flex flex-col items-center gap-4">
          <MagneticButton
            onClick={() => { toggleLanguage(); setIsMenuOpen(false) }}
            disabled={isSwitching}
            aria-busy={isSwitching}
            className={`relative overflow-hidden px-8 py-3 bg-transparent border border-white/30 text-white text-base font-medium rounded-full hover:bg-white/10 transition-all duration-300 ${
              isSwitching ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <span className={`inline-block transition-all duration-300 ease-out ${isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {t.nav.language}
            </span>
            <span className={`absolute inset-0 flex items-center justify-center text-base font-medium pointer-events-none transition-opacity duration-200 ${isSwitching ? 'opacity-100 animate-glitch-text' : 'opacity-0'}`}>
              {t.nav.language}
            </span>
          </MagneticButton>
          <Link href="/start" onClick={() => setIsMenuOpen(false)}>
            <MagneticButton className="px-8 py-3 bg-white text-black text-base font-medium rounded-full hover:bg-white/90 transition-colors">
              <ScrambleText text={t.nav.startProject} />
            </MagneticButton>
          </Link>
        </div>
      </div>
    </>
  )
}
