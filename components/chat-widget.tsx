'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Send, Sparkles, User, ChevronDown, Check, Zap, CheckCircle, ExternalLink } from 'lucide-react'
import { useLang } from '@/components/language-provider'

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | 'init'
  | 'ask_name'
  | 'products_menu'
  | 'product_ferias'
  | 'product_manager_info'
  | 'name_clarify'
  | 'name'
  | 'project_type'
  | 'description'
  | 'users'
  | 'auth'
  | 'integrations'
  | 'design'
  | 'deadline'
  | 'contact_email'
  | 'contact_phone'
  | 'schedule'
  | 'done'

type Answers = {
  name?: string
  project_type?: string
  description?: string
  users?: string
  auth?: string
  integrations?: string
  design?: string
  deadline?: string
  contact_email?: string
  contact_phone?: string
  schedule?: string
}

type ChatMsg = { from: 'bot' | 'user'; text: string }

// ─── Budget ───────────────────────────────────────────────────────────────────

const BASE: Record<string, number> = {
  'Landing Page': 800,
  'Página de Apresentação': 800,
  'Web App / SaaS': 3500,
  'Aplicação Web / SaaS': 3500,
  'E-commerce': 2200,
  'Loja Online': 2200,
  'Mobile App': 4500,
  'App Mobile': 4500,
  'API / Backend': 2000,
  'Dashboard / Analytics': 2800,
  'Dashboard / Análise de Dados': 2800,
  'Other': 1500,
  'Outro': 1500,
}

function calcBudget(answers: Answers): { low: number; high: number } {
  const base = BASE[answers.project_type ?? ''] ?? 2000
  let mult = 1
  if (answers.auth === 'Yes' || answers.auth === 'Sim') mult += 0.15
  if (answers.integrations === 'Yes' || answers.integrations === 'Sim') mult += 0.2
  if (answers.design === 'Custom Design' || answers.design === 'Design Personalizado') mult += 0.25
  if (answers.deadline === '< 2 weeks' || answers.deadline === '< 2 semanas') mult += 0.3
  return {
    low: Math.round((base * mult) / 100) * 100,
    high: Math.round((base * mult * 1.35) / 100) * 100,
  }
}

// ─── Stage config ─────────────────────────────────────────────────────────────
// Each stage defines:
//   getBotMsg  → message shown when ENTERING this stage
//   answerKey  → where to save the user's reply
//   next       → which stage to enter after user replies
//   inputType  → text / email / phone / buttons / none
//   getButtons → button labels (when inputType = 'buttons')

type InputType = 'text' | 'email' | 'phone' | 'buttons' | 'none'

type StageConfig = {
  getBotMsg: (a: Answers, lang: 'pt' | 'en') => string
  inputType: InputType
  getButtons?: (lang: 'pt' | 'en') => string[]
  answerKey?: keyof Answers
  next: Stage | ((answer: string) => Stage)
}

// Detects when the user gives an introduction instead of just a name
// e.g. "me chamo eduardo, mas meu apelido é dudu"
function looksLikeIntroduction(text: string): boolean {
  const t = text.toLowerCase()
  const introKeywords = [
    'me chamo', 'meu nome', 'sou o', 'sou a', 'apelido', 'alcunha',
    'my name is', 'i am', "i'm", 'they call me', 'nickname', 'but ',
    'mas ', 'porém', 'however',
  ]
  const hasKeyword = introKeywords.some((k) => t.includes(k))
  const hasMultipleWords = text.trim().split(/\s+/).length >= 3
  return hasKeyword || hasMultipleWords
}

const STAGES: Record<Stage, StageConfig> = {
  // ── 1. Welcome — choose between starting a project or exploring products ───
  init: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? 'Olá! Sou o assistente da FRPC.\n\nComo posso ajudar-te hoje?'
        : "Hi! I'm the FRPC assistant.\n\nHow can I help you today?",
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Iniciar um projeto', 'Explorar produtos FRPC']
        : ['Start a project', 'Explore FRPC products'],
    next: (answer) =>
      answer.includes('Explorar') || answer.includes('Explore')
        ? 'products_menu'
        : 'ask_name',
  },

  // ── 1a. Ask for name (project flow) ───────────────────────────────────────
  ask_name: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? 'Ótimo! Estou aqui para perceber o teu projeto e dar-te uma estimativa de orçamento em poucos minutos.\n\nComo te chamas?'
        : "Great! I'm here to understand your project and give you a budget estimate in just a few minutes.\n\nWhat's your name?",
    inputType: 'text',
    answerKey: 'name',
    next: (answer) => looksLikeIntroduction(answer) ? 'name_clarify' : 'name',
  },

  // ── 1b. Products menu ─────────────────────────────────────────────────────
  products_menu: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? 'Temos 2 produtos disponíveis.\n\nQual queres conhecer?'
        : 'We have 2 products available.\n\nWhich one would you like to know about?',
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Calendário de Férias', 'Project Manager']
        : ['Vacation Schedule', 'Project Manager'],
    next: (answer) =>
      answer.includes('Férias') || answer.includes('Vacation') || answer.includes('Schedule')
        ? 'product_ferias'
        : 'product_manager_info',
  },

  // ── 1c. Vacation Schedule info ────────────────────────────────────────────
  product_ferias: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? 'Calendário de Férias\n\nElimina emails e folhas de cálculo. Centraliza pedidos, aprovações e ausências da equipa numa plataforma simples e visual.\n\n✅ Pedidos e aprovações com 1 clique\n✅ Calendário visual de toda a equipa\n✅ Relatórios por departamento (CSV/PDF)\n✅ Setup em 2 minutos\n\nhttps://frpc-calendario-de-ferias-production.up.railway.app/login.html'
        : 'Vacation Schedule\n\nEliminate emails and spreadsheets. Centralize requests, approvals and team absences in a simple, visual platform.\n\n✅ Requests & approvals with 1 click\n✅ Visual team calendar\n✅ Reports by department (CSV/PDF)\n✅ 2 minute setup\n\nhttps://frpc-calendario-de-ferias-production.up.railway.app/login.html',
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Iniciar um projeto com FRPC', 'Ver Project Manager']
        : ['Start a project with FRPC', 'See Project Manager'],
    next: (answer) =>
      answer.includes('projeto') || answer.includes('project') || answer.includes('Start')
        ? 'ask_name'
        : 'product_manager_info',
  },

  // ── 1d. Project Manager info ──────────────────────────────────────────────
  product_manager_info: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? 'Project Manager\n\nFerramenta completa para gerir projetos, tarefas e equipas. Entrega mais rápido, com menos stress.\n\n✅ Quadros Kanban visuais\n✅ Gestão de equipas e prazos\n✅ Dashboard com KPIs em tempo real\n✅ Setup em 2 minutos\n\nhttps://frpc-project-production.up.railway.app/login.html'
        : 'Project Manager\n\nComplete tool to manage projects, tasks and teams. Ship faster, with less stress.\n\n✅ Visual Kanban boards\n✅ Team & deadline management\n✅ Real-time KPI dashboard\n✅ 2 minute setup\n\nhttps://frpc-project-production.up.railway.app/login.html',
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Iniciar um projeto com FRPC', 'Ver Calendário de Férias']
        : ['Start a project with FRPC', 'See Vacation Schedule'],
    next: (answer) =>
      answer.includes('projeto') || answer.includes('project') || answer.includes('Start')
        ? 'ask_name'
        : 'product_ferias',
  },

  // ── 1e. Clarify preferred name (when user gave a full introduction) ────────
  name_clarify: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Obrigado pela apresentação!\n\nComo preferes que te chame?`
        : `Thanks for the intro!\n\nWhat should I call you?`,
    inputType: 'text',
    answerKey: 'name',
    next: 'name',
  },

  // ── 2. Greet + ask project type ────────────────────────────────────────────
  name: {
    getBotMsg: (a, lang) =>
      lang === 'pt'
        ? `Prazer, ${a.name}!\n\nQue tipo de projeto tens em mente?`
        : `Nice to meet you, ${a.name}!\n\nWhat type of project do you have in mind?`,
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Página de Apresentação', 'Aplicação Web / SaaS', 'Loja Online', 'App Mobile', 'API / Backend', 'Dashboard / Análise de Dados', 'Outro']
        : ['Landing Page', 'Web App / SaaS', 'E-commerce', 'Mobile App', 'API / Backend', 'Dashboard / Analytics', 'Other'],
    answerKey: 'project_type',
    next: 'project_type',
  },

  // ── 3. Ask description ────────────────────────────────────────────────────
  project_type: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Boa escolha!\n\nDescreve brevemente o que queres construir — o problema que resolve ou a funcionalidade principal.`
        : `Great choice!\n\nBriefly describe what you want to build — the problem it solves or the main feature.`,
    inputType: 'text',
    answerKey: 'description',
    next: 'description',
  },

  // ── 4. Ask users ──────────────────────────────────────────────────────────
  description: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Ótimo! Quantos utilizadores estimas ter inicialmente?`
        : `Great! How many users do you expect initially?`,
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['1–10', '10–100', '100–1 000', '1 000+']
        : ['1–10', '10–100', '100–1,000', '1,000+'],
    answerKey: 'users',
    next: 'users',
  },

  // ── 5. Auth ───────────────────────────────────────────────────────────────
  users: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `O projeto precisa de autenticação de utilizadores (login / registo)?`
        : `Does the project need user authentication (login / signup)?`,
    inputType: 'buttons',
    getButtons: (lang) => (lang === 'pt' ? ['Sim', 'Não'] : ['Yes', 'No']),
    answerKey: 'auth',
    next: 'auth',
  },

  // ── 6. Integrations ───────────────────────────────────────────────────────
  auth: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Precisa de integrações com serviços externos? (pagamentos, APIs, CRMs...)`
        : `Does it need external integrations? (payments, APIs, CRMs...)`,
    inputType: 'buttons',
    getButtons: (lang) => (lang === 'pt' ? ['Sim', 'Não'] : ['Yes', 'No']),
    answerKey: 'integrations',
    next: 'integrations',
  },

  // ── 7. Design ─────────────────────────────────────────────────────────────
  integrations: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Como preferes o design?`
        : `What's your design preference?`,
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Design Personalizado', 'Componentes Padrão', 'Já tenho design']
        : ['Custom Design', 'Standard Components', 'I have a design'],
    answerKey: 'design',
    next: 'design',
  },

  // ── 8. Deadline ───────────────────────────────────────────────────────────
  design: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Qual é o prazo estimado para entrega?`
        : `What's your estimated delivery deadline?`,
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['< 2 semanas', '1–2 meses', '2–4 meses', 'Sem prazo definido']
        : ['< 2 weeks', '1–2 months', '2–4 months', 'No fixed deadline'],
    answerKey: 'deadline',
    next: 'deadline',
  },

  // ── 9. Budget reveal + ask email ─────────────────────────────────────────
  deadline: {
    getBotMsg: (a, lang) => {
      const { low, high } = calcBudget(a)
      return lang === 'pt'
        ? `Perfeito! Com base nas tuas respostas, estimo um orçamento entre:\n\n€${low.toLocaleString()} — €${high.toLocaleString()}\n\nPara te enviarmos uma proposta detalhada, qual é o teu email?`
        : `Perfect! Based on your answers, I estimate a budget between:\n\n€${low.toLocaleString()} — €${high.toLocaleString()}\n\nTo send you a detailed proposal, what's your email?`
    },
    inputType: 'email',
    answerKey: 'contact_email',
    next: 'contact_email',
  },

  // ── 10. Ask phone (optional) ─────────────────────────────────────────────
  contact_email: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Obrigado!\n\nE o teu número de telefone? (opcional — podes deixar em branco e premir Enter)`
        : `Thank you!\n\nAnd your phone number? (optional — leave blank and press Enter to skip)`,
    inputType: 'phone',
    answerKey: 'contact_phone',
    next: 'contact_phone',
  },

  // ── 11. Ask about scheduling a call ──────────────────────────────────────
  contact_phone: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Gostarias de agendar uma chamada de 15 minutos com a nossa equipa para discutir o projeto?`
        : `Would you like to schedule a 15-minute call with our team to discuss the project?`,
    inputType: 'buttons',
    getButtons: (lang) =>
      lang === 'pt'
        ? ['Sim, quero agendar', 'Não por agora']
        : ['Yes, schedule a call', 'Not right now'],
    answerKey: 'schedule',
    next: 'schedule',
  },

  // ── 12. Thank you — auto-transitions to done ──────────────────────────────
  schedule: {
    getBotMsg: (a, lang) => {
      const wantsCall = a.schedule?.includes('Sim') || a.schedule?.includes('Yes')
      return lang === 'pt'
        ? `Obrigado, ${a.name}!\n\nResumo enviado para ${a.contact_email}.\n\n${wantsCall ? 'Vais receber um link de agendamento em breve.' : 'A nossa equipa entrará em contacto em breve.'}`
        : `Thank you, ${a.name}!\n\nSummary sent to ${a.contact_email}.\n\n${wantsCall ? "You'll receive a scheduling link shortly." : 'Our team will reach out soon.'}`
    },
    inputType: 'none',
    next: 'done',
  },

  done: {
    getBotMsg: () => '',
    inputType: 'none',
    next: 'done',
  },
}

const PROGRESS: Record<Stage, number> = {
  init: 0,
  ask_name: 5,
  products_menu: 0,
  product_ferias: 0,
  product_manager_info: 0,
  name_clarify: 6,
  name: 10,
  project_type: 20,
  description: 30,
  users: 40,
  auth: 50,
  integrations: 60,
  design: 70,
  deadline: 78,
  contact_email: 86,
  contact_phone: 92,
  schedule: 97,
  done: 100,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function renderBotLine(line: string) {
  const urlMatch = line.match(/https?:\/\/[^\s]+/)
  if (urlMatch) {
    const url = urlMatch[0]
    const before = line.slice(0, urlMatch.index)
    const after = line.slice((urlMatch.index ?? 0) + url.length)
    return (
      <>
        {before}
        <ExternalLink className="inline-block w-3 h-3 text-blue-400 mr-1" style={{ verticalAlign: '-1px' }} />
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="underline text-blue-300 hover:text-blue-200 break-all"
          style={{ transition: 'color 150ms' }}
        >{url}</a>
        {after}
      </>
    )
  }
  return line
}

function isProductCard(text: string): boolean {
  const lines = text.split('\n')
  return lines.filter(l => l.startsWith('✅ ')).length >= 2 && lines.some(l => /^https?:\/\//.test(l.trim()))
}

function BotAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',
        border: '1px solid rgba(255,255,255,0.11)',
      }}
    >
      <Sparkles className="w-3.5 h-3.5 text-white/60" />
    </div>
  )
}

function ProductCardBubble({ text, lang }: { text: string; lang: 'pt' | 'en' }) {
  const lines = text.split('\n')
  const nonEmpty = lines.filter(l => l.trim())
  const title = nonEmpty[0]
  const description = nonEmpty.find(l => !l.startsWith('✅ ') && l !== title && !/^https?:\/\//.test(l))
  const features = lines.filter(l => l.startsWith('✅ ')).map(l => l.slice(2))
  const url = lines.find(l => /^https?:\/\//.test(l.trim()))?.trim()

  return (
    <div className="flex items-end gap-2" style={{ animation: 'chatBubbleIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
      <BotAvatar />
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          maxWidth: '88%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        {/* Accent stripe */}
        <div className="h-px" style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.7), rgba(139,92,246,0.5), rgba(59,130,246,0.3))' }} />
        {/* Title */}
        <div className="px-4 pt-4 pb-1.5">
          <p className="text-white font-semibold text-sm tracking-tight">{title}</p>
        </div>
        {/* Description */}
        {description && (
          <div className="px-4 pb-3">
            <p className="text-white/45 text-xs leading-relaxed">{description}</p>
          </div>
        )}
        {/* Divider */}
        <div className="mx-4 mb-3" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        {/* Features */}
        <div className="px-4 pb-3.5 space-y-2.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-px" />
              <span className="text-xs text-white/70 leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
        {/* CTA */}
        {url && (
          <div className="px-3 pb-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-black bg-white"
              style={{ transition: 'opacity 180ms' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {lang === 'pt' ? 'Experimentar agora' : 'Try it now'}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

const BotBubble = memo(function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2" style={{ animation: 'chatBubbleIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
      <BotAvatar />
      <div
        className="max-w-[84%] px-4 py-3 text-sm leading-relaxed text-white/85 rounded-2xl rounded-bl-sm"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {renderBotLine(line)}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
})

const UserBubble = memo(function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2 flex-row-reverse" style={{ animation: 'chatBubbleIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
      <div
        className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5 bg-white"
      >
        <User className="w-3 h-3 text-black" />
      </div>
      <div
        className="max-w-[80%] px-4 py-3 text-sm leading-relaxed font-medium rounded-2xl rounded-br-sm"
        style={{ background: 'rgba(255,255,255,0.97)', color: '#0a0a0f' }}
      >
        {text}
      </div>
    </div>
  )
})

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div
        className="px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {[0, 160, 320].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.35)',
              animation: `bounce 1.1s ${d}ms ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChatWidget() {
  const { lang } = useLang()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [stage, setStage] = useState<Stage>('init')
  const [answers, setAnswers] = useState<Answers>({})
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasBooted, setHasBooted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<Stage>('init')
  const answersRef = useRef<Answers>({})

  // Keep refs in sync (avoid stale closures in timeouts)
  stageRef.current = stage
  answersRef.current = answers

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && stage !== 'done') {
      const t = setTimeout(() => inputRef.current?.focus(), 400)
      return () => clearTimeout(t)
    }
  }, [isOpen, stage])

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  // Reset conversation when language changes (unless already finished)
  useEffect(() => {
    if (!hasBooted) return
    if (stage === 'done') return
    setHasBooted(false)
    setMessages([])
    setStage('init')
    setAnswers({})
    setInput('')
    setIsTyping(false)
    // Re-boot immediately so the new language message appears
    const botMsg = STAGES['init'].getBotMsg({}, lang)
    setIsTyping(true)
    const t = setTimeout(() => {
      setIsTyping(false)
      setMessages([{ from: 'bot', text: botMsg }])
      setHasBooted(true)
    }, 700)
    return () => clearTimeout(t)
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Boot conversation ────────────────────────────────────────────────────
  const boot = useCallback(() => {
    if (hasBooted) return
    setHasBooted(true)
    setIsTyping(true)
    const botMsg = STAGES['init'].getBotMsg({}, lang)
    setTimeout(() => {
      setIsTyping(false)
      setMessages([{ from: 'bot', text: botMsg }])
      // stage stays at 'init'
    }, 900)
  }, [hasBooted, lang])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    boot()
  }, [boot])

  // ── Advance conversation ─────────────────────────────────────────────────
  const advance = useCallback((userText: string) => {
    const currentStage = stageRef.current
    const currentAnswers = answersRef.current
    const cfg = STAGES[currentStage]

    // Save answer
    const newAnswers: Answers = cfg.answerKey
      ? { ...currentAnswers, [cfg.answerKey]: userText }
      : currentAnswers

    // Append user message
    setMessages((prev) => [...prev, { from: 'user', text: userText }])
    setAnswers(newAnswers)

    const nextStage = typeof cfg.next === 'function' ? cfg.next(userText) : cfg.next

    // Transition to done immediately if next is done
    if (nextStage === 'done') {
      setStage('done')
      submitLead(newAnswers).catch(() => {})
      return
    }

    setStage(nextStage)

    const nextCfg = STAGES[nextStage]
    const nextMsg = nextCfg.getBotMsg(newAnswers, lang)
    const delay = Math.min(600 + nextMsg.length * 6, 1800)

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { from: 'bot', text: nextMsg }])

      // If the next stage has no input (e.g. 'schedule'), auto-transition to done
      if (nextCfg.inputType === 'none') {
        submitLead(newAnswers).catch(() => {})
        setTimeout(() => setStage('done'), 600)
      }
    }, delay)
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submitLead(finalAnswers: Answers) {
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          budget: calcBudget(finalAnswers),
          lang,
        }),
      })
    } catch {
      // silent
    }
  }

  const handleTextSubmit = useCallback(() => {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    advance(text)
  }, [input, isTyping, advance])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTextSubmit()
    }
  }

  // ── Derived UI state ──────────────────────────────────────────────────────
  const currentCfg = STAGES[stage]
  const buttons = currentCfg.getButtons?.(lang) ?? []
  const progress = PROGRESS[stage]

  const showButtons =
    !isTyping && stage !== 'done' && currentCfg.inputType === 'buttons' && buttons.length > 0
  const showInput =
    !isTyping &&
    stage !== 'done' &&
    (currentCfg.inputType === 'text' ||
      currentCfg.inputType === 'email' ||
      currentCfg.inputType === 'phone')
  const isDone = stage === 'done' && !isTyping

  const title = 'FRPC Assistant'
  const subtitle = lang === 'pt' ? 'Online · responde em segundos' : 'Online · replies in seconds'
  const placeholder =
    currentCfg.inputType === 'email'
      ? (lang === 'pt' ? 'o.teu@email.com' : 'your@email.com')
      : currentCfg.inputType === 'phone'
      ? (lang === 'pt' ? '+351 9XX XXX XXX (opcional)' : '+1 555 000 0000 (optional)')
      : (lang === 'pt' ? 'Escreve aqui...' : 'Type here...')

  return (
    <>
      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <button
        onClick={handleOpen}
        aria-label={lang === 'pt' ? 'Abrir chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center active:scale-95"
        style={{
          background: '#fff',
          animation: !isOpen ? 'fabBreath 3s ease-in-out infinite' : 'none',
          transition: 'opacity 350ms cubic-bezier(0.16,1,0.3,1), transform 350ms cubic-bezier(0.16,1,0.3,1)',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.7) translateY(8px)' : 'scale(1)',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <Sparkles className="w-5 h-5 text-black" />
      </button>

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col"
        style={{
          width: 'min(400px, calc(100vw - 1.5rem))',
          height: 'min(600px, calc(100dvh - 5rem))',
          borderRadius: '22px',
          background: 'linear-gradient(180deg, #111116 0%, #0d0d11 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.025)',
          transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(16px)',
          transformOrigin: 'bottom right',
          pointerEvents: isOpen ? 'auto' : 'none',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #d0d0d0 100%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.45)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold tracking-tight leading-none">{title}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {/* Pulsing status dot */}
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                    style={{ animation: 'statusPulse 2.2s ease-in-out infinite', opacity: 0.6 }}
                  />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <p className="text-white/30 text-xs leading-none">{subtitle}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label={lang === 'pt' ? 'Fechar' : 'Close'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 active:scale-90"
            style={{ transition: 'all 160ms' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────── */}
        <div className="flex-shrink-0 h-px" style={{ background: 'rgba(255,255,255,0.04)', position: 'relative', overflow: 'visible' }}>
          <div
            style={{
              height: '2px',
              marginTop: '-1px',
              width: `${progress}%`,
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              transition: 'width 700ms cubic-bezier(0.16,1,0.3,1)',
              animation: progress > 0 && progress < 100 ? 'progressGlow 2s ease-in-out infinite' : 'none',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </div>

        {/* ── Messages ─────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {messages.map((msg, i) =>
            msg.from === 'bot'
              ? isProductCard(msg.text)
                ? <ProductCardBubble key={i} text={msg.text} lang={lang} />
                : <BotBubble key={i} text={msg.text} />
              : <UserBubble key={i} text={msg.text} />
          )}

          {isTyping && <TypingIndicator />}

          {isDone && (
            <div
              className="flex flex-col items-center gap-4 py-8 text-center"
              style={{ animation: 'chatBubbleIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(52,211,153,0.09)',
                  border: '1px solid rgba(52,211,153,0.18)',
                  boxShadow: '0 0 20px rgba(52,211,153,0.08)',
                }}
              >
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-white/35 text-xs max-w-[180px] leading-relaxed">
                {lang === 'pt' ? 'Receberás um email em breve.' : "You'll receive an email shortly."}
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Button choices ────────────────────────────────────────── */}
        {showButtons && (
          <div
            className="flex-shrink-0 px-3 pt-2.5 pb-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: buttons.length <= 2 ? '1fr' : 'repeat(2, 1fr)',
                gap: '5px',
              }}
            >
              {buttons.map((btn, i) => (
                <button
                  key={btn}
                  onClick={() => advance(btn)}
                  className="px-3 py-2.5 rounded-xl text-xs text-center active:scale-[0.96]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.65)',
                    transition: 'all 160ms',
                    lineHeight: '1.35',
                    animation: `chatButtonIn 0.3s ${i * 40}ms cubic-bezier(0.16,1,0.3,1) both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.92)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Text / email / phone input ───────────────────────────── */}
        {showInput && (
          <div
            className="flex-shrink-0 flex items-center gap-2 px-3 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <input
              ref={inputRef}
              type={currentCfg.inputType === 'email' ? 'email' : currentCfg.inputType === 'phone' ? 'tel' : 'text'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 200ms',
                caretColor: 'white',
              }}
              onFocus={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
              }}
              onBlur={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <button
              onClick={handleTextSubmit}
              disabled={!input.trim()}
              aria-label="Send"
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90"
              style={{
                background: input.trim() ? '#fff' : 'rgba(255,255,255,0.06)',
                color: input.trim() ? '#000' : 'rgba(255,255,255,0.18)',
                transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                transform: input.trim() ? 'scale(1)' : 'scale(0.95)',
                cursor: input.trim() ? 'pointer' : 'default',
              }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── Done footer ──────────────────────────────────────────── */}
        {isDone && (
          <div
            className="flex-shrink-0 flex items-center justify-center gap-1.5 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <Zap className="w-2.5 h-2.5 text-white/15" />
            <span className="text-white/15 text-xs">
              {lang === 'pt' ? 'Conversa concluída' : 'Conversation complete'}
            </span>
          </div>
        )}
      </div>
    </>
  )
}
