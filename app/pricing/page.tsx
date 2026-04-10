"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, X, ArrowRight, Zap, Shield, Users, Headphones } from 'lucide-react'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { useLanguage } from '@/components/language-provider'

const TRANSLATIONS = {
  pt: {
    back: 'Voltar',
    label: 'Preços',
    title: 'Simples e',
    titleAccent: 'transparente.',
    subtitle: 'Escolha o plano certo para a sua equipa. Sem surpresas, sem letras pequenas.',
    monthly: 'Mensal',
    yearly: 'Anual',
    yearlyDiscount: '2 meses grátis',
    popular: 'Mais popular',
    ctaFree: 'Começar grátis',
    ctaPaid: 'Começar agora',
    ctaEnterprise: 'Falar com equipa',
    perMonth: '/mês',
    perYear: '/ano',
    everythingIn: 'Tudo do',
    plus: 'mais:',
    plans: [
      {
        name: 'Starter',
        price: { monthly: 0, yearly: 0 },
        description: 'Para equipas pequenas que querem começar.',
        color: 'border-white/10',
        features: [
          '1 produto FRPC',
          'Até 5 utilizadores',
          '5 GB de armazenamento',
          'Suporte por email',
          'Atualizações automáticas',
        ],
        notIncluded: [
          'Integrações avançadas',
          'Relatórios personalizados',
          'Suporte prioritário',
          'API access',
        ],
      },
      {
        name: 'Pro',
        price: { monthly: 29, yearly: 290 },
        description: 'Para equipas em crescimento que precisam de mais.',
        color: 'border-white/30',
        features: [
          'Todos os produtos FRPC',
          'Até 25 utilizadores',
          '50 GB de armazenamento',
          'Integrações avançadas',
          'Relatórios personalizados',
          'Suporte prioritário',
          'Atualizações automáticas',
        ],
        notIncluded: [
          'API access',
        ],
      },
      {
        name: 'Business',
        price: { monthly: 79, yearly: 790 },
        description: 'Para empresas que precisam de controlo total.',
        color: 'border-white/10',
        features: [
          'Todos os produtos FRPC',
          'Utilizadores ilimitados',
          'Armazenamento ilimitado',
          'Integrações avançadas',
          'Relatórios personalizados',
          'API access completo',
          'Suporte dedicado 24/7',
          'SLA garantido',
          'Onboarding personalizado',
        ],
        notIncluded: [],
      },
    ],
    compareTitle: 'Comparação completa',
    compareFeatures: [
      { label: 'Utilizadores', values: ['5', '25', 'Ilimitado'] },
      { label: 'Produtos FRPC', values: ['1', 'Todos', 'Todos'] },
      { label: 'Armazenamento', values: ['5 GB', '50 GB', 'Ilimitado'] },
      { label: 'Suporte por email', values: [true, true, true] },
      { label: 'Suporte prioritário', values: [false, true, true] },
      { label: 'Suporte dedicado 24/7', values: [false, false, true] },
      { label: 'Integrações avançadas', values: [false, true, true] },
      { label: 'Relatórios personalizados', values: [false, true, true] },
      { label: 'API access', values: [false, false, true] },
      { label: 'SLA garantido', values: [false, false, true] },
      { label: 'Onboarding personalizado', values: [false, false, true] },
    ],
    faqTitle: 'Perguntas frequentes',
    faqs: [
      {
        q: 'Posso mudar de plano a qualquer momento?',
        a: 'Sim. Pode fazer upgrade ou downgrade do seu plano a qualquer altura. As alterações entram em vigor imediatamente.',
      },
      {
        q: 'Existe um período de teste?',
        a: 'Sim, todos os planos pagos incluem 14 dias de teste gratuito. Não é necessário cartão de crédito.',
      },
      {
        q: 'Como funciona a faturação anual?',
        a: 'Com a faturação anual poupa 2 meses (equivale a ~17% de desconto). É cobrado uma vez por ano.',
      },
      {
        q: 'O que acontece quando excedo o limite de utilizadores?',
        a: 'Receberá um aviso e pode fazer upgrade do plano ou adquirir utilizadores adicionais.',
      },
    ],
    bottomTitle: 'Precisa de algo',
    bottomAccent: 'personalizado?',
    bottomDesc: 'Para requisitos específicos, volumes elevados ou integrações à medida — fale connosco.',
    bottomCta: 'Falar com a equipa',
    footerRights: 'Todos os direitos reservados.',
    backToTop: 'Voltar ao topo ↑',
  },
  en: {
    back: 'Back',
    label: 'Pricing',
    title: 'Simple and',
    titleAccent: 'transparent.',
    subtitle: 'Choose the right plan for your team. No surprises, no fine print.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlyDiscount: '2 months free',
    popular: 'Most popular',
    ctaFree: 'Start for free',
    ctaPaid: 'Get started',
    ctaEnterprise: 'Talk to us',
    perMonth: '/mo',
    perYear: '/yr',
    everythingIn: 'Everything in',
    plus: 'plus:',
    plans: [
      {
        name: 'Starter',
        price: { monthly: 0, yearly: 0 },
        description: 'For small teams that want to get started.',
        color: 'border-white/10',
        features: [
          '1 FRPC product',
          'Up to 5 users',
          '5 GB storage',
          'Email support',
          'Automatic updates',
        ],
        notIncluded: [
          'Advanced integrations',
          'Custom reports',
          'Priority support',
          'API access',
        ],
      },
      {
        name: 'Pro',
        price: { monthly: 29, yearly: 290 },
        description: 'For growing teams that need more.',
        color: 'border-white/30',
        features: [
          'All FRPC products',
          'Up to 25 users',
          '50 GB storage',
          'Advanced integrations',
          'Custom reports',
          'Priority support',
          'Automatic updates',
        ],
        notIncluded: [
          'API access',
        ],
      },
      {
        name: 'Business',
        price: { monthly: 79, yearly: 790 },
        description: 'For companies that need full control.',
        color: 'border-white/10',
        features: [
          'All FRPC products',
          'Unlimited users',
          'Unlimited storage',
          'Advanced integrations',
          'Custom reports',
          'Full API access',
          'Dedicated 24/7 support',
          'Guaranteed SLA',
          'Custom onboarding',
        ],
        notIncluded: [],
      },
    ],
    compareTitle: 'Full comparison',
    compareFeatures: [
      { label: 'Users', values: ['5', '25', 'Unlimited'] },
      { label: 'FRPC Products', values: ['1', 'All', 'All'] },
      { label: 'Storage', values: ['5 GB', '50 GB', 'Unlimited'] },
      { label: 'Email support', values: [true, true, true] },
      { label: 'Priority support', values: [false, true, true] },
      { label: 'Dedicated 24/7 support', values: [false, false, true] },
      { label: 'Advanced integrations', values: [false, true, true] },
      { label: 'Custom reports', values: [false, true, true] },
      { label: 'API access', values: [false, false, true] },
      { label: 'Guaranteed SLA', values: [false, false, true] },
      { label: 'Custom onboarding', values: [false, false, true] },
    ],
    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        q: 'Can I change my plan at any time?',
        a: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
      },
      {
        q: 'Is there a trial period?',
        a: 'Yes, all paid plans include a 14-day free trial. No credit card required.',
      },
      {
        q: 'How does annual billing work?',
        a: 'With annual billing you save 2 months (equivalent to ~17% discount). Billed once per year.',
      },
      {
        q: 'What happens when I exceed the user limit?',
        a: "You'll receive a warning and can upgrade your plan or purchase additional users.",
      },
    ],
    bottomTitle: 'Need something',
    bottomAccent: 'custom?',
    bottomDesc: 'For specific requirements, high volumes or custom integrations — get in touch.',
    bottomCta: 'Talk to the team',
    footerRights: 'All rights reserved.',
    backToTop: 'Back to top ↑',
  },
}

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { lang, toggleLanguage, isSwitching, t: navT } = useLanguage()
  const t = TRANSLATIONS[lang]

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div className="hidden md:block"><CursorFollower /></div>
      <SplineBackground />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="hidden sm:block tracking-[0.2em] uppercase text-xs">{t.back}</span>
            </Link>
            <div className="w-px h-4 bg-white/20" />
            <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-white hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-serif)' }}>
              FRPC
            </Link>
          </div>
          <MagneticButton
            onClick={toggleLanguage}
            disabled={isSwitching}
            className="px-4 py-2 border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-300"
          >
            {navT.nav.language}
          </MagneticButton>
        </div>
      </nav>

      <main className="relative z-10">

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="relative min-h-[55vh] flex items-center px-6 md:px-12 pt-32 pb-16">
          <div className="max-w-7xl w-full mx-auto">
            <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-white/40 text-xs tracking-[0.3em] uppercase">{t.label}</span>
            </div>
            <div className={`mt-4 transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="font-serif font-bold text-white leading-none" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
                {t.title}<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>
                  {t.titleAccent}
                </span>
              </h1>
            </div>
            <p className={`text-white/50 text-lg md:text-xl max-w-xl mt-6 leading-relaxed transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t.subtitle}
            </p>

            {/* Billing toggle */}
            <div className={`mt-10 flex items-center gap-4 transition-all duration-700 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className={`text-sm transition-colors ${!yearly ? 'text-white' : 'text-white/40'}`}>{t.monthly}</span>
              <button
                onClick={() => setYearly(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${yearly ? 'bg-white' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${yearly ? 'left-7 bg-black' : 'left-1 bg-white'}`} />
              </button>
              <span className={`text-sm transition-colors ${yearly ? 'text-white' : 'text-white/40'}`}>{t.yearly}</span>
              {yearly && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">{t.yearlyDiscount}</span>
              )}
            </div>
          </div>
        </section>

        {/* ─── PRICING CARDS ───────────────────────────────────────── */}
        <section className="relative px-6 md:px-12 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.plans.map((plan, i) => {
                const isPro = plan.name === 'Pro'
                const price = yearly ? plan.price.yearly : plan.price.monthly
                const isFree = price === 0
                return (
                  <Reveal key={plan.name} delay={i * 100}>
                    <div className={`relative flex flex-col h-full p-8 md:p-10 rounded-3xl border transition-all duration-500 ${
                      isPro
                        ? 'border-white/40 bg-white/10 backdrop-blur-sm'
                        : 'border-white/10 bg-white/5 hover:bg-white/[0.08]'
                    }`}>
                      {isPro && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold tracking-wide">{t.popular}</span>
                        </div>
                      )}

                      <div className="mb-8">
                        <h2 className="text-xl font-serif font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{plan.name}</h2>
                        <p className="text-white/40 text-sm leading-relaxed">{plan.description}</p>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-end gap-1">
                          <span className="font-serif font-bold text-white" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                            {isFree ? 'Free' : `€${price}`}
                          </span>
                          {!isFree && (
                            <span className="text-white/40 text-sm mb-3">{yearly ? t.perYear : t.perMonth}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 mb-8">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-white/70 text-sm">{f}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map(f => (
                          <div key={f} className="flex items-start gap-3">
                            <X className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
                            <span className="text-white/25 text-sm line-through">{f}</span>
                          </div>
                        ))}
                      </div>

                      <a href={plan.name === 'Business' ? '#contact' : '/produtos/calendario-de-ferias'}>
                        <MagneticButton className={`w-full py-4 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group ${
                          isPro
                            ? 'bg-white text-black hover:bg-white/90'
                            : 'border border-white/20 text-white hover:bg-white/10'
                        }`}>
                          {plan.name === 'Business' ? t.ctaEnterprise : isFree ? t.ctaFree : t.ctaPaid}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </MagneticButton>
                      </a>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── FEATURE HIGHLIGHTS ──────────────────────────────────── */}
        <section className="relative py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Zap className="w-6 h-6" />, title: lang === 'pt' ? 'Setup em 2 min' : '2 min setup', desc: lang === 'pt' ? 'Sem configuração complexa' : 'No complex configuration' },
                { icon: <Shield className="w-6 h-6" />, title: lang === 'pt' ? 'Sem compromisso' : 'No commitment', desc: lang === 'pt' ? 'Cancele quando quiser' : 'Cancel anytime' },
                { icon: <Users className="w-6 h-6" />, title: lang === 'pt' ? 'Para equipas' : 'Built for teams', desc: lang === 'pt' ? 'Colaboração em tempo real' : 'Real-time collaboration' },
                { icon: <Headphones className="w-6 h-6" />, title: lang === 'pt' ? 'Suporte humano' : 'Human support', desc: lang === 'pt' ? 'Sempre aqui para ajudar' : 'Always here to help' },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/60 mx-auto mb-4">{item.icon}</div>
                    <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-white/40 text-xs">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COMPARISON TABLE ────────────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-16" style={{ fontFamily: 'var(--font-serif)' }}>
                {t.compareTitle}
              </h2>
            </Reveal>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 pr-8 text-white/40 text-xs uppercase tracking-widest font-normal w-1/2" />
                    {t.plans.map(plan => (
                      <th key={plan.name} className="py-4 px-4 text-center">
                        <span className={`text-sm font-semibold ${plan.name === 'Pro' ? 'text-white' : 'text-white/60'}`}>{plan.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.compareFeatures.map((row, i) => (
                    <tr key={row.label} className={`border-b border-white/[0.06] ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      <td className="py-4 pr-8 text-white/50 text-sm">{row.label}</td>
                      {row.values.map((val, vi) => (
                        <td key={vi} className="py-4 px-4 text-center">
                          {typeof val === 'boolean' ? (
                            val
                              ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                              : <X className="w-4 h-4 text-white/15 mx-auto" />
                          ) : (
                            <span className={`text-sm ${vi === 1 ? 'text-white font-medium' : 'text-white/60'}`}>{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────────────────── */}
        <section className="relative py-32 border-t border-white/10">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-16" style={{ fontFamily: 'var(--font-serif)' }}>
                {t.faqTitle}
              </h2>
            </Reveal>
            <div className="space-y-3">
              {t.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="border border-white/10 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-white font-medium text-sm md:text-base pr-4">{faq.q}</span>
                      <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>
                        <ArrowRight className="w-3 h-3 text-white/60 -rotate-45" />
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                      <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BOTTOM CTA ──────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <h2 className="font-serif font-bold text-white leading-none mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                {t.bottomTitle}<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>{t.bottomAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-white/40 text-lg max-w-md mx-auto mb-10">{t.bottomDesc}</p>
            </Reveal>
            <Reveal delay={300}>
              <Link href="/#contact">
                <MagneticButton className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all">
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
        <footer className="relative py-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-serif font-bold text-white hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-serif)' }}>FRPC</Link>
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} FRPC. {t.footerRights}</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">{t.backToTop}</button>
          </div>
        </footer>
      </main>
    </>
  )
}
