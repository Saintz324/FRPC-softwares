"use client"

import { useEffect, useRef, useState, memo } from 'react'

export const SplineBackground = memo(function SplineBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const scriptLoadedRef = useRef(false)
  const splineViewerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (scriptLoadedRef.current) return
    scriptLoadedRef.current = true

    // Load Spline viewer script with lower priority
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.76/build/spline-viewer.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      // Delay Spline initialization to not block main thread
      requestIdleCallback(() => {
        if (containerRef.current && !containerRef.current.querySelector('spline-viewer')) {
          const splineViewer = document.createElement('spline-viewer')
          splineViewer.setAttribute('url', 'https://prod.spline.design/P2vzY-8OaxMaVYd9/scene.splinecode')
          splineViewer.setAttribute('loading-anim-type', 'none')
          splineViewer.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
          `
          containerRef.current.appendChild(splineViewer)
          splineViewerRef.current = splineViewer
          
          // Inject styles to hide Spline branding in shadow DOM
          const injectHideStyles = () => {
            const shadowRoot = splineViewer.shadowRoot
            if (shadowRoot) {
              const existingStyle = shadowRoot.querySelector('style[data-hide-branding]')
              if (existingStyle) return
              
              const style = document.createElement('style')
              style.setAttribute('data-hide-branding', 'true')
              style.textContent = `
                #logo, 
                [id*="logo"], 
                [class*="logo"], 
                [class*="Logo"],
                [class*="watermark"],
                [class*="Watermark"],
                div[style*="bottom"][style*="left"],
                div[style*="position: absolute"][style*="bottom"],
                div[style*="position: fixed"][style*="bottom"],
                a[href*="spline"],
                canvas + div,
                canvas ~ div:not(:empty) {
                  display: none !important;
                  opacity: 0 !important;
                  visibility: hidden !important;
                  pointer-events: none !important;
                  width: 0 !important;
                  height: 0 !important;
                  overflow: hidden !important;
                }
              `
              shadowRoot.appendChild(style)
            }
            setIsLoaded(true)
          }

          // Try multiple times to ensure styles are injected
          setTimeout(injectHideStyles, 500)
          setTimeout(injectHideStyles, 1500)
          setTimeout(injectHideStyles, 3000)
        }
      }, { timeout: 2000 })
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        contain: 'strict'
      }}
    >
      {/* Bottom right corner - hide orbit controls */}
      <div 
        className="absolute bottom-0 right-0 z-50 pointer-events-none"
        style={{
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle at bottom right, rgba(10,10,20,1) 0%, rgba(10,10,20,0.9) 40%, transparent 70%)',
        }}
      />

      {/* Full bottom gradient for seamless look */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: '100px',
          background: 'linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 100%)',
        }}
      />
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
})

// Polyfill for requestIdleCallback
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  (window as typeof window & { requestIdleCallback: typeof requestIdleCallback }).requestIdleCallback = (cb: IdleRequestCallback) => {
    const start = Date.now()
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      })
    }, 1) as unknown as number
  }
}
