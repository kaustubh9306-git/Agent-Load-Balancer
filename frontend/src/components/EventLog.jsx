function fmt(ts) {
  if (!ts) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function tone(type) {
  if (type === "unhealthy") return "border-rose-900/60 bg-rose-950/25 text-rose-200";
  if (type === "recovery") return "border-emerald-900/60 bg-emerald-950/25 text-emerald-200";
  return "border-slate-800 bg-slate-950/20 text-slate-300";
}

export default function EventLog({ events }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-glow">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-100">Event log</div>
          <div className="mt-0.5 text-xs text-slate-400">
            Recent health events (latest first)
          </div>
        </div>
        <div className="text-xs text-slate-400">{events?.length || 0} shown</div>
      </div>

      <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-slate-800 bg-slate-950/20">
        {events?.length ? (
          <ul className="divide-y divide-slate-800">
            {events.map((e, idx) => (
              <li key={`${e.timestamp}-${idx}`} className="p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${tone(e.type)}`}>
                    {e.type}
                  </span>
                  <span className="text-xs text-slate-400">{fmt(e.timestamp)}</span>
                  <span className="text-xs text-slate-400">
                    Agent <span className="text-slate-200">{e.agent_id}</span>
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-200">{e.message}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-sm text-slate-400">
            No events yet.
          </div>
        )}
      </div>
    </div>
  );
}

