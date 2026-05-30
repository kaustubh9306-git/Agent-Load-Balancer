import AgentStatusCard from "./AgentStatusCard";

export default function AgentStatusGrid({ agents, status, agentExtras }) {
  const activeConnections = status?.active_connections || {};
  const routedCounts = status?.stats?.agent_counts || {};

  return (
    <div className="glass neon-border p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">
            Live agent status
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Health checks, failover, connections, request totals, response latency
          </div>
        </div>
        <div className="text-xs text-slate-400">{agents?.length || 0} agents</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(agents || []).map((a) => (
          <AgentStatusCard
            key={a.id}
            agent={a}
            activeConnections={activeConnections?.[String(a.port)] ?? 0}
            routedCount={routedCounts?.[a.id] ?? 0}
            extra={agentExtras?.[a.id]}
          />
        ))}
      </div>
    </div>
  );
}

