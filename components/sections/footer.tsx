"use client"

import { memo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../language-provider'

const LINKEDIN_URL = 'https://www.linkedin.com/company/frpc'

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function FooterContent() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-white hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            FRPC
          </Link>

          {/* Copyright */}
          <p className="text-white/30 text-sm text-center">
            {t.footer.copyright.replace('{year}', currentYear.toString())}
          </p>

          {/* Social + Back to top */}
          <div className="flex items-center gap-4">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white/30 hover:text-white text-sm transition-colors duration-200"
            >
              {t.footer.backToTop} ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterContent)

// Named export used by pages that don't import the default Footer
export const SharedFooter = memo(FooterContent)
