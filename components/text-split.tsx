"use client"

import { useEffect, useRef, useMemo, memo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useLanguage } from './language-provider'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

interface TextSplitProps {
  text: string
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
}

function TextSplitComponent({ text, className = '', style, delay = 0, stagger = 0.03 }: TextSplitProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const { isSwitching } = useLanguage()
  const [displayChars, setDisplayChars] = useState<string[]>(() => text.split(''))
  const rafRef = useRef<number | null>(null)
  const phaseRef = useRef<'idle' | 'scrambling' | 'resolving'>('idle')

  function cancelRaf() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let timeoutId: ReturnType<typeof setTimeout>

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          timeoutId = setTimeout(() => {
            requestAnimationFrame(() => setIsRevealed(true))
          }, delay)
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [delay]) // removed isRevealed — observer disconnects itself on first intersection

  // Phase 1: scramble when switching starts
  useEffect(() => {
    if (isSwitching) {
      phaseRef.current = 'scrambling'
      let frame = 0
      const scramble = () => {
        if (phaseRef.current !== 'scrambling') return
        // throttle: update every 3 frames (~20fps)
        if (++frame % 3 === 0) {
          setDisplayChars(prev =>
            prev.map(c => (c === ' ' || c === '\u00A0' ? c : randomChar()))
          )
        }
        rafRef.current = requestAnimationFrame(scramble)
      }
      cancelRaf()
      rafRef.current = requestAnimationFrame(scramble)
    } else {
      cancelRaf()
      phaseRef.current = 'idle'
      setDisplayChars(text.split(''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitching])

  // Phase 2: resolve char by char when text changes
  useEffect(() => {
    if (!isSwitching) {
      setDisplayChars(text.split(''))
      return
    }
    cancelRaf()
    phaseRef.current = 'resolving'

    let iteration = 0
    let frame = 0
    const chars = text.split('')
    const resolve = () => {
      if (phaseRef.current !== 'resolving') return
      iteration += 0.5
      const resolved = Math.floor(iteration)

      // throttle: update every 2 frames
      if (++frame % 2 === 0) {
        setDisplayChars(
          chars.map((char, i) => {
            if (char === ' ') return ' '
            if (i < resolved) return char
            return randomChar()
          })
        )
      }

      if (resolved < chars.length) {
        rafRef.current = requestAnimationFrame(resolve)
      } else {
        setDisplayChars(chars)
        phaseRef.current = 'idle'
      }
    }
    rafRef.current = requestAnimationFrame(resolve)
    return cancelRaf
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const characters = useMemo(() => {
    return text.split('').map((char, index) => ({
      char: char === ' ' ? '\u00A0' : char,
      key: `char-${index}`,
      index,
    }))
  }, [text])

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {characters.map(({ key, index }) => {
        const dc = displayChars[index]
        const shown = dc === ' ' ? '\u00A0' : (dc ?? '\u00A0')
        return (
          <span
            key={key}
            className="char inline-block"
            style={{
              transform: isRevealed ? 'translateY(0)' : 'translateY(100%)',
              opacity: isRevealed ? 1 : 0,
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out',
              transitionDelay: isRevealed ? `${index * stagger}s` : '0s',
            }}
          >
            {shown}
          </span>
        )
      })}
    </div>
  )
}

export const TextSplit = memo(TextSplitComponent)
