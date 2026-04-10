"use client"

import { memo } from 'react'
import { useLanguage } from '../language-provider'

const SEPARATOR = <span className="mx-6 text-white/20">✦</span>

const MarqueeRow = memo(function MarqueeRow({
  words,
  direction,
  outlined,
  speed,
}: {
  words: string[]
  direction: 'left' | 'right'
  outlined: boolean
  speed: number
}) {
  // 4 copies to ensure seamless loop at -50%
  const items = [...words, ...words, ...words, ...words]

  return (
    <div className="overflow-hidden marquee-edge-fade">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `${direction === 'left' ? 'marqueeLeft' : 'marqueeRight'} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {items.map((word, i) => (
          <span
            key={i}
            className="inline-flex items-center text-5xl md:text-7xl lg:text-8xl font-serif font-bold"
            style={{
              fontFamily: 'var(--font-serif)',
              ...(outlined
                ? {
                    WebkitTextStroke: '1px rgba(255,255,255,0.15)',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }
                : { color: 'rgba(255,255,255,0.07)' }),
            }}
          >
            <span className="mx-8">{word}</span>
            {SEPARATOR}
          </span>
        ))}
      </div>
    </div>
  )
})

export function MarqueeSection() {
  const { t } = useLanguage()
  const words = t.marquee.words

  return (
    <section
      className="py-10 md:py-16 overflow-hidden border-y select-none"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="space-y-2 marquee-container">
        {/* Row 1 — left, outlined */}
        <MarqueeRow words={words} direction="left" outlined speed={38} />
        {/* Row 2 — right, filled */}
        <MarqueeRow words={words} direction="right" outlined={false} speed={28} />
      </div>
    </section>
  )
}
