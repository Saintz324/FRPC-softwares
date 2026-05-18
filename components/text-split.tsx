"use client"

import { useEffect, useLayoutEffect, useRef, useMemo, memo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useLanguage } from './language-provider'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)]
const NBSP = ' '

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

  const rafRef = useRef<number | null>(null)
  const phaseRef = useRef<'idle' | 'scrambling' | 'resolving'>('idle')

  const characters = useMemo(() => (
    text.split('').map((char, index) => ({
      char: char === ' ' ? NBSP : char,
      key: `char-${index}`,
      index,
    }))
  ), [text])

  function cancel() {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

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
            if (span.textContent !== NBSP) span.textContent = rand()
          })
        }
        rafRef.current = requestAnimationFrame(go)
      }
      cancel()
      rafRef.current = requestAnimationFrame(go)
    } else {
      if (phaseRef.current !== 'resolving') {
        cancel()
        phaseRef.current = 'idle'
      }
      const spans = getSpans()
      if (spans) {
        text.split('').forEach((c, i) => {
          if (spans[i]) spans[i].textContent = c === ' ' ? NBSP : c
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitching])

  // Phase 2: resolve when text changes — useLayoutEffect prevents flash of final text before animation
  useLayoutEffect(() => {
    if (!isSwitching) {
      const spans = getSpans()
      if (spans) {
        text.split('').forEach((c, i) => {
          if (spans[i]) spans[i].textContent = c === ' ' ? NBSP : c
        })
      }
      return
    }
    // Immediately scramble before first paint to prevent flash
    const spans = getSpans()
    if (spans) spans.forEach(s => { if (s.textContent !== NBSP) s.textContent = rand() })
    cancel()
    phaseRef.current = 'resolving'
    let it = 0
    const chars = text.split('')
    const go = () => {
      if (phaseRef.current !== 'resolving') return
      it += 1.2
      const resolved = Math.floor(it)
      const currentSpans = getSpans()
      if (currentSpans) {
        chars.forEach((c, i) => {
          if (!currentSpans[i]) return
          if (c === ' ') { currentSpans[i].textContent = NBSP; return }
          currentSpans[i].textContent = i < resolved ? c : rand()
        })
      }
      if (resolved < chars.length) rafRef.current = requestAnimationFrame(go)
      else {
        const finalSpans = getSpans()
        if (finalSpans) chars.forEach((c, i) => {
          if (finalSpans[i]) finalSpans[i].textContent = c === ' ' ? NBSP : c
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
