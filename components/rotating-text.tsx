"use client"

import { useMemo, memo } from 'react'

interface RotatingTextProps {
  text: string
  radius?: number
  className?: string
}

function RotatingTextComponent({ text, radius = 80, className = '' }: RotatingTextProps) {
  // Memoize character calculations
  const characters = useMemo(() => {
    const chars = text.split('')
    const angleStep = 360 / chars.length
    return chars.map((char, index) => ({
      char,
      angle: index * angleStep,
      key: `${char}-${index}`
    }))
  }, [text])

  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width: radius * 2, 
        height: radius * 2,
        animation: 'rotateText 20s linear infinite',
        willChange: 'transform'
      }}
    >
      {characters.map(({ char, angle, key }) => (
        <span
          key={key}
          className="absolute left-1/2 top-0 origin-bottom text-[10px] font-medium tracking-wider uppercase"
          style={{
            transform: `translateX(-50%) rotate(${angle}deg)`,
            height: radius,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}

// Memoize to prevent re-renders
export const RotatingText = memo(RotatingTextComponent)
