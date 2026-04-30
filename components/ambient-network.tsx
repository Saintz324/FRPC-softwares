'use client'

export default function AmbientNetwork() {
  return (
    <svg className="ambient" viewBox="0 0 1440 900" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lf" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="vt" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <path d="M -20 220 C 200 220,260 260,320 260 S 460 220,560 220"
        stroke="url(#lf)" fill="none" strokeWidth="1"
        strokeDasharray="620" strokeDashoffset="620"
        style={{ animation: 'lineDraw 2.4s ease forwards 0.4s' }} />
      <path d="M 880 220 C 1000 220,1080 260,1160 260 S 1300 220,1460 220"
        stroke="url(#lf)" fill="none" strokeWidth="1"
        strokeDasharray="620" strokeDashoffset="620"
        style={{ animation: 'lineDraw 2.4s ease forwards 0.7s' }} />
      <path d="M -20 580 C 120 580,200 540,280 540 S 420 580,540 580"
        stroke="url(#lf)" fill="none" strokeWidth="1"
        strokeDasharray="580" strokeDashoffset="580"
        style={{ animation: 'lineDraw 2.4s ease forwards 1.0s' }} />
      <path d="M 900 600 C 1040 600,1140 560,1240 560 S 1380 600,1460 600"
        stroke="url(#lf)" fill="none" strokeWidth="1"
        strokeDasharray="580" strokeDashoffset="580"
        style={{ animation: 'lineDraw 2.4s ease forwards 1.3s' }} />

      {([[700,420,640],[720,440,700],[740,420,660],[760,460,720]] as number[][]).map(([x,y1,y2],i) => (
        <line key={x} x1={x} y1={y1} x2={x} y2={y2}
          stroke="url(#vt)" strokeWidth="1"
          strokeDasharray={y2-y1} strokeDashoffset={y2-y1}
          style={{ animation: `lineDraw 1.8s ease forwards ${1.8 + i * 0.15}s` }} />
      ))}

      {([[320,260,0],[560,220,0.3],[1160,260,0.6],[280,540,0.9],[540,580,1.2],[1240,560,1.5]] as number[][]).map(([x,y,d]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" fill="var(--glow)"
          style={{
            filter: 'drop-shadow(0 0 5px var(--glow))',
            opacity: 0,
            animation: `glowPulse 3s ease-in-out ${2 + d}s infinite`,
            animationFillMode: 'both',
          }} />
      ))}

      <g opacity="0.45">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={50 + i * 48} cy={840} r="0.8" fill="rgba(255,255,255,0.22)"
            style={{ animation: `glowPulse 2.5s ease-in-out ${i * 0.09}s infinite` }} />
        ))}
      </g>
    </svg>
  )
}
