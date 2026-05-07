'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Ico from '@/components/icons'
import { useLang } from '@/components/language-provider'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  const { t } = useLang()
  const s = t.sections.cta

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ position: 'relative', background: '#0c0c16', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px max(40px,7vw) 0', textAlign: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-soft), transparent 55%)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0, animation: 'glowPulse 8s ease-in-out infinite' }} />

      <div ref={ref} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 42, opacity: vis ? 1 : 0, transition: 'opacity 0.7s ease' }}>
          <div style={{ width: 32, height: 1, background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{s.label}</span>
          <div style={{ width: 32, height: 1, background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)' }} />
        </div>

        <div className="display" style={{ fontSize: 'clamp(56px, 10vw, 156px)', lineHeight: 0.9, letterSpacing: '-0.035em', margin: '0 0 28px' }}>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ display: 'block', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(100%)', transition: 'opacity 0.75s ease 0.1s, transform 0.75s cubic-bezier(.2,.7,.3,1) 0.1s' }}>{s.title1}</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ display: 'block', fontStyle: 'italic', color: 'rgba(244,244,241,0.4)', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(100%)', transition: 'opacity 0.75s ease 0.22s, transform 0.75s cubic-bezier(.2,.7,.3,1) 0.22s' }}>{s.title2}</span>
          </div>
        </div>

        <p style={{ color: 'var(--ink-dim)', fontSize: 15, lineHeight: 1.65, maxWidth: 400, margin: '0 auto 50px', opacity: vis ? 1 : 0, transition: 'opacity 0.7s ease 0.38s' }}>
          {s.subtitle}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', opacity: vis ? 1 : 0, transition: 'opacity 0.7s ease 0.5s' }}>
          <Link href="/start">
            <button className="btn btn-light" style={{ padding: '14px 34px', fontSize: 14 }}>
              {s.btnPrimary} <Ico.ArrowUpRight size={13} />
            </button>
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap', gap: 16 }}>
        <span>{s.copyright}</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {s.links.map(l => (
            <a key={l.label} href={l.href} style={{ color: 'var(--ink-mute)', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.06em' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>{l.label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Ico.X size={11} /><Ico.Linkedin size={11} />
        </div>
      </div>
    </div>
  )
}
