'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Send, Sparkles, User, ChevronDown, Check, Zap } from 'lucide-react'
import { useLang } from '@/components/language-provider'

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | 'init'
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
  // ── 1. Ask for name ────────────────────────────────────────────────────────
  init: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? '👋 Olá! Sou o assistente da FRPC.\n\nEstou aqui para perceber o teu projeto e dar-te uma estimativa de orçamento em poucos minutos.\n\nComo te chamas?'
        : "👋 Hi! I'm the FRPC assistant.\n\nI'm here to understand your project and give you a budget estimate in just a few minutes.\n\nWhat's your name?",
    inputType: 'text',
    answerKey: 'name',
    next: (answer) => looksLikeIntroduction(answer) ? 'name_clarify' : 'name',
  },

  // ── 1b. Clarify preferred name (when user gave a full introduction) ────────
  name_clarify: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Obrigado pela apresentação! 😄\n\nComo preferes que te chame?`
        : `Thanks for the intro! 😄\n\nWhat should I call you?`,
    inputType: 'text',
    answerKey: 'name',
    next: 'name',
  },

  // ── 2. Greet + ask project type ────────────────────────────────────────────
  name: {
    getBotMsg: (a, lang) =>
      lang === 'pt'
        ? `Prazer, ${a.name}! 🙌\n\nQue tipo de projeto tens em mente?`
        : `Nice to meet you, ${a.name}! 🙌\n\nWhat type of project do you have in mind?`,
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
        ? `Boa escolha! 🎯\n\nDescreve brevemente o que queres construir — o problema que resolve ou a funcionalidade principal.`
        : `Great choice! 🎯\n\nBriefly describe what you want to build — the problem it solves or the main feature.`,
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
        ? `✅ Perfeito! Com base nas tuas respostas, estimo um orçamento entre:\n\n💰 €${low.toLocaleString()} — €${high.toLocaleString()}\n\nPara te enviarmos uma proposta detalhada, qual é o teu email?`
        : `✅ Perfect! Based on your answers, I estimate a budget between:\n\n💰 €${low.toLocaleString()} — €${high.toLocaleString()}\n\nTo send you a detailed proposal, what's your email?`
    },
    inputType: 'email',
    answerKey: 'contact_email',
    next: 'contact_email',
  },

  // ── 10. Ask phone (optional) ─────────────────────────────────────────────
  contact_email: {
    getBotMsg: (_, lang) =>
      lang === 'pt'
        ? `Obrigado! 📧\n\nE o teu número de telefone? (opcional — podes deixar em branco e premir Enter)`
        : `Thank you! 📧\n\nAnd your phone number? (optional — leave blank and press Enter to skip)`,
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
        ? ['Sim, quero agendar! 📅', 'Não por agora']
        : ['Yes, schedule a call! 📅', 'Not right now'],
    answerKey: 'schedule',
    next: 'schedule',
  },

  // ── 12. Thank you — auto-transitions to done ──────────────────────────────
  schedule: {
    getBotMsg: (a, lang) => {
      const wantsCall = a.schedule?.includes('Sim') || a.schedule?.includes('Yes')
      return lang === 'pt'
        ? `🎉 Obrigado, ${a.name}!\n\nResumo enviado para ${a.contact_email}.\n\n${wantsCall ? 'Vais receber um link de agendamento em breve.' : 'A nossa equipa entrará em contacto em breve.'}\n\nFica à vontade para explorar os nossos produtos! 🚀`
        : `🎉 Thank you, ${a.name}!\n\nSummary sent to ${a.contact_email}.\n\n${wantsCall ? "You'll receive a scheduling link shortly." : 'Our team will reach out soon.'}\n\nFeel free to explore our products! 🚀`
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

const BotBubble = memo(function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2.5">
      <div
        className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Sparkles className="w-4 h-4 text-white/70" />
      </div>
      <div
        className="max-w-[82%] px-4 py-3 text-sm leading-relaxed text-white/90 rounded-3xl rounded-bl-md"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
})

const UserBubble = memo(function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2.5 flex-row-reverse">
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5 bg-white">
        <User className="w-3.5 h-3.5 text-black" />
      </div>
      <div className="max-w-[82%] px-4 py-3 text-sm leading-relaxed bg-white text-black font-medium rounded-3xl rounded-br-md">
        {text}
      </div>
    </div>
  )
})

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div
        className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <Sparkles className="w-4 h-4 text-white/60" />
      </div>
      <div
        className="px-4 py-3.5 rounded-3xl rounded-bl-md flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: `${d}ms`, animationDuration: '1s' }}
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
      {/* ── FAB ──────────────────────────────────────────────────── */}
      <button
        onClick={handleOpen}
        aria-label={lang === 'pt' ? 'Abrir chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center active:scale-95"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          transition: 'opacity 300ms ease, transform 300ms ease, box-shadow 300ms ease',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.75)' : 'scale(1)',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)'
        }}
      >
        <Sparkles className="w-5 h-5" />
        <span
          className="absolute inset-0 rounded-2xl animate-ping"
          style={{ background: 'white', opacity: 0.15 }}
        />
      </button>

      {/* ── Chat panel ───────────────────────────────────────────── */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl"
        style={{
          width: 'min(420px, calc(100vw - 1.5rem))',
          height: 'min(620px, calc(100dvh - 5rem))',
          background: 'linear-gradient(180deg, #131317 0%, #0e0e12 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)',
          transition:
            'opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(24px)',
          transformOrigin: 'bottom right',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0 rounded-t-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #d0d0d0 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold tracking-tight leading-none">{title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 6px rgba(52,211,153,0.9)' }}
                />
                <p className="text-white/40 text-xs leading-none">{subtitle}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label={lang === 'pt' ? 'Fechar' : 'Close'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-90"
            style={{ transition: 'color 200ms, background 200ms, transform 150ms' }}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full"
            style={{
              width: `${progress}%`,
              background: 'rgba(255,255,255,0.3)',
              transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 overscroll-contain">
          {messages.map((msg, i) =>
            msg.from === 'bot'
              ? <BotBubble key={i} text={msg.text} />
              : <UserBubble key={i} text={msg.text} />
          )}

          {isTyping && <TypingIndicator />}

          {/* Done state */}
          {isDone && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(52,211,153,0.12)',
                  border: '1px solid rgba(52,211,153,0.25)',
                }}
              >
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white/50 text-sm">
                {lang === 'pt' ? 'Receberás um email em breve!' : "You'll receive an email shortly!"}
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Button choices */}
        {showButtons && (
          <div
            className="flex-shrink-0 px-4 pb-3 flex flex-wrap gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}
          >
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => advance(btn)}
                className="px-4 py-2.5 rounded-2xl text-sm text-white/80 hover:text-white active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'background 200ms, color 200ms, transform 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        )}

        {/* Text / email / phone input */}
        {showInput && (
          <div
            className="flex-shrink-0 p-4 flex items-center gap-3 rounded-b-3xl"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <input
              ref={inputRef}
              type={
                currentCfg.inputType === 'email'
                  ? 'email'
                  : currentCfg.inputType === 'phone'
                  ? 'tel'
                  : 'text'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
                transition: 'background 200ms, border-color 200ms',
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
              }}
            />
            <button
              onClick={handleTextSubmit}
              disabled={!input.trim()}
              aria-label="Send"
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white text-black active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                transition: 'opacity 200ms, transform 150ms',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Done footer */}
        {isDone && (
          <div
            className="flex-shrink-0 px-5 py-4 rounded-b-3xl flex items-center justify-center gap-2 text-xs text-white/25"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Zap className="w-3 h-3" />
            <span>{lang === 'pt' ? 'Conversa concluída' : 'Conversation complete'}</span>
          </div>
        )}
      </div>
    </>
  )
}
