import { useMemo } from "react";

export default function ArchitectureFlow({ intensity = 0.2, failoverActive = false }) {
  const dur = useMemo(() => {
    const v = Math.max(0.7, 2.2 - intensity * 1.4);
    return `${v.toFixed(2)}s`;
  }, [intensity]);

  const glow = failoverActive ? "rgba(244,63,94,0.65)" : "rgba(56,189,248,0.55)";

  return (
    <div className="glass neon-border p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">
            Real-time request flow
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Client → Load Balancer → Agents (animated)
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Traffic intensity:{" "}
          <span className="text-slate-200">{Math.round(intensity * 100)}%</span>
        </div>
      </div>

      <div className="mt-4">
        <svg viewBox="0 0 900 260" className="h-[240px] w-full">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(56,189,248,0.85)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.85)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Paths */}
          <path
            id="p_client_lb"
            d="M170 70 C 270 70, 320 70, 420 70"
            stroke="url(#g1)"
            strokeWidth="3"
            fill="none"
            opacity="0.55"
          />
          <path
            id="p_lb_a1"
            d="M480 90 C 520 125, 560 155, 600 190"
            stroke="url(#g1)"
            strokeWidth="3"
            fill="none"
            opacity="0.55"
          />
          <path
            id="p_lb_a2"
            d="M450 95 C 450 125, 450 155, 450 190"
            stroke="url(#g1)"
            strokeWidth="3"
            fill="none"
            opacity="0.55"
          />
          <path
            id="p_lb_a3"
            d="M420 90 C 380 125, 340 155, 300 190"
            stroke="url(#g1)"
            strokeWidth="3"
            fill="none"
            opacity="0.55"
          />

          {/* Moving dots */}
          {["p_client_lb", "p_lb_a1", "p_lb_a2", "p_lb_a3"].map((pid, idx) => (
            <circle key={pid} r="5" fill={failoverActive ? "rgba(244,63,94,0.9)" : "rgba(56,189,248,0.9)"} filter="url(#glow)">
              <animateMotion dur={dur} repeatCount="indefinite" begin={`${idx * 0.15}s`}>
                <mpath href={`#${pid}`} />
              </animateMotion>
            </circle>
          ))}

          {/* Nodes */}
          <g filter="url(#glow)">
            <rect x="40" y="40" rx="18" ry="18" width="140" height="60" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
            <text x="110" y="75" textAnchor="middle" fill="rgba(226,232,240,0.92)" fontSize="14" fontFamily="ui-sans-serif, system-ui">
              Client
            </text>

            <rect x="420" y="40" rx="18" ry="18" width="160" height="60" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
            <text x="500" y="70" textAnchor="middle" fill="rgba(226,232,240,0.92)" fontSize="14" fontFamily="ui-sans-serif, system-ui">
              Load Balancer
            </text>
            <text x="500" y="88" textAnchor="middle" fill="rgba(148,163,184,0.9)" fontSize="11" fontFamily="ui-sans-serif, system-ui">
              /route • /status • /strategy
            </text>

            <rect x="240" y="190" rx="18" ry="18" width="120" height="56" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
            <text x="300" y="222" textAnchor="middle" fill="rgba(226,232,240,0.92)" fontSize="13" fontFamily="ui-sans-serif, system-ui">
              Agent 3
            </text>

            <rect x="390" y="190" rx="18" ry="18" width="120" height="56" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
            <text x="450" y="222" textAnchor="middle" fill="rgba(226,232,240,0.92)" fontSize="13" fontFamily="ui-sans-serif, system-ui">
              Agent 2
            </text>

            <rect x="540" y="190" rx="18" ry="18" width="120" height="56" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
            <text x="600" y="222" textAnchor="middle" fill="rgba(226,232,240,0.92)" fontSize="13" fontFamily="ui-sans-serif, system-ui">
              Agent 1
            </text>
          </g>

          {/* LB core pulse */}
          <circle cx="500" cy="70" r="42" fill="transparent" stroke={glow} strokeWidth="2" opacity="0.22">
            <animate attributeName="r" values="38;46;38" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}

