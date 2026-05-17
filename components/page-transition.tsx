'use client'

import { useSwitch } from './language-provider'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { isSwitching } = useSwitch()

  return (
    <div style={{
      transition: 'opacity 0.28s ease, filter 0.28s ease',
      opacity: isSwitching ? 0 : 1,
      filter: isSwitching ? 'blur(6px)' : 'none',
    }}>
      {children}
    </div>
  )
}
