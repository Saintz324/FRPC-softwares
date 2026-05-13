'use client'

import { useSwitch } from './language-provider'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { isSwitching } = useSwitch()

  return (
    <div style={{
      transition: 'filter 0.22s ease',
      filter: isSwitching ? 'blur(1.5px) brightness(0.92)' : 'none',
    }}>
      {children}
    </div>
  )
}
