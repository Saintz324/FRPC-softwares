"use client"

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Reveal } from '../reveal-animation'
import { MagneticButton } from '../magnetic-button'
import { useLanguage } from '../language-provider'
import { ScrambleText } from '../scramble-text'

export function ProjectsSection() {
  const { t } = useLanguage()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const handleMouseEnter = useCallback((id: number) => {
    setHoveredProject(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredProject(null)
  }, [])

  return (
    <section id="projects" className="relative py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24">
          <div>
            <Reveal>
              <ScrambleText as="span" text={t.projects.label} className="text-white/40 text-sm tracking-[0.3em] uppercase" />
            </Reveal>
            <Reveal delay={100}>
              <h2
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mt-6 leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <ScrambleText text={t.projects.titleLine1} /><br />
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}
                >
                  <ScrambleText text={t.projects.titleLine2} />
                </span>
              </h2>
            </Reveal>
          </div>
          
          <Reveal delay={200} className="mt-8 md:mt-0">
            <MagneticButton className="px-6 py-3 border border-white/30 text-white text-sm rounded-full hover:bg-white hover:text-black transition-all duration-300">
              <ScrambleText text={t.projects.viewAll} />
            </MagneticButton>
          </Reveal>
        </div>

        {/* Projects list */}
        <div className="space-y-2">
          {t.projects.items.map((project, index) => (
            <Reveal key={project.id} delay={index * 100}>
              <div
                className="group relative"
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Background gradient on hover */}
                <div 
                  className={`
                    absolute inset-0 bg-gradient-to-r ${project.color ?? 'from-white/10 to-white/20'} rounded-2xl
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    -z-10 scale-105
                  `}
                />
                
                <Link
                  href={project.url ?? '#'}
                  className="block py-8 md:py-12 border-t border-white/10 group-hover:border-transparent transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Project number and title */}
                    <div className="flex items-center gap-6 md:gap-12">
                      <span className="text-white/30 text-sm font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 
                        className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white group-hover:translate-x-4 transition-transform duration-500"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {project.title}
                      </h3>
                    </div>

                    {/* Category and year */}
                    <div className="flex items-center gap-8 ml-12 md:ml-0">
                      <span className="text-white/50 text-sm hidden md:block">
                        {project.category}
                      </span>
                      <span className="text-white/30 text-sm">
                        {project.year}
                      </span>
                      
                      {/* Arrow */}
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                        <svg 
                          className="w-5 h-5 text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-all duration-300" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Description on hover */}
                  <div className={`
                    overflow-hidden transition-all duration-500
                    ${hoveredProject === project.id ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0'}
                  `}>
                    <p className="text-white/60 text-sm md:text-base ml-12 md:ml-24">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
