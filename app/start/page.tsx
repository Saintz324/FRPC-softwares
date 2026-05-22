'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/components/language-provider'
import { SiteNav } from '@/components/site-nav'
import { SharedFooter } from '@/components/sections/footer'
import { ScrambleText } from '@/components/scramble-text'
import {
  Calendar, LayoutGrid, Kanban, Building2,
  ArrowRight, CheckCircle, Loader2, Sparkles, User, Mail, Phone, ChevronRight, ChevronDown
} from 'lucide-react'

// ─── Accent colour ────────────────────────────────────────────────────────────
const A = {
  solid: 'rgb(251,191,36)',
  a90:  'rgba(245,158,11,0.9)',
  a80:  'rgba(245,158,11,0.8)',
  a70:  'rgba(245,158,11,0.7)',
  a60:  'rgba(245,158,11,0.6)',
  a40:  'rgba(245,158,11,0.4)',
  a30:  'rgba(245,158,11,0.3)',
  a20:  'rgba(245,158,11,0.2)',
  a15:  'rgba(245,158,11,0.15)',
  a12:  'rgba(245,158,11,0.12)',
  a08:  'rgba(245,158,11,0.08)',
  grad: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Solution = {
  key: string
  labelPt: string
  labelEn: string
  icon: React.ReactNode
  accent: string
}

const SOLUTIONS: Solution[] = [
  { key: 'calendario',    labelPt: 'Calendário de Férias', labelEn: 'Vacation Calendar', icon: <Calendar size={20} />,   accent: '#60a5fa' },
  { key: 'portal',        labelPt: 'Portal FRPC',           labelEn: 'FRPC Portal',        icon: <LayoutGrid size={20} />, accent: '#a78bfa' },
  { key: 'processos',     labelPt: 'Gestor de Processos',   labelEn: 'Process Manager',    icon: <Kanban size={20} />,     accent: '#34d399' },
  { key: 'personalizada', labelPt: 'Solução Personalizada', labelEn: 'Custom Solution',    icon: <Sparkles size={20} />,   accent: '#fb923c' },
]

const DEADLINES_PT = ['< 2 semanas', '1 mês', '2-3 meses', '3-6 meses', 'Flexível']
const DEADLINES_EN = ['< 2 weeks', '1 month', '2-3 months', '3-6 months', 'Flexible']

const USERS_PT = ['1–5', '6–15', '16–50', '51–100', 'Mais de 100']
const USERS_EN = ['1–5', '6–15', '16–50', '51–100', 'More than 100']

// ─── Floating-label input ─────────────────────────────────────────────────────

function FloatingInput({
  id, label, type = 'text', value, onChange, required, icon, delay = 0
}: {
  id: string; label: string; type?: string; value: string
  onChange: (v: string) => void; required?: boolean
  icon?: React.ReactNode; delay?: number
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}>
      <div
        className="relative flex items-center rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? A.a70 : active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? `0 0 0 3px ${A.a12}` : 'none',
        }}
      >
        {icon && (
          <span
            className="absolute left-4 pointer-events-none transition-colors duration-200"
            style={{ color: focused ? A.a80 : 'rgba(255,255,255,0.25)' }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-white outline-none text-base"
          style={{
            paddingTop:    active ? '22px' : '15px',
            paddingBottom: active ? '8px'  : '15px',
            paddingLeft:   icon   ? '44px' : '16px',
            paddingRight:  '16px',
            transition: 'padding-top 0.2s, padding-bottom 0.2s',
          }}
          autoComplete="off"
        />
        <label
          htmlFor={id}
          className="absolute pointer-events-none transition-all duration-200 font-medium"
          style={{
            left: icon ? '44px' : '16px',
            top: active ? '8px' : '50%',
            transform: active ? 'none' : 'translateY(-50%)',
            fontSize: active ? '11px' : '15px',
            letterSpacing: active ? '0.06em' : '0',
            textTransform: active ? 'uppercase' : 'none',
            color: focused ? A.a90 : 'rgba(255,255,255,0.35)',
          }}
        >
          {label}
        </label>
      </div>
    </div>
  )
}

// ─── Floating-label select ────────────────────────────────────────────────────

function FloatingSelect({
  id, label, value, onChange, options, required, delay = 0
}: {
  id: string; label: string; value: string
  onChange: (v: string) => void; options: string[]; required?: boolean; delay?: number
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}>
      <div
        className="relative rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? A.a70 : active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? `0 0 0 3px ${A.a12}` : 'none',
        }}
      >
        <select
          id={id}
          value={value}
          required={required}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-white outline-none text-base appearance-none"
          style={{
            paddingTop: active ? '22px' : '15px',
            paddingBottom: active ? '8px' : '15px',
            paddingLeft: '16px',
            paddingRight: '40px',
            color: value ? 'rgba(255,255,255,0.9)' : 'transparent',
          }}
        >
          <option value="" disabled style={{ background: '#0a0a14' }} />
          {options.map(opt => (
            <option key={opt} value={opt} style={{ background: '#0a0a14', color: 'white' }}>{opt}</option>
          ))}
        </select>
        <label
          htmlFor={id}
          className="absolute pointer-events-none transition-all duration-200 font-medium"
          style={{
            left: '16px',
            top: active ? '8px' : '50%',
            transform: active ? 'none' : 'translateY(-50%)',
            fontSize: active ? '11px' : '15px',
            letterSpacing: active ? '0.06em' : '0',
            textTransform: active ? 'uppercase' : 'none',
            color: focused ? A.a90 : 'rgba(255,255,255,0.35)',
          }}
        >
          {label}
        </label>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  )
}

// ─── Floating-label textarea ──────────────────────────────────────────────────

function FloatingTextarea({
  id, label, value, onChange, maxLength = 500, delay = 0
}: {
  id: string; label: string; value: string
  onChange: (v: string) => void; maxLength?: number; delay?: number
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}>
      <div
        className="relative rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? A.a70 : active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? `0 0 0 3px ${A.a12}` : 'none',
        }}
      >
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          className="w-full bg-transparent text-white outline-none text-base resize-none"
          style={{
            paddingTop:    active ? '26px' : '18px',
            paddingBottom: active ? '12px' : '18px',
            paddingLeft:   '16px',
            paddingRight:  '16px',
            transition: 'padding-top 0.2s, padding-bottom 0.2s',
          }}
        />
        <label
          htmlFor={id}
          className="absolute pointer-events-none transition-all duration-200 font-medium"
          style={{
            left: '16px', top: active ? '9px' : '18px',
            fontSize: active ? '11px' : '15px',
            letterSpacing: active ? '0.06em' : '0',
            textTransform: active ? 'uppercase' : 'none',
            color: focused ? A.a90 : 'rgba(255,255,255,0.35)',
          }}
        >
          {label}
        </label>
        <span
          className="absolute bottom-3 right-4 text-xs pointer-events-none"
          style={{ color: value.length > maxLength * 0.8 ? 'rgba(251,146,60,0.8)' : 'rgba(255,255,255,0.2)' }}
        >
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}

// ─── Solution tile ────────────────────────────────────────────────────────────

function SolutionTile({ solution, selected, onClick, lang, delay }: {
  solution: Solution; selected: boolean; onClick: () => void
  lang: 'pt' | 'en'; delay: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-3 rounded-2xl text-left transition-all duration-300 min-w-0 overflow-hidden"
      style={{
        animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        padding: '14px 16px',
        background: selected ? solution.accent + '14' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? solution.accent + '60' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? `0 0 0 3px ${solution.accent}20, 0 8px 24px ${solution.accent}15` : 'none',
        transform: selected ? 'translateY(-2px)' : undefined,
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: selected ? solution.accent + '22' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${selected ? solution.accent + '40' : 'rgba(255,255,255,0.1)'}`,
          color: selected ? solution.accent : 'rgba(255,255,255,0.4)',
        }}
      >
        {solution.icon}
      </div>
      <span className="text-sm font-semibold leading-snug min-w-0 flex-1 break-words"
        style={{ color: selected ? 'white' : 'rgba(255,255,255,0.65)', paddingRight: selected ? '18px' : '0' }}>
        {lang === 'pt' ? solution.labelPt : solution.labelEn}
      </span>
      {selected && (
        <span className="absolute top-3 right-3">
          <CheckCircle size={14} style={{ color: solution.accent }} />
        </span>
      )}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartPage() {
  const { lang } = useLang()
  const isPt = lang === 'pt'

  const [name,         setName]         = useState('')
  const [empresa,      setEmpresa]      = useState('')
  const [solution,     setSolution]     = useState('')
  const [utilizadores, setUtilizadores] = useState('')
  const [description,  setDescription]  = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [deadline,     setDeadline]     = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const tid = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(tid)
  }, [])

  const deadlines    = isPt ? DEADLINES_PT : DEADLINES_EN
  const usersOptions = isPt ? USERS_PT : USERS_EN
  const canSubmit    = name.trim() && email.trim() && solution && description.trim()

  async function handleSubmit() {
    if (!canSubmit || status === 'sending') return
    setStatus('sending')

    const sel = SOLUTIONS.find(s => s.key === solution)
    const answers = {
      name:          name.trim(),
      empresa:       empresa.trim()     || undefined,
      project_type:  isPt ? sel?.labelPt : sel?.labelEn,
      users:         utilizadores       || undefined,
      description:   description.trim(),
      contact_email: email.trim(),
      contact_phone: phone.trim()       || undefined,
      deadline:      deadline           || undefined,
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, budget: { low: 0, high: 0 }, lang }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const stats = [
    { value: '48h',  label: isPt ? 'Resposta garantida' : 'Response guaranteed' },
    { value: '3+',   label: isPt ? 'Produtos lançados'  : 'Products launched'   },
    { value: '100%', label: isPt ? 'Foco no cliente'    : 'Customer focus'      },
  ]

  const anim = (delay: number) =>
    mounted ? `sfadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` : 'none'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', color: 'var(--ink)' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />

      <SiteNav />

      <main className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 sm:pt-32 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-start">

            {/* ── Left panel ───────────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-32">
              <div style={{ animation: anim(0) }} className="mb-6">
                <ScrambleText
                  text={isPt ? '— Iniciar Projeto' : '— Start a Project'}
                  className="text-xs font-bold tracking-[0.15em] uppercase"
                  style={{ color: A.a80 }}
                />
              </div>

              <div style={{ animation: anim(80) }} className="mb-8">
                <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl leading-[1.0] tracking-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}>
                  <ScrambleText text={isPt ? 'Vamos' : "Let's"} className="text-white block" />
                  <ScrambleText
                    text={isPt ? 'construir' : 'build'}
                    className="block"
                    style={{
                      WebkitTextStroke: `1.5px ${A.a70}`,
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                    }}
                  />
                  <ScrambleText text={isPt ? 'juntos.' : 'together.'} className="text-white block" />
                </h1>
              </div>

              <ScrambleText
                as="p"
                text={isPt
                  ? 'Conta-nos sobre o teu projeto. Respondemos em menos de 48 horas com uma proposta personalizada.'
                  : 'Tell us about your project. We respond within 48 hours with a tailored proposal.'}
                className="text-base leading-relaxed mb-12 max-w-sm"
                style={{ color: 'rgba(255,255,255,0.45)', animation: anim(160) }}
              />

              <div style={{ animation: anim(240) }} className="flex flex-col gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span
                      className="text-2xl font-bold tracking-tight"
                      style={{ background: A.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: '52px' }}
                    >
                      {s.value}
                    </span>
                    <ScrambleText text={s.label} className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                ))}
              </div>

              <div style={{ animation: anim(320) }} className="mt-12 hidden lg:block">
                <div className="h-px w-32" style={{ background: `linear-gradient(90deg, ${A.a60}, transparent)` }} />
              </div>
            </div>

            {/* ── Right panel ──────────────────────────────────────────────── */}
            <div>
              {status === 'success' ? (
                <SuccessCard isPt={isPt} />
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
                  <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                      animation: anim(100),
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-4 sm:px-8 sm:py-6"
                         style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                           style={{ background: A.a20, border: `1px solid ${A.a30}` }}>
                        <Sparkles size={14} style={{ color: A.solid }} />
                      </div>
                      <ScrambleText
                        text={isPt ? 'Estimativa gratuita · Sem compromisso' : 'Free estimate · No commitment'}
                        className="text-sm font-semibold"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-8 flex flex-col gap-6">

                      {/* Nome + Empresa */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatingInput id="name" label={isPt ? 'O teu nome' : 'Your name'}
                          value={name} onChange={setName} required icon={<User size={16} />} delay={150} />
                        <FloatingInput id="empresa" label={isPt ? 'Empresa' : 'Company'}
                          value={empresa} onChange={setEmpresa} icon={<Building2 size={16} />} delay={200} />
                      </div>

                      {/* Email + Telefone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatingInput id="email" label="Email" type="email"
                          value={email} onChange={setEmail} required icon={<Mail size={16} />} delay={250} />
                        <FloatingInput id="phone"
                          label={isPt ? 'Telefone (opcional)' : 'Phone (optional)'} type="tel"
                          value={phone} onChange={setPhone} icon={<Phone size={16} />} delay={300} />
                      </div>

                      {/* Solução pretendida */}
                      <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 350ms both` }}>
                        <ScrambleText
                          text={isPt ? 'Solução pretendida' : 'Desired solution'}
                          className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        />
                        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
                          {SOLUTIONS.map((sol, i) => (
                            <SolutionTile key={sol.key} solution={sol}
                              selected={solution === sol.key}
                              onClick={() => setSolution(sol.key)}
                              lang={lang} delay={400 + i * 40} />
                          ))}
                        </div>
                      </div>

                      {/* Número de utilizadores */}
                      <FloatingSelect
                        id="utilizadores"
                        label={isPt ? 'Número aproximado de utilizadores' : 'Approximate number of users'}
                        value={utilizadores}
                        onChange={setUtilizadores}
                        options={usersOptions}
                        delay={560}
                      />

                      {/* Prazo pretendido */}
                      <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 600ms both` }}>
                        <ScrambleText
                          text={isPt ? 'Prazo pretendido' : 'Desired timeline'}
                          className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {deadlines.map((d, i) => {
                            const sel = deadline === d
                            return (
                              <button key={d} type="button"
                                onClick={() => setDeadline(sel ? '' : d)}
                                className="text-sm font-medium rounded-xl px-4 py-2 transition-all duration-200"
                                style={{
                                  animation: `sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${640 + i * 40}ms both`,
                                  background: sel ? A.a20 : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${sel ? A.a60 : 'rgba(255,255,255,0.08)'}`,
                                  color: sel ? A.solid : 'rgba(255,255,255,0.5)',
                                }}>
                                {d}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Descrição */}
                      <FloatingTextarea id="desc"
                        label={isPt ? 'Descreve o teu projeto' : 'Describe your project'}
                        value={description} onChange={setDescription} maxLength={500} delay={800} />

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={!canSubmit || status === 'sending'}
                        className="relative w-full flex items-center justify-center gap-3 rounded-2xl text-base font-semibold transition-all duration-300 overflow-hidden group"
                        style={{
                          animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 900ms both`,
                          padding: '18px 28px',
                          background: canSubmit ? 'white' : 'rgba(255,255,255,0.06)',
                          color:      canSubmit ? '#0a0a14' : 'rgba(255,255,255,0.25)',
                          border:     canSubmit ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow:  canSubmit ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
                          cursor:     canSubmit ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {canSubmit && (
                          <span
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, transparent 60%)' }}
                          />
                        )}
                        {status === 'sending' ? (
                          <><Loader2 size={18} className="animate-spin" /><span>{isPt ? 'A enviar…' : 'Sending…'}</span></>
                        ) : (
                          <><span>{isPt ? 'Enviar proposta' : 'Send proposal'}</span>
                            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" /></>
                        )}
                      </button>

                      {status === 'error' && (
                        <p className="text-center text-sm" style={{ color: 'rgba(251,113,133,0.8)' }}>
                          {isPt ? 'Ocorreu um erro. Tenta novamente.' : 'Something went wrong. Please try again.'}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes sfadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
      <SharedFooter />
    </div>
  )
}

// ─── Success card ─────────────────────────────────────────────────────────────

function SuccessCard({ isPt }: { isPt: boolean }) {
  return (
    <div
      className="rounded-3xl flex flex-col items-center text-center py-12 px-6 sm:py-20 sm:px-12"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        animation: 'sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0ms both',
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{
          background: A.a15,
          border: `1px solid ${A.a40}`,
          boxShadow: `0 0 40px ${A.a20}`,
          animation: 'sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 100ms both',
        }}
      >
        <CheckCircle size={36} style={{ color: A.solid }} />
      </div>

      <h2
        className="font-serif text-4xl font-bold mb-4 text-white"
        style={{ fontFamily: 'var(--font-serif)', animation: 'sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 200ms both' }}
      >
        {isPt ? 'Mensagem enviada!' : 'Message sent!'}
      </h2>

      <p
        className="text-base leading-relaxed max-w-xs mb-10"
        style={{ color: 'rgba(255,255,255,0.4)', animation: 'sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 280ms both' }}
      >
        {isPt
          ? 'Recebemos a tua mensagem. Entraremos em contacto em menos de 48 horas com uma proposta personalizada.'
          : "We received your message. We'll reach out within 48 hours with a tailored proposal."}
      </p>

      <div
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: A.a80, animation: 'sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 360ms both' }}
      >
        <span>{isPt ? 'Verifica o teu email' : 'Check your inbox'}</span>
        <ChevronRight size={14} />
      </div>
    </div>
  )
}
