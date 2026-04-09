"use client"

import { useEffect, useState, ReactNode } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Reveal } from './reveal-animation'
import { MagneticButton } from './magnetic-button'
import { TextSplit } from './text-split'
import { ProductNav } from './product-nav'

export type ProductFeature = {
  icon: ReactNode
  title: string
  description: string
}

export type ProductStat = {
  value: string
  label: string
}

export type ProductData = {
  /** e.g. "FRPC Software · Gestão de Equipas" */
  label: string
  /** First line of the big heading */
  name: string
  /** Second line, rendered with outline style */
  nameAccent?: string
  /** Short punchy tagline shown below the heading */
  tagline: string
  /** Longer description below the tagline */
  description: string
  /** URL of the deployed app */
  externalUrl: string
  /** Primary CTA label */
  ctaPrimary: string
  /** Secondary CTA label (scrolls to features) */
  ctaSecondary: string
  stats: ProductStat[]
  featuresTitle: string
  features: ProductFeature[]
  forWhoTitle: string
  forWhoDescription: string
  forWhoItems: string[]
  /** Large text above the final CTA */
  ctaFinalTitle: string
  ctaFinalDescription: string
}

export function ProductPageTemplate({ product }: { product: ProductData }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <ProductNav externalUrl={product.externalUrl} tryLabel={product.ctaPrimary} />

      {/* Gradient background — lighter than the Spline version */}
      <div
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      />

      {/* Decorative blobs */}
      <div className="fixed top-1/4 -left-64 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-64 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none -z-10" />

      <main className="relative z-10">
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl w-full mx-auto text-center">
            {/* Label */}
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase">
                {product.label}
              </span>
            </div>

            {/* Big heading */}
            <div
              className={`mt-8 transition-all duration-700 delay-100 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              <TextSplit
                text={product.name}
                className="font-serif font-bold text-white leading-none tracking-tight justify-center"
                style={{ fontSize: 'clamp(3rem, 12vw, 10rem)' }}
                delay={200}
                stagger={0.04}
              />
              {product.nameAccent && (
                <TextSplit
                  text={product.nameAccent}
                  className="font-serif font-bold leading-none tracking-tight justify-center"
                  style={{
                    fontSize: 'clamp(3rem, 12vw, 10rem)',
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.45)',
                    WebkitTextFillColor: 'transparent',
                  }}
                  delay={400}
                  stagger={0.04}
                />
              )}
            </div>

            {/* Tagline */}
            <p
              className={`text-white/70 text-xl md:text-2xl max-w-2xl mx-auto mt-8 leading-relaxed transition-all duration-700 delay-500 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {product.tagline}
            </p>

            {/* Description */}
            <p
              className={`text-white/40 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed transition-all duration-700 delay-[600ms] ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {product.description}
            </p>

            {/* CTAs */}
            <div
              className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-white text-black text-sm font-medium rounded-full flex items-center gap-3 hover:bg-white/90 transition-colors duration-200"
              >
                {product.ctaPrimary}
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 border border-white/30 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                {product.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 transition-all duration-700 delay-[900ms] ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ─── STATS ─────────────────────────────────────────────────────── */}
        <section className="relative py-20 md:py-28 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-3 gap-6 md:gap-12">
              {product.stats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 100}>
                  <div className="text-center">
                    <div
                      className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-2"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/40 text-xs md:text-sm tracking-widest uppercase">
                      {stat.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────────────────────── */}
        <section id="features" className="relative py-32 md:py-48">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 md:mb-24">
              <Reveal>
                <h2
                  className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {product.featuresTitle}
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delay={index * 100}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                >
                  <div className="group relative p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all duration-500 cursor-default">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl md:text-2xl font-serif font-bold text-white mb-3"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/60 leading-relaxed">{feature.description}</p>

                    {/* Index */}
                    <div className="absolute top-8 right-8 text-white/20 text-sm font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOR WHO ───────────────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
              {/* Left */}
              <div>
                <Reveal>
                  <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {product.forWhoTitle}
                  </h2>
                </Reveal>
                <Reveal delay={150}>
                  <p className="text-white/60 text-lg mt-6 leading-relaxed">
                    {product.forWhoDescription}
                  </p>
                </Reveal>
              </div>

              {/* Right — checklist */}
              <div className="space-y-4">
                {product.forWhoItems.map((item, index) => (
                  <Reveal key={index} delay={index * 80} direction="right">
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors duration-300">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-white/80 text-sm md:text-base">{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="relative py-32 md:py-48">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <h2
                className="font-serif font-bold text-white leading-none"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                }}
              >
                {product.ctaFinalTitle}
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mt-8 mb-12 leading-relaxed">
                {product.ctaFinalDescription}
              </p>
            </Reveal>

            <Reveal delay={400}>
              <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
                <MagneticButton className="group inline-flex items-center gap-4 px-10 py-6 bg-white text-black text-base md:text-lg font-medium rounded-full hover:bg-white/90 transition-all">
                  {product.ctaPrimary}
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </MagneticButton>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ─── FOOTER ────────────────────────────────────────────────────── */}
        <footer className="relative py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <a
              href="/"
              className="text-2xl font-serif font-bold text-white hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              FRPC
            </a>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} FRPC. Todos os direitos reservados.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Voltar ao topo ↑
            </button>
          </div>
        </footer>
      </main>
    </>
  )
}
