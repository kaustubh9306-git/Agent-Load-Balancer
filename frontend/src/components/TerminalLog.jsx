import { useEffect, useMemo, useRef } from "react";
import { formatTime } from "../utils/format";

function levelStyle(level) {
  if (level === "ERROR") return "text-rose-200";
  if (level === "WARN") return "text-amber-200";
  if (level === "RECOVERY") return "text-emerald-200";
  if (level === "SIM") return "text-sky-200";
  return "text-slate-200";
}

function badge(level) {
  if (level === "ERROR") return "border-rose-500/30 bg-rose-500/10 text-rose-200";
  if (level === "WARN") return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  if (level === "RECOVERY") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  if (level === "SIM") return "border-sky-500/30 bg-sky-500/10 text-sky-200";
  return "border-white/10 bg-white/5 text-slate-200";
}

export default function TerminalLog({ logs }) {
  const boxRef = useRef(null);
  const items = useMemo(() => (logs || []).slice().sort((a, b) => a.tsMs - b.tsMs), [logs]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items.length]);

  return (
    <div className="terminal">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">Event log</div>
          <div className="mt-0.5 text-xs text-slate-400">
            Terminal-style streaming logs (auto-scroll)
          </div>
        </div>
        <div className="text-xs text-slate-400">{items.length} entries</div>
      </div>

      <div ref={boxRef} className="max-h-[360px] overflow-auto px-4 py-3 font-mono text-xs">
        {items.length ? (
          <div className="space-y-2">
            {items.map((l) => (
              <div key={l.id} className="flex gap-3">
                <span className="min-w-[82px] text-slate-500">{formatTime(l.tsMs)}</span>
                <span className={`rounded-md border px-2 py-0.5 ${badge(l.level)}`}>
                  {l.level}
                </span>
                <span className={`${levelStyle(l.level)} leading-relaxed`}>
                  {l.message}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500">No events yet.</div>
        )}
      </div>
    </div>
  );
}

