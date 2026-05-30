import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "../utils/format";

function tLabel(tsMs) {
  const d = new Date(tsMs);
  return d.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
}

function Card({ title, subtitle, children }) {
  return (
    <div className="glass neon-border p-4">
      <div>
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        {subtitle ? <div className="mt-0.5 text-xs text-slate-400">{subtitle}</div> : null}
      </div>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-100 shadow-glow backdrop-blur-xl">
      <div className="font-medium">{label}</div>
      <div className="mt-1 space-y-0.5">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-6 text-slate-300">
            <span style={{ color: p.color }} className="font-medium">
              {p.name}
            </span>
            <span className="text-slate-100">{formatNumber(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartsPanel({ distribution, timeSeries }) {
  const series = (timeSeries || []).map((p) => ({ ...p, t: tLabel(p.tsMs) }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card
        title="Request distribution (per agent)"
        subtitle="Live bar chart from /status.stats.distribution"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis
              dataKey="agent"
              stroke="rgba(148,163,184,0.6)"
              tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              stroke="rgba(148,163,184,0.6)"
              tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
            />
            <Tooltip content={<TooltipBox />} />
            <Bar
              name="Requests"
              dataKey="requests"
              fill="rgba(56, 189, 248, 0.85)"
              radius={[10, 10, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card
        title="Requests over time"
        subtitle="Derived client-side from /status polling (every 2s)"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis
              dataKey="t"
              stroke="rgba(148,163,184,0.6)"
              tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
              minTickGap={18}
            />
            <YAxis
              allowDecimals={false}
              stroke="rgba(148,163,184,0.6)"
              tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
            />
            <Tooltip content={<TooltipBox />} />
            <Line
              name="New requests / tick"
              type="monotone"
              dataKey="delta_requests"
              stroke="rgba(139, 92, 246, 0.9)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
            <Line
              name="Total requests"
              type="monotone"
              dataKey="total_requests"
              stroke="rgba(56, 189, 248, 0.9)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

