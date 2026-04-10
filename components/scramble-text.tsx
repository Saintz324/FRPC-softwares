'use client'

import { useEffect, useRef, ElementType, useCallback } from 'react'
import { useLanguage } from './language-provider'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)]

interface ScrambleTextProps {
  text: string
  className?: string
  as?: ElementType
  style?: React.CSSProperties
}

// Direct DOM manipulation — zero React re-renders during scramble
export function ScrambleText({ text, className, as: Tag = 'span', style }: ScrambleTextProps) {
  const { isSwitching } = useLanguage()
  const elRef = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const phaseRef = useRef<'idle' | 'scrambling' | 'resolving'>('idle')
  const textRef = useRef(text)
  textRef.current = text

  const setRef = useCallback((el: HTMLElement | null) => { elRef.current = el }, [])

  function setText(value: string) {
    if (elRef.current) elRef.current.textContent = value
  }

  function cancel() {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  // Phase 1: scramble on switch start
  useEffect(() => {
    if (isSwitching) {
      phaseRef.current = 'scrambling'
      const prev = elRef.current?.textContent ?? text
      let frame = 0
      const go = () => {
        if (phaseRef.current !== 'scrambling') return
        if (++frame % 3 === 0) setText(prev.split('').map(c => c === ' ' ? ' ' : rand()).join(''))
        rafRef.current = requestAnimationFrame(go)
      }
      cancel()
      rafRef.current = requestAnimationFrame(go)
    } else {
      cancel()
      phaseRef.current = 'idle'
      setText(textRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitching])

  // Phase 2: resolve char-by-char when text prop changes
  useEffect(() => {
    textRef.current = text
    if (!isSwitching) { setText(text); return }
    cancel()
    phaseRef.current = 'resolving'
    let it = 0, frame = 0
    const chars = text.split('')
    const go = () => {
      if (phaseRef.current !== 'resolving') return
      it += 0.5
      const resolved = Math.floor(it)
      if (++frame % 2 === 0) {
        setText(chars.map((c, i) => (c === ' ' ? ' ' : i < resolved ? c : rand())).join(''))
      }
      if (resolved < chars.length) rafRef.current = requestAnimationFrame(go)
      else { setText(text); phaseRef.current = 'idle' }
    }
    rafRef.current = requestAnimationFrame(go)
    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tag ref={setRef as any} className={className} style={style}>{text}</Tag>
}
