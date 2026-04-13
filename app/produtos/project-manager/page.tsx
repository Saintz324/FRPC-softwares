"use client"

import { useEffect, useState, memo } from 'react'
import { ArrowRight, ExternalLink, Layers, Users, Clock, LayoutDashboard, CheckCircle, Target, Zap, Shield } from 'lucide-react'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { ProductNav } from '@/components/product-nav'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { TextSplit } from '@/components/text-split'
import { useLanguage } from '@/components/language-provider'

const APP_URL = 'https://frpc-project-production.up.railway.app/login.html'

const TRANSLATIONS = {
  pt: {
    badge: 'Gestão de Projetos · SaaS',
    subtitle: 'Organize projetos, tarefas e equipas. Entregue mais rápido, com menos stress.',
    tryBtn: 'Experimentar',
    seeFeaturesBtn: 'Ver funcionalidades',
    noCard: 'Sem cartão de crédito',
    setup: 'Setup em 2 minutos',
    stats: [
      { value: '∞', label: 'Projetos' },
      { value: '∞', label: 'Tarefas' },
      { value: '0', label: 'Reuniões de status' },
      { value: '100%', label: 'Visibilidade' },
    ],
    featuresLabel: 'Funcionalidades',
    featuresTitle1: 'Tudo o que precisa',
    featuresTitle2: 'numa só ferramenta.',
    featuresDesc: 'Do Kanban ao dashboard de projetos, passando por gestão de equipas e prazos — sem precisar de 5 ferramentas diferentes.',
    features: [
      { title: 'Quadros Kanban', description: 'Organize tarefas em colunas visuais por estado. Arraste e largue para atualizar — claro para toda a equipa.', badge: 'Visual' },
      { title: 'Gestão de Equipas', description: 'Atribua tarefas, defina responsáveis e acompanhe o progresso de cada membro em tempo real.', badge: 'Colaboração' },
      { title: 'Prazos & Milestones', description: 'Defina datas-limite e marcos importantes. Nunca mais perca um prazo crítico.', badge: 'Planeamento' },
      { title: 'Dashboard de Projetos', description: 'Visão geral de todos os projetos ativos e métricas de progresso num único ecrã.', badge: 'Visibilidade' },
    ],
    dashboardLabel: 'Dashboard',
    dashboardTitle1: 'Todos os projetos.',
    dashboardTitle2: 'Uma visão clara.',
    dashboardDesc: 'Acompanhe o estado real de cada projeto sem precisar de perguntar à equipa. KPIs, progresso e alertas de atraso — tudo num único dashboard.',
    dashboardItems: [
      'Progresso por projeto em tempo real',
      'Alertas automáticos de tarefas em atraso',
      'Carga de trabalho por membro da equipa',
      'Métricas de sprint e velocity',
    ],
    forTeamsTitle1: 'Para equipas que',
    forTeamsTitle2: 'entregam resultados.',
    teams: [
      { number: '01', title: 'Equipas de Produto', items: ['Sprints e backlogs', 'Roadmaps de produto', 'Tracking de features'] },
      { number: '02', title: 'Equipas de Engenharia', items: ['Gestão de bugs e issues', 'Code reviews como tarefas', 'CI/CD tracking'] },
      { number: '03', title: 'Gestores de Projeto', items: ['Visão cross-equipa', 'Relatórios para stakeholders', 'Gestão de prazos'] },
    ],
    ctaTitle1: 'Organize a',
    ctaTitle2: 'equipa.',
    ctaDesc: 'Experimente agora.',
    ctaBtn: 'Experimentar Agora',
    tryLabel: 'Experimentar Agora',
    footerRights: 'Todos os direitos reservados.',
    backToTop: 'Voltar ao topo ↑',
    // Mockup
    kanbanColumns: ['A Fazer', 'Em Progresso', 'Concluído'],
    kanbanDotColors: ['bg-white/30', 'bg-amber-400', 'bg-emerald-400'],
    kanbanTextColors: ['text-white/50', 'text-amber-400', 'text-emerald-400'],
    kanbanCards: [
      [
        { title: 'Redesign da página de login', tag: 'Design', assignee: 'AN', priority: 'high' },
        { title: 'Integração com API de pagamentos', tag: 'Backend', assignee: 'JM', priority: 'medium' },
      ],
      [
        { title: 'Dashboard de analytics', tag: 'Frontend', assignee: 'MC', priority: 'high' },
        { title: 'Testes de performance', tag: 'QA', assignee: 'PN', priority: 'low' },
      ],
      [
        { title: 'Setup do CI/CD pipeline', tag: 'DevOps', assignee: 'RF', priority: 'medium' },
      ],
    ],
    priorityLabels: { high: 'Alta', medium: 'Média', low: 'Baixa' },
    addCard: '+ Adicionar',
    kpis: [
      { label: 'Projetos Ativos', value: '4', trend: '+1' },
      { label: 'Tarefas em Atraso', value: '2', trend: '-3' },
      { label: 'Concluídas Hoje', value: '7', trend: '+7' },
    ],
    projectsLabel: 'Projetos',
    tasksLabel: 'tarefas',
  },
  en: {
    badge: 'Project Management · SaaS',
    subtitle: 'Organize projects, tasks and teams. Ship faster, with less stress.',
    tryBtn: 'Try it',
    seeFeaturesBtn: 'See features',
    noCard: 'No credit card required',
    setup: '2 minute setup',
    stats: [
      { value: '∞', label: 'Projects' },
      { value: '∞', label: 'Tasks' },
      { value: '0', label: 'Status meetings' },
      { value: '100%', label: 'Visibility' },
    ],
    featuresLabel: 'Features',
    featuresTitle1: 'Everything you need',
    featuresTitle2: 'in one tool.',
    featuresDesc: 'From Kanban to project dashboards, team management and deadlines — without needing 5 different tools.',
    features: [
      { title: 'Kanban Boards', description: 'Organize tasks in visual columns by status. Drag and drop to update — clear for the whole team.', badge: 'Visual' },
      { title: 'Team Management', description: "Assign tasks, set owners and track each member's progress in real time.", badge: 'Collaboration' },
      { title: 'Deadlines & Milestones', description: 'Set due dates and key milestones. Never miss a critical deadline again.', badge: 'Planning' },
      { title: 'Project Dashboard', description: 'Overview of all active projects and progress metrics in a single screen.', badge: 'Visibility' },
    ],
    dashboardLabel: 'Dashboard',
    dashboardTitle1: 'All projects.',
    dashboardTitle2: 'One clear view.',
    dashboardDesc: 'Track the real status of every project without asking the team. KPIs, progress and overdue alerts — all in one dashboard.',
    dashboardItems: [
      'Real-time progress per project',
      'Automatic overdue task alerts',
      'Workload per team member',
      'Sprint and velocity metrics',
    ],
    forTeamsTitle1: 'For teams that',
    forTeamsTitle2: 'deliver results.',
    teams: [
      { number: '01', title: 'Product Teams', items: ['Sprints and backlogs', 'Product roadmaps', 'Feature tracking'] },
      { number: '02', title: 'Engineering Teams', items: ['Bug and issue management', 'Code reviews as tasks', 'CI/CD tracking'] },
      { number: '03', title: 'Project Managers', items: ['Cross-team visibility', 'Stakeholder reports', 'Deadline management'] },
    ],
    ctaTitle1: 'Organize your',
    ctaTitle2: 'team.',
    ctaDesc: 'Try it for free. No credit card, no commitments.',
    ctaBtn: 'Try Now',
    tryLabel: 'Try Now',
    footerRights: 'All rights reserved.',
    backToTop: 'Back to top ↑',
    // Mockup
    kanbanColumns: ['To Do', 'In Progress', 'Done'],
    kanbanDotColors: ['bg-white/30', 'bg-amber-400', 'bg-emerald-400'],
    kanbanTextColors: ['text-white/50', 'text-amber-400', 'text-emerald-400'],
    kanbanCards: [
      [
        { title: 'Login page redesign', tag: 'Design', assignee: 'AN', priority: 'high' },
        { title: 'Payment API integration', tag: 'Backend', assignee: 'JM', priority: 'medium' },
      ],
      [
        { title: 'Analytics dashboard', tag: 'Frontend', assignee: 'MC', priority: 'high' },
        { title: 'Performance testing', tag: 'QA', assignee: 'PN', priority: 'low' },
      ],
      [
        { title: 'CI/CD pipeline setup', tag: 'DevOps', assignee: 'RF', priority: 'medium' },
      ],
    ],
    priorityLabels: { high: 'High', medium: 'Med', low: 'Low' },
    addCard: '+ Add',
    kpis: [
      { label: 'Active Projects', value: '4', trend: '+1' },
      { label: 'Overdue Tasks', value: '2', trend: '-3' },
      { label: 'Done Today', value: '7', trend: '+7' },
    ],
    projectsLabel: 'Projects',
    tasksLabel: 'tasks',
  },
}

/* ─── Kanban Board Mockup ────────────────────────────────────────────── */
const KanbanMockup = memo(function KanbanMockup() {
  const { lang } = useLanguage()
  const t = TRANSLATIONS[lang]

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-emerald-500/20 text-emerald-400',
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
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
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: '62%' }} />
          </div>
          <span className="text-white/30 text-xs">62%</span>
        </div>
      </div>
      <div className="bg-[#0f0f1a] px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {t.kanbanColumns.map((colTitle, ci) => (
            <div key={colTitle}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${t.kanbanDotColors[ci]}`} />
                <span className={`text-xs font-medium ${t.kanbanTextColors[ci]}`}>{colTitle}</span>
                <span className="text-white/20 text-xs ml-auto">{t.kanbanCards[ci].length}</span>
              </div>
              <div className="space-y-2">
                {t.kanbanCards[ci].map(card => (
                  <div key={card.title} className="p-2.5 rounded-lg bg-white/5 border border-white/[0.06] hover:border-white/10 transition-colors">
                    <p className="text-white/80 text-xs leading-snug mb-2">{card.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/30">{card.tag}</span>
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${priorityColors[card.priority]}`}>
                          {t.priorityLabels[card.priority as keyof typeof t.priorityLabels]}
                        </span>
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white/50 text-[9px] font-bold">
                          {card.assignee[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-2 rounded-lg border border-dashed border-white/10 text-white/20 text-xs text-center hover:border-white/20 transition-colors cursor-pointer">
                  {t.addCard}
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
  const { lang } = useLanguage()
  const t = TRANSLATIONS[lang]
  const projects = [
    { name: 'Website Redesign', progress: 78, status: 'bg-emerald-400' },
    { name: 'App Mobile', progress: 45, status: 'bg-amber-400' },
    { name: 'API v2', progress: 91, status: 'bg-blue-400' },
    { name: 'Data Migration', progress: 22, status: 'bg-violet-400' },
  ]
  const taskCounts = [12, 8, 6, 15]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
      <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono">{t.dashboardLabel}</div>
      </div>
      <div className="bg-[#0f0f1a] p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {t.kpis.map(kpi => (
            <div key={kpi.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-white/40 text-xs mb-1">{kpi.label}</div>
              <div className="flex items-end justify-between">
                <span className="text-white/90 text-xl font-bold">{kpi.value}</span>
                <span className={`text-xs ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.trend}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-2">{t.projectsLabel}</p>
          {projects.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors">
              <div className={`w-2 h-2 rounded-full ${p.status} shrink-0`} />
              <span className="text-white/70 text-xs flex-1 truncate">{p.name}</span>
              <span className="text-white/30 text-xs">{taskCounts[i]} {t.tasksLabel}</span>
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
  const { lang } = useLanguage()
  const t = TRANSLATIONS[lang]

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div className="hidden md:block"><CursorFollower /></div>
      <SplineBackground />
      <ProductNav externalUrl={APP_URL} tryLabel={t.tryLabel} />

      <main className="relative z-10">

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 pt-24 pb-0 text-center">
          <div className="max-w-5xl w-full mx-auto">
            <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs tracking-widest uppercase">
                <Layers className="w-3 h-3" />
                {t.badge}
              </span>
            </div>

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
              {t.subtitle}
            </p>

            <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                className="group px-8 py-4 bg-white text-black text-sm font-medium rounded-full flex items-center gap-3 hover:bg-white/90 transition-colors"
              >
                {t.tryBtn}
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#features"
                className="px-8 py-4 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
              >
                {t.seeFeaturesBtn}
              </a>
            </div>

            <div className={`mt-8 flex items-center justify-center gap-6 transition-all duration-700 delay-[900ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <span className="flex items-center gap-2 text-white/30 text-xs">
                <Shield className="w-3.5 h-3.5" /> {t.noCard}
              </span>
              <div className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-2 text-white/30 text-xs">
                <Zap className="w-3.5 h-3.5" /> {t.setup}
              </span>
            </div>
          </div>

          <div className={`mt-16 w-full max-w-6xl mx-auto transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <KanbanMockup />
          </div>
        </section>

        {/* ─── STATS BAR ───────────────────────────────────────────── */}
        <section className="relative py-20 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {t.stats.map((s, i) => (
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

        {/* ─── FEATURES GRID ───────────────────────────────────────── */}
        <section id="features" className="relative py-32 md:py-48">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div>
                <Reveal>
                  <span className="text-white/40 text-xs tracking-[0.3em] uppercase">{t.featuresLabel}</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    {t.featuresTitle1}<br />
                    <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>
                      {t.featuresTitle2}
                    </span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={200}>
                <p className="text-white/50 text-xl leading-relaxed">{t.featuresDesc}</p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 100} direction={index % 2 === 0 ? 'left' : 'right'}>
                  <div className="group relative p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                        {index === 0 ? <Layers className="w-6 h-6" /> : index === 1 ? <Users className="w-6 h-6" /> : index === 2 ? <Clock className="w-6 h-6" /> : <LayoutDashboard className="w-6 h-6" />}
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

        {/* ─── DASHBOARD MOCKUP SECTION ────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <Reveal>
                  <span className="text-violet-400/70 text-xs tracking-[0.3em] uppercase">{t.dashboardLabel}</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    {t.dashboardTitle1}<br />{t.dashboardTitle2}
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">{t.dashboardDesc}</p>
                </Reveal>
                <div className="space-y-3">
                  {t.dashboardItems.map((item, i) => (
                    <Reveal key={item} delay={300 + i * 60}>
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <div className="text-violet-400/70">
                          {i === 0 ? <Target className="w-4 h-4" /> : i === 1 ? <Clock className="w-4 h-4" /> : i === 2 ? <Users className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                        </div>
                        {item}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
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
                {t.forTeamsTitle1}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-16" style={{ fontFamily: 'var(--font-serif)', WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>
                {t.forTeamsTitle2}
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.teams.map((card, i) => (
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

        {/* ─── FINAL CTA ───────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48 border-t border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <h2 className="font-serif font-bold text-white leading-none mb-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 10vw, 9rem)' }}>
                {t.ctaTitle1}
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-serif font-bold leading-none mb-10" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 10vw, 9rem)', WebkitTextStroke: '1.5px rgba(255,255,255,0.4)', color: 'transparent' }}>
                {t.ctaTitle2}
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-white/40 text-base md:text-lg max-w-md mx-auto mb-12">{t.ctaDesc}</p>
            </Reveal>
            <Reveal delay={350}>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all">
                  {t.ctaBtn}
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
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} FRPC. {t.footerRights}</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">{t.backToTop}</button>
          </div>
        </footer>
      </main>
    </>
  )
}
