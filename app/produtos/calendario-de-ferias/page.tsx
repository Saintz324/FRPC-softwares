"use client"

import { useEffect, useState, memo } from 'react'
import { ArrowRight, ExternalLink, Calendar, CheckCircle, BarChart2, Users, Bell, Shield } from 'lucide-react'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { ProductNav } from '@/components/product-nav'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { TextSplit } from '@/components/text-split'

const APP_URL = 'https://frpc-calendario-de-ferias-production.up.railway.app/login.html'

/* ─── Browser Mockup ─────────────────────────────────────────────────── */
const CalendarMockup = memo(function CalendarMockup() {
  const team = [
    { name: 'João Silva', color: 'bg-blue-400', start: 0, span: 7 },
    { name: 'Maria Costa', color: 'bg-emerald-400', start: 3, span: 9 },
    { name: 'Ana Ferreira', color: 'bg-violet-400', start: 10, span: 5 },
    { name: 'Pedro Nunes', color: 'bg-amber-400', start: 1, span: 4 },
    { name: 'Rita Lopes', color: 'bg-rose-400', start: 8, span: 6 },
  ]
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const weeks = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
  ]

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
          frpc-calendario-de-ferias.app
        </div>
      </div>

      {/* App UI */}
      <div className="bg-[#0f0f1a] p-4">
        {/* App header */}
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

        {/* Calendar grid */}
        <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/5">
            {days.map(d => (
              <div key={d} className="text-center py-2 text-white/30 text-xs">{d}</div>
            ))}
          </div>
          {/* Weeks */}
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

        {/* Team absence bars */}
        <div className="mt-4 space-y-2">
          <p className="text-white/30 text-xs mb-2 uppercase tracking-wider">Equipa</p>
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
          Pedidos de Férias
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
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Aprovado</span>
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

        {/* ─── HERO: split left/right ──────────────────────────────── */}
        <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-24">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <div>
              <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs tracking-widest uppercase mb-8">
                  <Calendar className="w-3 h-3" />
                  Gestão de Férias · SaaS
                </span>
              </div>

              <div className={`transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <TextSplit
                  text="CALENDÁRIO"
                  className="font-serif font-bold text-white leading-none tracking-tight"
                  style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
                  delay={200}
                  stagger={0.04}
                />
                <TextSplit
                  text="DE FÉRIAS"
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
                Elimine emails e folhas de cálculo. Centralize pedidos, aprovações e ausências da equipa numa plataforma simples e visual.
              </p>

              <div className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                  className="group px-8 py-4 bg-white text-black text-sm font-medium rounded-full flex items-center gap-3 hover:bg-white/90 transition-colors w-fit"
                >
                  Experimentar Grátis
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a href="#como-funciona"
                  className="px-8 py-4 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/10 transition-colors w-fit"
                >
                  Como funciona
                </a>
              </div>

              {/* Trust signals */}
              <div className={`mt-10 flex items-center gap-6 transition-all duration-700 delay-[900ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  Sem cartão de crédito
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Configuração em 2 min
                </div>
              </div>
            </div>

            {/* Right — mockup */}
            <div className={`transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <CalendarMockup />
            </div>
          </div>
        </section>

        {/* ─── STATS ──────────────────────────────────────────────── */}
        <section className="relative py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '∞', label: 'Utilizadores' },
                { value: '0', label: 'Emails de pedido' },
                { value: '2 min', label: 'Configuração' },
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

        {/* ─── COMO FUNCIONA ──────────────────────────────────────── */}
        <section id="como-funciona" className="relative py-32 md:py-48">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 md:mb-20">
              <Reveal>
                <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Como funciona</span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  Simples do início<br />
                  <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>ao fim.</span>
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard number="1" title="Crie a equipa" description="Adicione os membros da equipa em segundos. Defina departamentos e níveis de permissão de forma intuitiva." delay={0} />
              <StepCard number="2" title="Peça férias" description="O colaborador submete o pedido com as datas pretendidas. O gestor recebe notificação instantânea para aprovação." delay={100} />
              <StepCard number="3" title="Gerencie com clareza" description="Veja o calendário completo da equipa, aprove pedidos e exporte relatórios com um clique." delay={200} />
            </div>
          </div>
        </section>

        {/* ─── FEATURE 1: Aprovações (text left, mockup right) ────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <Reveal>
                  <span className="text-blue-400/70 text-xs tracking-[0.3em] uppercase">Funcionalidade</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    Aprovações sem fricção.
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">
                    Chega de cadeias de emails intermináveis. Os pedidos de férias chegam diretamente ao gestor, que aprova ou rejeita com um clique — com notificação automática ao colaborador.
                  </p>
                </Reveal>
                <div className="space-y-4">
                  {[
                    'Notificações instantâneas por email',
                    'Histórico completo de aprovações',
                    'Aprovação em bulk para vários pedidos',
                    'Comentários e justificações opcionais',
                  ].map((item, i) => (
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

        {/* ─── FEATURE 2: Relatórios (mockup left, text right) ────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Mockup left */}
              <Reveal delay={100} direction="right">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                  <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/30 text-xs font-mono">Relatórios</div>
                  </div>
                  <div className="bg-[#0f0f1a] p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm font-semibold">Resumo de Ausências</span>
                      <span className="text-white/30 text-xs">Jul 2026</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Desenvolvimento', days: 32, color: 'bg-blue-400' },
                        { name: 'Design', days: 18, color: 'bg-violet-400' },
                        { name: 'Marketing', days: 24, color: 'bg-emerald-400' },
                        { name: 'RH', days: 10, color: 'bg-amber-400' },
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
                        Exportar CSV →
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Text right */}
              <div>
                <Reveal>
                  <span className="text-blue-400/70 text-xs tracking-[0.3em] uppercase">Relatórios</span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    Dados quando precisa.
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">
                    Aceda a relatórios detalhados por departamento, período ou colaborador. Exporte para CSV com um clique e integre com qualquer ferramenta de RH.
                  </p>
                </Reveal>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <BarChart2 className="w-5 h-5" />, label: 'Relatórios por período' },
                    { icon: <Users className="w-5 h-5" />, label: 'Por departamento' },
                    { icon: <Calendar className="w-5 h-5" />, label: 'Exportação CSV / PDF' },
                    { icon: <CheckCircle className="w-5 h-5" />, label: 'Saldos de férias' },
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

        {/* ─── PARA QUEM É ────────────────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white text-center mb-16 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                Para quem é este produto?
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Users className="w-6 h-6" />, title: 'Gestores de Equipa', description: 'Visibilidade total das ausências sem precisar de perguntar a cada pessoa.' },
                { icon: <BarChart2 className="w-6 h-6" />, title: 'Recursos Humanos', description: 'Relatórios rápidos e precisos para planeamento e conformidade.' },
                { icon: <CheckCircle className="w-6 h-6" />, title: 'Colaboradores', description: 'Peça férias em segundos e acompanhe o estado do pedido em tempo real.' },
                { icon: <Calendar className="w-6 h-6" />, title: 'PMEs & Startups', description: 'Substituição imediata de emails e Excel sem curva de aprendizagem.' },
              ].map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-white/70 group-hover:bg-white group-hover:text-black transition-all duration-500">
                      {card.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2 text-sm">{card.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{card.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ──────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="relative rounded-3xl bg-white/5 border border-white/10 p-12 md:p-20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5" />
              <Reveal>
                <h2 className="font-serif font-bold text-white leading-none mb-6 relative" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                  Comece hoje.
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="text-white/50 text-lg max-w-md mx-auto mb-10 relative">
                  Experimente gratuitamente. Sem cartão de crédito, sem compromissos.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                  <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all relative">
                    Experimentar Agora  
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
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} FRPC. Todos os direitos reservados.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">Voltar ao topo ↑</button>
          </div>
        </footer>
      </main>
    </>
  )
}
