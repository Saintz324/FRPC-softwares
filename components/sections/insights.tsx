'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import AmbientNetwork from '@/components/ambient-network'
import { useLang } from '@/components/language-provider'

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
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 'clamp(42px, 5vw, 72px)', fontFamily: 'var(--font-display)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>Menos trabalho<br /><em style={{ fontStyle: 'italic', color: 'var(--glow)', textShadow: '0 0 30px var(--glow-soft)' }}>manual</em></span>
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

function StatTile({ label, value, textValue, suffix, sub, accent, delay = 0, statusTag }: { label: string; value?: number; textValue?: string; suffix?: string; sub: string; accent?: boolean; delay?: number; statusTag: string }) {
  const v = useCountUp(value ?? 0, 1500)
  const ref = useRef<HTMLDivElement>(null)
  useTilt(ref, 5)
  return (
    <div ref={ref} className="card tilt-card" style={{ padding: 22, position: 'relative', opacity: 0, animation: `insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) ${delay}s forwards`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 18, right: 18 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent ? 'var(--glow)' : '#fff', boxShadow: accent ? '0 0 8px var(--glow)' : 'none' }} />
          {statusTag}
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 28, marginTop: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
        {textValue
          ? <span style={{ fontSize: 42, fontFamily: 'var(--font-display)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>{textValue}</span>
          : <>
              <span style={{ fontSize: 56, fontFamily: 'var(--font-display)', lineHeight: 0.9, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{(value ?? 0) % 1 === 0 ? Math.round(v) : v.toFixed(1)}</span>
              {suffix && <span style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--ink-dim)' }}>{suffix}</span>}
              {accent && <span style={{ fontSize: 14, color: 'var(--glow)', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>↗</span>}
            </>
        }
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', flex: 1 }}>{sub}</div>
      <AnimatedSparkbars accent={accent} />
    </div>
  )
}

function AnimatedSparkbars({ accent }: { accent?: boolean }) {
  const bases = accent ? [4, 6, 8, 11, 14, 17, 20, 24, 28, 32] : [4, 6, 8, 11, 14, 17, 20, 24, 28, 32]
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 100); return () => clearTimeout(id) }, [])
  return (
    <>
      <style>{`
        @keyframes sparkWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.35); }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36, marginTop: 18 }}>
        {bases.map((h, i) => (
          <div key={i} style={{
            width: 6,
            height: mounted ? h : 0,
            borderRadius: 2,
            transformOrigin: 'bottom',
            background: accent && i > 7 ? 'var(--glow)' : accent ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)',
            boxShadow: accent && i > 7 ? '0 0 6px var(--glow-soft)' : 'none',
            transition: `height 0.7s cubic-bezier(.2,.7,.3,1) ${i * 0.05}s`,
            animation: mounted ? `sparkWave ${2.8 + (i % 3) * 0.4}s ease-in-out ${i * 0.18}s infinite` : 'none',
          }} />
        ))}
      </div>
    </>
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


export function InsightsSection() {
  const clock = useNow()
  const mouse = useMouse()
  const heroRef = useRef<HTMLDivElement>(null)
  useTilt(heroRef, 6)
  const { t } = useLang()
  const s = t.sections.insights

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
          {s.liveLabel}
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(48px, 6.5vw, 92px)', margin: '0 0 14px', letterSpacing: '-0.025em' }}>
          {s.title} <em style={{ fontStyle: 'italic', color: 'var(--glow)', textShadow: '0 0 40px var(--glow-soft)' }}>{s.subtitle}</em>
        </h2>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 580, margin: '0 auto', fontSize: 15, lineHeight: 1.55 }}>
          {s.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 18, position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', transformStyle: 'preserve-3d' }} className="insights-grid">

        <div ref={heroRef} className="card tilt-card" style={{ padding: 32, gridColumn: 'span 2', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0, animation: 'insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) 0.25s forwards' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--glow)', boxShadow: '0 0 12px var(--glow)' }} />
                <span style={{ fontSize: 11, color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{s.globalLabel}</span>
              </div>
              <CountedHero />
              <div style={{ fontSize: 14, color: 'var(--ink-dim)', maxWidth: 320, lineHeight: 1.5, marginTop: 12 }}>
                {s.globalDesc}
              </div>
            </div>
            <Globe3D t={clock} />
          </div>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 28, paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <AnimatedChip delay={0.6}>{s.chips[0]}</AnimatedChip>
              <AnimatedChip delay={0.7}>{s.chips[1]}</AnimatedChip>
              <AnimatedChip delay={0.8}>{s.chips[2]}</AnimatedChip>
            </div>
            <LiveSparkline t={clock} />
          </div>
        </div>

        <div className="card tilt-card-mini" style={{ padding: 24, display: 'flex', flexDirection: 'column', minHeight: 340, gridRow: 'span 2', opacity: 0, animation: 'insFadeUp 0.9s cubic-bezier(.2,.7,.3,1) 0.4s forwards' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}><BarTower3D t={clock} /></div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18, marginTop: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>{s.pipelineLabel}</div>
            <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', marginBottom: 8, letterSpacing: '-0.01em' }}>{s.pipelineTitle}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.55 }}>{s.pipelineDesc}</div>
          </div>
        </div>

        <StatTile delay={0.55} label={s.stat1Label} textValue={s.stat1Value} sub={s.stat1Sub} statusTag={s.statusOutput} accent />
        <StatTile delay={0.7} label={s.stat2Label} textValue={s.stat2Value} sub={s.stat2Sub} statusTag={s.statusActive} />

      </div>

      <style>{`
        @media (max-width: 1100px) { .insights-grid { grid-template-columns: 1fr 1fr !important; } .insights-grid > .card:first-child { grid-column: span 2 !important; } }
        @media (max-width: 720px) { .insights-grid { grid-template-columns: 1fr !important; } .insights-grid > .card { grid-column: span 1 !important; grid-row: auto !important; } }
      `}</style>
    </div>
  )
}
