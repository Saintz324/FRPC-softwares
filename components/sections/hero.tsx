"use client"

import { memo, useEffect, useState } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { TextSplit } from '../text-split'
import { RotatingText } from '../rotating-text'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

// Memoized rotating text to prevent re-renders
const MemoizedRotatingText = memo(RotatingText)

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t, lang } = useLanguage()

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsVisible(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  function openChat() {
    window.dispatchEvent(new CustomEvent('open-chat'))
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto text-center relative z-10">
        <ScrambleText
          as="p"
          text={t.hero.intro}
          className={`text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase mb-8 md:mb-12 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ willChange: 'opacity, transform' }}
        />

        <div
          className={`transition-all duration-700 delay-100 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <TextSplit
            text={t.hero.main1}
            className="font-serif font-bold text-white leading-none tracking-tight justify-center"
            style={{
              fontSize: 'clamp(3.5rem, 15vw, 12rem)',
            }}
            delay={200}
            stagger={0.04}
            nowrap
          />
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8 mt-[-0.05em]">
          <div
            className={`hidden md:flex items-center justify-center transition-all duration-700 delay-300 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="relative">
              <MemoizedRotatingText
                text={t.hero.rotatingBadge}
                radius={50}
                className="text-white/70"
              />
              <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-300 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ willChange: 'opacity, transform' }}
          >
            <TextSplit
              text={t.hero.main2}
              className="font-serif font-bold leading-none tracking-tight justify-center"
              style={{
                fontSize: 'clamp(3.5rem, 15vw, 12rem)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
                WebkitTextFillColor: 'transparent',
              }}
              delay={400}
              stagger={0.04}
              nowrap
            />
          </div>
        </div>

        <div
          className={`mt-[-0.05em] transition-all duration-700 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <TextSplit
            text={t.hero.main3}
            className="font-serif font-bold text-white leading-none tracking-tight justify-center"
            style={{
              fontSize: 'clamp(3.5rem, 15vw, 12rem)',
            }}
            delay={500}
            stagger={0.04}
            nowrap
          />
        </div>

        <ScrambleText
          as="p"
          text={t.hero.subtitle}
          className={`text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mt-10 md:mt-16 transition-all duration-700 delay-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ willChange: 'opacity, transform' }}
        />

        <div
          className={`mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-[900ms] ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <a
            href="#projects"
            className="group px-8 py-4 bg-white text-black text-sm font-medium rounded-full flex items-center gap-3 hover:bg-white/90 transition-colors duration-200"
          >
            <ScrambleText text={t.hero.work} />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <ScrambleText text={t.hero.talk} />
          </a>
          <button
            onClick={openChat}
            className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            {lang === 'pt' ? 'Chat IA' : 'AI Chat'}
          </button>
        </div>
      </div>

      <div
        className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 transition-all duration-700 delay-[1100ms] ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ScrambleText text={t.hero.scroll} className="text-xs tracking-widest uppercase" />
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
