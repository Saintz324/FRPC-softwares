"use client"

import { useLanguage } from '../language-provider'

export function MarqueeSection() {
  const { t } = useLanguage()  
  return (
    <section className="py-16 md:py-24 overflow-hidden border-y border-white/10">
      <div className="flex">
        {/* First marquee - moving left */}
        <div className="flex animate-marquee whitespace-nowrap">
          {[...t.marquee.words, ...t.marquee.words].map((word, index) => (
            <span 
              key={index}
              className="mx-8 text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-white/10 hover:text-white/30 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {word}
              <span className="mx-8 text-white/20">✦</span>
            </span>
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden>
          {[...t.marquee.words, ...t.marquee.words].map((word, index) => (
            <span 
              key={index}
              className="mx-8 text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-white/10 hover:text-white/30 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {word}
              <span className="mx-8 text-white/20">✦</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
