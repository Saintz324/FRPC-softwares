"use client"

import { useEffect, useState, memo } from 'react'
import { ArrowRight, ExternalLink, Layers, Users, Clock, LayoutDashboard, CheckCircle, Target, Zap, Shield } from 'lucide-react'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { ProductNav } from '@/components/product-nav'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { TextSplit } from '@/components/text-split'

const APP_URL = 'https://frpc-project-production.up.railway.app/login.html'

/* ─── Kanban Board Mockup ────────────────────────────────────────────── */
const KanbanMockup = memo(function KanbanMockup() {
  const columns = [
    {
      title: 'A Fazer',
      color: 'text-white/50',
      dot: 'bg-white/30',
      cards: [
        { title: 'Redesign da página de login', tag: 'Design', assignee: 'AN', priority: 'high' },
        { title: 'Integração com API de pagamentos', tag: 'Backend', assignee: 'JM', priority: 'medium' },
      ],
    },
    {
      title: 'Em Progresso',
      color: 'text-amber-400',
      dot: 'bg-amber-400',
      cards: [
        { title: 'Dashboard de analytics', tag: 'Frontend', assignee: 'MC', priority: 'high' },
        { title: 'Testes de performance', tag: 'QA', assignee: 'PN', priority: 'low' },
      ],
    },
    {
      title: 'Concluído',
      color: 'text-emerald-400',
      dot: 'bg-emerald-400',
      cards: [
        { title: 'Setup do CI/CD pipeline', tag: 'DevOps', assignee: 'RF', priority: 'medium' },
      ],
    },
  ]

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-emerald-500/20 text-emerald-400',
  }
  const priorityLabels: Record<string, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
      {/* Browser chrome */}
      <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono truncate">
          frpc-project.app / Sprint 4
        </div>
      </div>

      {/* App header */}
      <div className="bg-[#0f0f1a] px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span className="text-white/90 text-sm font-semibold">Project Manager</span>
            <span className="text-white/20 text-sm">·</span>
            <span className="text-white/40 text-xs">Sprint 4 — Jun 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-400/60 text-white text-[9px] flex items-center justify-center font-bold">J</div>
            <div className="w-5 h-5 rounded-full bg-violet-400/60 text-white text-[9px] flex items-center justify-center font-bold">M</div>
            <div className="w-5 h-5 rounded-full bg-emerald-400/60 text-white text-[9px] flex items-center justify-center font-bold">A</div>
            <div className="text-white/30 text-xs ml-1">+2</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: '62%' }} />
          </div>
          <span className="text-white/30 text-xs">62%</span>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="bg-[#0f0f1a] px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {columns.map(col => (
            <div key={col.title}>
              {/* Column header */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                <span className={`text-xs font-medium ${col.color}`}>{col.title}</span>
                <span className="text-white/20 text-xs ml-auto">{col.cards.length}</span>
              </div>
              {/* Cards */}
              <div className="space-y-2">
                {col.cards.map(card => (
                  <div key={card.title} className="p-2.5 rounded-lg bg-white/5 border border-white/[0.06] hover:border-white/10 transition-colors">
                    <p className="text-white/80 text-xs leading-snug mb-2">{card.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/30">{card.tag}</span>
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${priorityColors[card.priority]}`}>
                          {priorityLabels[card.priority]}
                        </span>
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white/50 text-[9px] font-bold">
                          {card.assignee[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add card placeholder */}
                <div className="p-2 rounded-lg border border-dashed border-white/10 text-white/20 text-xs text-center hover:border-white/20 transition-colors cursor-pointer">
                  + Adicionar
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

/* ─── Dashboard Mockup ───────────────────────────────────────────────── */
const DashboardMockup = memo(function DashboardMockup() {
  const projects = [
    { name: 'Website Redesign', progress: 78, status: 'bg-emerald-400', tasks: 12 },
    { name: 'App Mobile', progress: 45, status: 'bg-amber-400', tasks: 8 },
    { name: 'API v2', progress: 91, status: 'bg-blue-400', tasks: 6 },
    { name: 'Data Migration', progress: 22, status: 'bg-violet-400', tasks: 15 },
  ]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
      <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono">Dashboard</div>
      </div>
      <div className="bg-[#0f0f1a] p-4">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Projetos Ativos', value: '4', trend: '+1' },
            { label: 'Tarefas em Atraso', value: '2', trend: '-3' },
            { label: 'Concluídas Hoje', value: '7', trend: '+7' },
          ].map(kpi => (
            <div key={kpi.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-white/40 text-xs mb-1">{kpi.label}</div>
              <div className="flex items-end justify-between">
                <span className="text-white/90 text-xl font-bold">{kpi.value}</span>
                <span className={`text-xs ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Projects list */}
        <div className="space-y-2.5">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Projetos</p>
          {projects.map(p => (
            <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors">
              <div className={`w-2 h-2 rounded-full ${p.status} shrink-0`} />
              <span className="text-white/70 text-xs flex-1 truncate">{p.name}</span>
              <span className="text-white/30 text-xs">{p.tasks} tarefas</span>
              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${p.status} opacity-70`} style={{ width: `${p.progress}%` }} />
              </div>
              <span className="text-white/30 text-xs w-8 text-right">{p.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function ProjectManagerPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div className="hidden md:block"><CursorFollower /></div>
      <SplineBackground />
      <ProductNav externalUrl={APP_URL} tryLabel="Experimentar Agora" />

      <main className="relative z-10">

        {/* ─── HERO: centrado + mockup abaixo ─────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 pt-24 pb-0 text-center">
          <div className="max-w-5xl w-full mx-auto">
            {/* Badge */}
            <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs tracking-widest uppercase">
                <Layers className="w-3 h-3" />
                Gestão de Projetos · SaaS
              </span>
            </div>

            {/* Heading */}
            <div className={`mt-8 transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <TextSplit
                text="PROJECT"
                className="font-serif font-bold text-white leading-none tracking-tight justify-center"
                style={{ fontSize: 'clamp(3.5rem, 13vw, 11rem)' }}
                delay={200}
                stagger={0.04}
              />
              <TextSplit
                text="MANAGER"
                className="font-serif font-bold leading-none tracking-tight justify-center"
                style={{
                  fontSize: 'clamp(3.5rem, 13vw, 11rem)',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.4)',
                  WebkitTextFillColor: 'transparent',
                }}
                delay={400}
                stagger={0.04}
              />
            </div>

            <p className={`text-white/60 text-lg md:text-2xl max-w-2xl mx-auto mt-8 leading-relaxed transition-all duration-700 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Organize projetos, tarefas e equipas. Entregue mais rápido, com menos stress.
            </p>

            <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                className="group px-8 py-4 bg-white text-black text-sm font-medium rounded-full flex items-center gap-3 hover:bg-white/90 transition-colors"
              >
                Experimentar Grátis
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#features"
                className="px-8 py-4 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
              >
                Ver funcionalidades
              </a>
            </div>

            {/* Trust */}
            <div className={`mt-8 flex items-center justify-center gap-6 transition-all duration-700 delay-[900ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <span className="flex items-center gap-2 text-white/30 text-xs">
                <Shield className="w-3.5 h-3.5" /> Sem cartão de crédito
              </span>
              <div className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-2 text-white/30 text-xs">
                <Zap className="w-3.5 h-3.5" /> Setup em 2 minutos
              </span>
            </div>
          </div>

          {/* Full-width mockup scrolling into view */}
          <div className={`mt-16 w-full max-w-6xl mx-auto transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <KanbanMockup />
          </div>
        </section>

        {/* ─── STATS BAR ──────────────────────────────────────────── */}
        <section className="relative py-20 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '∞', label: 'Projetos' },
                { value: '∞', label: 'Tarefas' },
                { value: '0', label: 'Reunioes de status' },
                { value: '100%', label: 'Visibilidade' },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 80}>
                  <div>
                    <div className="text-3xl md:text-5xl font-serif font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{s.value}</div>
                    <div className="text-white/40 text-xs md:text-sm tracking-widest uppercase mt-2">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ──────────────────────────────────────── */}
        <section id="features" className="relative py-32 md:py-48">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div>
                <Reveal>
                  <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Funcionalidades</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    Tudo o que precisa<br />
                    <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>
                      numa só ferramenta.
                    </span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={200}>
                <p className="text-white/50 text-xl leading-relaxed">
                  Do Kanban ao dashboard de projetos, passando por gestão de equipas e prazos — sem precisar de 5 ferramentas diferentes.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: 'Quadros Kanban',
                  description: 'Organize tarefas em colunas visuais por estado. Arraste e largue para atualizar — claro para toda a equipa.',
                  badge: 'Visual',
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Gestão de Equipas',
                  description: 'Atribua tarefas, defina responsáveis e acompanhe o progresso de cada membro em tempo real.',
                  badge: 'Colaboração',
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: 'Prazos & Milestones',
                  description: 'Defina datas-limite e marcos importantes. Nunca mais perca um prazo crítico.',
                  badge: 'Planeamento',
                },
                {
                  icon: <LayoutDashboard className="w-6 h-6" />,
                  title: 'Dashboard de Projetos',
                  description: 'Visão geral de todos os projetos ativos e métricas de progresso num único ecrã.',
                  badge: 'Visibilidade',
                },
              ].map((feature, index) => (
                <Reveal key={feature.title} delay={index * 100} direction={index % 2 === 0 ? 'left' : 'right'}>
                  <div className="group relative p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                        {feature.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/30 text-xs">{feature.badge}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed">{feature.description}</p>
                    <div className="absolute top-6 right-20 text-white/10 text-4xl font-serif font-bold select-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── DASHBOARD MOCKUP SECTION ───────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text */}
              <div>
                <Reveal>
                  <span className="text-violet-400/70 text-xs tracking-[0.3em] uppercase">Dashboard</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    Todos os projetos.<br />Uma visão clara.
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">
                    Acompanhe o estado real de cada projeto sem precisar de perguntar à equipa. KPIs, progresso e alertas de atraso — tudo num único dashboard.
                  </p>
                </Reveal>
                <div className="space-y-3">
                  {[
                    { icon: <Target className="w-4 h-4" />, text: 'Progresso por projeto em tempo real' },
                    { icon: <Clock className="w-4 h-4" />, text: 'Alertas automáticos de tarefas em atraso' },
                    { icon: <Users className="w-4 h-4" />, text: 'Carga de trabalho por membro da equipa' },
                    { icon: <LayoutDashboard className="w-4 h-4" />, text: 'Métricas de sprint e velocity' },
                  ].map((item, i) => (
                    <Reveal key={item.text} delay={300 + i * 60}>
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <div className="text-violet-400/70">{item.icon}</div>
                        {item.text}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Dashboard mockup */}
              <Reveal delay={150} direction="left">
                <DashboardMockup />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── PARA QUEM É ─────────────────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                Para equipas que
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-16" style={{ fontFamily: 'var(--font-serif)', WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>
                entregam resultados.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  number: '01',
                  title: 'Equipas de Produto',
                  items: ['Sprints e backlogs', 'Roadmaps de produto', 'Tracking de features'],
                },
                {
                  number: '02',
                  title: 'Equipas de Engenharia',
                  items: ['Gestão de bugs e issues', 'Code reviews como tarefas', 'CI/CD tracking'],
                },
                {
                  number: '03',
                  title: 'Gestores de Projeto',
                  items: ['Visão cross-equipa', 'Relatórios para stakeholders', 'Gestão de prazos'],
                },
              ].map((card, i) => (
                <Reveal key={card.title} delay={i * 100}>
                  <div className="group p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-500 h-full">
                    <div className="text-white/10 text-5xl font-serif font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>{card.number}</div>
                    <h3 className="text-white text-lg font-serif font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>{card.title}</h3>
                    <ul className="space-y-2">
                      {card.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-white/40 text-sm">
                          <ArrowRight className="w-3 h-3 text-white/20 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ──────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48 border-t border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <h2 className="font-serif font-bold text-white leading-none mb-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 10vw, 9rem)' }}>
                Organize a
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-serif font-bold leading-none mb-10" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 10vw, 9rem)', WebkitTextStroke: '1.5px rgba(255,255,255,0.4)', color: 'transparent' }}>
                equipa.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-white/40 text-base md:text-lg max-w-md mx-auto mb-12">
                Experimente gratuitamente. Sem cartão de crédito, sem compromissos.
              </p>
            </Reveal>
            <Reveal delay={350}>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all">
                  Experimentar Agora
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </MagneticButton>
              </a>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/" className="text-2xl font-serif font-bold text-white hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-serif)' }}>FRPC</a>
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} FRPC. Todos os direitos reservados.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">Voltar ao topo ↑</button>
          </div>
        </footer>
      </main>
    </>
  )
}
