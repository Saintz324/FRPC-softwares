'use client'

import { useSwitch } from './language-provider'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { isSwitching } = useSwitch()

  return (
    <div style={isSwitching ? {
      opacity: 0,
      transform: 'scale(0.994) translateY(3px)',
      filter: 'blur(3px)',
      transition: 'opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease',
      willChange: 'opacity, transform, filter',
    } : {
      transition: 'opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease',
    }}>
      {children}
    </div>
  )
}
