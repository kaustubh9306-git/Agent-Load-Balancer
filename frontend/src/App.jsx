import { useCallback, useMemo } from "react";
import { resetStats, setStrategy } from "./api/client";
import useDashboardData from "./hooks/useDashboardData";

import Background from "./components/Background";
import HeaderBar from "./components/HeaderBar";
import FailoverBanner from "./components/FailoverBanner";
import OverviewPanel from "./components/OverviewPanel";
import StrategySwitcher from "./components/StrategySwitcher";
import TrafficSimulator from "./components/TrafficSimulator";
import ArchitectureFlow from "./components/ArchitectureFlow";
import ChartsPanel from "./components/ChartsPanel";
import AgentStatusGrid from "./components/AgentStatusGrid";
import TerminalLog from "./components/TerminalLog";

export default function App() {
  const {
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
  } = useDashboardData({ pollMs: 2000 });

  const onSetStrategy = useCallback(
    async (next) => {
      await setStrategy(next);
      await refresh();
      pushLog?.({
        id: `${Date.now()}-strategy`,
        level: "INFO",
        message: `Strategy switched → ${next}`,
        tsMs: Date.now(),
        source: "dashboard",
      });
    },
    [refresh, pushLog]
  );

  const onResetStats = useCallback(async () => {
    await resetStats();
    await refresh();
    pushLog?.({
      id: `${Date.now()}-reset`,
      level: "INFO",
      message: "Stats reset (POST /reset)",
      tsMs: Date.now(),
      source: "dashboard",
    });
  }, [refresh, pushLog]);

  const intensity = useMemo(() => {
    const last = timeSeries?.[timeSeries.length - 1];
    const delta = last?.delta_requests ?? 0;
    // Normalize: 0..1 (10 requests per tick == full intensity)
    return Math.max(0, Math.min(1, delta / 10));
  }, [timeSeries]);

  return (
    <div className="min-h-screen text-slate-100">
      <Background />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <HeaderBar
          strategy={status?.strategy}
          lastUpdated={lastUpdated}
          error={error}
          onRefresh={refresh}
          failoverActive={failoverActive}
        />

        <div className="mt-4">
          <FailoverBanner active={failoverActive} />
        </div>

        <div className="mt-6">
          <OverviewPanel derived={derived} status={status} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <StrategySwitcher
              current={status?.strategy}
              available={status?.available_strategies || []}
              onSetStrategy={onSetStrategy}
              onResetStats={onResetStats}
              disabled={!status}
            />
          </div>
          <div className="lg:col-span-5">
            <TrafficSimulator pushLog={pushLog} disabled={!status} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ArchitectureFlow intensity={intensity} failoverActive={failoverActive} />
          </div>
          <div className="lg:col-span-7">
            <ChartsPanel
              distribution={status?.stats?.distribution || []}
              timeSeries={timeSeries}
            />
          </div>
        </div>

        <div className="mt-6">
          <AgentStatusGrid
            agents={status?.agents || []}
            status={status}
            agentExtras={agentExtras}
          />
        </div>

        <div className="mt-6">
          <TerminalLog logs={logs} />
        </div>
      </div>
    </div>
  );
}
