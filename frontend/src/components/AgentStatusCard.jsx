import { motion } from "framer-motion";
import { Activity, ArrowRightLeft, HeartPulse, Timer } from "lucide-react";
import { formatMs, formatNumber } from "../utils/format";

export default function AgentStatusCard({
  agent,
  activeConnections,
  routedCount,
  extra,
}) {
  const healthy = !!agent?.healthy;
  const latencyMs = extra?.latencyMs ?? null;
  const agentTotal = extra?.total_requests ?? null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={[
        "glass neon-border p-4",
        healthy ? "" : "border-rose-500/25",
        healthy ? "" : "animate-alert",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold text-slate-100">
              Agent {agent?.id}
            </div>
            <div
              className={[
                "h-2.5 w-2.5 rounded-full",
                healthy ? "bg-emerald-400/90 animate-pulse-soft" : "bg-rose-400",
              ].join(" ")}
              title={healthy ? "Healthy" : "Unhealthy"}
            />
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Port <span className="text-slate-200">{agent?.port}</span> •{" "}
            <span className="text-slate-300">{agent?.url}</span>
          </div>
        </div>

        <span
          className={[
            "rounded-full border px-2 py-0.5 text-xs",
            healthy
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/30 bg-rose-500/10 text-rose-200",
          ].join(" ")}
        >
          {healthy ? "HEALTHY" : "UNHEALTHY"}
        </span>
      </div>

      {!healthy ? (
        <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
          <span className="font-semibold">FAILOVER ACTIVATED</span> — traffic is
          being rerouted away from this agent.
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
            <Activity className="h-3.5 w-3.5 text-sky-200" />
            Active connections
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-slate-100">
            {formatNumber(activeConnections ?? 0)}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
            <Timer className="h-3.5 w-3.5 text-violet-200" />
            Response time (ping)
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-slate-100">
            {formatMs(latencyMs)}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
            <ArrowRightLeft className="h-3.5 w-3.5 text-sky-200" />
            Routed by LB
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-slate-100">
            {formatNumber(routedCount ?? 0)}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
            <HeartPulse className="h-3.5 w-3.5 text-emerald-200" />
            Handled by agent
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-slate-100">
            {formatNumber(agentTotal)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

