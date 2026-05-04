'use client'

import { useSwitch } from './language-provider'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { isSwitching } = useSwitch()

  return (
    <div style={{
      opacity: isSwitching ? 0 : 1,
      transform: isSwitching ? 'scale(0.994) translateY(3px)' : 'scale(1) translateY(0)',
      filter: isSwitching ? 'blur(3px)' : 'none',
      transition: 'opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease',
      willChange: 'opacity, transform, filter',
    }}>
      {children}
    </div>
  )
}
