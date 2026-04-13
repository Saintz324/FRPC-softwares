"use client"

import { memo } from 'react'
import Link from 'next/link'
import { Reveal } from '../reveal-animation'
import { MagneticButton } from '../magnetic-button'
import { TextSplit } from '../text-split'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

export const ContactSection = memo(function ContactSection() {
  const { t } = useLanguage()
  return (
    <section id="contact" className="relative py-32 md:py-48 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-white/[0.02] to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Left side - CTA */}
          <div>
            <Reveal>
              <ScrambleText as="span" text={t.contact.label} className="text-white/40 text-sm tracking-[0.3em] uppercase" />
            </Reveal>

            <div className="mt-8 mb-12">
              <h2 
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <TextSplit text={t.contact.title1} delay={200} />
              </h2>
              <h2
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight"
                style={{
                  fontFamily: 'var(--font-serif)',
                  WebkitTextStroke: '1px rgba(255,255,255,0.6)',
                  color: 'transparent',
                  wordBreak: 'keep-all',
                  overflowWrap: 'normal',
                }}
              >
                <ScrambleText text={t.contact.title2} />
              </h2>
              <h2 
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <TextSplit text={t.contact.title3} delay={600} />
              </h2>
            </div>

            <Reveal delay={800}>
              <ScrambleText as="p" text={t.contact.description} className="text-white/60 text-lg leading-relaxed max-w-md mb-12" />
            </Reveal>

            <Reveal delay={900}>
              <Link href="/start">
                <MagneticButton className="group inline-flex items-center gap-4 px-8 py-5 bg-white text-black text-lg font-medium rounded-full hover:bg-white/90 transition-all">
                  <ScrambleText text={t.contact.button} />
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </MagneticButton>
              </Link>
            </Reveal>
          </div>

          {/* Right side - Contact info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-12">
              <Reveal delay={200}>
                <div className="group">
                  <ScrambleText as="span" text={t.contact.email} className="text-white/40 text-sm tracking-wide uppercase mb-3 block" />
                  <a 
                    href="mailto:contato@frpc.com.br"
                    className="text-2xl md:text-3xl font-serif text-white hover:text-white/70 transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    it-admin@frpc.pt
                  </a>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="group">
                  <ScrambleText as="span" text={t.contact.phone} className="text-white/40 text-sm tracking-wide uppercase mb-3 block" />
                  <a 
                    href="tel:+5511999999999"
                    className="text-2xl md:text-3xl font-serif text-white hover:text-white/70 transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    +351 929 062 671
                  </a>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="group">
                  <ScrambleText as="span" text={t.contact.location} className="text-white/40 text-sm tracking-wide uppercase mb-3 block" />
                  <p 
                    className="text-2xl md:text-3xl font-serif text-white"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Setúbal, Portugal
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Social links */}
            <Reveal delay={500}>
              <div className="mt-16 pt-8 border-t border-white/10">
                <ScrambleText as="span" text={t.contact.socials} className="text-white/40 text-sm tracking-wide uppercase mb-6 block" />
                <div className="flex items-center gap-6">
                  {t.contact.socialNames.map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-white/60 hover:text-white text-sm tracking-wide transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
})
