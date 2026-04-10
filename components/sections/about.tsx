"use client"

import { memo, useEffect, useRef, useState } from 'react'
import { Reveal } from '../reveal-animation'
import { Parallax } from '../parallax'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

// Single IntersectionObserver at parent level (instead of one per counter)
function useCountUp(target: string, started: boolean, duration = 1400) {
  const [display, setDisplay] = useState('0')
  const hasRun = useRef(false)

  useEffect(() => {
    if (!started || hasRun.current) return
    hasRun.current = true

    const match = target.match(/^(\d+)(.*)$/)
    if (!match) { setDisplay(target); return }

    const end = parseInt(match[1], 10)
    const suffix = match[2] ?? ''

    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * end)
      setDisplay(`${current}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplay(target)
    }
    requestAnimationFrame(tick)
  }, [started, target, duration])

  return display
}

type StatCardProps = {
  stat: { value: string; label: string }
  index: number
  started: boolean
}

const StatCard = memo(function StatCard({ stat, index, started }: StatCardProps) {
  const display = useCountUp(stat.value, started, 1200)
  const isFirst = index === 0

  return (
    <div
      className={`
        relative p-8 rounded-2xl group
        ${isFirst ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}
        ${index === 1 ? 'mt-12' : ''}
        ${index === 2 ? '-mt-6' : ''}
      `}
      style={{ transition: 'transform 500ms cubic-bezier(0.23,1,0.32,1)' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <div
        className={`text-4xl md:text-5xl font-serif font-bold mb-2 tabular-nums ${isFirst ? 'text-black' : 'text-white'}`}
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {display}
      </div>
      <div className={`text-sm tracking-wide ${isFirst ? 'text-black/60' : 'text-white/50'}`}>
        {stat.label}
      </div>
      {/* Accent dot */}
      <div
        className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${isFirst ? 'bg-black' : 'bg-white/20'}`}
        style={{ opacity: 0, transition: 'opacity 300ms' }}
        ref={(el) => {
          if (!el) return
          const parent = el.parentElement
          if (!parent) return
          const show = () => { el.style.opacity = '1' }
          const hide = () => { el.style.opacity = '0' }
          parent.addEventListener('mouseenter', show)
          parent.addEventListener('mouseleave', hide)
        }}
      />
    </div>
  )
})

export const AboutSection = memo(function AboutSection() {
  const { t } = useLanguage()
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsStarted, setStatsStarted] = useState(false)

  // One observer for all stats
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.018] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left */}
          <div>
            <Reveal>
              <ScrambleText as="span" text={t.about.label} className="text-white/40 text-sm tracking-[0.3em] uppercase" />
            </Reveal>

            <Reveal delay={100}>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mt-6 mb-8 leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <ScrambleText text={t.about.title} />
                <ScrambleText as="span" text={t.about.titleAccent} className="text-white/40" />
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <ScrambleText as="p" text={t.about.p1} className="text-white/60 text-lg leading-relaxed mb-6" />
            </Reveal>

            <Reveal delay={300}>
              <ScrambleText as="p" text={t.about.p2} className="text-white/60 text-lg leading-relaxed" />
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-12 flex items-center gap-4">
                <div className="w-16 h-px bg-white/30" />
                <ScrambleText as="span" text={t.about.quote} className="text-white/40 text-sm italic" />
              </div>
            </Reveal>
          </div>

          {/* Right — stats with shared observer */}
          <div className="relative" ref={statsRef}>
            <Parallax speed={0.2}>
              <div className="grid grid-cols-2 gap-6">
                {t.about.stats.map((stat, index) => (
                  <Reveal key={stat.label} delay={100 * index} direction={index % 2 === 0 ? 'left' : 'right'}>
                    <StatCard stat={stat} index={index} started={statsStarted} />
                  </Reveal>
                ))}
              </div>
            </Parallax>

            {/* Decorative floaters */}
            <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full border border-white/8 floating" />
            <div
              className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full blur-2xl floating"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent)', animationDelay: '-3s' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
})
