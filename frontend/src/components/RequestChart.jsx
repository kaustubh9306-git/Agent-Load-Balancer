import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-slate-100 shadow-glow">
      <div className="font-medium">{label}</div>
      <div className="mt-1 text-slate-300">
        Requests: <span className="text-slate-100">{payload[0].value}</span>
      </div>
    </div>
  );
}

export default function RequestChart({ distribution }) {
  const hasData = Array.isArray(distribution) && distribution.length > 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-glow">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-100">
            Request distribution
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            From <code className="text-slate-300">stats.distribution</code>
          </div>
        </div>
      </div>

      <div className="mt-4 h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis
                dataKey="agent"
                stroke="rgba(148,163,184,0.7)"
                tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                stroke="rgba(148,163,184,0.7)"
                tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" fill="rgba(56, 189, 248, 0.85)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No data yet (send traffic to <code className="mx-1 text-slate-200">/route</code>).
          </div>
        )}
      </div>
    </div>
  );
}

