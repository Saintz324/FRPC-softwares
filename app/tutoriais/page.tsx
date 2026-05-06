"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown,
  Calendar, Kanban, Zap, Terminal, Star
} from 'lucide-react'
import { Reveal } from '@/components/reveal-animation'
import { MagneticButton } from '@/components/magnetic-button'
import { useLang } from '@/components/language-provider'
import { ScrambleText } from '@/components/scramble-text'
import { SiteNav } from '@/components/site-nav'

// ─── Data ────────────────────────────────────────────────────────────────────

const T = {
  pt: {
    eyebrow: 'Tutoriais',
    title: 'Aprende em',
    titleAccent: 'minutos.',
    subtitle: 'Guias passo a passo para tirares o máximo de cada produto FRPC. Sem complicações.',
    jumpTo: 'Saltar para',
    steps: 'passos',
    tip: 'Dica',
    stepOf: 'Passo',
    features: 'Funcionalidades',
    viewProduct: 'Ver produto',
    faqTitle: 'Perguntas frequentes',
    ctaTitle: 'Pronto para',
    ctaAccent: 'começar?',
    ctaDesc: 'Junta-te a centenas de equipas que já usam os produtos FRPC.',
    ctaBtn: 'Começar grátis',
    ctaBtnSecondary: 'Falar connosco',
    footerRights: 'Todos os direitos reservados.',
    products: [
      {
        id: 'calendario',
        badge: 'Calendário de Férias',
        tagline: 'Gestão de férias e ausências',
        accent: '#60a5fa',
        accentDim: 'rgba(59,130,246,0.12)',
        href: '/produtos/calendario-de-ferias',
        intro: 'A forma mais simples de gerir ausências da tua equipa. Configuras e estás pronto em menos de 5 minutos.',
        terminal: [
          '$ frpc init --product calendario',
          '✓ Workspace criado',
          '✓ Equipa convidada',
          '✓ Pronto em 47s',
        ],
        steps: [
          {
            title: 'Criar a tua conta',
            body: 'Acede a frpc.pt e clica em "Começar grátis". Preenche o teu email e define uma palavra-passe. Receberás um email de confirmação — clica no link para ativar a conta.',
            tip: 'Usa o email corporativo para facilitar a identificação da tua equipa.',
          },
          {
            title: 'Convidar a equipa',
            body: 'No painel principal, vai a Definições → Utilizadores → Convidar. Introduz os emails dos teus colaboradores. Eles receberão um convite e poderão aderir instantaneamente.',
            tip: 'Podes importar múltiplos emails de uma vez separando-os por vírgula.',
          },
          {
            title: 'Configurar o calendário',
            body: 'Define os dias úteis da tua empresa, feriados nacionais e locais. Em Configurações → Calendário podes ajustar os dias disponíveis e o máximo de ausências simultâneas.',
            tip: 'O sistema sugere automaticamente os feriados portugueses do ano corrente.',
          },
          {
            title: 'Gerir pedidos de férias',
            body: 'Quando um colaborador faz um pedido, o gestor recebe uma notificação por email. No painel de aprovações podes ver, aprovar ou rejeitar com um clique e adicionar notas.',
            tip: 'Ativa aprovações automáticas para pedidos de menos de 2 dias para reduzir trabalho administrativo.',
          },
        ],
        features: ['Vista mensal e anual', 'Notificações por email', 'Exportação PDF e CSV', 'Relatórios de ausências', 'Google Calendar'],
      },
      {
        id: 'project-manager',
        badge: 'Project Manager',
        tagline: 'Gestão de projetos e tarefas',
        accent: '#34d399',
        accentDim: 'rgba(52,211,153,0.1)',
        href: '/produtos/project-manager',
        intro: 'Centraliza projetos, tarefas e equipas numa interface Kanban intuitiva. Ideal para entregar mais com menos stress.',
        terminal: [
          '$ frpc init --product manager',
          '✓ Projeto criado',
          '✓ Kanban configurado',
          '✓ Equipa a bordo',
        ],
        steps: [
          {
            title: 'Criar o teu primeiro projeto',
            body: 'Clica em "+ Novo Projeto" no painel principal. Define o nome, data de início e prazo final. Podes adicionar uma descrição e uma cor para identificar o projeto rapidamente.',
            tip: 'Usa cores diferentes para projetos de clientes diferentes — muito mais fácil de gerir.',
          },
          {
            title: 'Adicionar membros à equipa',
            body: 'Na página do projeto, clica em "Equipa" → "Adicionar Membro". Podes atribuir papéis: Gestor, Contribuidor ou Observador.',
            tip: 'Convida clientes como Observadores para dares visibilidade ao progresso sem expores detalhes internos.',
          },
          {
            title: 'Criar e organizar tarefas',
            body: 'No quadro Kanban, clica em "+ Tarefa" em qualquer coluna. Define título, responsável, prazo e prioridade. Arrasta e larga entre colunas conforme o progresso.',
            tip: 'Usa etiquetas de prioridade para o painel filtrar automaticamente o que é urgente.',
          },
          {
            title: 'Acompanhar o progresso',
            body: 'O dashboard de KPIs mostra em tempo real: tarefas concluídas, taxa de conclusão, dias restantes e carga de trabalho por membro.',
            tip: 'Configura alertas automáticos quando uma tarefa está a 48h do prazo sem estar concluída.',
          },
        ],
        features: ['Kanban drag-and-drop', 'Timeline de prazos', 'Dashboard de KPIs', 'Histórico por tarefa', 'Notificações inteligentes'],
      },
    ],
    faqs: [
      { q: 'Preciso de cartão de crédito para começar?', a: 'Não. Podes usar os planos gratuitos ou iniciar um trial de 14 dias sem qualquer compromisso. O cartão só é pedido quando fazes upgrade.' },
      { q: 'Posso usar os dois produtos juntos?', a: 'Sim! O Calendário de Férias e o Project Manager são complementares. Os teus colaboradores gerem férias e projetos a partir do mesmo ecossistema FRPC.' },
      { q: 'Os dados estão seguros?', a: 'Todos os dados são armazenados em servidores europeus com encriptação AES-256. Fazemos backups automáticos diários e cumprimos o RGPD.' },
      { q: 'Posso exportar os meus dados?', a: 'Sim. Em qualquer momento podes exportar todos os dados em CSV ou PDF. Os teus dados são sempre teus.' },
      { q: 'Existe suporte em português?', a: 'Sim! O nosso suporte é 100% em português. Podes contactar-nos por email, chat ou videochamada.' },
    ],
  },
  en: {
    eyebrow: 'Tutorials',
    title: 'Learn in',
    titleAccent: 'minutes.',
    subtitle: 'Step-by-step guides to get the most out of every FRPC product. No complexity.',
    jumpTo: 'Jump to',
    steps: 'steps',
    tip: 'Tip',
    stepOf: 'Step',
    features: 'Features',
    viewProduct: 'View product',
    faqTitle: 'Frequently asked questions',
    ctaTitle: 'Ready to',
    ctaAccent: 'get started?',
    ctaDesc: 'Join hundreds of teams already using FRPC products.',
    ctaBtn: 'Start for free',
    ctaBtnSecondary: 'Talk to us',
    footerRights: 'All rights reserved.',
    products: [
      {
        id: 'calendario',
        badge: 'Vacation Calendar',
        tagline: 'Vacation & absence management',
        accent: '#60a5fa',
        accentDim: 'rgba(59,130,246,0.12)',
        href: '/produtos/calendario-de-ferias',
        intro: 'The simplest way to manage your team\'s absences. Get set up and ready in under 5 minutes.',
        terminal: [
          '$ frpc init --product calendar',
          '✓ Workspace created',
          '✓ Team invited',
          '✓ Ready in 47s',
        ],
        steps: [
          {
            title: 'Create your account',
            body: 'Go to frpc.pt and click "Start for free". Enter your email and set a password. You\'ll receive a confirmation email — click the link to activate your account.',
            tip: 'Use your corporate email to make it easier to identify your team.',
          },
          {
            title: 'Invite your team',
            body: 'In the main dashboard, go to Settings → Users → Invite. Enter your team members\' emails. They\'ll receive an invite and can join instantly.',
            tip: 'You can import multiple emails at once by separating them with commas.',
          },
          {
            title: 'Configure the calendar',
            body: 'Set your company\'s working days, national and local holidays. In Settings → Calendar you can adjust available vacation days and the maximum simultaneous absences.',
            tip: 'The system automatically suggests public holidays for the current year.',
          },
          {
            title: 'Manage vacation requests',
            body: 'When a team member makes a request, the manager gets an email. In the approvals dashboard you can see, approve or reject with one click, and add notes.',
            tip: 'Enable automatic approvals for requests under 2 days to reduce admin overhead.',
          },
        ],
        features: ['Monthly & yearly view', 'Email notifications', 'PDF & CSV export', 'Absence reports', 'Google Calendar'],
      },
      {
        id: 'project-manager',
        badge: 'Project Manager',
        tagline: 'Project & task management',
        accent: '#34d399',
        accentDim: 'rgba(52,211,153,0.1)',
        href: '/produtos/project-manager',
        intro: 'Centralise projects, tasks and teams in an intuitive Kanban interface. Deliver more with less stress.',
        terminal: [
          '$ frpc init --product manager',
          '✓ Project created',
          '✓ Kanban configured',
          '✓ Team on board',
        ],
        steps: [
          {
            title: 'Create your first project',
            body: 'Click "+ New Project" in the main dashboard. Set the name, start date, and deadline. You can also add a description and color for quick identification.',
            tip: 'Use different colors for different client projects — much easier to manage at a glance.',
          },
          {
            title: 'Add team members',
            body: 'On the project page, click "Team" → "Add Member". Assign roles: Manager (full access), Contributor (create/edit tasks), or Viewer (read-only).',
            tip: 'Invite clients as Viewers to give them visibility without exposing internal details.',
          },
          {
            title: 'Create and organize tasks',
            body: 'On the Kanban board, click "+ Task" in any column. Set title, assignee, deadline and priority. Drag and drop tasks between columns as they progress.',
            tip: 'Use priority labels so your dashboard automatically filters what\'s urgent.',
          },
          {
            title: 'Track progress',
            body: 'The KPI dashboard shows in real time: completed tasks, completion rate, remaining days, and workload per member. Use Timeline view to check deadlines.',
            tip: 'Set up automatic alerts when a task is 48 hours from its deadline and not yet complete.',
          },
        ],
        features: ['Drag-and-drop Kanban', 'Deadline timeline', 'Real-time KPIs', 'Task history', 'Smart notifications'],
      },
    ],
    faqs: [
      { q: 'Do I need a credit card to get started?', a: 'No. You can use the free plans or start a 14-day trial with no commitment. A card is only required when you upgrade.' },
      { q: 'Can I use both products together?', a: 'Yes! The Vacation Calendar and Project Manager are complementary. Your team manages vacations and projects from the same FRPC ecosystem.' },
      { q: 'Is my data secure?', a: 'All data is stored on European servers with AES-256 encryption. We do automatic daily backups and comply with GDPR.' },
      { q: 'Can I export my data?', a: 'Yes. At any time you can export all data in CSV or PDF. Your data is always yours.' },
      { q: 'Is there support in English?', a: 'Yes! Our support team is available in both English and Portuguese via email, chat, or video call.' },
    ],
  },
}

type Lang = 'pt' | 'en'

// ─── Terminal card ────────────────────────────────────────────────────────────

function TerminalCard({ lines, accent }: { lines: string[]; accent: string }) {
  const [typed, setTyped] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    started.current = false
    setTyped(0)
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        lines.forEach((_, i) => {
          setTimeout(() => setTyped(i + 1), i * 320 + 200)
        })
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [lines])

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.55)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 14,
      padding: '18px 20px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      lineHeight: 1.8,
      backdropFilter: 'blur(12px)',
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)`,
    }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{
          color: i === 0 ? 'rgba(255,255,255,0.75)' : accent,
          opacity: typed > i ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}>
          {line}
        </div>
      ))}
    </div>
  )
}

// ─── Step timeline ────────────────────────────────────────────────────────────

function StepTimeline({ steps, accent, stepLabel, tipLabel }: {
  steps: { title: string; body: string; tip: string }[]
  accent: string
  stepLabel: string
  tipLabel: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Vertical connector line */}
      <div style={{
        position: 'absolute', left: 19, top: 28, bottom: 28,
        width: 1,
        background: `linear-gradient(to bottom, ${accent}44, ${accent}11)`,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
            {/* Step node */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `linear-gradient(135deg, ${accent}22, ${accent}0a)`,
                border: `1.5px solid ${accent}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                color: accent,
                flexShrink: 0,
                boxShadow: `0 0 16px ${accent}18`,
                fontFamily: 'var(--font-mono)',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>

            {/* Step content */}
            <div style={{ flex: 1, paddingTop: 6 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
                {stepLabel} {i + 1}
              </div>
              <ScrambleText text={step.title} style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 10, lineHeight: 1.3, display: 'block' }} />
              <ScrambleText as="p" text={step.body} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 12 }} />
              <div style={{
                display: 'inline-flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 12px', borderRadius: 10,
                background: accent + '0f',
                border: `1px solid ${accent}20`,
              }}>
                <Zap style={{ width: 12, height: 12, color: accent, flexShrink: 0, marginTop: 2 }} />
                <ScrambleText text={`${tipLabel}: ${step.tip}`} style={{ fontSize: 12, color: accent + 'cc', lineHeight: 1.5 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 16,
        }}
      >
        <ScrambleText text={q} style={{ fontSize: 15, fontWeight: 500, color: open ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', transition: 'color 0.2s', flex: 1 }} />
        <div style={{
          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s, background 0.2s',
          background: open ? 'rgba(255,255,255,0.08)' : 'transparent',
        }}>
          <ChevronDown style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.4)', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 200 : 0,
        transition: 'max-height 0.35s cubic-bezier(.2,.7,.3,1)',
      }}>
        <ScrambleText as="p" text={a} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, paddingBottom: 20 }} />
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TutoriaisPage() {
  const [mounted, setMounted] = useState(false)
  const { lang } = useLang()
  const tr = T[lang as Lang]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const target = params.get('p') === 'project-manager' ? 'project-manager' : null
    if (target) {
      const el = document.getElementById(target)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const fade = (delay = 0) => ({
    style: {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'none' : 'translateY(18px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    },
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', color: 'var(--ink)' }}>

      {/* Fixed ambient */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 65% 50% at 20% 20%, var(--glow-soft), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 75%, var(--glow-faint), transparent 60%)',
        filter: 'blur(18px)', opacity: 0.85,
      }} />

      <SiteNav />

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(120px, 18vw, 200px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* Eyebrow */}
            <div {...fade(0)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, ...fade(0).style }}>
              <div style={{ width: 20, height: 1, background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)' }} />
              <ScrambleText text={tr.eyebrow} style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }} />
            </div>

            {/* Headline */}
            <div {...fade(80)}>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3rem, 10vw, 9.5rem)',
                lineHeight: 0.9, letterSpacing: '-0.03em',
                marginBottom: 28,
              }}>
                <ScrambleText text={tr.title} style={{ display: 'block', color: 'var(--ink)' }} />
                <ScrambleText text={tr.titleAccent} style={{ display: 'block', WebkitTextStroke: '1.5px rgba(255,255,255,0.3)', WebkitTextFillColor: 'transparent' }} />
              </h1>
            </div>

            <div {...fade(160)}>
              <ScrambleText as="p" text={tr.subtitle} style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.4)', maxWidth: 520, lineHeight: 1.7, marginBottom: 56 }} />
            </div>

            {/* Product jump cards */}
            <div {...fade(240)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, maxWidth: 600 }}>
              {tr.products.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  onClick={e => {
                    e.preventDefault()
                    document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '20px 22px',
                      borderRadius: 18,
                      background: p.accentDim,
                      border: `1px solid ${p.accent}28`,
                      transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = p.accent + '55'
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = p.accent + '28'
                      el.style.transform = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.accent + '22', border: `1px solid ${p.accent}33` }}>
                        {p.id === 'calendario' ? <Calendar style={{ width: 15, height: 15, color: p.accent }} /> : <Kanban style={{ width: 15, height: 15, color: p.accent }} />}
                      </div>
                      <ScrambleText text={p.badge} style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ScrambleText text={`${tr.jumpTo} · ${p.steps.length} ${tr.steps}`} style={{ fontSize: 11, color: p.accent, fontWeight: 500 }} />
                      <ArrowRight style={{ width: 11, height: 11, color: p.accent }} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT SECTIONS ──────────────────────────────────────────── */}
        {tr.products.map((product, pIdx) => (
          <section
            key={product.id}
            id={product.id}
            style={{
              padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              scrollMarginTop: 80,
            }}
          >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

              {/* Section header */}
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: product.accent + '1a', border: `1px solid ${product.accent}28` }}>
                        {product.id === 'calendario' ? <Calendar style={{ width: 16, height: 16, color: product.accent }} /> : <Kanban style={{ width: 16, height: 16, color: product.accent }} />}
                      </div>
                      <ScrambleText text={`${String(pIdx + 1).padStart(2, '0')} — ${product.badge}`} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: product.accent, fontWeight: 600, fontFamily: 'var(--font-mono)' }} />
                    </div>
                    <ScrambleText as="h2" text={product.intro} style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.1, color: 'rgba(255,255,255,0.92)', maxWidth: 520 }} />
                  </div>
                  <Link href={product.href} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: product.accent, opacity: 0.8, transition: 'opacity 0.2s', marginTop: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                  >
                    <ScrambleText text={tr.viewProduct} /> <ArrowUpRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </Reveal>

              {/* Two-column: steps + sidebar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0, 360px)', gap: 48, alignItems: 'start' }}>

                {/* Left: step timeline */}
                <Reveal delay={80}>
                  <StepTimeline
                    steps={product.steps}
                    accent={product.accent}
                    stepLabel={tr.stepOf}
                    tipLabel={tr.tip}
                  />
                </Reveal>

                {/* Right: terminal + features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <Reveal delay={160}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Terminal style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Quick setup</span>
                      </div>
                      <TerminalCard lines={product.terminal} accent={product.accent} />
                    </div>
                  </Reveal>

                  <Reveal delay={220}>
                    <div style={{ padding: '22px 24px', borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <ScrambleText text={tr.features} style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 16, fontFamily: 'var(--font-mono)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                        {product.features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0, color: product.accent }} />
                            <ScrambleText text={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }} />
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <Link href={product.href}>
                          <MagneticButton style={{
                            width: '100%', padding: '11px 0', borderRadius: 12,
                            background: product.accent + '18', border: `1px solid ${product.accent}30`,
                            color: product.accent, fontSize: 13, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = product.accent + '28')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = product.accent + '18')}
                          >
                            <Star style={{ width: 12, height: 12 }} />
                            {lang === 'pt' ? 'Experimentar grátis' : 'Try for free'}
                          </MagneticButton>
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>

            </div>
          </section>
        ))}

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <Reveal>
              <ScrambleText as="h2" text={tr.faqTitle} style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'rgba(255,255,255,0.9)', marginBottom: 48 }} />
            </Reveal>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {tr.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 40}>
                  <FaqRow q={faq.q} a={faq.a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Reveal>
              <div style={{
                borderRadius: 28,
                padding: 'clamp(48px, 6vw, 80px)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-soft), transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 8vw, 6.5rem)', lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 20, position: 'relative' }}>
                  <ScrambleText text={tr.ctaTitle} style={{ display: 'block', color: 'rgba(255,255,255,0.92)' }} />
                  <ScrambleText text={tr.ctaAccent} style={{ display: 'block', WebkitTextStroke: '1.5px rgba(255,255,255,0.28)', WebkitTextFillColor: 'transparent' }} />
                </h2>
                <ScrambleText as="p" text={tr.ctaDesc} style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', maxWidth: 360, lineHeight: 1.65, marginBottom: 40, position: 'relative' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', position: 'relative' }}>
                  <Link href="/start">
                    <MagneticButton className="group inline-flex items-center gap-3 px-9 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors duration-200 text-sm">
                      <ScrambleText text={tr.ctaBtn} />
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="group-hover:rotate-45 transition-transform duration-300">
                        <ArrowRight style={{ width: 13, height: 13, color: '#fff' }} />
                      </div>
                    </MagneticButton>
                  </Link>
                  <Link href="/start">
                    <MagneticButton className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/50 hover:text-white hover:border-white/35 rounded-full text-sm font-medium transition-all duration-200">
                      <ScrambleText text={tr.ctaBtnSecondary} />
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer style={{ padding: 'clamp(28px, 4vw, 40px) clamp(24px, 6vw, 80px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <Link href="/" style={{ fontSize: 20, fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>FRPC</Link>
            <ScrambleText as="p" text={`© ${new Date().getFullYear()} FRPC. ${tr.footerRights}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }} />
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.25)')}
            >
              <ScrambleText text={lang === 'pt' ? 'Voltar ao topo ↑' : 'Back to top ↑'} />
            </button>
          </div>
        </footer>

      </main>
    </div>
  )
}
