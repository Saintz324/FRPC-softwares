'use client'

import { useState, useEffect } from 'react'
import { SplineBackground } from '@/components/spline-background'
import { Navigation } from '@/components/navigation'
import { useLang } from '@/components/language-provider'
import { ScrambleText } from '@/components/scramble-text'
import {
  Globe, ShoppingCart, LayoutDashboard, Smartphone, Server, Layers,
  ArrowRight, CheckCircle, Loader2, Sparkles, User, Mail, Phone, ChevronRight
} from 'lucide-react'

// ─── Accent colour ────────────────────────────────────────────────────────────
// Warm amber — echoes the Spline's orange blobs, matches the dark-navy palette
const A = {
  solid: 'rgb(251,191,36)',          // amber-400
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

type ProjectType = {
  key: string
  labelPt: string
  labelEn: string
  icon: React.ReactNode
  baseBudget: number
}

const PROJECT_TYPES: ProjectType[] = [
  { key: 'saas',      labelPt: 'Web App / SaaS',          labelEn: 'Web App / SaaS',        icon: <Globe size={22} />,         baseBudget: 3500 },
  { key: 'ecommerce', labelPt: 'Loja Online',              labelEn: 'E-commerce',             icon: <ShoppingCart size={22} />,  baseBudget: 2200 },
  { key: 'dashboard', labelPt: 'Dashboard / Analytics',    labelEn: 'Dashboard / Analytics',  icon: <LayoutDashboard size={22} />, baseBudget: 2800 },
  { key: 'mobile',    labelPt: 'App Mobile',               labelEn: 'Mobile App',             icon: <Smartphone size={22} />,    baseBudget: 4500 },
  { key: 'api',       labelPt: 'API / Backend',            labelEn: 'API / Backend',          icon: <Server size={22} />,        baseBudget: 2000 },
  { key: 'landing',   labelPt: 'Página de Apresentação',   labelEn: 'Landing Page',           icon: <Layers size={22} />,        baseBudget: 800  },
]

const DEADLINES_PT = ['< 2 semanas', '1 mês', '2-3 meses', '3-6 meses', 'Flexível']
const DEADLINES_EN = ['< 2 weeks',   '1 month', '2-3 months', '3-6 months', 'Flexible']

function calcBudget(key: string) {
  const base = PROJECT_TYPES.find(p => p.key === key)?.baseBudget ?? 2000
  return {
    low:  Math.round(base / 100) * 100,
    high: Math.round((base * 1.35) / 100) * 100,
  }
}

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

// ─── Project-type tile ────────────────────────────────────────────────────────

function TypeTile({ type, selected, onClick, lang, delay }: {
  type: ProjectType; selected: boolean; onClick: () => void
  lang: 'pt' | 'en'; delay: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-start gap-2 rounded-2xl text-left transition-all duration-300"
      style={{
        animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        padding: '18px 16px',
        background: selected ? A.a15 : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? A.a70 : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? `0 0 0 3px ${A.a12}, 0 8px 24px ${A.a15}` : 'none',
        transform: selected ? 'translateY(-2px)' : undefined,
      }}
    >
      <span style={{ color: selected ? A.solid : 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}>
        {type.icon}
      </span>
      <span className="text-sm font-semibold leading-snug"
        style={{ color: selected ? 'white' : 'rgba(255,255,255,0.65)' }}>
        {lang === 'pt' ? type.labelPt : type.labelEn}
      </span>
      {selected && (
        <span className="absolute top-3 right-3">
          <CheckCircle size={14} style={{ color: A.solid }} />
        </span>
      )}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartPage() {
  const { lang } = useLang()
  const isPt = lang === 'pt'

  const [name,        setName]        = useState('')
  const [projectType, setProjectType] = useState('')
  const [description, setDescription] = useState('')
  const [email,       setEmail]       = useState('')
  const [phone,       setPhone]       = useState('')
  const [deadline,    setDeadline]    = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const tid = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(tid)
  }, [])

  const deadlines = isPt ? DEADLINES_PT : DEADLINES_EN
  const canSubmit  = name.trim() && projectType && description.trim() && email.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || status === 'sending') return
    setStatus('sending')

    const sel = PROJECT_TYPES.find(p => p.key === projectType)
    const answers = {
      name:          name.trim(),
      project_type:  isPt ? sel?.labelPt : sel?.labelEn,
      description:   description.trim(),
      contact_email: email.trim(),
      contact_phone: phone.trim() || undefined,
      deadline:      deadline     || undefined,
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, budget: calcBudget(projectType), lang }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const stats = [
    { value: '48h',  label: isPt ? 'Resposta garantida' : 'Response guaranteed' },
    { value: '3+',   label: isPt ? 'Produtos lançados'  : 'Products shipped'    },
    { value: '100%', label: isPt ? 'Foco no cliente'    : 'Customer focus'      },
  ]

  const anim = (delay: number) =>
    mounted ? `sfadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` : 'none'

  return (
    <>
      <SplineBackground />
      <Navigation />

      <main className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
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
                <form onSubmit={handleSubmit}>
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
                    <div className="flex items-center gap-3 px-8 py-6"
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
                    <div className="p-8 flex flex-col gap-6">

                      <FloatingInput id="name" label={isPt ? 'O teu nome' : 'Your name'}
                        value={name} onChange={setName} required icon={<User size={16} />} delay={150} />

                      {/* Project type */}
                      <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 220ms both` }}>
                        <ScrambleText
                          text={isPt ? 'Tipo de projeto' : 'Project type'}
                          className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {PROJECT_TYPES.map((pt, i) => (
                            <TypeTile key={pt.key} type={pt}
                              selected={projectType === pt.key}
                              onClick={() => setProjectType(pt.key)}
                              lang={lang} delay={280 + i * 40} />
                          ))}
                        </div>
                      </div>

                      <FloatingTextarea id="desc" label={isPt ? 'Descreve o teu projeto' : 'Describe your project'}
                        value={description} onChange={setDescription} maxLength={500} delay={560} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FloatingInput id="email" label="Email" type="email"
                          value={email} onChange={setEmail} required icon={<Mail size={16} />} delay={620} />
                        <FloatingInput id="phone"
                          label={isPt ? 'Telefone (opcional)' : 'Phone (optional)'} type="tel"
                          value={phone} onChange={setPhone} icon={<Phone size={16} />} delay={680} />
                      </div>

                      {/* Deadline */}
                      <div style={{ animation: `sfadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 720ms both` }}>
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
                                  animation: `sfadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${760 + i * 40}ms both`,
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

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                      {/* Budget preview */}
                      {projectType && (
                        <div className="rounded-2xl p-5"
                             style={{
                               background: A.a08,
                               border: `1px solid ${A.a20}`,
                               animation: 'sfadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0ms both',
                             }}>
                          <ScrambleText
                            text={isPt ? 'Estimativa inicial' : 'Initial estimate'}
                            className="text-xs font-bold uppercase tracking-[0.1em] mb-2 block"
                            style={{ color: A.a80 }}
                          />
                          <p className="text-2xl font-bold tracking-tight"
                             style={{ background: A.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            €{calcBudget(projectType).low.toLocaleString()} — €{calcBudget(projectType).high.toLocaleString()}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {isPt ? 'O valor final pode variar conforme os detalhes do projeto.'
                                  : 'Final price may vary based on project details.'}
                          </p>
                        </div>
                      )}

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
    </>
  )
}

// ─── Success card ─────────────────────────────────────────────────────────────

function SuccessCard({ isPt }: { isPt: boolean }) {
  return (
    <div
      className="rounded-3xl flex flex-col items-center text-center py-20 px-12"
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
