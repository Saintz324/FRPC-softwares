'use client'

import React, { useEffect, useRef } from 'react'
import Ico from '@/components/icons'
import { useLang } from '@/components/language-provider'

type Card = { tag: string; title: string; body: string; stat: string; sub: string }
const ICONS = ['Spark', 'Triangle', 'Sun']

function FeatureCard({ card, delay, icon }: { card: Card; delay: number; icon: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const IconC = (Ico as Record<string, (props: { size: number; color: string }) => React.ReactElement>)[icon]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.style.animation = `fadeSlideUp 0.75s cubic-bezier(.2,.7,.3,1) ${delay}s both`
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  const hover = (e: React.MouseEvent<HTMLDivElement>, on: boolean) => {
    const el = e.currentTarget
    el.style.borderColor = on ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'
    el.style.transform = on ? 'translateY(-6px)' : ''
  }

  return (
    <div ref={ref} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}
      style={{
        flex: '1 1 280px',
        background: 'linear-gradient(148deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 22, padding: '36px 32px',
        backdropFilter: 'blur(18px)',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.35s cubic-bezier(.2,.7,.3,1)',
        opacity: 0,
      }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-faint), transparent 70%)', filter: 'blur(28px)', pointerEvents: 'none' }} />

      <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', marginBottom: 26 }}>{card.tag}</div>

      <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', marginBottom: 22 }}>
        {IconC && <IconC size={18} color="var(--glow)" />}
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '-0.022em', margin: '0 0 12px', color: 'var(--ink)' }}>{card.title}</h3>
      <p style={{ color: 'var(--ink-dim)', fontSize: 13.5, lineHeight: 1.68, margin: '0 0 30px' }}>{card.body}</p>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 22, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1 }}>{card.stat}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{card.sub}</span>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  const { t } = useLang()
  const s = t.sections.features

  return (
    <div style={{ position: 'relative', background: '#06060b', minHeight: '100dvh', padding: '80px max(40px,7vw) 120px' }}>
      <div style={{ position: 'absolute', top: '30%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-faint), transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
            <div style={{ width: 28, height: 1, background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)' }} />
            <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>{s.label}</span>
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(38px, 5.5vw, 82px)', margin: 0, lineHeight: 0.93, letterSpacing: '-0.03em', maxWidth: 600 }}>
            {s.title1}<br />
            {s.title2}<br />
            <em style={{ fontStyle: 'italic', color: 'rgba(244,244,241,0.45)' }}>{s.title3}</em>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {s.cards.map((c, i) => <FeatureCard key={i} card={c} delay={i * 0.13} icon={ICONS[i]} />)}
        </div>
      </div>
    </div>
  )
}
