"use client"

import { useEffect, useState, memo } from 'react'
import { ArrowRight, ExternalLink, Calendar, CheckCircle, BarChart2, Users, Bell, Shield } from 'lucide-react'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { ProductNav } from '@/components/product-nav'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { TextSplit } from '@/components/text-split'
import { useLanguage } from '@/components/language-provider'

const APP_URL = 'https://frpc-calendario-de-ferias-production.up.railway.app/login.html'

const TRANSLATIONS = {
  pt: {
    badge: 'Gestão de Férias · SaaS',
    heroLine1: 'CALENDÁRIO',
    heroLine2: 'DE FÉRIAS',
    subtitle: 'Elimine emails e folhas de cálculo. Centralize pedidos, aprovações e ausências da equipa numa plataforma simples e visual.',
    tryBtn: 'Experimentar',
    howItWorksBtn: 'Como funciona',
    noCard: 'Sem cartão de crédito',
    setup: 'Configuração em 2 min',
    stats: [
      { value: '∞', label: 'Utilizadores' },
      { value: '0', label: 'Emails de pedido' },
      { value: '2 min', label: 'Configuração' },
    ],
    howItWorksLabel: 'Como funciona',
    howItWorksTitle1: 'Simples do início',
    howItWorksTitle2: 'ao fim.',
    steps: [
      { number: '1', title: 'Crie a equipa', description: 'Adicione os membros da equipa em segundos. Defina departamentos e níveis de permissão de forma intuitiva.' },
      { number: '2', title: 'Peça férias', description: 'O colaborador submete o pedido com as datas pretendidas. O gestor recebe notificação instantânea para aprovação.' },
      { number: '3', title: 'Gerencie com clareza', description: 'Veja o calendário completo da equipa, aprove pedidos e exporte relatórios com um clique.' },
    ],
    feature1Label: 'Funcionalidade',
    feature1Title: 'Aprovações sem fricção.',
    feature1Desc: 'Chega de cadeias de emails intermináveis. Os pedidos de férias chegam diretamente ao gestor, que aprova ou rejeita com um clique — com notificação automática ao colaborador.',
    feature1Items: [
      'Notificações instantâneas por email',
      'Histórico completo de aprovações',
      'Aprovação em bulk para vários pedidos',
      'Comentários e justificações opcionais',
    ],
    feature2Label: 'Relatórios',
    feature2Title: 'Dados quando precisa.',
    feature2Desc: 'Aceda a relatórios detalhados por departamento, período ou colaborador. Exporte para CSV com um clique e integre com qualquer ferramenta de RH.',
    feature2Items: ['Relatórios por período', 'Por departamento', 'Exportação CSV / PDF', 'Saldos de férias'],
    forWhomTitle: 'Para quem é este produto?',
    forWhom: [
      { title: 'Gestores de Equipa', description: 'Visibilidade total das ausências sem precisar de perguntar a cada pessoa.' },
      { title: 'Recursos Humanos', description: 'Relatórios rápidos e precisos para planeamento e conformidade.' },
      { title: 'Colaboradores', description: 'Peça férias em segundos e acompanhe o estado do pedido em tempo real.' },
      { title: 'PMEs & Startups', description: 'Substituição imediata de emails e Excel sem curva de aprendizagem.' },
    ],
    ctaTitle: 'Comece hoje.',
    ctaDesc: 'Experimente gratuitamente. Sem cartão de crédito, sem compromissos.',
    ctaBtn: 'Experimentar Agora',
    tryLabel: 'Experimentar Agora',
    footerRights: 'Todos os direitos reservados.',
    backToTop: 'Voltar ao topo ↑',
    // Mockup
    days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    teamLabel: 'Equipa',
    requestsTitle: 'Pedidos de Férias',
    approved: 'Aprovado',
    reportTitle: 'Resumo de Ausências',
    exportBtn: 'Exportar CSV →',
    depts: ['Desenvolvimento', 'Design', 'Marketing', 'RH'],
  },
  en: {
    badge: 'Vacation Management · SaaS',
    heroLine1: 'VACATION',
    heroLine2: 'SCHEDULE',
    subtitle: 'Eliminate emails and spreadsheets. Centralize requests, approvals and team absences in a simple, visual platform.',
    tryBtn: 'Try it',
    howItWorksBtn: 'How it works',
    noCard: 'No credit card required',
    setup: '2 min setup',
    stats: [
      { value: '∞', label: 'Users' },
      { value: '0', label: 'Request emails' },
      { value: '2 min', label: 'Setup' },
    ],
    howItWorksLabel: 'How it works',
    howItWorksTitle1: 'Simple from start',
    howItWorksTitle2: 'to finish.',
    steps: [
      { number: '1', title: 'Create your team', description: 'Add team members in seconds. Set departments and permission levels intuitively.' },
      { number: '2', title: 'Request time off', description: 'Employees submit requests with their desired dates. Managers receive instant notifications for approval.' },
      { number: '3', title: 'Manage with clarity', description: 'View the full team calendar, approve requests and export reports with one click.' },
    ],
    feature1Label: 'Feature',
    feature1Title: 'Frictionless approvals.',
    feature1Desc: 'No more endless email chains. Vacation requests go straight to the manager, who approves or rejects with one click — with automatic notification to the employee.',
    feature1Items: [
      'Instant email notifications',
      'Full approval history',
      'Bulk approval for multiple requests',
      'Optional comments and justifications',
    ],
    feature2Label: 'Reports',
    feature2Title: 'Data when you need it.',
    feature2Desc: 'Access detailed reports by department, period or employee. Export to CSV with one click and integrate with any HR tool.',
    feature2Items: ['Reports by period', 'By department', 'CSV / PDF export', 'Vacation balances'],
    forWhomTitle: 'Who is this for?',
    forWhom: [
      { title: 'Team Managers', description: 'Full visibility of absences without having to ask each person.' },
      { title: 'Human Resources', description: 'Fast and accurate reports for planning and compliance.' },
      { title: 'Employees', description: 'Request time off in seconds and track your request status in real time.' },
      { title: 'SMEs & Startups', description: 'Immediate replacement for emails and Excel with no learning curve.' },
    ],
    ctaTitle: 'Start today.',
    ctaDesc: 'Try it for free. No credit card, no commitments.',
    ctaBtn: 'Try Now',
    tryLabel: 'Try Now',
    footerRights: 'All rights reserved.',
    backToTop: 'Back to top ↑',
    // Mockup
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    teamLabel: 'Team',
    requestsTitle: 'Vacation Requests',
    approved: 'Approved',
    reportTitle: 'Absence Summary',
    exportBtn: 'Export CSV →',
    depts: ['Development', 'Design', 'Marketing', 'HR'],
  },
}

/* ─── Browser Mockup ─────────────────────────────────────────────────── */
const CalendarMockup = memo(function CalendarMockup() {
  const { lang } = useLanguage()
  const t = TRANSLATIONS[lang]
  const team = [
    { name: 'João Silva', color: 'bg-blue-400', start: 0, span: 7 },
    { name: 'Maria Costa', color: 'bg-emerald-400', start: 3, span: 9 },
    { name: 'Ana Ferreira', color: 'bg-violet-400', start: 10, span: 5 },
    { name: 'Pedro Nunes', color: 'bg-amber-400', start: 1, span: 4 },
    { name: 'Rita Lopes', color: 'bg-rose-400', start: 8, span: 6 },
  ]
  const weeks = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
  ]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
      <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono truncate">
          frpc-calendario-de-ferias.app
        </div>
      </div>
      <div className="bg-[#0f0f1a] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-white/90 text-sm font-semibold">Calendário de Férias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">Junho 2026</div>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <Bell className="w-3 h-3 text-white/50" />
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/5">
            {t.days.map(d => (
              <div key={d} className="text-center py-2 text-white/30 text-xs">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-white/[0.04] last:border-0">
              {week.map(day => (
                <div key={day} className="text-center py-2.5 text-white/50 text-xs relative">
                  <span className={day === 10 ? 'w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto text-[10px]' : ''}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-white/30 text-xs mb-2 uppercase tracking-wider">{t.teamLabel}</p>
          {team.map(member => (
            <div key={member.name} className="flex items-center gap-2">
              <div className="w-20 shrink-0 text-white/50 text-xs truncate">{member.name.split(' ')[0]}</div>
              <div className="flex-1 relative h-5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 h-full rounded-full ${member.color} opacity-70`}
                  style={{
                    left: `${(member.start / 14) * 100}%`,
                    width: `${(member.span / 28) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

/* ─── Step card ──────────────────────────────────────────────────────── */
function StepCard({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all duration-500 group">
        <div className="text-6xl font-serif font-bold text-white/5 absolute top-6 right-8 select-none" style={{ fontFamily: 'var(--font-serif)' }}>
          {number}
        </div>
        <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center mb-6 font-bold text-sm">
          {number}
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
        <p className="text-white/50 leading-relaxed text-sm">{description}</p>
      </div>
    </Reveal>
  )
}

/* ─── Approval flow mockup ───────────────────────────────────────────── */
const ApprovalMockup = memo(function ApprovalMockup() {
  const { lang } = useLanguage()
  const t = TRANSLATIONS[lang]
  const requests = [
    { name: 'Ana Ferreira', period: '14–21 Jul', status: 'approved', avatar: 'AF' },
    { name: 'João Silva', period: '1–5 Ago', status: 'pending', avatar: 'JS' },
    { name: 'Pedro Nunes', period: '18–22 Ago', status: 'pending', avatar: 'PN' },
  ]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
      <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono">
          {t.requestsTitle}
        </div>
      </div>
      <div className="bg-[#0f0f1a] p-4 space-y-3">
        {requests.map(r => (
          <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold shrink-0">
              {r.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs font-medium">{r.name}</p>
              <p className="text-white/30 text-xs">{r.period}</p>
            </div>
            {r.status === 'approved' ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">{t.approved}</span>
            ) : (
              <div className="flex gap-1.5">
                <button className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-colors">✓</button>
                <button className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors">✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function CalendarioDeFeriasPage() {
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
        <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-24">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs tracking-widest uppercase mb-8">
                  <Calendar className="w-3 h-3" />
                  {t.badge}
                </span>
              </div>

              <div className={`transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <TextSplit
                  text={t.heroLine1}
                  className="font-serif font-bold text-white leading-none tracking-tight"
                  style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
                  delay={200}
                  stagger={0.04}
                />
                <TextSplit
                  text={t.heroLine2}
                  className="font-serif font-bold leading-none tracking-tight"
                  style={{
                    fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.4)',
                    WebkitTextFillColor: 'transparent',
                  }}
                  delay={400}
                  stagger={0.04}
                />
              </div>

              <p className={`text-white/60 text-lg md:text-xl max-w-lg mt-8 leading-relaxed transition-all duration-700 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {t.subtitle}
              </p>

              <div className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                  className="group px-8 py-4 bg-white text-black text-sm font-medium rounded-full flex items-center gap-3 hover:bg-white/90 transition-colors w-fit"
                >
                  {t.tryBtn}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a href="#como-funciona"
                  className="px-8 py-4 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/10 transition-colors w-fit"
                >
                  {t.howItWorksBtn}
                </a>
              </div>

              <div className={`mt-10 flex items-center gap-6 transition-all duration-700 delay-[900ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  {t.noCard}
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t.setup}
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <CalendarMockup />
            </div>
          </div>
        </section>

        {/* ─── STATS ───────────────────────────────────────────────── */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-3 gap-8 text-center">
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

        {/* ─── COMO FUNCIONA ───────────────────────────────────────── */}
        <section id="como-funciona" className="relative py-32 md:py-48">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 md:mb-20">
              <Reveal>
                <span className="text-white/40 text-xs tracking-[0.3em] uppercase">{t.howItWorksLabel}</span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  {t.howItWorksTitle1}<br />
                  <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>{t.howItWorksTitle2}</span>
                </h2>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.steps.map((step, i) => (
                <StepCard key={step.number} number={step.number} title={step.title} description={step.description} delay={i * 100} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURE 1: Aprovações ───────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <Reveal>
                  <span className="text-blue-400/70 text-xs tracking-[0.3em] uppercase">{t.feature1Label}</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    {t.feature1Title}
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">{t.feature1Desc}</p>
                </Reveal>
                <div className="space-y-4">
                  {t.feature1Items.map((item, i) => (
                    <Reveal key={item} delay={300 + i * 60}>
                      <div className="flex items-center gap-3 text-white/70 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        {item}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              <Reveal delay={200} direction="left">
                <ApprovalMockup />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── FEATURE 2: Relatórios ───────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <Reveal delay={100} direction="right">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                  <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono">{t.feature2Label}</div>
                  </div>
                  <div className="bg-[#0f0f1a] p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm font-semibold">{t.reportTitle}</span>
                      <span className="text-white/30 text-xs">Jul 2026</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: t.depts[0], days: 32, color: 'bg-blue-400' },
                        { name: t.depts[1], days: 18, color: 'bg-violet-400' },
                        { name: t.depts[2], days: 24, color: 'bg-emerald-400' },
                        { name: t.depts[3], days: 10, color: 'bg-amber-400' },
                      ].map(dept => (
                        <div key={dept.name} className="space-y-1">
                          <div className="flex justify-between text-xs text-white/50">
                            <span>{dept.name}</span>
                            <span>{dept.days} dias</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${dept.color} opacity-60`} style={{ width: `${(dept.days / 40) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <button className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 transition-colors">
                        {t.exportBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div>
                <Reveal>
                  <span className="text-blue-400/70 text-xs tracking-[0.3em] uppercase">{t.feature2Label}</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    {t.feature2Title}
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">{t.feature2Desc}</p>
                </Reveal>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <BarChart2 className="w-5 h-5" />, label: t.feature2Items[0] },
                    { icon: <Users className="w-5 h-5" />, label: t.feature2Items[1] },
                    { icon: <Calendar className="w-5 h-5" />, label: t.feature2Items[2] },
                    { icon: <CheckCircle className="w-5 h-5" />, label: t.feature2Items[3] },
                  ].map((item, i) => (
                    <Reveal key={item.label} delay={300 + i * 60}>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="text-white/40">{item.icon}</div>
                        <span className="text-white/70 text-xs">{item.label}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PARA QUEM É ─────────────────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white text-center mb-16 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                {t.forWhomTitle}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.forWhom.map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-white/70 group-hover:bg-white group-hover:text-black transition-all duration-500">
                      {i === 0 ? <Users className="w-6 h-6" /> : i === 1 ? <BarChart2 className="w-6 h-6" /> : i === 2 ? <CheckCircle className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                    </div>
                    <h3 className="text-white font-semibold mb-2 text-sm">{card.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{card.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ───────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="relative rounded-3xl bg-white/5 border border-white/10 p-12 md:p-20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5" />
              <Reveal>
                <h2 className="font-serif font-bold text-white leading-none mb-6 relative" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                  {t.ctaTitle}
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="text-white/50 text-lg max-w-md mx-auto mb-10 relative">{t.ctaDesc}</p>
              </Reveal>
              <Reveal delay={300}>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                  <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all relative">
                    {t.ctaBtn}
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </MagneticButton>
                </a>
              </Reveal>
            </div>
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
