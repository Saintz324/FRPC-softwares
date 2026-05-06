'use client'

import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/hero'

const ChatWidget = dynamic(
  () => import('@/components/chat-widget').then(m => ({ default: m.ChatWidget })),
  { ssr: false }
)
import { FeaturesSection } from '@/components/sections/features'
import { InsightsSection } from '@/components/sections/insights'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { WorkspaceSection } from '@/components/sections/workspace'
import { CTASection } from '@/components/sections/cta'

export default function Home() {
  return (
    <>

      <div style={{ width: '100%' }}>
        <div style={{ height: '100dvh' }}><HeroSection /></div>
        <FeaturesSection />
        <InsightsSection />
        <TestimonialsSection />
        <WorkspaceSection />
        <CTASection />
      </div>

      <ChatWidget />
    </>
  )
}
