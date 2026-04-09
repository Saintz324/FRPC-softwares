"use client"

import dynamic from 'next/dynamic'
import { SplineBackground } from '@/components/spline-background'
import { CursorFollower } from '@/components/cursor-follower'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/sections/hero'

// Lazy load sections that are below the fold
const AboutSection = dynamic(() => import('@/components/sections/about').then(mod => ({ default: mod.AboutSection })), {
  loading: () => null,
  ssr: true
})

const ProjectsSection = dynamic(() => import('@/components/sections/projects').then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => null,
  ssr: true
})

const ServicesSection = dynamic(() => import('@/components/sections/services').then(mod => ({ default: mod.ServicesSection })), {
  loading: () => null,
  ssr: true
})

const MarqueeSection = dynamic(() => import('@/components/sections/marquee').then(mod => ({ default: mod.MarqueeSection })), {
  loading: () => null,
  ssr: true
})

const ContactSection = dynamic(() => import('@/components/sections/contact').then(mod => ({ default: mod.ContactSection })), {
  loading: () => null,
  ssr: true
})

const Footer = dynamic(() => import('@/components/sections/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => null,
  ssr: true
})

export default function Home() {
  return (
    <>
      {/* Custom cursor - only visible on desktop */}
      <div className="hidden md:block">
        <CursorFollower />
      </div>

      {/* Spline 3D Background */}
      <SplineBackground />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <MarqueeSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
