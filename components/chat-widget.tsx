'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Sparkles, User, ChevronDown } from 'lucide-react'
import { sendMessage, type Message } from '@/lib/chatAgent'
import { useLanguage } from '@/components/language-provider'

const ui = {
  pt: {
    title: 'FRPC Assistant',
    subtitle: 'Online • Responde em segundos',
    placeholder: 'Escreve uma mensagem...',
    welcome:
      'Olá! 👋 Sou o assistente da FRPC.\n\nPosso ajudar com:\n• Informações sobre produtos e serviços\n• Preços e funcionalidades\n• Agendar um contacto com a equipa\n\nComo posso ajudar?',
    typing: 'A escrever',
    error: 'Algo correu mal. Tenta novamente.',
    openLabel: 'Abrir chat',
    closeLabel: 'Fechar',
  },
  en: {
    title: 'FRPC Assistant',
    subtitle: 'Online • Replies in seconds',
    placeholder: 'Write a message...',
    welcome:
      "Hi there! 👋 I'm the FRPC assistant.\n\nI can help with:\n• Product & service information\n• Pricing & features\n• Scheduling a callback with the team\n\nHow can I help?",
    typing: 'Typing',
    error: 'Something went wrong. Please try again.',
    openLabel: 'Open chat',
    closeLabel: 'Close',
  },
}

function MessageBubble({ msg, isLast }: { msg: Message; isLast: boolean }) {
  const isUser = msg.role === 'user'

  const lines = msg.content.split('\n')

  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${isLast ? '' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5 ${
          isUser
            ? 'bg-white'
            : 'bg-white/[0.08] border border-white/10'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-black" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-white/60" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[76%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-white text-black font-medium rounded-3xl rounded-br-md'
            : 'text-white/85 rounded-3xl rounded-bl-md border border-white/[0.07]'
        }`}
        style={
          isUser
            ? undefined
            : { background: 'rgba(255,255,255,0.055)' }
        }
      >
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-7 h-7 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center mb-0.5 flex-shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white/60" />
      </div>
      <div
        className="px-4 py-3.5 rounded-3xl rounded-bl-md border border-white/[0.07] flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,0.055)' }}
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
          />
        ))}
      </div>
    </div>
  )
}

export function ChatWidget() {
  const { lang } = useLanguage()
  const t = ui[lang]

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.welcome },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Listen for external open trigger (dispatched by the hero button)
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]

    setMessages(updated)
    setInput('')
    setIsLoading(true)

    try {
      const reply = await sendMessage(updated)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t.error },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, t.error])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── Floating open button ─────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={t.openLabel}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-2xl
          bg-white text-black
          flex items-center justify-center
          shadow-[0_8px_32px_rgba(0,0,0,0.6)]
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]
          active:scale-95
          ${isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}
        `}
      >
        <Sparkles className="w-5 h-5" />
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-2xl animate-ping opacity-20"
          style={{ background: 'white' }}
        />
      </button>

      {/* ── Chat window ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        className={`
          fixed bottom-6 right-6 z-50
          w-[min(420px,calc(100vw-1.5rem))]
          flex flex-col
          rounded-3xl
          transition-all duration-500
          origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-[0.85] translate-y-8 pointer-events-none'
          }
        `}
        style={{
          height: 'min(600px, calc(100dvh - 5rem))',
          background: 'linear-gradient(180deg, #141418 0%, #0f0f13 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0 rounded-t-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold tracking-tight leading-none">
                {t.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
                />
                <p className="text-white/40 text-xs leading-none">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label={t.closeLabel}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 overscroll-contain">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input ── */}
        <div
          className="flex-shrink-0 p-4 flex items-center gap-3 rounded-b-3xl"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 disabled:opacity-40"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send"
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white text-black transition-all duration-200 hover:bg-white/90 active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
