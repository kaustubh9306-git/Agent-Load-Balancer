function fmt(ts) {
  if (!ts) return "—";
  const d = new Date(ts * 1000); // backend uses time.time()
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function AgentCard({ agent, activeConnections }) {
  const healthy = !!agent?.healthy;
  return (
    <div
      className={[
        "rounded-2xl border p-4 transition",
        healthy
          ? "border-emerald-900/50 bg-emerald-950/20"
          : "border-rose-900/60 bg-rose-950/20",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-100">
            Agent {agent?.id}
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Port {agent?.port} •{" "}
            <span className="text-slate-300">{agent?.url}</span>
          </div>
        </div>

        <span
          className={[
            "rounded-full border px-2 py-0.5 text-xs",
            healthy
              ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-200"
              : "border-rose-900/60 bg-rose-950/40 text-rose-200",
          ].join(" ")}
        >
          {healthy ? "Healthy" : "Down"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Active
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            {activeConnections}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Failures
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            {agent?.consecutive_failures ?? 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Checked
          </div>
          <div className="mt-1 text-sm font-medium tabular-nums text-slate-200">
            {fmt(agent?.last_checked)}
          </div>
        </div>
      </div>
    </div>
  );
}

