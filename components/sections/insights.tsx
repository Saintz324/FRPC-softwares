'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Ico from '@/components/icons'
import AmbientNetwork from '@/components/ambient-network'

function useCountUp(target: number, duration = 1800, deps: unknown[] = []) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf: number, start: number
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return val
}

function useTilt(ref: React.RefObject<HTMLDivElement | null>, max = 8) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--rx', `${-y * max}deg`)
      el.style.setProperty('--ry', `${x * max}deg`)
      el.style.setProperty('--mx', `${x * 100 + 50}%`)
      el.style.setProperty('--my', `${y * 100 + 50}%`)
    }
    const onLeave = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [max, ref])
}

function useNow() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const loop = () => { setT((performance.now() - start) / 1000); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return t
}

function useMouse() {
  const [m, setM] = useState({ x: 0.5, y: 0.5 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => setM({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return m
}

function CountedHero() {
  const v = useCountUp(98.2, 1800)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 'clamp(80px, 9vw, 128px)', fontFamily: 'var(--font-display)', lineHeight: 0.9, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{v.toFixed(1)}</span>
      <span style={{ fontSize: 36, color: 'var(--glow)', fontFamily: 'var(--font-display)', textShadow: '0 0 30px var(--glow-soft)' }}>%</span>
    </div>
  )
}

function AnimatedChip({ children, delay = 0, active }: { children: React.ReactNode; delay?: number; active?: boolean }) {
  return (
    <span className="chip" style={{ fontSize: 12, padding: '6px 12px', ...(active ? { background: 'rgba(255,255,255,0.08)', borderColor: 'var(--line-strong)' } : {}), opacity: 0, animation: `chipIn 0.5s cubic-bezier(.2,.7,.3,1) ${delay}s forwards` }}>
      {children}
    </span>
  )
}

function Globe3D({ t }: { t: number }) {
  const rotY = (t * 12) % 360
  const rings = 6, dots = 14
  return (
    <div style={{ width: 220, height: 220, position: 'relative', transformStyle: 'preserve-3d', perspective: '900px' }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(-15deg) rotateY(${rotY}deg)` }}>
        {Array.from({ length: rings }).map((_, i) => {
          const lat = (i / (rings - 1) - 0.5) * Math.PI
          const r = Math.cos(lat) * 90, y = Math.sin(lat) * 90
          return <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: r * 2, height: r * 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', transform: `translate3d(-50%, calc(-50% + ${y}px), 0) rotateX(90deg)` }} />
        })}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`lng${i}`} style={{ position: 'absolute', left: '50%', top: '50%', width: 180, height: 180, border: '1px solid rgba(255,255,255,0.06)', borderRadius: '50%', transform: `translate(-50%, -50%) rotateY(${(i / 6) * 180}deg)` }} />
        ))}
        {Array.from({ length: dots }).map((_, i) => {
          const lat = (Math.sin(i * 1.7) * 0.5) * Math.PI
          const lng = (i / dots) * Math.PI * 2
          const x = Math.cos(lat) * Math.cos(lng) * 90
          const y = Math.sin(lat) * 90
          const z = Math.cos(lat) * Math.sin(lng) * 90
          const isAccent = i % 4 === 0
          return <div key={`d${i}`} style={{ position: 'absolute', left: '50%', top: '50%', width: isAccent ? 6 : 3, height: isAccent ? 6 : 3, borderRadius: '50%', background: isAccent ? 'var(--glow)' : 'rgba(255,255,255,0.6)', boxShadow: isAccent ? '0 0 8px var(--glow)' : 'none', transform: `translate3d(${x - 1.5}px, ${y - 1.5}px, ${z}px)` }} />
        })}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow), transparent)', transform: 'translate(-50%, -50%)', filter: 'blur(2px)' }} />
      </div>
      <div style={{ position: 'absolute', top: 8, right: -10, fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>spot · 02</div>
      <div style={{ position: 'absolute', bottom: 30, left: -16, fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>spot · 01</div>
    </div>
  )
}

function BarTower3D({ t }: { t: number }) {
  const bars = 7
  return (
    <div style={{ width: 220, height: 220, position: 'relative', perspective: '900px', transformStyle: 'preserve-3d' }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(-12deg) rotateY(${Math.sin(t * 0.3) * 15}deg)`, transition: 'transform 0.1s linear' }}>
        {Array.from({ length: bars }).map((_, i) => {
          const breathing = Math.sin(t * 1.2 + i * 0.5) * 8
          const baseHeight = 40 + (i === 3 ? 80 : Math.abs(3 - i) === 1 ? 60 : Math.abs(3 - i) === 2 ? 35 : 20)
          const h = baseHeight + breathing
          const x = (i - 3) * 22
          const isCenter = i === 3
          return (
            <div key={i} style={{ position: 'absolute', left: '50%', top: '60%', width: 8, height: h, transform: `translate3d(${x}px, ${-h}px, 0)`, transformStyle: 'preserve-3d', transition: 'height 0.15s' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, var(--glow) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.05) 100%)', borderRadius: 4 }} />
              <div style={{ position: 'absolute', left: '50%', top: -4, width: 10, height: 10, borderRadius: '50%', background: 'var(--glow)', boxShadow: `0 0 ${isCenter ? 20 : 10}px var(--glow)`, transform: 'translate(-50%, 0)' }} />
            </div>
          )
        })}
        <div style={{ position: 'absolute', left: '10%', right: '10%', top: '60%', height: 1, background: 'rgba(255,255,255,0.12)' }} />
      </div>
    </div>
  )
}

function StatTile({ label, value, suffix, sub, accent, delay = 0 }: { label: string; value: number; suffix: string; sub: string; accent?: boolean; delay?: number }) {
  const v = useCountUp(value, 1500)
  const ref = useRef<HTMLDivElement>(null)
  useTilt(ref, 5)
  return (
    <div ref={ref} className="card tilt-card" style={{ padding: 22, position: 'relative', opacity: 0, animation: `insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) ${delay}s forwards` }}>
      <div style={{ position: 'absolute', top: 18, right: 18 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent ? 'var(--glow)' : '#fff', boxShadow: accent ? '0 0 8px var(--glow)' : 'none' }} />
          {accent ? 'Output' : 'Ativo'}
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 28, marginTop: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 56, fontFamily: 'var(--font-display)', lineHeight: 0.9, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{value % 1 === 0 ? Math.round(v) : v.toFixed(1)}</span>
        {suffix && <span style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--ink-dim)' }}>{suffix}</span>}
        {accent && <span style={{ fontSize: 14, color: 'var(--glow)', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>↗</span>}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>{sub}</div>
      <AnimatedSparkbars accent={accent} />
    </div>
  )
}

function AnimatedSparkbars({ accent }: { accent?: boolean }) {
  const heights = accent ? [3, 5, 4, 7, 6, 9, 8, 12, 10, 14] : [8, 6, 9, 7, 11, 9, 13, 11, 15, 13]
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 100); return () => clearTimeout(id) }, [])
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 6, height: mounted ? h * (accent ? 2 : 1.7) : 0, borderRadius: 1, background: accent && i > 7 ? 'var(--glow-soft)' : accent ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.45)', transition: `height 0.7s cubic-bezier(.2,.7,.3,1) ${i * 0.05}s` }} />
      ))}
    </div>
  )
}

function LiveSparkline({ t }: { t: number }) {
  const w = 140, h = 32
  const pts = useMemo(() => Array.from({ length: 24 }).map((_, i) => 16 + Math.sin((i + t * 2) * 0.5) * 8 + Math.cos(i * 0.7) * 4), [Math.floor(t * 6)])
  const max = 32
  const path = pts.map((p, i) => { const x = (i / (pts.length - 1)) * w; const y = h - (p / max) * h; return `${i === 0 ? 'M' : 'L'} ${x} ${y}` }).join(' ')
  const lastY = h - (pts[pts.length - 1] / max) * h
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--glow)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--glow)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#sparkFill)" />
      <path d={path} stroke="var(--glow)" strokeWidth="1.5" fill="none" />
      <circle cx={w} cy={lastY} r="3" fill="var(--glow)" style={{ filter: 'drop-shadow(0 0 4px var(--glow))' }} />
    </svg>
  )
}

function PeriodFilter() {
  const [active, setActive] = useState(1)
  const periods = ['1S', '1M', '3M', 'YTD']
  return (
    <div style={{ display: 'flex', gap: 4, padding: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 10 }}>
      {periods.map((p, i) => (
        <button key={p} onClick={() => setActive(i)} style={{ background: active === i ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: active === i ? 'var(--ink)' : 'var(--ink-dim)', padding: '5px 12px', borderRadius: 7, fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>{p}</button>
      ))}
    </div>
  )
}

function PromptChart({ t }: { t: number }) {
  const data = [{ label: 'Seg', a: 24, b: 18 }, { label: 'Ter', a: 38, b: 22 }, { label: 'Qua', a: 52, b: 30 }, { label: 'Qui', a: 46, b: 34 }, { label: 'Sex', a: 64, b: 28 }, { label: 'Sáb', a: 32, b: 20 }, { label: 'Dom', a: 28, b: 16 }]
  const max = 70
  const [hover, setHover] = useState(-1)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 200); return () => clearTimeout(id) }, [])
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 12, height: 200, perspective: '900px', transformStyle: 'preserve-3d', padding: '0 8px' }}>
        {data.map((d, i) => {
          const ha = (d.a / max) * 160, hb = (d.b / max) * 160
          return (
            <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, justifyContent: 'center', cursor: 'pointer', transform: hover === i ? 'translateY(-8px)' : 'translateY(0)', transition: 'transform 0.25s cubic-bezier(.2,.7,.3,1)', position: 'relative' }}>
              {hover === i && <div style={{ position: 'absolute', top: -42, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,15,16,0.95)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', backdropFilter: 'blur(10px)', zIndex: 5 }}><span style={{ color: 'var(--glow)' }}>●</span> {d.a} / <span style={{ color: '#fff' }}>●</span> {d.b}</div>}
              <div style={{ width: 16, height: mounted ? ha : 0, background: 'linear-gradient(180deg, var(--glow), rgba(255,255,255,0.3))', borderRadius: '4px 4px 0 0', position: 'relative', transition: `height 0.9s cubic-bezier(.2,.7,.3,1) ${i * 0.08}s`, boxShadow: hover === i ? '0 0 20px var(--glow-soft)' : '0 0 8px var(--glow-faint)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--glow)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px var(--glow)' }} />
              </div>
              <div style={{ width: 16, height: mounted ? hb : 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.3))', borderRadius: '4px 4px 0 0', transition: `height 0.9s cubic-bezier(.2,.7,.3,1) ${i * 0.08 + 0.1}s` }} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12, padding: '0 8px' }}>
        {data.map((d, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{d.label}</div>)}
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 16, fontSize: 11, color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: 'var(--glow)', borderRadius: 2, boxShadow: '0 0 6px var(--glow)' }} /> Entregues</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.7)', borderRadius: 2 }} /> Revistos</div>
      </div>
    </div>
  )
}

export function InsightsSection() {
  const t = useNow()
  const mouse = useMouse()
  const heroRef = useRef<HTMLDivElement>(null)
  useTilt(heroRef, 6)

  return (
    <div style={{ position: 'relative', background: '#050506', padding: '80px max(40px,7vw) 120px', perspective: '1400px', overflow: 'hidden', color: 'var(--ink)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />
      <AmbientNetwork />

      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', transform: `translate3d(${(mouse.x - 0.5) * -30}px, ${(mouse.y - 0.5) * -20}px, 0)`, transition: 'transform 0.4s cubic-bezier(.2,.7,.3,1)' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-soft), transparent 60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '8%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-faint), transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginTop: 8, marginBottom: 32, opacity: 0, animation: 'insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) 0.1s forwards' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--glow)', boxShadow: '0 0 12px var(--glow)', animation: 'pulse 2s ease-in-out infinite' }} />
          Live · Q2 2026
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(48px, 6.5vw, 92px)', margin: '0 0 14px', letterSpacing: '-0.025em' }}>
          Resultados <em style={{ fontStyle: 'italic', color: 'var(--glow)', textShadow: '0 0 40px var(--glow-soft)' }}>mensuráveis</em>
        </h2>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 580, margin: '0 auto', fontSize: 15, lineHeight: 1.55 }}>
          Um dashboard vivo. Métricas que respiram. Cada sinal é um fio que podes puxar.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 18, position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', transformStyle: 'preserve-3d' }} className="insights-grid">

        <div ref={heroRef} className="card tilt-card" style={{ padding: 32, gridColumn: 'span 2', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0, animation: 'insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) 0.25s forwards' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--glow)', boxShadow: '0 0 12px var(--glow)' }} />
                <span style={{ fontSize: 11, color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Taxa de satisfação · global</span>
              </div>
              <CountedHero />
              <div style={{ fontSize: 14, color: 'var(--ink-dim)', maxWidth: 320, lineHeight: 1.5, marginTop: 12 }}>
                Clientes satisfeitos com produtos entregues <em style={{ fontStyle: 'italic' }}>a tempo e com qualidade</em>.
              </div>
            </div>
            <Globe3D t={t} />
          </div>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 28, paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <AnimatedChip delay={0.6}>↗ +1.2k / mês</AnimatedChip>
              <AnimatedChip delay={0.7}><Ico.Plus size={10} /> Novo projeto</AnimatedChip>
              <AnimatedChip delay={0.8} active><Ico.Plus size={10} /> Auto-assign</AnimatedChip>
            </div>
            <LiveSparkline t={t} />
          </div>
        </div>

        <div className="card tilt-card-mini" style={{ padding: 24, display: 'flex', flexDirection: 'column', minHeight: 340, gridRow: 'span 2', opacity: 0, animation: 'insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) 0.4s forwards' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}><BarTower3D t={t} /></div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18, marginTop: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>02 — Processo</div>
            <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', marginBottom: 8, letterSpacing: '-0.01em' }}>Desenvolvimento Ágil</div>
            <div style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.55 }}>Iterações rápidas, feedback constante — o produto evolui com as tuas necessidades reais.</div>
          </div>
        </div>

        <StatTile delay={0.55} label="Projetos entregues" value={12} suffix="+" sub="desde o lançamento" accent />
        <StatTile delay={0.7} label="Resposta" value={48} suffix="h" sub="tempo médio de resposta" />

        <div className="card" style={{ padding: 28, gridColumn: 'span 2', opacity: 0, animation: 'insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) 0.85s forwards' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>03 — Performance</div>
              <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Entregas por semana</div>
            </div>
            <PeriodFilter />
          </div>
          <PromptChart t={t} />
        </div>
      </div>

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-mute)', fontSize: 12, position: 'relative', zIndex: 1 }}>
        <div className="row gap-16">
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Suporte</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Status</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Docs</a>
        </div>
        <div>Criado no FRPC Studio · 2026</div>
        <div className="row gap-16"><Ico.X size={12} /><Ico.Linkedin size={12} /></div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .insights-grid { grid-template-columns: 1fr 1fr !important; } .insights-grid > .card:first-child { grid-column: span 2 !important; } }
        @media (max-width: 720px) { .insights-grid { grid-template-columns: 1fr !important; } .insights-grid > .card { grid-column: span 1 !important; grid-row: auto !important; } }
      `}</style>
    </div>
  )
}
