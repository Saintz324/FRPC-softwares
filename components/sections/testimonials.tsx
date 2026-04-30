'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: '48h',  label: 'Resposta garantida'    },
  { value: '3+',   label: 'Produtos lançados'     },
  { value: '100%', label: 'Foco no cliente'       },
  { value: '2025', label: 'A crescer desde'       },
]

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ flex: 1, padding: '36px 0', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 4.5vw, 64px)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 10, opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(14px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</div>
    </div>
  )
}

export function TestimonialsSection() {
  const quoteRef = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.2 })
    if (quoteRef.current) obs.observe(quoteRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ position: 'relative', background: '#070710', minHeight: '100dvh', padding: '80px max(40px,7vw) 120px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, var(--glow-faint), transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 80, overflow: 'hidden' }}>
        {STATS.map((s, i) => <AnimatedStat key={s.label} value={s.value} label={s.label} delay={i * 0.12} />)}
      </div>

      <div ref={quoteRef} style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', marginBottom: 36, opacity: vis ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          ★ ★ ★ ★ ★ &nbsp;&nbsp; Destaques de clientes
        </div>

        <blockquote className="display" style={{ fontSize: 'clamp(26px, 3.8vw, 52px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 40px', fontStyle: 'italic', opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s' }}>
          "A FRPC entregou o nosso Calendário de Férias num tempo recorde. O resultado superou todas as expectativas — interface limpa, produto sólido."
        </blockquote>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: vis ? 1 : 0, transition: 'opacity 0.6s ease 0.35s' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 16 }}>R</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Ricardo Fonseca</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>CEO, TechFlow Lisboa</div>
          </div>
        </div>
      </div>
    </div>
  )
}
