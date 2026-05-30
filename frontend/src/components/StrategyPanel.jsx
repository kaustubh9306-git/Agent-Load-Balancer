import { useEffect, useState } from "react";

export default function StrategyPanel({
  strategy,
  available,
  onSetStrategy,
  onResetStats,
  disabled,
}) {
  const [busy, setBusy] = useState(false);
  const [local, setLocal] = useState(strategy || "");

  // keep select in sync when backend changes
  useEffect(() => {
    if (strategy && !busy) setLocal(strategy);
  }, [strategy, busy]);

  async function applyStrategy(next) {
    setLocal(next);
    setBusy(true);
    try {
      await onSetStrategy(next);
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    try {
      await onResetStats();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-glow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-100">
            Routing strategy
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Switch live via <code className="text-slate-300">POST /strategy</code>
          </div>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/40 px-2 py-0.5 text-xs text-slate-200">
          {busy ? "Applying…" : "Live"}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="text-xs text-slate-400">Select strategy</label>
        <select
          value={local}
          disabled={disabled || busy}
          onChange={(e) => applyStrategy(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600/40 disabled:opacity-60"
        >
          {available?.length ? null : <option value="">—</option>}
          {available.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={disabled || busy}
          onClick={reset}
          className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 hover:bg-slate-950/70 disabled:opacity-60"
          title="POST /reset"
        >
          Reset stats
        </button>
      </div>
    </div>
  );
}
