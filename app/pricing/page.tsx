"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, X, Clock, ChevronDown } from 'lucide-react'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { useLang, useSwitch } from '@/components/language-provider'

// ─── Translations ────────────────────────────────────────────────────────────
const T = {
  pt: {
    back: 'Voltar',
    label: 'Preços',
    title: 'Preços por',
    titleAccent: 'produto.',
    subtitle: 'Paga apenas o que usas. Cada produto FRPC tem o seu próprio plano — começa grátis, cresce quando precisas.',
    monthly: 'Mensal',
    yearly: 'Anual',
    save: 'Poupa 2 meses',
    perMonth: '/mês',
    perYear: '/ano',
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
    products: {
      calendar: {
        badge: 'Calendário de Férias',
        tagline: 'Gestão de férias e ausências para equipas',
        description: 'A forma mais simples de gerir férias, folgas e ausências da tua equipa. Visual, intuitivo e pronto a usar em minutos.',
        url: '/produtos/calendario-de-ferias',
        plans: [
          {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Para equipas pequenas que querem começar.',
            features: ['Até 5 utilizadores', '1 calendário', 'Aprovações simples', 'Vista mensal', 'Exportar PDF'],
            notIncluded: ['Múltiplos calendários', 'Integrações', 'Relatórios', 'Suporte prioritário'],
          },
          {
            name: 'Pro',
            price: { monthly: 9, yearly: 90 },
            description: 'Para equipas em crescimento.',
            popular: true,
            features: ['Até 25 utilizadores', 'Múltiplos calendários', 'Aprovações avançadas', 'Relatórios de ausências', 'Integração Google Calendar', 'Notificações por email', 'Suporte prioritário'],
            notIncluded: ['Utilizadores ilimitados', 'API access'],
          },
          {
            name: 'Business',
            price: { monthly: 19, yearly: 190 },
            description: 'Para empresas que precisam de controlo total.',
            features: ['Utilizadores ilimitados', 'Múltiplos calendários', 'API access completo', 'SSO / SAML', 'Relatórios avançados', 'SLA garantido', 'Suporte dedicado 24/7', 'Onboarding personalizado'],
            notIncluded: [],
          },
        ],
      },
      manager: {
        badge: 'Project Manager',
        tagline: 'Gestão de projetos e tarefas para equipas',
        description: 'Kanban, timelines e gestão de equipas numa interface moderna e intuitiva. Entrega mais rápido, com menos stress.',
        url: '/produtos/project-manager',
        plans: [
          {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Para começar a organizar os teus projetos.',
            features: ['3 projetos', 'Até 5 utilizadores', 'Quadros Kanban', 'Vista de tarefas'],
            notIncluded: ['Projetos ilimitados', 'Relatórios', 'Integrações', 'Suporte prioritário'],
          },
          {
            name: 'Pro',
            price: { monthly: 12, yearly: 120 },
            description: 'Para equipas que precisam de mais.',
            popular: true,
            features: ['Projetos ilimitados', 'Até 25 utilizadores', 'Timelines e prazos', 'Relatórios e KPIs', 'Notificações por email', 'Suporte prioritário'],
            notIncluded: ['Utilizadores ilimitados', 'API access'],
          },
          {
            name: 'Business',
            price: { monthly: 25, yearly: 250 },
            description: 'Para empresas com controlo total.',
            features: ['Utilizadores ilimitados', 'Projetos ilimitados', 'API access completo', 'SSO / SAML', 'Relatórios avançados', 'SLA garantido', 'Suporte dedicado 24/7'],
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
    yearly: 'Yearly',
    save: 'Save 2 months',
    perMonth: '/mo',
    perYear: '/yr',
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
    products: {
      calendar: {
        badge: 'Vacation Schedule',
        tagline: 'Vacation & absence management for teams',
        description: 'The simplest way to manage your team\'s vacations, days off and absences. Visual, intuitive and ready to use in minutes.',
        url: '/produtos/calendario-de-ferias',
        plans: [
          {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'For small teams getting started.',
            features: ['Up to 5 users', '1 calendar', 'Simple approvals', 'Monthly view', 'PDF export'],
            notIncluded: ['Multiple calendars', 'Integrations', 'Reports', 'Priority support'],
          },
          {
            name: 'Pro',
            price: { monthly: 9, yearly: 90 },
            description: 'For growing teams.',
            popular: true,
            features: ['Up to 25 users', 'Multiple calendars', 'Advanced approvals', 'Absence reports', 'Google Calendar sync', 'Email notifications', 'Priority support'],
            notIncluded: ['Unlimited users', 'API access'],
          },
          {
            name: 'Business',
            price: { monthly: 19, yearly: 190 },
            description: 'For companies needing full control.',
            features: ['Unlimited users', 'Multiple calendars', 'Full API access', 'SSO / SAML', 'Advanced reports', 'Guaranteed SLA', 'Dedicated 24/7 support', 'Custom onboarding'],
            notIncluded: [],
          },
        ],
      },
      manager: {
        badge: 'Project Manager',
        tagline: 'Project & task management for teams',
        description: 'Kanban, timelines and team management in a modern, intuitive interface. Ship faster, with less stress.',
        url: '/produtos/project-manager',
        plans: [
          {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'To start organizing your projects.',
            features: ['3 projects', 'Up to 5 users', 'Kanban boards', 'Task view'],
            notIncluded: ['Unlimited projects', 'Reports', 'Integrations', 'Priority support'],
          },
          {
            name: 'Pro',
            price: { monthly: 12, yearly: 120 },
            description: 'For teams that need more.',
            popular: true,
            features: ['Unlimited projects', 'Up to 25 users', 'Timelines & deadlines', 'Reports & KPIs', 'Email notifications', 'Priority support'],
            notIncluded: ['Unlimited users', 'API access'],
          },
          {
            name: 'Business',
            price: { monthly: 25, yearly: 250 },
            description: 'For companies with full control.',
            features: ['Unlimited users', 'Unlimited projects', 'Full API access', 'SSO / SAML', 'Advanced reports', 'Guaranteed SLA', 'Dedicated 24/7 support'],
            notIncluded: [],
          },
        ],
      },
    },
  },
}

type Lang = 'pt' | 'en'
type Plan = { name: string; price: { monthly: number; yearly: number }; description?: string; popular?: boolean; features: string[]; notIncluded: string[] }

// ─── Plan card ───────────────────────────────────────────────────────────────
function PlanCard({ plan, yearly, lang, productUrl }: { plan: Plan; yearly: boolean; lang: Lang; productUrl?: string }) {
  const t = T[lang]
  const isPro = !!plan.popular
  const isBusiness = plan.name === 'Business'
  const price = yearly ? plan.price.yearly : plan.price.monthly
  const isFree = price === 0

  const ctaLabel = isBusiness ? t.ctaBusiness : isFree ? t.ctaFree : t.ctaPro
  const ctaHref = isBusiness ? '/#contact' : (productUrl ?? '/')

  return (
    <div className={`relative flex flex-col rounded-2xl border ${
      isPro
        ? 'border-white/25 bg-white/[0.07] shadow-[0_0_40px_rgba(255,255,255,0.05)]'
        : 'border-white/[0.08] bg-white/[0.03]'
    }`}>
      {/* Pro gradient top line */}
      {isPro && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-2xl" />
      )}

      {/* Popular badge — sits above the card, needs overflow-visible on parent */}
      {isPro && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold tracking-wide uppercase whitespace-nowrap">
          {t.popular}
        </div>
      )}

      <div className={`p-7 flex flex-col gap-6 ${isPro ? 'pt-9' : ''}`}>
        {/* Header */}
        <div>
          <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">{plan.name}</p>
          {plan.description && <p className="text-white/35 text-sm leading-relaxed">{plan.description}</p>}
        </div>

        {/* Price */}
        <div className="flex items-end gap-1.5">
          <span
            className="font-serif font-bold text-white leading-none"
            style={{ fontFamily: 'var(--font-serif)', fontSize: isFree ? '2.5rem' : 'clamp(2rem,5vw,3rem)' }}
          >
            {isFree ? t.free : `€${price}`}
          </span>
          {!isFree && (
            <span className="text-white/35 text-sm mb-1">{yearly ? t.perYear : t.perMonth}</span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2.5">
              <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPro ? 'bg-emerald-500/20' : 'bg-white/[0.06]'}`}>
                <Check className={`w-2.5 h-2.5 ${isPro ? 'text-emerald-400' : 'text-white/45'}`} />
              </div>
              <span className={`text-sm ${isPro ? 'text-white/75' : 'text-white/50'}`}>{f}</span>
            </li>
          ))}
          {plan.notIncluded.map(f => (
            <li key={f} className="flex items-start gap-2.5 opacity-30">
              <X className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
              <span className="text-sm text-white/30 line-through">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href={ctaHref} className="mt-auto block">
          <MagneticButton className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group transition-colors duration-200 ${
            isPro
              ? 'bg-white text-black hover:bg-white/90'
              : 'border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/[0.05]'
          }`}>
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </MagneticButton>
        </Link>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { lang, toggleLanguage, t: navT } = useLang()
  const { isSwitching } = useSwitch()
  const t = T[lang as Lang]

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const vis = (delay = '') => ({
    style: delay ? { transitionDelay: delay } : undefined,
    className: `transition-[opacity,transform] duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`,
  })

  return (
    <>
      <div className="hidden md:block"><CursorFollower /></div>
      <SplineBackground />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-[color] duration-200 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="hidden sm:block tracking-[0.2em] uppercase text-xs">{t.back}</span>
            </Link>
            <div className="w-px h-4 bg-white/15" />
            <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-white hover:opacity-80 transition-opacity duration-200" style={{ fontFamily: 'var(--font-serif)' }}>
              FRPC
            </Link>
          </div>
          <MagneticButton
            onClick={toggleLanguage}
            disabled={isSwitching}
            className="px-4 py-2 border border-white/25 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-[background-color] duration-200"
          >
            {navT.nav.language}
          </MagneticButton>
        </div>
      </nav>

      <main className="relative z-10">

        {/*  HERO  */}
        <section className="relative px-6 md:px-12 pt-40 pb-16">
          <div className="max-w-7xl w-full mx-auto">
            <div {...vis('0ms')}>
              <span className="text-white/35 text-xs tracking-[0.3em] uppercase">{t.label}</span>
            </div>
            <div {...vis('100ms')} className={`mt-4 transition-[opacity,transform] duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h1 className="font-serif font-bold text-white leading-none" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 9vw, 8rem)' }}>
                {t.title}<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)', WebkitTextFillColor: 'transparent' }}>
                  {t.titleAccent}
                </span>
              </h1>
            </div>
            <p className={`text-white/45 text-lg md:text-xl max-w-xl mt-6 leading-relaxed transition-[opacity,transform] duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              {t.subtitle}
            </p>

            {/* Billing toggle */}
            <div className={`mt-10 flex items-center gap-4 transition-[opacity,transform] duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <span className={`text-sm transition-[color] duration-200 ${!yearly ? 'text-white' : 'text-white/35'}`}>{t.monthly}</span>
              <button
                onClick={() => setYearly(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-[background-color] duration-300 ${yearly ? 'bg-white' : 'bg-white/20'}`}
                aria-label="Toggle billing period"
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-[left] duration-300 ${yearly ? 'left-6 bg-black' : 'left-1 bg-white'}`} />
              </button>
              <span className={`text-sm transition-[color] duration-200 ${yearly ? 'text-white' : 'text-white/35'}`}>{t.yearly}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium transition-[opacity,transform] duration-300 ${yearly ? 'opacity-100 scale-100 bg-emerald-500/15 text-emerald-400' : 'opacity-0 scale-90'}`}>
                {t.save}
              </span>
            </div>
          </div>
        </section>

        {/*  CALENDÁRIO DE FÉRIAS  */}
        <section className="relative px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
                {/* Product header */}
                <div className="px-8 md:px-12 py-8 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-white font-semibold">{t.products.calendar.badge}</h2>
                        <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-semibold tracking-wide uppercase">{t.flagship}</span>
                      </div>
                      <p className="text-white/35 text-sm">{t.products.calendar.tagline}</p>
                    </div>
                  </div>
                  <Link href={t.products.calendar.url} className="group inline-flex items-center gap-2 text-white/45 hover:text-white text-sm transition-[color] duration-200">
                    {lang === 'pt' ? 'Ver produto' : 'View product'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Plans grid */}
                <div className="p-6 md:p-8 pt-8 md:pt-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {t.products.calendar.plans.map((plan) => (
                      <PlanCard key={plan.name} plan={plan} yearly={yearly} lang={lang as Lang} productUrl={t.products.calendar.url} />
                    ))}
                  </div>
                  <p className="text-center text-white/25 text-xs mt-6">{t.trialNote}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/*  PROJECT MANAGER  */}
        <section className="relative px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
                {/* Product header */}
                <div className="px-8 md:px-12 py-8 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-white font-semibold">{t.products.manager.badge}</h2>
                      <p className="text-white/35 text-sm">{t.products.manager.tagline}</p>
                    </div>
                  </div>
                  <Link href={t.products.manager.url} className="group inline-flex items-center gap-2 text-white/45 hover:text-white text-sm transition-[color] duration-200">
                    {lang === 'pt' ? 'Ver produto' : 'View product'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Plans grid */}
                <div className="p-6 md:p-8 pt-8 md:pt-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {t.products.manager.plans.map((plan) => (
                      <PlanCard key={plan.name} plan={plan} yearly={yearly} lang={lang as Lang} productUrl={t.products.manager.url} />
                    ))}
                  </div>
                  <p className="text-center text-white/25 text-xs mt-6">{t.trialNote}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* outros produtos — só Portal */}
        <section className="relative px-6 md:px-12 pb-32">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="mb-8">
                <h3 className="text-white/60 text-sm font-semibold tracking-widest uppercase">{t.otherProducts}</h3>
                <p className="text-white/25 text-sm mt-1">{t.otherDesc}</p>
              </div>
            </Reveal>

            {/* Portal FRPC — coming soon */}
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
                        <h2 className="text-white/70 font-semibold">Portal FRPC</h2>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 text-white/30 text-[10px]">
                          <Clock className="w-2.5 h-2.5" />{t.comingSoon}
                        </span>
                      </div>
                      <p className="text-white/25 text-sm">{lang === 'pt' ? 'Acesso centralizado a todos os produtos FRPC' : 'Centralized access to all FRPC products'}</p>
                    </div>
                  </div>
                  <span className="text-white/20 text-sm">{lang === 'pt' ? 'Incluído em todos os planos' : 'Included in all plans'}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/*  FAQ  */}
        <section className="relative py-24 border-t border-white/[0.06] px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-10" style={{ fontFamily: 'var(--font-serif)' }}>
                {t.faqTitle}
              </h2>
            </Reveal>
            <div className="space-y-2">
              {t.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="border border-white/[0.07] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-[background-color] duration-200"
                    >
                      <span className="text-white/80 font-medium text-sm md:text-base pr-4">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ease-out ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                      <p className="px-6 pb-5 text-white/45 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA  */}
        <section className="relative py-32 md:py-48 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <h2 className="font-serif font-bold text-white leading-none mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                {t.bottomTitle}<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.3)', WebkitTextFillColor: 'transparent' }}>{t.bottomAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-white/35 text-lg max-w-md mx-auto mb-10">{t.bottomDesc}</p>
            </Reveal>
            <Reveal delay={200}>
              <Link href="/#contact">
                <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-[background-color] duration-200">
                  {t.bottomCta}
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
            <p className="text-white/25 text-sm">© {new Date().getFullYear()} FRPC. {t.footerRights}</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/30 hover:text-white text-sm transition-[color] duration-200">{lang === 'pt' ? 'Voltar ao topo ↑' : 'Back to top ↑'}</button>
          </div>
        </footer>
      </main>
    </>
  )
}
