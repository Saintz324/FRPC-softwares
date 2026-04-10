'use client'

import { useState, useEffect, useRef, ElementType } from 'react'
import { useLanguage } from './language-provider'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

interface ScrambleTextProps {
  text: string
  className?: string
  as?: ElementType
  style?: React.CSSProperties
}

export function ScrambleText({ text, className, as: Tag = 'span', style }: ScrambleTextProps) {
  const { isSwitching } = useLanguage()
  const [display, setDisplay] = useState(text)
  const rafRef = useRef<number | null>(null)
  const phaseRef = useRef<'idle' | 'scrambling' | 'resolving'>('idle')

  function cancelRaf() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  // Phase 1: scramble when switching starts
  useEffect(() => {
    if (isSwitching) {
      phaseRef.current = 'scrambling'
      let frame = 0
      const scramble = () => {
        if (phaseRef.current !== 'scrambling') return
        // throttle: update display every 3 frames (~20fps) — imperceptible difference
        if (++frame % 3 === 0) {
          setDisplay(prev =>
            prev.split('').map(c => (c === ' ' ? ' ' : randomChar())).join('')
          )
        }
        rafRef.current = requestAnimationFrame(scramble)
      }
      cancelRaf()
      rafRef.current = requestAnimationFrame(scramble)
    } else {
      cancelRaf()
      phaseRef.current = 'idle'
      setDisplay(text)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitching])

  // Phase 2: resolve char by char when text prop changes
  useEffect(() => {
    if (!isSwitching) {
      setDisplay(text)
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

      // throttle: update display every 2 frames
      if (++frame % 2 === 0) {
        setDisplay(
          chars.map((char, i) => {
            if (char === ' ') return ' '
            if (i < resolved) return char
            return randomChar()
          }).join('')
        )
      }

      if (resolved < chars.length) {
        rafRef.current = requestAnimationFrame(resolve)
      } else {
        setDisplay(text)
        phaseRef.current = 'idle'
      }
    }
    rafRef.current = requestAnimationFrame(resolve)
    return cancelRaf
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <Tag className={className} style={style}>
      {display}
    </Tag>
  )
}
