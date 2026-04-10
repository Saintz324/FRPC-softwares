'use client'

import { memo } from 'react'

// Static noise overlay — no animation, no SVG filter repaint.
// The fixed position + scrolling content behind it creates a natural
// parallax grain effect without any JS or per-frame cost.
export const Grain = memo(function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999]"
      aria-hidden
      style={{
        opacity: 0.032,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
  )
})
