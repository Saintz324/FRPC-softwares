"use client"

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Calendar, LayoutGrid, Kanban, Sparkles, CheckCircle, Loader2 } from 'lucide-react'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { useLang } from '@/components/language-provider'
import { ScrambleText } from '@/components/scramble-text'
import { SiteNav } from '@/components/site-nav'
import { SharedFooter } from '@/components/sections/footer'

// ─── Translations ──────────────────────────────────────────────────────────────
const T = {
  pt: {
    eyebrow: 'PROPOSTAS',
    title: 'Soluções digitais adaptadas à tua empresa',
    subtitle: 'Cada empresa trabalha de forma diferente. Diz-nos o que precisas e preparamos uma proposta ajustada ao teu processo, equipa e objetivos.',
    solutionsTitle: 'Escolhe o que precisas',
    solutions: [
      { key: 'calendario', title: 'Calendário de Férias', desc: 'Gestão de férias, ausências, aprovações e controlo interno.', accent: '#60a5fa' },
      { key: 'portal', title: 'Portal FRPC', desc: 'Acesso centralizado a ferramentas, documentos, pedidos e informação da empresa.', accent: '#a78bfa' },
      { key: 'processos', title: 'Gestor de Processos', desc: 'Organização de tarefas, estados, responsáveis, prazos e acompanhamento de processos.', accent: '#34d399' },
      { key: 'personalizada', title: 'Solução Personalizada', desc: 'Automações, dashboards, integrações, formulários internos ou ferramentas feitas à medida.', accent: '#fb923c' },
    ],
    ctaCard: 'Pedir proposta',
    formTitle: 'Pede a tua proposta',
    formSubtitle: 'Preenche os campos abaixo e enviamos uma resposta em 24–48 horas úteis.',
    labels: {
      nome: 'Nome',
      empresa: 'Empresa',
      email: 'Email',
      telefone: 'Telefone (opcional)',
      solucao: 'Solução pretendida',
      utilizadores: 'Número aproximado de utilizadores',
      mensagem: 'Descreve a tua necessidade',
    },
    solucaoOptions: ['Calendário de Férias', 'Portal Interno', 'Gestor de Processos', 'Automação ou Integração', 'Outro'],
    utilizadoresOptions: ['1–5', '6–15', '16–50', '51–100', 'Mais de 100'],
    submit: 'Pedir proposta',
    sending: 'A enviar...',
    successTitle: 'Proposta enviada!',
    successMsg: 'Recebemos o teu pedido. A nossa equipa irá analisar e enviar uma proposta personalizada em breve.',
    backToForm: 'Fazer outro pedido',
    faqTitle: 'Perguntas frequentes',
    faqs: [
      { q: 'Como é feito o orçamento?', a: 'Depois de recebermos o teu pedido, a nossa equipa analisa as necessidades e prepara uma proposta detalhada com estimativa de custo e prazo, adaptada ao teu projeto.' },
      { q: 'Tenho de saber exatamente o que preciso?', a: 'Não! Basta descrever o problema que queres resolver. Trabalhamos contigo para perceber os detalhes e sugerir a melhor solução.' },
      { q: 'Podem adaptar a solução ao meu processo?', a: 'Sim. Todas as soluções são desenvolvidas à medida do teu processo, equipa e ferramentas que já usas.' },
      { q: 'Quanto tempo demora a receber uma proposta?', a: 'Geralmente enviamos uma proposta inicial em 24 a 48 horas úteis após receber o teu pedido.' },
      { q: 'Qual é o investimento mínimo?', a: 'Não existe um mínimo fixo. O custo depende do âmbito, complexidade e prazo. Com a proposta, recebes uma estimativa clara e sem compromisso.' },
    ],
  },
  en: {
    eyebrow: 'PROPOSALS',
    title: 'Digital solutions tailored to your company',
    subtitle: "Every company works differently. Tell us what you need and we'll prepare a proposal aligned with your process, team and goals.",
    solutionsTitle: 'Choose what you need',
    solutions: [
      { key: 'calendario', title: 'Vacation Calendar', desc: 'Vacation management, absences, approvals and internal control.', accent: '#60a5fa' },
      { key: 'portal', title: 'FRPC Portal', desc: 'Centralised access to tools, documents, requests and company information.', accent: '#a78bfa' },
      { key: 'processos', title: 'Process Manager', desc: 'Task organisation, statuses, owners, deadlines and process tracking.', accent: '#34d399' },
      { key: 'personalizada', title: 'Custom Solution', desc: 'Automations, dashboards, integrations, internal forms or bespoke internal tools.', accent: '#fb923c' },
    ],
    ctaCard: 'Request proposal',
    formTitle: 'Request your proposal',
    formSubtitle: "Fill in the fields below and we'll get back to you within 24-48 working hours.",
    labels: {
      nome: 'Name',
      empresa: 'Company',
      email: 'Email',
      telefone: 'Phone (optional)',
      solucao: 'Desired solution',
      utilizadores: 'Approximate number of users',
      mensagem: 'Describe your need',
    },
    solucaoOptions: ['Vacation Calendar', 'Internal Portal', 'Process Manager', 'Automation or Integration', 'Other'],
    utilizadoresOptions: ['1–5', '6–15', '16–50', '51–100', 'More than 100'],
    submit: 'Request proposal',
    sending: 'Sending...',
    successTitle: 'Proposal sent!',
    successMsg: 'We received your request. Our team will review it and send a personalised proposal shortly.',
    backToForm: 'Make another request',
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'How is the quote calculated?', a: 'Once we receive your request, our team analyses your needs and prepares a detailed proposal with cost and timeline estimates, tailored to your project.' },
      { q: 'Do I need to know exactly what I need?', a: "No! Just describe the problem you want to solve. We'll work with you to understand the details and suggest the best solution." },
      { q: 'Can you adapt the solution to my process?', a: 'Yes. All solutions are built to fit your process, team and the tools you already use.' },
      { q: 'How long does it take to receive a proposal?', a: 'We typically send an initial proposal within 24 to 48 working hours of receiving your request.' },
      { q: 'Is there a minimum investment?', a: "There's no fixed minimum. The cost depends on scope, complexity and timeline. The proposal gives you a clear estimate with no commitment." },
    ],
  },
}

type Lang = 'pt' | 'en'

const SOLUTION_ICONS: Record<string, React.ReactNode> = {
  calendario: <Calendar size={20} />,
  portal: <LayoutGrid size={20} />,
  processos: <Kanban size={20} />,
  personalizada: <Sparkles size={20} />,
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PropostasPage() {
  const { lang } = useLang()
  const t = T[lang as Lang]
  const formRef = useRef<HTMLElement>(null)

  const [selectedSolution, setSelectedSolution] = useState('')
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [utilizadores, setUtilizadores] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => { setIsVisible(true) }, [])

  function pickSolution(key: string) {
    const sol = t.solutions.find(s => s.key === key)
    if (sol) setSelectedSolution(sol.title)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSolution) return
    setSending(true)
    try {
      await fetch('/api/proposta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, empresa, email, telefone, solucao: selectedSolution, utilizadores, mensagem }),
      })
      setSuccess(true)
    } finally {
      setSending(false)
    }
  }

  const vis = (delay = '') => ({
    style: delay ? { transitionDelay: delay } : undefined,
    className: `transition-[opacity,transform] duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`,
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', color: 'var(--ink)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />

      <SiteNav />

      <main className="relative z-10">

        {/* ── HERO ── */}
        <section className="relative px-6 md:px-12 pt-40 pb-20">
          <div className="max-w-5xl mx-auto">
            <div {...vis('0ms')}>
              <ScrambleText text={t.eyebrow} className="text-white/35 text-xs tracking-[0.3em] uppercase" />
            </div>
            <div {...vis('80ms')} className="mt-5">
              <h1 className="font-serif font-bold text-white leading-[1.05]" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}>
                {t.title}
              </h1>
            </div>
            <p {...vis('160ms')} className="text-white/45 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </section>

        {/* ── SOLUTION CARDS ── */}
        <section className="relative px-6 md:px-12 pb-24">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <p className="text-white/35 text-xs tracking-[0.25em] uppercase mb-8">{t.solutionsTitle}</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.solutions.map((sol, i) => (
                <Reveal key={sol.key} delay={i * 60}>
                  <div
                    className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 p-6 flex flex-col gap-4"
                  >
                    {/* top bar accent */}
                    <div className="absolute top-0 left-6 right-6 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${sol.accent}60, transparent)` }} />
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300" style={{ background: sol.accent + '1a', border: `1px solid ${sol.accent}28`, color: sol.accent }}>
                        {SOLUTION_ICONS[sol.key]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base mb-1">{sol.title}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">{sol.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => pickSolution(sol.key)}
                      className="self-start inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 group/btn"
                      style={{ color: sol.accent }}
                    >
                      {t.ctaCard}
                      <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM ── */}
        <section ref={formRef} className="relative px-6 md:px-12 pb-32" style={{ scrollMarginTop: '100px' }}>
          <div className="max-w-2xl mx-auto">
            <Reveal>
              <div className="mb-10">
                <h2 className="font-serif font-bold text-white mb-3" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
                  {t.formTitle}
                </h2>
                <p className="text-white/40 text-base leading-relaxed">{t.formSubtitle}</p>
              </div>
            </Reveal>

            {success ? (
              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="font-serif font-bold text-white text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>{t.successTitle}</h3>
                  <p className="text-white/45 text-base leading-relaxed max-w-sm">{t.successMsg}</p>
                  <button
                    onClick={() => { setSuccess(false); setNome(''); setEmpresa(''); setEmail(''); setTelefone(''); setSelectedSolution(''); setUtilizadores(''); setMensagem('') }}
                    className="mt-2 text-white/40 hover:text-white text-sm transition-colors duration-200"
                  >
                    {t.backToForm}
                  </button>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row: Nome + Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t.labels.nome} value={nome} onChange={setNome} required />
                    <FormField label={t.labels.empresa} value={empresa} onChange={setEmpresa} required />
                  </div>

                  {/* Row: Email + Telefone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t.labels.email} type="email" value={email} onChange={setEmail} required />
                    <FormField label={t.labels.telefone} type="tel" value={telefone} onChange={setTelefone} />
                  </div>

                  {/* Solução — visual grid */}
                  <SolutionGrid
                    solutions={t.solutions}
                    selected={selectedSolution}
                    onSelect={(title) => setSelectedSolution(title)}
                  />

                  {/* Utilizadores */}
                  <SelectField
                    label={t.labels.utilizadores}
                    value={utilizadores}
                    onChange={setUtilizadores}
                    options={t.utilizadoresOptions}
                    required
                  />

                  {/* Mensagem */}
                  <TextareaField
                    label={t.labels.mensagem}
                    value={mensagem}
                    onChange={setMensagem}
                    required
                  />

                  <div className="pt-2">
                    <MagneticButton
                      type="submit"
                      disabled={sending}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />{t.sending}</>
                      ) : (
                        <>{t.submit}<ArrowRight className="w-4 h-4" /></>
                      )}
                    </MagneticButton>
                  </div>
                </form>
              </Reveal>
            )}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="relative py-24 border-t border-white/[0.06] px-6 md:px-12">
          <div className="max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-serif font-bold text-white mb-10" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>
                {t.faqTitle}
              </h2>
            </Reveal>
            <div className="space-y-2">
              {t.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="border border-white/[0.07] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-colors duration-200"
                    >
                      <span className="text-white/80 font-medium text-sm md:text-base pr-4">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ease-out ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}>
                      <p className="px-6 pb-5 text-white/45 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <SharedFooter />
      </main>
    </div>
  )
}

// ─── Solution grid for form ───────────────────────────────────────────────────

function SolutionGrid({ solutions, selected, onSelect }: {
  solutions: { key: string; title: string; accent: string }[]
  selected: string
  onSelect: (title: string) => void
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
        Solução pretendida
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {solutions.map(sol => {
          const isSelected = selected === sol.title
          return (
            <button
              key={sol.key}
              type="button"
              onClick={() => onSelect(sol.title)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 14,
                border: `1px solid ${isSelected ? sol.accent + '60' : 'rgba(255,255,255,0.08)'}`,
                background: isSelected ? sol.accent + '14' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.18s',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: isSelected ? sol.accent + '22' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isSelected ? sol.accent + '40' : 'rgba(255,255,255,0.1)'}`,
                color: isSelected ? sol.accent : 'rgba(255,255,255,0.4)',
              }}>
                {SOLUTION_ICONS[sol.key]}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
                {sol.title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Form sub-components ───────────────────────────────────────────────────────

function FormField({ label, type = 'text', value, onChange, required }: {
  label: string; type?: string; value: string
  onChange: (v: string) => void; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div
      className="relative rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(255,255,255,0.3)' : active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <label
        className="absolute left-4 pointer-events-none transition-all duration-200 font-medium"
        style={{
          top: active ? '8px' : '50%',
          transform: active ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: active ? '10px' : '14px',
          color: active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.3)',
          letterSpacing: active ? '0.06em' : 'normal',
          textTransform: active ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-white outline-none text-sm"
        style={{ paddingTop: active ? '22px' : '14px', paddingBottom: active ? '8px' : '14px', paddingLeft: '16px', paddingRight: '16px' }}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void
  options: string[]; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div
      className="relative rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(255,255,255,0.3)' : active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <label
        className="absolute left-4 pointer-events-none transition-all duration-200 font-medium z-10"
        style={{
          top: active ? '8px' : '50%',
          transform: active ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: active ? '10px' : '14px',
          color: active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.3)',
          letterSpacing: active ? '0.06em' : 'normal',
          textTransform: active ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-white outline-none text-sm appearance-none"
        style={{
          paddingTop: active ? '22px' : '14px',
          paddingBottom: active ? '8px' : '14px',
          paddingLeft: '16px',
          paddingRight: '40px',
          color: value ? 'rgba(255,255,255,0.9)' : 'transparent',
        }}
      >
        <option value="" disabled style={{ background: '#0a0a0a' }} />
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: '#0a0a0a', color: 'white' }}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
    </div>
  )
}

function TextareaField({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div
      className="relative rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(255,255,255,0.3)' : active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <label
        className="absolute left-4 pointer-events-none transition-all duration-200 font-medium"
        style={{
          top: active ? '12px' : '20px',
          fontSize: active ? '10px' : '14px',
          color: active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.3)',
          letterSpacing: active ? '0.06em' : 'normal',
          textTransform: active ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        className="w-full bg-transparent text-white outline-none text-sm resize-none"
        style={{ paddingTop: active ? '28px' : '18px', paddingBottom: '14px', paddingLeft: '16px', paddingRight: '16px' }}
      />
    </div>
  )
}
