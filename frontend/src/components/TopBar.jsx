function formatTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function TopBar({
  strategy,
  isRefreshing,
  lastUpdated,
  error,
  onRefresh,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-glow md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-500/30 ring-1 ring-slate-700" />
        <div>
          <div className="text-lg font-semibold tracking-tight">
            Load Balancer Dashboard
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-2 py-0.5">
              Strategy: <span className="text-slate-100">{strategy || "—"}</span>
            </span>
            <span className="text-slate-400">
              Last update: {formatTime(lastUpdated)}
            </span>
            {error ? (
              <span className="rounded-full border border-rose-900/60 bg-rose-950/40 px-2 py-0.5 text-rose-200">
                {error}
              </span>
            ) : (
              <span className="rounded-full border border-emerald-900/60 bg-emerald-950/30 px-2 py-0.5 text-emerald-200">
                API OK
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 hover:bg-slate-950/70 active:scale-[0.99]"
        >
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </div>
  );
}

