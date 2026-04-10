"use client"

import { useEffect, useRef, useMemo, memo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useLanguage } from './language-provider'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)]

interface TextSplitProps {
  text: string
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
  nowrap?: boolean
}

function TextSplitComponent({ text, className = '', style, delay = 0, stagger = 0.03, nowrap = false }: TextSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const { isSwitching } = useLanguage()

  // Track current chars per span — updated via DOM, not state
  const rafRef = useRef<number | null>(null)
  const phaseRef = useRef<'idle' | 'scrambling' | 'resolving'>('idle')

  // Split text into characters only when text changes (memo prevents re-runs)
  const characters = useMemo(() => (
    text.split('').map((char, index) => ({
      char: char === ' ' ? '\u00A0' : char,
      key: `char-${index}`,
      index,
    }))
  ), [text])

  function cancel() {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  // Get span elements lazily
  function getSpans(): NodeListOf<HTMLElement> | null {
    return containerRef.current?.querySelectorAll('.char') as NodeListOf<HTMLElement> | null
  }

  // One-shot reveal via IntersectionObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let tid: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect()
        tid = setTimeout(() => requestAnimationFrame(() => setIsRevealed(true)), delay)
      }
    }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' })
    observer.observe(el)
    return () => { observer.disconnect(); clearTimeout(tid) }
  }, [delay])

  // Phase 1: scramble on language switch — direct DOM
  useEffect(() => {
    if (isSwitching) {
      phaseRef.current = 'scrambling'
      let frame = 0
      const go = () => {
        if (phaseRef.current !== 'scrambling') return
        if (++frame % 3 === 0) {
          getSpans()?.forEach(span => {
            if (span.textContent !== '\u00A0') span.textContent = rand()
          })
        }
        rafRef.current = requestAnimationFrame(go)
      }
      cancel()
      rafRef.current = requestAnimationFrame(go)
    } else {
      cancel()
      phaseRef.current = 'idle'
      // Restore current text
      const spans = getSpans()
      if (spans) {
        text.split('').forEach((c, i) => {
          if (spans[i]) spans[i].textContent = c === ' ' ? '\u00A0' : c
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitching])

  // Phase 2: resolve when text changes — direct DOM
  useEffect(() => {
    if (!isSwitching) {
      // Sync spans to new text directly
      const spans = getSpans()
      if (spans) {
        text.split('').forEach((c, i) => {
          if (spans[i]) spans[i].textContent = c === ' ' ? '\u00A0' : c
        })
      }
      return
    }
    cancel()
    phaseRef.current = 'resolving'
    let it = 0, frame = 0
    const chars = text.split('')
    const go = () => {
      if (phaseRef.current !== 'resolving') return
      it += 0.5
      const resolved = Math.floor(it)
      const spans = getSpans()
      if (spans && ++frame % 2 === 0) {
        chars.forEach((c, i) => {
          if (!spans[i]) return
          if (c === ' ') { spans[i].textContent = '\u00A0'; return }
          spans[i].textContent = i < resolved ? c : rand()
        })
      }
      if (resolved < chars.length) rafRef.current = requestAnimationFrame(go)
      else {
        const finalSpans = getSpans()
        if (finalSpans) chars.forEach((c, i) => {
          if (finalSpans[i]) finalSpans[i].textContent = c === ' ' ? '\u00A0' : c
        })
        phaseRef.current = 'idle'
      }
    }
    rafRef.current = requestAnimationFrame(go)
    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div ref={containerRef} className={`inline-flex ${nowrap ? 'flex-nowrap' : 'flex-wrap'} ${className}`} style={style}>
      {characters.map(({ char, key, index }) => (
        <span
          key={key}
          className="char inline-block"
          style={{
            transform: isRevealed ? 'translateY(0)' : 'translateY(100%)',
            opacity: isRevealed ? 1 : 0,
            transition: isRevealed
              ? `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * stagger}s, opacity 0.6s ease-out ${index * stagger}s`
              : 'none',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}

export const TextSplit = memo(TextSplitComponent)
