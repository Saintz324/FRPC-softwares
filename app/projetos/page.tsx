'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Kanban, LayoutGrid, ArrowUpRight, ArrowRight } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { useLang } from '@/components/language-provider'
import { Reveal } from '@/components/reveal-animation'
import { ScrambleText } from '@/components/scramble-text'
import { SharedFooter } from '@/components/sections/footer'

const ICONS: Record<string, React.ReactNode> = {
  calendario: <Calendar size={22} />,
  'project-manager': <Kanban size={22} />,
  portal: <LayoutGrid size={22} />,
}

const DATA = {
  pt: {
    eyebrow: '— Projetos',
    title: 'Conheça os\nnossos Projetos',
    subtitle: 'Soluções desenvolvidas pela FRPC Tech para equipas que querem trabalhar de forma mais organizada, eficiente e visual.',
    projects: [
      {
        key: 'calendario',
        label: 'Calendário de Férias',
        tag: 'Gestão · SaaS',
        desc: 'Elimine emails e folhas de cálculo. Centralize pedidos, aprovações e ausências da equipa numa plataforma simples e visual.',
        href: '/produtos/calendario-de-ferias',
        accent: '#60a5fa',
        status: 'Ativo',
      },
      {
        key: 'project-manager',
        label: 'Gestão de Projetos',
        tag: 'Produtividade · SaaS',
        desc: 'Acompanhe projetos, tarefas e equipas numa interface moderna. Kanban, timelines e dashboards de desempenho.',
        href: '/produtos/project-manager',
        accent: '#34d399',
        status: 'Ativo',
      },
      {
        key: 'portal',
        label: 'Portal FRPC',
        tag: 'Plataforma interna',
        desc: 'Acesso centralizado a ferramentas, documentos, pedidos e informação da empresa. Tudo num só lugar.',
        href: '/pricing',
        accent: '#a78bfa',
        status: 'Em breve',
      },
    ],
    ctaTitle: 'Qual é o teu projeto?',
    ctaSubtitle: 'Ajudamos a criar a solução ideal para a tua empresa — desde a análise ao lançamento, adaptada ao teu processo real.',
    ctaBtn: 'Pedir Orçamento',
    ctaNote: 'Resposta em menos de 48 horas · Sem compromisso',
  },
  en: {
    eyebrow: '— Projects',
    title: "Get to know\nour Projects",
    subtitle: 'Solutions built by FRPC Tech for teams that want to work in a more organised, efficient and visual way.',
    projects: [
      {
        key: 'calendario',
        label: 'Vacation Calendar',
        tag: 'Management · SaaS',
        desc: 'Eliminate emails and spreadsheets. Centralise requests, approvals and team absences in a simple, visual platform.',
        href: '/produtos/calendario-de-ferias',
        accent: '#60a5fa',
        status: 'Active',
      },
      {
        key: 'project-manager',
        label: 'Project Manager',
        tag: 'Productivity · SaaS',
        desc: 'Track projects, tasks and teams in a modern interface. Kanban, timelines and performance dashboards.',
        href: '/produtos/project-manager',
        accent: '#34d399',
        status: 'Active',
      },
      {
        key: 'portal',
        label: 'FRPC Portal',
        tag: 'Internal platform',
        desc: 'Centralised access to tools, documents, requests and company information. Everything in one place.',
        href: '/pricing',
        accent: '#a78bfa',
        status: 'Coming soon',
      },
    ],
    ctaTitle: 'What is your project?',
    ctaSubtitle: 'We help create the ideal solution for your company — from analysis to launch, adapted to your real process.',
    ctaBtn: 'Request Quote',
    ctaNote: 'Response in less than 48 hours · No commitment',
  },
}

export default function ProjetosPage() {
  const { lang } = useLang()
  const isPt = lang === 'pt'
  const d = DATA[lang as 'pt' | 'en']
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const anim = (delay: number) =>
    mounted ? `projFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` : 'none'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', color: 'var(--ink)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />

      <SiteNav />

      <main className="relative z-10">

        {/* ── HERO ── */}
        <section style={{ padding: 'clamp(100px,14vw,160px) clamp(24px,7vw,80px) clamp(48px,6vw,80px)' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ animation: anim(0), marginBottom: 20 }}>
              <ScrambleText
                text={d.eyebrow}
                className="text-xs font-bold tracking-[0.15em] uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              />
            </div>
            <div style={{ animation: anim(80) }}>
              <h1
                className="font-serif leading-[1.0] tracking-tight"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem,8vw,7rem)', marginBottom: 24, whiteSpace: 'pre-line' }}
              >
                {d.title}
              </h1>
            </div>
            <p style={{ animation: anim(160), color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(14px,1.8vw,18px)', lineHeight: 1.65, maxWidth: 560 }}>
              {d.subtitle}
            </p>
          </div>
        </section>

        {/* ── PROJECT CARDS ── */}
        <section style={{ padding: '0 clamp(24px,7vw,80px) clamp(80px,10vw,120px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,340px), 1fr))', gap: 16, maxWidth: 1200 }} className="proj-grid">
            {d.projects.map((p, i) => (
              <Reveal key={p.key} delay={i * 70}>
                <Link href={p.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    className="proj-card"
                    style={{
                      height: '100%',
                      padding: '28px 24px',
                      borderRadius: 20,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      transition: 'border-color 0.2s, background 0.2s, transform 0.25s cubic-bezier(.2,.7,.3,1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.borderColor = p.accent + '55'
                      el.style.background = p.accent + '08'
                      el.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.borderColor = 'rgba(255,255,255,0.08)'
                      el.style.background = 'rgba(255,255,255,0.03)'
                      el.style.transform = ''
                    }}
                  >
                    {/* accent top bar */}
                    <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg, transparent, ${p.accent}50, transparent)` }} />

                    {/* icon + status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.accent + '18', border: `1px solid ${p.accent}28`, color: p.accent }}>
                        {ICONS[p.key]}
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.key === 'portal' ? '#a78bfa' : '#34d399', boxShadow: `0 0 6px ${p.key === 'portal' ? '#a78bfa' : '#34d399'}` }} />
                        {p.status}
                      </span>
                    </div>

                    {/* content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{p.tag}</div>
                      <h2 style={{ fontSize: 'clamp(18px,2.2vw,22px)', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 10, lineHeight: 1.3 }}>{p.label}</h2>
                      <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{p.desc}</p>
                    </div>

                    {/* arrow cta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: p.accent }}>
                      {isPt ? 'Ver projeto' : 'View project'}
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA / CREATE YOUR PROJECT ── */}
        <section style={{ padding: '0 clamp(24px,7vw,80px) clamp(80px,10vw,140px)' }}>
          <Reveal>
            <div
              style={{
                maxWidth: 780,
                padding: 'clamp(36px,5vw,60px) clamp(28px,5vw,56px)',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* glow accent */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-soft), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2
                  className="font-serif"
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem,4.5vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: 16, lineHeight: 1.1 }}
                >
                  {d.ctaTitle}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(13px,1.6vw,16px)', lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
                  {d.ctaSubtitle}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <Link href="/pricing" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '14px 28px', borderRadius: 999,
                        background: 'white', color: '#0a0a0a',
                        fontWeight: 600, fontSize: 14.5,
                        border: 'none', cursor: 'pointer',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      {d.ctaBtn}
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)' }}>
                    {d.ctaNote}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <SharedFooter />
      </main>

      <style jsx global>{`
        @keyframes projFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .proj-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
