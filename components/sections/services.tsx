"use client"

import { useState, memo } from 'react'
import { Reveal } from '../reveal-animation'
import { RotatingText } from '../rotating-text'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

const ServiceIcon1 = memo(() => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
))
ServiceIcon1.displayName = 'ServiceIcon1'

const ServiceIcon2 = memo(() => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
))
ServiceIcon2.displayName = 'ServiceIcon2'

const ServiceIcon3 = memo(() => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
))
ServiceIcon3.displayName = 'ServiceIcon3'

const ServiceIcon4 = memo(() => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
  </svg>
))
ServiceIcon4.displayName = 'ServiceIcon4'

const icons = [ServiceIcon1, ServiceIcon2, ServiceIcon3, ServiceIcon4]

type ServiceItem = {
  id: number
  title: string
  description: string
  features: string[]
}

type ServiceCardProps = {
  service: ServiceItem
  index: number
  isActive: boolean
  onHover: () => void
}

const ServiceCard = memo(function ServiceCard({ service, index, isActive, onHover }: ServiceCardProps) {
  const IconComponent = icons[index]
  
  return (
    <Reveal delay={index * 100} direction={index % 2 === 0 ? 'left' : 'right'}>
      <div
        className={`
          group relative p-8 md:p-12 rounded-3xl cursor-pointer
          transition-[background-color,color] duration-500
          ${isActive 
            ? 'bg-white text-black' 
            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
          }
        `}
        onMouseEnter={onHover}
      >
        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-8
          ${isActive ? 'bg-black text-white' : 'bg-white/10 text-white'}
          transition-colors duration-500
        `}>
          <IconComponent />
        </div>

        {/* Title */}
        <h3
          className="text-2xl md:text-3xl font-serif font-bold mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <ScrambleText text={service.title} />
        </h3>

        {/* Description */}
        <ScrambleText
          as="p"
          text={service.description}
          className={`
            text-base leading-relaxed mb-8
            ${isActive ? 'text-black/70' : 'text-white/60'}
            transition-colors duration-500
          `}
        />

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {service.features.map((feature: string) => (
            <span
              key={feature}
              className={`
                px-4 py-2 rounded-full text-sm
                ${isActive
                  ? 'bg-black/10 text-black'
                  : 'bg-white/10 text-white/70'
                }
                transition-colors duration-500
              `}
            >
              <ScrambleText text={feature} />
            </span>
          ))}
        </div>

        {/* Corner decoration */}
        <div className={`
          absolute top-8 right-8 w-8 h-8 rounded-full
          ${isActive ? 'bg-black' : 'bg-white/10'}
          transition-colors duration-500
          flex items-center justify-center
        `}>
          <span className={`text-lg ${isActive ? 'text-white' : 'text-white/50'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </Reveal>
  )
})

export function ServicesSection() {
  const [activeService, setActiveService] = useState(1)
  const { t } = useLanguage()

  const services = t.services.items

  const RotatingBadge = memo(function RotatingBadge() {
    return (
      <div className="relative mt-8 lg:mt-0">
        <RotatingText
          text={t.services.badgeText}
          radius={70}
          className="text-white/50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-2xl">✦</span>
          </div>
        </div>
      </div>
    )
  })

  return (
    <section id="services" className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/8 to-transparent rounded-full blur-[80px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-l from-purple-500/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 md:mb-24">
          <div className="lg:max-w-xl">
            <Reveal>
              <ScrambleText as="span" text={t.services.label} className="text-white/40 text-sm tracking-[0.3em] uppercase" />
            </Reveal>
            <Reveal delay={100}>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mt-6 leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <ScrambleText text={t.services.title} /><br />
                <span className="italic"><ScrambleText text={t.services.subtitle} /></span>
              </h2>
            </Reveal>
          </div>
          
          {/* Rotating badge */}
          <Reveal delay={200} className="hidden lg:block">
            <RotatingBadge />
          </Reveal>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isActive={activeService === service.id}
              onHover={() => setActiveService(service.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
