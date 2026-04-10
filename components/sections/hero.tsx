"use client"

import { memo, useEffect, useState } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { TextSplit } from '../text-split'
import { RotatingText } from '../rotating-text'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

const MemoizedRotatingText = memo(RotatingText)

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t, lang } = useLanguage()

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  function openChat() {
    window.dispatchEvent(new CustomEvent('open-chat'))
  }

  const fadeIn = (delay: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 700ms ${delay}ms ease-out, transform 700ms ${delay}ms ease-out`,
  })

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 pb-36 overflow-hidden">
      {/* Static radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-white/[0.022] blur-[130px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.022,
          maskImage: 'radial-gradient(ellipse 65% 65% at 50% 45%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 50% 45%, black 0%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl w-full mx-auto text-center relative z-10">
        <ScrambleText
          as="p"
          text={t.hero.intro}
          className="text-white/40 text-xs md:text-sm tracking-[0.3em] uppercase mb-6 md:mb-8"
          style={fadeIn(0)}
        />

        <div style={fadeIn(100)}>
          <TextSplit
            text={t.hero.main1}
            className="font-serif font-bold text-white leading-none tracking-tight justify-center"
            style={{ fontSize: 'clamp(3.5rem, 15vw, 12rem)' }}
            delay={200}
            stagger={0.04}
            nowrap
          />
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8 mt-[-0.05em]">
          <div
            className="hidden md:flex items-center justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.5)',
              transition: 'opacity 700ms 300ms ease-out, transform 700ms 300ms ease-out',
            }}
          >
            <div className="relative">
              <MemoizedRotatingText text={t.hero.rotatingBadge} radius={50} className="text-white/70" />
              <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            </div>
          </div>

          <div style={fadeIn(300)}>
            <TextSplit
              text={t.hero.main2}
              className="font-serif font-bold leading-none tracking-tight justify-center"
              style={{
                fontSize: 'clamp(3.5rem, 15vw, 12rem)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.45)',
                WebkitTextFillColor: 'transparent',
              }}
              delay={400}
              stagger={0.04}
              nowrap
            />
          </div>
        </div>

        <div style={{ ...fadeIn(500), marginTop: '-0.05em' }}>
          <TextSplit
            text={t.hero.main3}
            className="font-serif font-bold text-white leading-none tracking-tight justify-center"
            style={{ fontSize: 'clamp(3.5rem, 15vw, 12rem)' }}
            delay={500}
            stagger={0.04}
            nowrap
          />
        </div>

        <ScrambleText
          as="p"
          text={t.hero.subtitle}
          className="text-white/55 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mt-10 md:mt-16"
          style={fadeIn(700)}
        />

        <div
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
          style={fadeIn(900)}
        >
          <a
            href="#projects"
            className="group relative overflow-hidden px-8 py-4 bg-white text-black text-sm font-semibold rounded-full flex items-center gap-3"
            style={{ boxShadow: '0 0 28px rgba(255,255,255,0.1)', transition: 'background-color 250ms' }}
          >
            <ScrambleText text={t.hero.work} />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>

          <a
            href="#contact"
            className="px-8 py-4 text-white/75 hover:text-white text-sm font-medium rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.18)',
              transition: 'color 250ms, background-color 250ms, border-color 250ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = ''
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
          >
            <ScrambleText text={t.hero.talk} />
          </a>

          <button
            onClick={openChat}
            className="flex items-center gap-2 px-8 py-4 text-white/75 hover:text-white text-sm font-medium rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.18)',
              transition: 'color 250ms, background-color 250ms, border-color 250ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = ''
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
          >
            <MessageCircle className="w-4 h-4" />
            {lang === 'pt' ? 'Chat IA' : 'AI Chat'}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/35"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 700ms 1100ms ease-out' }}
      >
        <ScrambleText text={t.hero.scroll} className="text-xs tracking-widest uppercase" />
        <div className="relative w-px h-10 overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/50 to-transparent"
            style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}
