'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Ico from '@/components/icons'
import AmbientNetwork from '@/components/ambient-network'
import { useLang } from '@/components/language-provider'

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

function Dial({ mounted, dialUptime, dialLabel }: { mounted: boolean; dialUptime: string; dialLabel: string }) {
  const size = 360, cx = size / 2, cy = size / 2
  const r1 = 160, r2 = 130, r3 = 100
  const arc = (radius: number, startDeg: number, endDeg: number) => {
    const s = (startDeg - 90) * Math.PI / 180
    const e = (endDeg - 90) * Math.PI / 180
    const x1 = cx + radius * Math.cos(s), y1 = cy + radius * Math.sin(s)
    const x2 = cx + radius * Math.cos(e), y2 = cy + radius * Math.sin(e)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`
  }
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: 380 }} suppressHydrationWarning>
      <circle cx={cx} cy={cy} r={r1} stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r={r2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
      <path d={arc(r2 + 12, 0, 280)} stroke="url(#dialGrad)" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.9" />
      <defs>
        <linearGradient id="dialGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.95)" />
        </linearGradient>
      </defs>
      {mounted && Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 - 90) * Math.PI / 180
        const r0 = r1 + 6, r4 = r1 + 12
        return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r4 * Math.cos(a)} y2={cy + r4 * Math.sin(a)} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      })}
      <text x={cx - 130} y={cy - 110} fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="var(--font-mono)">{dialUptime}</text>
      <text x={cx - 130} y={cy - 95} fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="var(--font-mono)">99.9%</text>
      <text x={cx - 130} y={cy - 60} fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="var(--font-mono)">Versão</text>
      <text x={cx - 130} y={cy - 45} fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="var(--font-mono)">2025</text>
      <circle cx={cx} cy={cy} r={r3} fill="#0a0a0a" stroke="rgba(255,255,255,0.18)" />
      <circle cx={cx} cy={cy} r={r3 - 18} fill="#050505" stroke="rgba(255,255,255,0.08)" />
      <g transform={`translate(${cx - 10} ${cy - 10})`}>
        <path d="M13 0 4 12h7l-1 8 9-12h-7l1-8z" fill="white" />
      </g>
      <text x={cx} y={cy + 38} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="var(--font-mono)">{dialLabel}</text>
    </svg>
  )
}

export function WorkspaceSection() {
  const [mounted, setMounted] = useState(false)
  const { t } = useLang()
  const s = t.sections.workspace
  useEffect(() => setMounted(true), [])

  return (
    <div style={{ position: 'relative', background: '#050506', minHeight: '100dvh', padding: '80px 0 120px', overflow: 'hidden', color: 'var(--ink)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />
      <AmbientNetwork />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 20px 24px' }}>
        <h2 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: '0 0 12px' }}>{s.title}</h2>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 540, margin: '0 auto 22px', fontSize: 14 }}>
          {s.subtitle}
        </p>
        <Link href="/pricing">
          <button className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: 13 }}>{s.priceBtn}</button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', padding: '36px 56px', position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }} className="ws-grid">
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.productsLabel}</div>
          <div style={{ fontSize: 'clamp(64px, 7vw, 92px)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 28 }}>{s.productsCount}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
            {s.products.map((p, i) => (
              <Link key={i} href={PRODUCT_HREFS[i] ?? '/'} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: PRODUCT_COLORS[i]?.bg, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--ink)' }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>frpc.pt</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRODUCT_COLORS[i]?.dot, boxShadow: `0 0 8px ${PRODUCT_COLORS[i]?.dot}`, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)' }}>{p.status}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="row gap-8" style={{ marginTop: 24 }}>
            <Link href="/produtos/calendario-de-ferias">
              <button className="btn btn-light" style={{ padding: '8px 18px' }}>{s.btnPrimary}</button>
            </Link>
            <Link href="/pricing">
              <button className="btn btn-ghost" style={{ padding: '8px 18px' }}>{s.btnSecondary}</button>
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Dial mounted={mounted} dialUptime={s.dialUptime} dialLabel={s.dialLabel} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '0 32px 24px', position: 'relative', zIndex: 1 }}>
        {s.chips.map((label, i) => (
          <span key={i} className="chip" style={i === 2 ? { background: '#f4f4f1', color: '#0a0a0a', borderColor: '#f4f4f1' } : {}}>{label}</span>
        ))}
      </div>

      <div style={{ position: 'absolute', right: 28, bottom: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button className="btn btn-ghost" style={{ padding: 8, width: 36, height: 36, justifyContent: 'center' }}><Ico.Down size={14} /></button>
        <button className="btn btn-ghost" style={{ padding: 8, width: 36, height: 36, justifyContent: 'center', transform: 'rotate(180deg)' }}><Ico.Down size={14} /></button>
      </div>

      <style>{`@media (max-width: 900px) { .ws-grid { grid-template-columns: 1fr !important; padding: 24px !important; } }`}</style>
    </div>
  )
}
