'use client'

/**
 * Procedural chibi “ops buddy” with four poses:
 * - idle: soft bob + eye blink
 * - walk: leg/arm swing + bob
 * - pushups: body dips
 * - hack: laptop out, fast “typing”
 *
 * No external assets; all SVG + CSS animations.
 */
export default function SidekickSprite({
  pose = 'idle',
  facing = 'right',
  size = 64,
  accent = '#00E5FF',
}: {
  pose?: 'idle' | 'walk' | 'pushups' | 'hack'
  facing?: 'left' | 'right'
  size?: number
  accent?: string
}) {
  const flip = facing === 'left' ? -1 : 1

  return (
    <svg
      width={size}
      height={Math.round(size * 1.35)}
      viewBox="0 0 64 86"
      aria-hidden
      style={{ transform: `scaleX(${flip})` }}
    >
      <style>{`
        .bob { animation: bob 2.2s ease-in-out infinite; transform-origin: 50% 80%; }
        .blink { animation: blink 4.6s infinite; transform-origin: 50% 50%; }
        .walk-bob { animation: walkBob 0.6s ease-in-out infinite; transform-origin: 50% 80%; }
        .leg-left { animation: legSwing 0.6s ease-in-out infinite; transform-origin: 20px 74px; }
        .leg-right { animation: legSwing 0.6s ease-in-out infinite reverse; transform-origin: 44px 74px; }
        .arm-left { animation: armSwing 0.6s ease-in-out infinite; transform-origin: 18px 46px; }
        .arm-right { animation: armSwing 0.6s ease-in-out infinite reverse; transform-origin: 46px 46px; }
        .push { animation: push 0.9s ease-in-out infinite; transform-origin: 32px 70px; }
        .type { animation: type 0.25s steps(2) infinite; transform-origin: 32px 46px; }
        .matrix { animation: matrix 1.3s linear infinite; }
        .glow { filter: drop-shadow(0 0 8px var(--accent)); }
        @keyframes bob { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-2px) } }
        @keyframes walkBob { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-1.5px) } }
        @keyframes legSwing { 0%,100%{ transform: rotate(10deg) } 50%{ transform: rotate(-18deg) } }
        @keyframes armSwing { 0%,100%{ transform: rotate(-4deg) } 50%{ transform: rotate(10deg) } }
        @keyframes push { 0%,100%{ transform: translateY(0) rotate(0deg) } 50%{ transform: translateY(5px) rotate(-2deg) } }
        @keyframes type { 0%{ transform: translateY(0) } 50%{ transform: translateY(-1px) } 100%{ transform: translateY(0) } }
        @keyframes blink { 0%, 92%, 100% { transform: scaleY(1) } 95% { transform: scaleY(0.1) } }
        @keyframes matrix {
          0% { transform: translateY(-8px); opacity: .8 }
          100% { transform: translateY(8px); opacity: .1 }
        }
      `}</style>

      <defs>
        <linearGradient id="bod" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0f1420" />
          <stop offset="100%" stopColor="#0b121b" />
        </linearGradient>
        <linearGradient id="face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#101a28" />
          <stop offset="100%" stopColor="#0c1520" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="32" cy="82" rx="16" ry="4" fill="#00e5ff" opacity="0.12" />

      {/* legs */}
      <g className={pose === 'walk' ? 'leg-left' : ''}>
        <rect x="16" y="66" width="10" height="12" rx="3" fill="#182637" />
      </g>
      <g className={pose === 'walk' ? 'leg-right' : ''}>
        <rect x="38" y="66" width="10" height="12" rx="3" fill="#182637" />
      </g>

      {/* body block */}
      <g className={pose === 'pushups' ? 'push' : pose === 'walk' ? 'walk-bob' : 'bob'}>
        <rect x="10" y="28" width="44" height="40" rx="10" fill="url(#bod)" stroke="#152132" />

        {/* chest stripe */}
        <rect x="14" y="50" width="36" height="6" rx="3" fill={accent} opacity="0.2" />
        <rect x="14" y="50" width="18" height="6" rx="3" fill={accent} opacity="0.5" className="glow" style={{ ['--accent' as any]: accent }} />

        {/* arms */}
        <g className={pose === 'walk' ? 'arm-left' : pose === 'hack' ? 'type' : ''}>
          <rect x="10" y="42" width="10" height="8" rx="3" fill="#152132" />
        </g>
        <g className={pose === 'walk' ? 'arm-right' : pose === 'hack' ? 'type' : ''}>
          <rect x="44" y="42" width="10" height="8" rx="3" fill="#152132" />
        </g>
      </g>

      {/* head */}
      <g className={pose === 'walk' ? 'walk-bob' : 'bob'}>
        <rect x="14" y="6" width="36" height="26" rx="8" fill="url(#face)" stroke="#152132" />
        {/* eyes */}
        <g className="blink">
          <rect x="22" y="16" width="6" height="6" rx="2" fill={accent} className="glow" style={{ ['--accent' as any]: accent }} />
          <rect x="36" y="16" width="6" height="6" rx="2" fill={accent} className="glow" style={{ ['--accent' as any]: accent }} />
        </g>
        {/* antenna */}
        <rect x="31" y="0" width="2" height="6" fill={accent} opacity=".8" />
      </g>

      {/* laptop + falling code for 'hack' */}
      {pose === 'hack' && (
        <g transform="translate(18,48)">
          <rect x="0" y="0" width="28" height="12" rx="2" fill="#0c1724" stroke="#1a2a3f" />
          <rect x="2" y="2" width="24" height="8" rx="2" fill="#0a0f16" />
          <g className="matrix">
            <rect x="4" y="1" width="1" height="6" fill={accent} opacity=".6" />
            <rect x="8" y="1" width="1" height="6" fill={accent} opacity=".5" />
            <rect x="12" y="1" width="1" height="6" fill={accent} opacity=".7" />
            <rect x="16" y="1" width="1" height="6" fill={accent} opacity=".6" />
            <rect x="20" y="1" width="1" height="6" fill={accent} opacity=".5" />
          </g>
        </g>
      )}
    </svg>
  )
}
