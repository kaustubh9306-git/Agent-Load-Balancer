function StatCard({ label, value, sub, tone = "slate" }) {
  const tones = {
    slate: "border-slate-800 bg-slate-900/60",
    sky: "border-sky-900/50 bg-sky-950/30",
    emerald: "border-emerald-900/50 bg-emerald-950/25",
    rose: "border-rose-900/50 bg-rose-950/25",
  };
  return (
    <div className={`rounded-2xl border p-4 shadow-glow ${tones[tone] || tones.slate}`}>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-100">
        {value ?? "—"}
      </div>
      {sub ? <div className="mt-1 text-xs text-slate-400">{sub}</div> : null}
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        label="Total requests"
        value={stats?.total_requests}
        sub="Across all agents"
        tone="sky"
      />
      <StatCard
        label="Successful"
        value={stats?.successful_requests}
        sub="Routed and processed"
        tone="emerald"
      />
      <StatCard
        label="Failed"
        value={stats?.failed_requests}
        sub="No agent / agent failure"
        tone="rose"
      />
      <StatCard
        label="Uptime (s)"
        value={stats?.uptime_seconds}
        sub="Stats timer"
        tone="slate"
      />
    </div>
  );
}

