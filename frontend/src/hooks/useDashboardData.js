import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useInterval from "./useInterval";
import { getStatus } from "../api/client";

function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function clampArray(arr, max) {
  if (arr.length <= max) return arr;
  return arr.slice(arr.length - max);
}

function toLogEntry({ level, message, tsMs, source }) {
  return {
    id: `${tsMs}-${Math.random().toString(16).slice(2)}`,
    level, // INFO | WARN | ERROR | RECOVERY | SIM
    message,
    tsMs,
    source: source || "dashboard",
  };
}

function mapBackendEventToLog(e) {
  const level =
    e?.type === "unhealthy"
      ? "WARN"
      : e?.type === "recovery"
      ? "RECOVERY"
      : "INFO";
  return toLogEntry({
    level,
    message: e?.message || "event",
    tsMs: Math.floor((e?.timestamp || 0) * 1000),
    source: "health_checker",
  });
}

async function fetchAgentHealth(agentUrl) {
  const start = nowMs();
  const res = await fetch(`${agentUrl}/health`, { method: "GET" });
  const ms = nowMs() - start;
  if (!res.ok) throw new Error(`Agent health failed (${res.status})`);
  const data = await res.json();
  return { data, latencyMs: ms };
}

export default function useDashboardData({ pollMs = 2000 } = {}) {
  const [status, setStatus] = useState(null);
  const [agentExtras, setAgentExtras] = useState({}); // { [agentId]: { latencyMs, total_requests } }
  const [timeSeries, setTimeSeries] = useState([]); // { tsMs, total_requests, failed_requests, a1, a2, ... , rps }
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [logs, setLogs] = useState([]);
  const [failoverActive, setFailoverActive] = useState(false);

  const inFlight = useRef(false);
  const prevAgentsRef = useRef(null);
  const prevTotalsRef = useRef(null);
  const seenBackendEvents = useRef(new Set());

  const pushLog = useCallback((entry) => {
    setLogs((prev) => clampArray([...prev, entry], 250));
  }, []);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const data = await getStatus();
      setStatus(data);
      setError(null);
      setLastUpdated(Date.now());

      // Compute failover state (any agent unhealthy)
      const anyDown = (data?.agents || []).some((a) => !a.healthy);
      setFailoverActive(anyDown);

      // Time series (client-side) — derive request rate from deltas
      const totals = {
        total: data?.stats?.total_requests ?? 0,
        failed: data?.stats?.failed_requests ?? 0,
        agentCounts: data?.stats?.agent_counts || {},
      };

      const prevTotals = prevTotalsRef.current;
      const deltaTotal =
        prevTotals && totals.total >= prevTotals.total
          ? totals.total - prevTotals.total
          : 0;
      const rps = pollMs ? deltaTotal / (pollMs / 1000) : 0;

      setTimeSeries((prev) => {
        const point = {
          tsMs: Date.now(),
          total_requests: totals.total,
          failed_requests: totals.failed,
          delta_requests: deltaTotal,
          rps,
        };
        Object.entries(totals.agentCounts).forEach(([id, count]) => {
          point[`a${id}`] = count;
        });
        return clampArray([...prev, point], 60);
      });
      prevTotalsRef.current = totals;

      // Backend events → terminal log (dedupe by timestamp+message)
      (data?.events || []).forEach((e) => {
        const key = `${e?.timestamp}-${e?.message}`;
        if (seenBackendEvents.current.has(key)) return;
        seenBackendEvents.current.add(key);
        pushLog(mapBackendEventToLog(e));
      });

      // Detect health transitions for stronger failover demo messaging
      const prevAgents = prevAgentsRef.current;
      if (prevAgents) {
        const prevById = new Map(prevAgents.map((a) => [a.id, a]));
        (data?.agents || []).forEach((a) => {
          const p = prevById.get(a.id);
          if (!p) return;
          if (p.healthy && !a.healthy) {
            pushLog(
              toLogEntry({
                level: "ERROR",
                message: `FAILOVER ACTIVATED — Agent ${a.id} down (port ${a.port}). Rerouting traffic to healthy agents.`,
                tsMs: Date.now(),
                source: "load_balancer",
              })
            );
          }
          if (!p.healthy && a.healthy) {
            pushLog(
              toLogEntry({
                level: "RECOVERY",
                message: `Agent ${a.id} recovered. Traffic distribution returning to normal.`,
                tsMs: Date.now(),
                source: "load_balancer",
              })
            );
          }
        });
      }
      prevAgentsRef.current = data?.agents || null;

      // Per-agent /health ping (to get request count + latency)
      const agents = data?.agents || [];
      const results = await Promise.allSettled(
        agents.map((a) => fetchAgentHealth(a.url))
      );
      setAgentExtras((prev) => {
        const next = { ...prev };
        results.forEach((r, idx) => {
          const a = agents[idx];
          if (!a) return;
          if (r.status === "fulfilled") {
            next[a.id] = {
              latencyMs: r.value.latencyMs,
              total_requests: r.value.data?.total_requests ?? null,
            };
          } else {
            next[a.id] = {
              latencyMs: null,
              total_requests: next[a.id]?.total_requests ?? null,
            };
          }
        });
        return next;
      });
    } catch (e) {
      const msg = e?.message || "Failed to fetch /status";
      setError(msg);
      pushLog(
        toLogEntry({
          level: "ERROR",
          message: `API error: ${msg}`,
          tsMs: Date.now(),
          source: "dashboard",
        })
      );
    } finally {
      inFlight.current = false;
    }
  }, [pollMs, pushLog]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useInterval(refresh, pollMs);

  const derived = useMemo(() => {
    const total = status?.stats?.total_requests ?? 0;
    const failed = status?.stats?.failed_requests ?? 0;
    const success = status?.stats?.successful_requests ?? Math.max(0, total - failed);
    const successRate = total ? success / total : 1;
    const activeAgents = (status?.agents || []).filter((a) => a.healthy).length;
    return { total, failed, success, successRate, activeAgents };
  }, [status]);

  return {
    status,
    agentExtras,
    timeSeries,
    logs,
    error,
    lastUpdated,
    failoverActive,
    refresh,
    pushLog,
    derived,
  };
}
