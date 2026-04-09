"use client"

import { memo } from 'react'
import { Reveal } from '../reveal-animation'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

export const Footer = memo(function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Reveal>
            <a 
              href="#" 
              className="text-3xl md:text-4xl font-serif font-bold text-white hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              FRPC
            </a>
          </Reveal>

          {/* Copyright */}
          <Reveal delay={100}>
            <ScrambleText
              as="p"
              text={t.footer.copyright.replace('{year}', currentYear.toString())}
              className="text-white/40 text-sm text-center"
            />
          </Reveal>

          {/* Back to top */}
          <Reveal delay={200}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ScrambleText text={t.footer.backToTop} />
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                <svg 
                  className="w-4 h-4 text-white group-hover:text-black -rotate-90 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </Reveal>
        </div>

        {/* Bottom decoration */}
        <div className="mt-12 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </footer>
  )
})
