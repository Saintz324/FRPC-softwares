'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Ico from '@/components/icons'
import AmbientNetwork from '@/components/ambient-network'
import { useLang } from '@/components/language-provider'

// Pre-computed at module level with rounded coords to avoid SSR/client floating-point mismatch
const _CX = 180, _CY = 180, _R = 142
const _rnd = (n: number) => parseFloat(n.toFixed(4))
const _pt = (deg: number) => {
  const a = (deg - 90) * Math.PI / 180
  return { x: _rnd(_CX + _R * Math.cos(a)), y: _rnd(_CY + _R * Math.sin(a)) }
}
const _arcD = (start: number, end: number) => {
  const s = _pt(start), e = _pt(end)
  return `M ${s.x} ${s.y} A ${_R} ${_R} 0 ${end - start > 180 ? 1 : 0} 1 ${e.x} ${e.y}`
}
const ACTIVE_ARC = _arcD(0, 200)
const SOON_ARC = _arcD(204, 300)
const TRACK_ARC = _arcD(0, 300)
const SEP_PT = _pt(202)

const PRODUCT_HREFS = [
  '/produtos/calendario-de-ferias',
  '/produtos/project-manager',
  '/pricing',
]
const PRODUCT_COLORS = [
  { bg: 'rgba(59,130,246,0.15)', dot: '#60a5fa' },
  { bg: 'rgba(52,211,153,0.12)', dot: '#34d399' },
  { bg: 'rgba(139,92,246,0.10)', dot: '#a78bfa' },
]

function Dial({ mounted, dialLabel }: { mounted: boolean; dialLabel: string }) {
  const size = 360, cx = size / 2, cy = size / 2
  const r3 = 100
  const activeArc = ACTIVE_ARC
  const soonArc   = SOON_ARC
  const trackArc  = TRACK_ARC
  const sepPt     = SEP_PT

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: 380 }} suppressHydrationWarning>
      <defs>
        <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
        </linearGradient>
        <filter id="arcGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Rotating tick ring — client only to avoid hydration mismatch */}
      <g>
        {mounted && Array.from({ length: 60 }).map((_, i) => {
          const a = (i * 6 - 90) * Math.PI / 180
          const r0 = 166, r4 = 172
          return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r4 * Math.cos(a)} y2={cy + r4 * Math.sin(a)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        })}
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="40s" repeatCount="indefinite" />
      </g>

      {/* Track */}
      <path d={trackArc} stroke="rgba(255,255,255,0.06)" strokeWidth="20" strokeLinecap="round" fill="none" />

      {/* Active arc */}
      <path
        id="dialActiveArc"
        d={activeArc}
        stroke="url(#activeGrad)"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
        filter="url(#arcGlow)"
      />

      {/* Coming soon arc */}
      <path
        d={soonArc}
        stroke="rgba(167,139,250,0.55)"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />

      {/* Moving dot along active arc */}
      {mounted && (
        <circle r={5} fill="white" opacity="0.95" filter="url(#arcGlow)">
          <animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto">
            <mpath href="#dialActiveArc" />
          </animateMotion>
        </circle>
      )}

      {/* Separator dot */}
      {mounted && <circle cx={sepPt.x} cy={sepPt.y} r={4} fill="#0a0a0a" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />}

      {/* Center */}
      <circle cx={cx} cy={cy} r={r3} fill="#0a0a0a" stroke="rgba(255,255,255,0.14)" />
      <circle cx={cx} cy={cy} r={r3 - 18} fill="#050505" stroke="rgba(255,255,255,0.06)" />

      {/* Pulsing ring */}
      <circle cx={cx} cy={cy} r={r3 - 10} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1">
        <animate attributeName="r" values={`${r3 - 10};${r3 - 5};${r3 - 10}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.22;0.07" dur="3s" repeatCount="indefinite" />
      </circle>

      <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontFamily="var(--font-mono)" letterSpacing="0.1em">FRPC</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.12em">TECH</text>
      <text x={cx} y={cy + 36} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="var(--font-mono)">{dialLabel}</text>
    </svg>
  )
}

export function WorkspaceSection() {
  const [mounted, setMounted] = useState(false)
  const { t } = useLang()
  const s = t.sections.workspace
  useEffect(() => setMounted(true), [])

  return (
    <div id="produtos" style={{ position: 'relative', background: '#050506', minHeight: '100dvh', padding: '80px 0 120px', overflow: 'hidden', color: 'var(--ink)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />
      <AmbientNetwork />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 20px 24px' }}>
        <h2 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: '0 0 12px' }}>{s.title}</h2>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 540, margin: '0 auto', fontSize: 14 }}>
          {s.subtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', padding: '36px 56px', position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }} className="ws-grid">
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{s.productsLabel}</div>
          <div style={{ marginBottom: 24 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--ink-dim)', padding: '7px 14px', borderRadius: 999, border: '1px solid var(--line-strong)', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', flexShrink: 0 }} />
              {s.productsCount}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
            {s.products.map((p, i) => (
              <Link key={i} href={PRODUCT_HREFS[i] ?? '/'} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '14px 16px', background: PRODUCT_COLORS[i]?.bg, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{p.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRODUCT_COLORS[i]?.dot, boxShadow: `0 0 8px ${PRODUCT_COLORS[i]?.dot}` }} />
                      <span style={{ fontSize: 11, color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)' }}>{p.status}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-dim)', lineHeight: 1.5 }}>{p.description}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="row gap-8" style={{ marginTop: 24 }}>
            <Link href="/projetos">
              <button className="btn btn-light" style={{ padding: '10px 20px' }}>{s.btnPrimary}</button>
            </Link>
            <Link href="/pricing">
              <button className="btn btn-ghost" style={{ padding: '10px 20px', borderColor: 'rgba(255,255,255,0.28)', color: 'var(--ink)' }}>{s.btnSecondary}</button>
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Dial mounted={mounted} dialLabel={s.dialLabel} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '0 32px 24px', position: 'relative', zIndex: 1 }}>
        {s.chips.map((label, i) => (
          <span key={i} className="chip">{label}</span>
        ))}
      </div>

      <div style={{ position: 'absolute', right: 28, bottom: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button className="btn btn-ghost" style={{ padding: 8, width: 36, height: 36, justifyContent: 'center' }}><Ico.Down size={14} /></button>
        <button className="btn btn-ghost" style={{ padding: 8, width: 36, height: 36, justifyContent: 'center', transform: 'rotate(180deg)' }}><Ico.Down size={14} /></button>
      </div>

    </div>
  )
}
