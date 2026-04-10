"use client"

import { useState, useCallback, memo } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { Reveal } from '../reveal-animation'
import { useLanguage } from '../language-provider'

// ─── Product UI mockups (pure CSS, no images) ──────────────────────────────

const CalendarMockup = memo(function CalendarMockup() {
  return (
    <div className="w-full max-w-[340px] mx-auto select-none pointer-events-none" aria-hidden>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
          <div className="ml-3 flex-1 h-4 rounded bg-white/5" />
        </div>
        {/* Month header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <span className="text-white/60 text-xs font-semibold tracking-wide">June 2026</span>
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded bg-white/6 flex items-center justify-center">
              <div className="w-1.5 h-1.5 border-l border-t border-white/30 -rotate-45" />
            </div>
            <div className="w-5 h-5 rounded bg-white/6 flex items-center justify-center">
              <div className="w-1.5 h-1.5 border-r border-t border-white/30 rotate-45" />
            </div>
          </div>
        </div>
        {/* Day labels */}
        <div className="grid grid-cols-7 px-3 pb-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-center text-white/20 text-[9px] py-1">{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 px-3 pb-4 gap-y-0.5">
          {[
            null,null,null,1,2,3,4,
            5,6,7,8,9,10,11,
            12,13,14,15,16,17,18,
            19,20,21,22,23,24,25,
            26,27,28,29,30,null,null
          ].map((day, i) => {
            const isToday = day === 15
            const isVacation = day && [17,18,19,20,21].includes(day)
            const isVacationStart = day === 17
            const isVacationEnd = day === 21
            return (
              <div key={i} className={`relative h-7 flex items-center justify-center text-[10px] ${
                isVacation ? 'bg-blue-500/25' : ''
              } ${isVacationStart ? 'rounded-l-full' : ''} ${isVacationEnd ? 'rounded-r-full' : ''}`}>
                {day && (
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] ${
                    isToday ? 'bg-white text-black font-bold' :
                    isVacation ? 'text-blue-300' : 'text-white/50'
                  }`}>{day}</span>
                )}
              </div>
            )
          })}
        </div>
        {/* Team presence footer */}
        <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {['bg-blue-400','bg-emerald-400','bg-violet-400','bg-amber-400'].map((c, i) => (
              <div key={i} className={`w-5 h-5 rounded-full border border-black/30 ${c}`} />
            ))}
          </div>
          <span className="text-white/30 text-[9px]">4 {`on leave`}</span>
        </div>
      </div>
    </div>
  )
})

const KanbanMockup = memo(function KanbanMockup() {
  const cols = [
    { label: 'To Do', color: 'bg-white/10', cards: ['Research', 'Wireframes'] },
    { label: 'In Progress', color: 'bg-blue-500/30', cards: ['API design', 'Auth flow'] },
    { label: 'Done', color: 'bg-emerald-500/30', cards: ['Setup', 'DB schema'] },
  ]
  return (
    <div className="w-full max-w-[320px] mx-auto select-none pointer-events-none" aria-hidden>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden p-4">
        <div className="flex gap-2.5">
          {cols.map(col => (
            <div key={col.label} className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                <span className="text-white/40 text-[9px] font-semibold uppercase tracking-wide truncate">{col.label}</span>
              </div>
              <div className="space-y-1.5">
                {col.cards.map(card => (
                  <div key={card} className="rounded-lg bg-white/[0.06] border border-white/[0.06] px-2.5 py-2">
                    <div className="text-white/60 text-[9px] mb-1.5">{card}</div>
                    <div className="flex items-center justify-between">
                      <div className="h-1 w-8 rounded bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// ─── List item (rows 2-4) ──────────────────────────────────────────────────



// ─── Main section ──────────────────────────────────────────────────────────

export function ProjectsSection() {
  const { t, lang } = useLanguage()
  const [hovered, setHovered] = useState<number | null>(null)

  const items = t.projects.items
  const featured = items[0]
  const rest = items.slice(1)

  const onEnter = useCallback((i: number) => setHovered(i), [])
  const onLeave = useCallback(() => setHovered(null), [])
  const isFeaturedH = hovered === -1

  return (
    <section id="projects" className="relative py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20">
          <div>
            <Reveal>
              <span className="text-white/40 text-sm tracking-[0.3em] uppercase">{t.projects.label}</span>
            </Reveal>
            <Reveal delay={100}>
              <h2
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mt-5 leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {t.projects.titleLine1}{' '}
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.35)' }}>
                  {t.projects.titleLine2}
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200} className="mt-6 md:mt-0 shrink-0">
            <p className="text-white/25 text-sm max-w-[180px] md:text-right leading-relaxed">
              {lang === 'pt' ? 'Construídos para equipas modernas' : 'Built for modern teams'}
            </p>
          </Reveal>
        </div>

        {/* ── Featured card ──────────────────────────────────────────── */}
        {featured && (
          <Reveal delay={50}>
            <div
              className="group relative rounded-3xl border overflow-hidden mb-4 transition-[border-color] duration-500"
              style={{ borderColor: isFeaturedH ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={() => onEnter(-1)}
              onMouseLeave={onLeave}
            >
              {/* Glow spot — opacity only (GPU) */}
              <div
                className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
                style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.12), transparent)', opacity: isFeaturedH ? 1 : 0 }}
              />

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[280px]">
                {/* Left — text */}
                <div className="p-10 md:p-14 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="w-2 h-2 rounded-full bg-blue-400 transition-transform duration-300"
                        style={{ transform: isFeaturedH ? 'scale(1.3)' : 'scale(1)' }}
                      />
                      <span className="text-white/35 text-xs tracking-widest uppercase">{featured.category}</span>
                      <span className="text-white/15 text-xs">· {featured.year}</span>
                    </div>
                    <h3
                      className="font-serif font-bold leading-tight transition-[color] duration-300"
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                        color: isFeaturedH ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.88)',
                      }}
                    >
                      {featured.title}
                    </h3>
                    <p
                      className="mt-4 text-sm md:text-base leading-relaxed max-w-sm transition-[opacity] duration-300"
                      style={{ opacity: isFeaturedH ? 0.6 : 0.35, color: 'white' }}
                    >
                      {featured.description}
                    </p>
                  </div>

                  {featured.url ? (
                    <Link
                      href={featured.url}
                      className="mt-8 inline-flex items-center gap-3 self-start transition-[transform] duration-300 group/cta"
                      style={{ transform: isFeaturedH ? 'translateX(4px)' : 'translateX(0)' }}
                    >
                      <span className="text-sm font-medium text-white/70 group-hover/cta:text-white transition-[color] duration-200">
                        {lang === 'pt' ? 'Explorar produto' : 'Explore product'}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-[background-color,border-color,color] duration-300"
                        style={{
                          borderColor: isFeaturedH ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                          backgroundColor: isFeaturedH ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: isFeaturedH ? 'white' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ) : (
                    <span className="mt-8 inline-flex items-center gap-2 text-white/25 text-sm">
                      <Clock className="w-4 h-4" />
                      {lang === 'pt' ? 'Em breve' : 'Coming soon'}
                    </span>
                  )}
                </div>

                {/* Right — product mockup */}
                <div
                  className="hidden md:flex items-center justify-center p-10 border-l border-white/[0.06] transition-[opacity] duration-500"
                  style={{ opacity: isFeaturedH ? 1 : 0.6 }}
                >
                  <CalendarMockup />
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── 3-column grid for items 2–4 ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {rest.slice(0, 2).map((project, idx) => {
            const i = idx + 10
            const isH = hovered === i
            const bgColors = ['rgba(52,211,153,0.08)', 'rgba(167,139,250,0.08)']
            const dotColors = ['bg-emerald-400', 'bg-violet-400']

            const inner = (
              <div
                className="relative rounded-2xl border overflow-hidden p-7 h-full transition-[border-color] duration-400 cursor-pointer"
                style={{ borderColor: isH ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
              >
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse 100% 80% at 50% 100%, ${bgColors[idx]}, transparent)`, opacity: isH ? 1 : 0 }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[idx]}`} />
                      <span className="text-white/25 text-[10px] tracking-widest uppercase">{project.category}</span>
                    </div>
                    {!project.url ? (
                      <span className="flex items-center gap-1 text-white/20 text-[10px]">
                        <Clock className="w-2.5 h-2.5" />{lang === 'pt' ? 'Em breve' : 'Soon'}
                      </span>
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full border flex items-center justify-center transition-[transform,border-color,background-color,color] duration-300"
                        style={{
                          borderColor: isH ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)',
                          backgroundColor: isH ? 'white' : 'transparent',
                          color: isH ? '#000' : 'rgba(255,255,255,0.3)',
                          transform: isH ? 'rotate(0deg)' : 'rotate(-45deg)',
                        }}
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <span className="text-white/15 text-xs font-mono">{project.year}</span>
                  <h3
                    className="font-serif font-bold mt-2 leading-tight transition-[color,transform] duration-300"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                      color: isH ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8)',
                      transform: isH ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed transition-[opacity] duration-300" style={{ opacity: isH ? 0.55 : 0.28, color: 'white' }}>
                    {project.description}
                  </p>
                </div>
              </div>
            )
            return (
              <Reveal key={project.id} delay={idx * 80}>
                {project.url ? <Link href={project.url} className="block h-full">{inner}</Link> : inner}
              </Reveal>
            )
          })}

          {/* Last item with kanban mockup */}
          {rest[2] && (() => {
            const project = rest[2]
            const i = 12
            const isH = hovered === i
            const inner = (
              <div
                className="relative rounded-2xl border overflow-hidden h-full transition-[border-color] duration-400 cursor-pointer"
                style={{ borderColor: isH ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
              >
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(251,191,36,0.07), transparent)', opacity: isH ? 1 : 0 }}
                />
                {/* Mockup preview area */}
                <div
                  className="relative border-b border-white/[0.06] py-6 px-5 transition-opacity duration-400"
                  style={{ opacity: isH ? 1 : 0.5 }}
                >
                  <KanbanMockup />
                </div>
                {/* Text */}
                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-white/25 text-[10px] tracking-widest uppercase">{project.category}</span>
                  </div>
                  <h3
                    className="font-serif font-bold leading-tight transition-[color] duration-300"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                      color: isH ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed transition-[opacity] duration-300" style={{ opacity: isH ? 0.5 : 0.25, color: 'white' }}>
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-white/15 text-xs font-mono">{project.year}</span>
                    <span className="flex items-center gap-1 text-white/20 text-[10px]">
                      <Clock className="w-2.5 h-2.5" />{lang === 'pt' ? 'Em breve' : 'Soon'}
                    </span>
                  </div>
                </div>
              </div>
            )
            return (
              <Reveal key={project.id} delay={160}>
                {inner}
              </Reveal>
            )
          })()}
        </div>

        {/* ── Bot de Chamadas — wide bottom card ──────────────────────── */}
        {items[3] && (() => {
          const project = items[3]
          const i = 20
          const isH = hovered === i
          return (
            <Reveal delay={200}>
              <div
                className="relative rounded-2xl border overflow-hidden transition-[border-color] duration-500 cursor-pointer"
                style={{ borderColor: isH ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
              >
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                  style={{ background: 'radial-gradient(ellipse 50% 120% at 80% 50%, rgba(167,139,250,0.1), transparent)', opacity: isH ? 1 : 0 }}
                />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 md:px-12 md:py-10">
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="font-mono text-white/15 text-sm">04</span>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <span className="text-white/25 text-[10px] tracking-widest uppercase">{project.category}</span>
                      </div>
                      <h3
                        className="font-serif font-bold transition-[color] duration-300"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                          color: isH ? 'white' : 'rgba(255,255,255,0.8)',
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/30 text-sm leading-relaxed max-w-sm md:text-right transition-[opacity] duration-300" style={{ opacity: isH ? 0.65 : 0.35 }}>
                    {project.description}
                  </p>
                  <span className="shrink-0 flex items-center gap-2 text-white/20 text-xs border border-white/10 rounded-full px-4 py-2">
                    <Clock className="w-3.5 h-3.5" />
                    {lang === 'pt' ? 'Em breve' : 'Coming soon'}
                  </span>
                </div>
              </div>
            </Reveal>
          )
        })()}

      </div>
    </section>
  )
}
