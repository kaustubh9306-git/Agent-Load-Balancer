import AgentCard from "./AgentCard";

export default function AgentGrid({ agents, activeConnections }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-glow">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-100">Agents</div>
          <div className="mt-0.5 text-xs text-slate-400">
            Health checks + live connection counts
          </div>
        </div>
        <div className="text-xs text-slate-400">
          {agents?.length || 0} configured
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {agents?.length ? (
          agents.map((a) => (
            <AgentCard
              key={a.id}
              agent={a}
              activeConnections={activeConnections?.[String(a.port)] ?? 0}
            />
          ))
        ) : (
          <div className="text-sm text-slate-400">No agent data yet.</div>
        )}
      </div>
    </div>
  );
}

