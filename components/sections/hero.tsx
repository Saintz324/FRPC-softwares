'use client'

import { useEffect, useRef } from 'react'
import Ico from '@/components/icons'
import AmbientNetwork from '@/components/ambient-network'
import Link from 'next/link'
import { useLang } from '@/components/language-provider'
import { ScrambleText } from '@/components/scramble-text'
import { SiteNav } from '@/components/site-nav'

const PTCL = Array.from({ length: 22 }, (_, i) => ({
  id: i, x: 4 + (i * 1873) % 90, y: 5 + (i * 2137) % 87,
  sz: i % 5 === 0 ? 2.8 : i % 3 === 0 ? 1.8 : 1.1,
  glow: i % 5 === 0,
  dur: 3.5 + (i % 4) * 0.8, del: (i * 0.33) % 3,
  dx: `${(i % 5 - 2) * 10}px`, dy: `${-(12 + (i % 12))}px`,
}))

function Particles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {PTCL.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.sz, height: p.sz, borderRadius: '50%',
          background: p.glow ? 'var(--glow)' : 'rgba(255,255,255,0.42)',
          boxShadow: p.glow ? `0 0 ${p.sz * 4}px var(--glow)` : 'none',
          ['--dx' as string]: p.dx, ['--dy' as string]: p.dy,
          animation: `particleFloat ${p.dur}s ease-in-out ${p.del}s infinite alternate`,
          willChange: 'transform, opacity',
        }} />
      ))}
    </div>
  )
}

function MagBtn({ children, className }: { children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.transition = 'transform 0.1s ease'
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`
  }
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.5s cubic-bezier(.2,.7,.3,1)'
    ref.current.style.transform = ''
  }
  return <button ref={ref} className={`${className} mag-btn`} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</button>
}

function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let posY = 24, velY = 0, posX = 0, velX = 0
    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5
    const SPRING = 0.048, DAMP = 0.80
    let raf: number
    const onMouse = (e: MouseEvent) => { tmx = e.clientX / window.innerWidth; tmy = e.clientY / window.innerHeight }
    window.addEventListener('mousemove', onMouse, { passive: true })
    const loop = (now: number) => {
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04
      const floatY = Math.sin(now * 0.00072) * 9
      const targetX = (mx - 0.5) * 14
      velY = (velY + (floatY - posY) * SPRING) * DAMP
      velX = (velX + (targetX - posX) * SPRING) * DAMP
      posY += velY; posX += velX
      if (wrapRef.current) wrapRef.current.style.transform =
        `translate(${posX}px, calc(-50% + ${posY}px))`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMouse) }
  }, [])

  return (
    <div ref={wrapRef} style={{
      position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)',
      width: 'clamp(380px, 50vw, 740px)', height: 'clamp(380px, 50vw, 740px)',
      willChange: 'transform', zIndex: 2,
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 8%, rgba(0,0,0,0.35) 22%, black 40%)',
      maskImage: 'linear-gradient(to right, transparent 0%, transparent 8%, rgba(0,0,0,0.35) 22%, black 40%)',
    }}>
      <img
        src="/lindo.gif"
        alt=""
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}


export function HeroSection() {
  const { t } = useLang()
  const bgRef = useRef<HTMLDivElement>(null), midRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null), copyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number, sy = 0, mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5
    const onMouse = (e: MouseEvent) => { tmx = e.clientX / window.innerWidth; tmy = e.clientY / window.innerHeight }
    window.addEventListener('mousemove', onMouse, { passive: true })
    const loop = () => {
      sy += (window.scrollY - sy) * 0.09
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04
      const dx = (mx - 0.5) * 36, dy = (my - 0.5) * 22
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${dx * 0.45}px,${sy * 0.25 + dy * 0.45}px,0)`
      if (midRef.current) midRef.current.style.transform = `translate3d(${dx * 0.22}px,${sy * 0.35}px,0)`
      if (nodeRef.current) nodeRef.current.style.transform = `translate3d(${dx * 0.09}px,${sy * 0.12}px,0)`
      if (copyRef.current) copyRef.current.style.transform = `translate3d(0,${sy * 0.05}px,0)`
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('mousemove', onMouse) }
  }, [])

  return (
    <div className="screen" style={{ overflow: 'hidden' }}>
      <div ref={bgRef} style={{ position: 'absolute', top: '-22%', left: '-15%', right: '-15%', bottom: '-55%', willChange: 'transform', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '22%', left: '54%', width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-soft), transparent 55%)', filter: 'blur(52px)', animation: 'glowPulse 7s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '48%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-faint), transparent 65%)', filter: 'blur(72px)', animation: 'glowPulse 9.5s ease-in-out 3s infinite' }} />
        <div style={{ position: 'absolute', top: '3%', left: '38%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.018), transparent 70%)', filter: 'blur(40px)', animation: 'glowPulse 12s ease-in-out 1.5s infinite' }} />
      </div>

      <div ref={midRef} style={{ position: 'absolute', inset: '-8%', willChange: 'transform', zIndex: 1, pointerEvents: 'none' }}>
        <AmbientNetwork />
      </div>

      <Particles />
      <HeroVisual />

      <div style={{ position: 'relative', zIndex: 10 }}><SiteNav /></div>

      <div ref={nodeRef} style={{ position: 'absolute', inset: 0, willChange: 'transform', zIndex: 3, pointerEvents: 'none' }} />

      <div ref={copyRef} style={{ position: 'absolute', inset: 0, willChange: 'transform', zIndex: 4, display: 'flex', alignItems: 'center', padding: '0 0 0 max(40px, 7vw)', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'all', maxWidth: 'min(660px, 58%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36, animation: 'fadeSlideUp 0.6s ease 0.2s both' }}>
            <div style={{ width: 28, height: 1, background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)', flexShrink: 0 }} />
            <ScrambleText text={t.hero.intro} style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }} />
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(48px, 9vw, 140px)', margin: '0 0 32px', lineHeight: 0.93, letterSpacing: '-0.03em' }}>
            <div style={{ overflow: 'hidden' }}>
              <ScrambleText text={t.hero.main1} style={{ display: 'block', animation: 'wordReveal 0.72s cubic-bezier(.2,.7,.3,1) 0.40s both' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <ScrambleText text={t.hero.main2} style={{ display: 'block', color: 'rgba(244,244,241,0.48)', animation: 'wordReveal 0.72s cubic-bezier(.2,.7,.3,1) 0.55s both' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <ScrambleText text={t.hero.main3} style={{ display: 'block', fontStyle: 'italic', animation: 'wordReveal 0.72s cubic-bezier(.2,.7,.3,1) 0.70s both' }} />
            </div>
          </h1>

          <div style={{ height: 1, background: 'linear-gradient(90deg, var(--line-strong) 0%, var(--line) 55%, transparent 100%)', marginBottom: 28, transformOrigin: 'left center', animation: 'shimmerLine 0.9s ease 0.88s both' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', animation: 'fadeSlideUp 0.6s ease 1.05s both' }}>
            <ScrambleText as="p" text={t.hero.subtitle} style={{ color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.65, maxWidth: 270, margin: 0, flex: '0 0 auto' }} />
            <div style={{ display: 'flex', gap: 10, flex: '0 0 auto' }}>
              <Link href="/start">
                <MagBtn className="btn btn-dark"><ScrambleText text={t.hero.work} /> <Ico.ArrowUpRight size={11} /></MagBtn>
              </Link>
              <Link href="/produtos/calendario-de-ferias">
                <MagBtn className="btn btn-light"><ScrambleText text={t.hero.talk} /></MagBtn>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 'max(40px,7vw)', bottom: 44, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-dim)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', zIndex: 5, animation: 'fadeSlideUp 0.8s ease 1.5s both' }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(244,244,241,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: 'var(--ink)', display: 'grid', placeItems: 'center', animation: 'glowPulse 3s ease-in-out infinite' }}>
          <Ico.Down size={11} />
        </span>
        <ScrambleText text={t.hero.scroll} />
      </div>
    </div>
  )
}
