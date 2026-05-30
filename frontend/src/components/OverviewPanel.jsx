import { motion } from "framer-motion";
import { CheckCircle2, Clock, Cpu, Gauge, XCircle } from "lucide-react";
import { formatNumber, formatPct } from "../utils/format";

function Metric({ label, value, icon: Icon, tone = "sky", sub }) {
  const tones = {
    sky: "from-sky-500/15 to-sky-500/0 text-sky-200",
    violet: "from-violet-500/15 to-violet-500/0 text-violet-200",
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-200",
    rose: "from-rose-500/15 to-rose-500/0 text-rose-200",
    slate: "from-slate-500/12 to-slate-500/0 text-slate-200",
  };
  return (
    <div className="glass neon-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-100">
            {value}
          </div>
          {sub ? <div className="mt-1 text-xs text-slate-400">{sub}</div> : null}
        </div>
        <div
          className={[
            "grid h-10 w-10 place-items-center rounded-2xl border border-white/10",
            "bg-gradient-to-br",
            tones[tone] || tones.sky,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function OverviewPanel({ derived, status }) {
  const uptime = status?.stats?.uptime_seconds ?? null;
  const strategy = status?.strategy || "—";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <motion.div layout>
        <Metric
          label="Total requests"
          value={formatNumber(derived?.total)}
          icon={Gauge}
          tone="sky"
          sub="Routed through the load balancer"
        />
      </motion.div>
      <motion.div layout>
        <Metric
          label="Success rate"
          value={formatPct(derived?.successRate)}
          icon={CheckCircle2}
          tone="emerald"
          sub={`${formatNumber(derived?.success)} successful`}
        />
      </motion.div>
      <motion.div layout>
        <Metric
          label="Failed requests"
          value={formatNumber(derived?.failed)}
          icon={XCircle}
          tone="rose"
          sub="No healthy agents / request errors"
        />
      </motion.div>
      <motion.div layout>
        <Metric
          label="System"
          value={`${derived?.activeAgents ?? 0} active`}
          icon={Cpu}
          tone="violet"
          sub={`Strategy: ${strategy} • Uptime: ${uptime ?? "—"}s`}
        />
      </motion.div>
      <div className="glass neon-border p-4 md:col-span-2 xl:col-span-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-slate-100">
            Monitoring overview
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-4 w-4" />
            Updates every 2 seconds
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-300">
          This dashboard combines the load balancer’s <code>/status</code> payload with
          direct per-agent <code>/health</code> pings to show request totals and live
          response latency—no backend logic changes required.
        </div>
      </div>
    </div>
  );
}

