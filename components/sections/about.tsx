"use client"

import { memo, useEffect, useRef, useState } from 'react'
import { Reveal } from '../reveal-animation'
import { Parallax } from '../parallax'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

function useCountUp(target: string, duration = 1500) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Extract numeric portion and suffix (e.g. "2+" → 2, "+")
    const match = target.match(/^(\d+)(.*)$/)
    if (!match) {
      setDisplay(target)
      return
    }
    const end = parseInt(match[1], 10)
    const suffix = match[2] ?? ''

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasRun.current) return
        hasRun.current = true
        observer.disconnect()

        const startTime = performance.now()
        const tick = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          const current = Math.floor(eased * end)
          setDisplay(`${current}${suffix}`)
          if (progress < 1) requestAnimationFrame(tick)
          else setDisplay(target)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { display, ref }
}

type StatCardProps = {
  stat: { value: string; label: string }
  index: number
}

const StatCard = memo(function StatCard({ stat, index }: StatCardProps) {
  const { display, ref } = useCountUp(stat.value, 1200)
  return (
    <div
      ref={ref}
      className={`
        relative p-8 rounded-2xl
        ${index === 0 ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}
        ${index === 1 ? 'mt-12' : ''}
        ${index === 2 ? '-mt-6' : ''}
        group hover:scale-105 transition-transform duration-500
      `}
    >
      <div
        className={`text-4xl md:text-5xl font-serif font-bold mb-2 tabular-nums ${index === 0 ? 'text-black' : 'text-white'}`}
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {display}
      </div>
      <div className={`text-sm tracking-wide ${index === 0 ? 'text-black/60' : 'text-white/50'}`}>
        {stat.label}
      </div>
      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${index === 0 ? 'bg-black' : 'bg-white/20'} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  )
})

export const AboutSection = memo(function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left side */}
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
                <ScrambleText as="span" text={t.about.quote} className="text-white/40 text-sm" />
              </div>
            </Reveal>
          </div>

          {/* Right side - animated stats */}
          <div className="relative">
            <Parallax speed={0.2}>
              <div className="grid grid-cols-2 gap-6">
                {t.about.stats.map((stat, index) => (
                  <Reveal key={stat.label} delay={100 * index} direction={index % 2 === 0 ? 'left' : 'right'}>
                    <StatCard stat={stat} index={index} />
                  </Reveal>
                ))}
              </div>
            </Parallax>

            <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full border border-white/10 floating" />
            <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl floating" style={{ animationDelay: '-3s' }} />
          </div>
        </div>
      </div>
    </section>
  )
})
