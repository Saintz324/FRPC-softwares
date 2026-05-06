"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clock, ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { useLang } from '@/components/language-provider'
import { ScrambleText } from '@/components/scramble-text'
import { SiteNav } from '@/components/site-nav'

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  pt: {
    back: 'Voltar',
    label: 'Preços',
    title: 'Preços por',
    titleAccent: 'produto.',
    subtitle: 'Paga apenas o que usas. Cada produto FRPC tem o seu próprio plano — começa grátis, cresce quando precisas.',
    monthly: 'Mensal',
    yearly: 'Anual',
    lifetime: 'Vitalício',
    recommended: 'Recomendado',
    save: 'Poupa 2 meses',
    perMonth: '/mês',
    perYear: '/ano',
    perLifetime: 'único',
    vatNote: '+ IVA',
    free: 'Grátis',
    ctaFree: 'Começar grátis',
    ctaPro: 'Começar agora',
    ctaBusiness: 'Falar com a equipa',
    trialNote: '14 dias grátis · Sem cartão de crédito',
    popular: 'Mais popular',
    flagship: 'Produto principal',
    comingSoon: 'Em breve',
    otherProducts: 'Outros produtos',
    otherDesc: 'Mais ferramentas a caminho. Subscreve para ser o primeiro a saber.',
    faqTitle: 'Perguntas frequentes',
    faqs: [
      { q: 'Posso experimentar antes de pagar?', a: 'Sim. Todos os planos pagos têm 14 dias de teste gratuito. Não precisas de cartão de crédito para começar.' },
      { q: 'Posso mudar de plano a qualquer momento?', a: 'Sim, podes fazer upgrade ou downgrade quando quiseres. As alterações entram em vigor imediatamente.' },
      { q: 'Como funciona a faturação anual?', a: 'Com faturação anual poupas o equivalente a 2 meses (~17% de desconto). Faturado uma vez por ano.' },
      { q: 'O que acontece quando excedo o limite de utilizadores?', a: 'Recebes um aviso e podes fazer upgrade ou adicionar utilizadores extra.' },
    ],
    bottomTitle: 'Precisas de algo',
    bottomAccent: 'à medida?',
    bottomDesc: 'Volumes elevados, integrações específicas ou requisitos enterprise — fala connosco.',
    bottomCta: 'Falar com a equipa',
    footerRights: 'Todos os direitos reservados.',
    calendarNote: 'Necessita de algo personalizado? Entre em contacto para uma proposta à medida.',
    calendarNoteCta: 'Falar connosco',
    products: {
      calendar: {
        badge: 'Calendário de Férias',
        tagline: 'Gestão de férias e ausências para equipas',
        url: '/produtos/calendario-de-ferias',
        plans: [
          {
            name: 'Essencial',
            users: 'Até 5 utilizadores',
            price: { monthly: 19, yearly: 190, lifetime: 490 },
            popular: false,
            features: ['1 calendário', 'Aprovações simples', 'Vista mensal', 'Exportar PDF'],
            notIncluded: ['Múltiplos calendários', 'Integrações', 'Relatórios', 'Suporte prioritário'],
          },
          {
            name: 'Pro',
            users: 'Até 25 utilizadores',
            price: { monthly: 39, yearly: 390, lifetime: 990 },
            popular: true,
            features: ['Múltiplos calendários', 'Aprovações avançadas', 'Relatórios de ausências', 'Google Calendar', 'Notificações email', 'Suporte prioritário'],
            notIncluded: ['Utilizadores ilimitados', 'API access'],
          },
          {
            name: 'Enterprise',
            users: 'Utilizadores ilimitados',
            price: { monthly: 69, yearly: 690, lifetime: 1690 },
            popular: false,
            features: ['Múltiplos calendários', 'API access completo', 'SSO / SAML', 'Relatórios avançados', 'SLA garantido', 'Suporte dedicado 24/7', 'Onboarding personalizado'],
            notIncluded: [],
          },
        ],
      },
      manager: {
        badge: 'Project Manager',
        tagline: 'Gestão de projetos e tarefas para equipas',
        url: '/produtos/project-manager',
        plans: [
          {
            name: 'Essencial',
            users: 'Até 5 utilizadores',
            price: { monthly: 5, yearly: 50, lifetime: undefined as number | undefined },
            popular: false,
            features: ['3 projetos', 'Quadros Kanban', 'Vista de tarefas'],
            notIncluded: ['Projetos ilimitados', 'Relatórios', 'Integrações', 'Suporte prioritário'],
          },
          {
            name: 'Pro',
            users: 'Até 25 utilizadores',
            price: { monthly: 12, yearly: 120, lifetime: undefined as number | undefined },
            popular: true,
            features: ['Projetos ilimitados', 'Timelines e prazos', 'Relatórios e KPIs', 'Notificações email', 'Suporte prioritário'],
            notIncluded: ['Utilizadores ilimitados', 'API access'],
          },
          {
            name: 'Enterprise',
            users: 'Utilizadores ilimitados',
            price: { monthly: 25, yearly: 250, lifetime: undefined as number | undefined },
            popular: false,
            features: ['Projetos ilimitados', 'API access completo', 'SSO / SAML', 'Relatórios avançados', 'SLA garantido', 'Suporte dedicado 24/7'],
            notIncluded: [],
          },
        ],
      },
    },
  },
  en: {
    back: 'Back',
    label: 'Pricing',
    title: 'Pricing per',
    titleAccent: 'product.',
    subtitle: 'Pay only for what you use. Each FRPC product has its own plan — start free, scale when you need to.',
    monthly: 'Monthly',
    yearly: 'Annual',
    lifetime: 'Lifetime',
    recommended: 'Recommended',
    save: 'Save 2 months',
    perMonth: '/mo',
    perYear: '/yr',
    perLifetime: 'once',
    vatNote: '+ VAT',
    free: 'Free',
    ctaFree: 'Start for free',
    ctaPro: 'Get started',
    ctaBusiness: 'Talk to us',
    trialNote: '14-day free trial · No credit card required',
    popular: 'Most popular',
    flagship: 'Main product',
    comingSoon: 'Coming soon',
    otherProducts: 'More products',
    otherDesc: 'More tools on the way. Subscribe to be the first to know.',
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'Can I try before paying?', a: 'Yes. All paid plans have a 14-day free trial. No credit card needed to start.' },
      { q: 'Can I change my plan at any time?', a: 'Yes, you can upgrade or downgrade whenever you want. Changes take effect immediately.' },
      { q: 'How does annual billing work?', a: 'With annual billing you save the equivalent of 2 months (~17% discount). Billed once per year.' },
      { q: 'What happens when I exceed the user limit?', a: "You'll receive a warning and can upgrade or add extra users." },
    ],
    bottomTitle: 'Need something',
    bottomAccent: 'custom?',
    bottomDesc: 'High volumes, specific integrations or enterprise requirements — get in touch.',
    bottomCta: 'Talk to the team',
    footerRights: 'All rights reserved.',
    calendarNote: 'Need something custom? Get in touch for a tailored proposal.',
    calendarNoteCta: 'Talk to us',
    products: {
      calendar: {
        badge: 'Vacation Schedule',
        tagline: 'Vacation & absence management for teams',
        url: '/produtos/calendario-de-ferias',
        plans: [
          {
            name: 'Essential',
            users: 'Up to 5 users',
            price: { monthly: 19, yearly: 190, lifetime: 490 },
            popular: false,
            features: ['1 calendar', 'Simple approvals', 'Monthly view', 'PDF export'],
            notIncluded: ['Multiple calendars', 'Integrations', 'Reports', 'Priority support'],
          },
          {
            name: 'Pro',
            users: 'Up to 25 users',
            price: { monthly: 39, yearly: 390, lifetime: 990 },
            popular: true,
            features: ['Multiple calendars', 'Advanced approvals', 'Absence reports', 'Google Calendar', 'Email notifications', 'Priority support'],
            notIncluded: ['Unlimited users', 'API access'],
          },
          {
            name: 'Enterprise',
            users: 'Unlimited users',
            price: { monthly: 69, yearly: 690, lifetime: 1690 },
            popular: false,
            features: ['Multiple calendars', 'Full API access', 'SSO / SAML', 'Advanced reports', 'Guaranteed SLA', 'Dedicated 24/7 support', 'Custom onboarding'],
            notIncluded: [],
          },
        ],
      },
      manager: {
        badge: 'Project Manager',
        tagline: 'Project & task management for teams',
        url: '/produtos/project-manager',
        plans: [
          {
            name: 'Essential',
            users: 'Up to 5 users',
            price: { monthly: 5, yearly: 50, lifetime: undefined as number | undefined },
            popular: false,
            features: ['3 projects', 'Kanban boards', 'Task view'],
            notIncluded: ['Unlimited projects', 'Reports', 'Integrations', 'Priority support'],
          },
          {
            name: 'Pro',
            users: 'Up to 25 users',
            price: { monthly: 12, yearly: 120, lifetime: undefined as number | undefined },
            popular: true,
            features: ['Unlimited projects', 'Timelines & deadlines', 'Reports & KPIs', 'Email notifications', 'Priority support'],
            notIncluded: ['Unlimited users', 'API access'],
          },
          {
            name: 'Enterprise',
            users: 'Unlimited users',
            price: { monthly: 25, yearly: 250, lifetime: undefined as number | undefined },
            popular: false,
            features: ['Unlimited projects', 'Full API access', 'SSO / SAML', 'Advanced reports', 'Guaranteed SLA', 'Dedicated 24/7 support'],
            notIncluded: [],
          },
        ],
      },
    },
  },
}

type Lang = 'pt' | 'en'
type Plan = {
  name: string
  users: string
  price: { monthly: number; yearly: number; lifetime?: number }
  popular: boolean
  features: string[]
  notIncluded: string[]
}

// ─── Pricing table ────────────────────────────────────────────────────────────
function PricingTable({ plans, lang, productUrl }: { plans: Plan[]; lang: Lang; productUrl: string }) {
  const t = T[lang]
  const hasLifetime = plans.some(p => p.price.lifetime !== undefined)

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div style={{ minWidth: hasLifetime ? 580 : 440 }}>

        {/* Column headers */}
        <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: hasLifetime ? '200px repeat(3,1fr)' : '200px repeat(2,1fr)' }}>
          <div />
          {/* Monthly */}
          <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/35 font-semibold">{t.monthly}</span>
          </div>
          {/* Annual — highlighted */}
          <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-white/20 bg-white/[0.06] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-white font-semibold">{t.yearly}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-wide uppercase">{t.save}</span>
          </div>
          {/* Lifetime */}
          {hasLifetime && (
            <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/35 font-semibold">{t.lifetime}</span>
              <span className="text-[9px] text-white/20">{lang === 'pt' ? 'paga uma vez' : 'pay once'}</span>
            </div>
          )}
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {plans.map((plan) => {
            const isPro = plan.popular
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border transition-all duration-300 ${
                  isPro
                    ? 'border-white/20 bg-white/[0.07] shadow-[0_0_50px_rgba(255,255,255,0.04)]'
                    : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]'
                }`}
              >
                {isPro && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent rounded-t-2xl" />
                )}

                <div className="grid gap-3 items-center px-5 py-5" style={{ gridTemplateColumns: hasLifetime ? '200px repeat(3,1fr)' : '200px repeat(2,1fr)' }}>
                  {/* Plan info */}
                  <div className="pr-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-sm font-bold ${isPro ? 'text-white' : 'text-white/75'}`}>{plan.name}</span>
                      {isPro && (
                        <span className="px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-bold tracking-wide uppercase">{t.popular}</span>
                      )}
                    </div>
                    <span className={`text-xs ${isPro ? 'text-white/50' : 'text-white/30'}`}>{plan.users}</span>

                    {/* Feature chips */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {plan.features.slice(0, 3).map(f => (
                        <span key={f} className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md ${isPro ? 'bg-white/10 text-white/60' : 'bg-white/[0.05] text-white/35'}`}>
                          <Check className="w-2 h-2 shrink-0" />{f}
                        </span>
                      ))}
                      {plan.features.length > 3 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isPro ? 'text-white/40 bg-white/[0.06]' : 'text-white/25 bg-white/[0.03]'}`}>
                          +{plan.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monthly price */}
                  <div className="text-center px-2">
                    <div>
                      <span className={`font-bold ${isPro ? 'text-white' : 'text-white/65'}`} style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                        €{plan.price.monthly}
                      </span>
                      <span className={`block text-[10px] mt-1 ${isPro ? 'text-white/35' : 'text-white/25'}`}>{t.perMonth} {t.vatNote}</span>
                    </div>
                  </div>

                  {/* Annual price — highlighted */}
                  <div className="text-center px-2 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <div>
                      <span className={`font-bold ${isPro ? 'text-white' : 'text-white/70'}`} style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                        €{plan.price.yearly}
                      </span>
                      <span className={`block text-[10px] mt-1 ${isPro ? 'text-white/35' : 'text-white/25'}`}>{t.perYear} {t.vatNote}</span>
                    </div>
                  </div>

                  {/* Lifetime price */}
                  {hasLifetime && (
                    <div className="text-center px-2">
                      {plan.price.lifetime !== undefined ? (
                        <div>
                          <span className={`font-bold ${isPro ? 'text-white/80' : 'text-white/55'}`} style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                            €{plan.price.lifetime}
                          </span>
                          <span className={`block text-[10px] mt-1 ${isPro ? 'text-white/30' : 'text-white/20'}`}>{t.perLifetime} {t.vatNote}</span>
                        </div>
                      ) : (
                        <span className="text-white/20 text-lg">—</span>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA row */}
                <div className="px-5 pb-4 pt-1 border-t border-white/[0.05] flex justify-end">
                  <Link href={plan.name === 'Enterprise' ? '/#contact' : productUrl}>
                    <button className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold group transition-all duration-200 ${
                      isPro
                        ? 'bg-white text-black hover:bg-white/85'
                        : 'border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                    }`}>
                      {plan.name === 'Enterprise' ? t.ctaBusiness : t.ctaPro}
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trial note */}
        <p className="text-center text-white/20 text-xs mt-5">{t.trialNote}</p>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { lang } = useLang()
  const t = T[lang as Lang]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const vis = (delay = '') => ({
    style: delay ? { transitionDelay: delay } : undefined,
    className: `transition-[opacity,transform] duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`,
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', color: 'var(--ink)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 70% 35%, var(--glow-soft), transparent 60%), radial-gradient(ellipse 55% 40% at 25% 70%, var(--glow-faint), transparent 65%)', filter: 'blur(20px)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />

      <SiteNav />

      <main className="relative z-10">

        {/* HERO */}
        <section className="relative px-6 md:px-12 pt-40 pb-16">
          <div className="max-w-7xl w-full mx-auto">
            <div {...vis('0ms')}>
              <ScrambleText text={t.label} className="text-white/35 text-xs tracking-[0.3em] uppercase" />
            </div>
            <div {...vis('100ms')} className={`mt-4 transition-[opacity,transform] duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h1 className="font-serif font-bold text-white leading-none" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 9vw, 8rem)' }}>
                <ScrambleText text={t.title} /><br />
                <ScrambleText text={t.titleAccent} style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)', WebkitTextFillColor: 'transparent' }} />
              </h1>
            </div>
            <ScrambleText as="p" text={t.subtitle} className={`text-white/45 text-lg md:text-xl max-w-xl mt-6 leading-relaxed transition-[opacity,transform] duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} />
          </div>
        </section>

        {/* CALENDÁRIO DE FÉRIAS */}
        <section id="calendar" className="relative px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="rounded-3xl border border-white/15 bg-white/[0.04] overflow-hidden">
                <div className="px-8 md:px-12 py-8 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <ScrambleText text={t.products.calendar.badge} className="text-white font-bold text-xl md:text-2xl block" />
                      <ScrambleText text={t.products.calendar.tagline} className="text-white/35 text-sm block mt-0.5" />
                    </div>
                  </div>
                  <Link href={t.products.calendar.url} className="group inline-flex items-center gap-2 text-white/45 hover:text-white text-sm transition-[color] duration-200">
                    <ScrambleText text={lang === 'pt' ? 'Ver produto' : 'View product'} />
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </div>

                <div className="p-6 md:p-10">
                  <PricingTable plans={t.products.calendar.plans as Plan[]} lang={lang as Lang} productUrl={t.products.calendar.url} />

                  <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-white/[0.06]">
                    <ScrambleText as="p" text={t.calendarNote} className="text-white/35 text-sm leading-relaxed" />
                    <Link href="/#contact" className="group shrink-0 inline-flex items-center gap-2 text-white/55 hover:text-white text-sm font-medium transition-[color] duration-200">
                      <ScrambleText text={t.calendarNoteCta} />
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROJECT MANAGER */}
        <section id="manager" className="relative px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="px-8 md:px-12 py-8 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <ScrambleText text={t.products.manager.badge} className="text-white font-bold text-xl md:text-2xl block" />
                      <ScrambleText text={t.products.manager.tagline} className="text-white/35 text-sm block mt-0.5" />
                    </div>
                  </div>
                  <Link href={t.products.manager.url} className="group inline-flex items-center gap-2 text-white/45 hover:text-white text-sm transition-[color] duration-200">
                    <ScrambleText text={lang === 'pt' ? 'Ver produto' : 'View product'} />
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </div>

                <div className="p-6 md:p-10">
                  <PricingTable plans={t.products.manager.plans as Plan[]} lang={lang as Lang} productUrl={t.products.manager.url} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* OUTROS PRODUTOS */}
        <section className="relative px-6 md:px-12 pb-32">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="mb-8">
                <ScrambleText text={t.otherProducts} className="text-white/60 text-sm font-semibold tracking-widest uppercase block" />
                <ScrambleText text={t.otherDesc} className="text-white/25 text-sm mt-1 block" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-400/15 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <ScrambleText text="Portal FRPC" className="text-white/70 font-semibold" />
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 text-white/30 text-[10px]">
                          <Clock className="w-2.5 h-2.5" /><ScrambleText text={t.comingSoon} />
                        </span>
                      </div>
                      <ScrambleText text={lang === 'pt' ? 'Acesso centralizado a todos os produtos FRPC' : 'Centralized access to all FRPC products'} className="text-white/25 text-sm" />
                    </div>
                  </div>
                  <ScrambleText text={lang === 'pt' ? 'Incluído em todos os planos' : 'Included in all plans'} className="text-white/20 text-sm" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-24 border-t border-white/[0.06] px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <ScrambleText as="h2" text={t.faqTitle} className="text-2xl md:text-4xl font-serif font-bold text-white mb-10" style={{ fontFamily: 'var(--font-serif)' }} />
            </Reveal>
            <div className="space-y-2">
              {t.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="border border-white/[0.07] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-[background-color] duration-200"
                    >
                      <ScrambleText text={faq.q} className="text-white/80 font-medium text-sm md:text-base pr-4" />
                      <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ease-out ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                      <ScrambleText as="p" text={faq.a} className="px-6 pb-5 text-white/45 text-sm leading-relaxed" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="relative py-32 md:py-48 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <h2 className="font-serif font-bold text-white leading-none mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                <ScrambleText text={t.bottomTitle} /><br />
                <ScrambleText text={t.bottomAccent} style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.3)', WebkitTextFillColor: 'transparent' }} />
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <ScrambleText as="p" text={t.bottomDesc} className="text-white/35 text-lg max-w-md mx-auto mb-10" />
            </Reveal>
            <Reveal delay={200}>
              <Link href="/#contact">
                <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-[background-color] duration-200">
                  <ScrambleText text={t.bottomCta} />
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </MagneticButton>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-10 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-serif font-bold text-white hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-serif)' }}>FRPC</Link>
            <ScrambleText as="p" text={`© ${new Date().getFullYear()} FRPC. ${t.footerRights}`} className="text-white/25 text-sm" />
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/30 hover:text-white text-sm transition-[color] duration-200">
              <ScrambleText text={lang === 'pt' ? 'Voltar ao topo ↑' : 'Back to top ↑'} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}
