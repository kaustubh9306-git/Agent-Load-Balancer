import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { routeOnce } from "../api/client";

function toLog({ message, tsMs }) {
  return {
    id: `${tsMs}-${Math.random().toString(16).slice(2)}`,
    level: "SIM",
    message,
    tsMs,
    source: "simulator",
  };
}

export default function TrafficSimulator({ pushLog, disabled }) {
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(30); // requests per second (approx)
  const timerRef = useRef(null);
  const sentRef = useRef(0);
  const okRef = useRef(0);
  const failRef = useRef(0);

  const tickMs = 250;
  const perTick = useMemo(() => Math.max(1, Math.round((rate * tickMs) / 1000)), [rate]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    pushLog?.(
      toLog({
        tsMs: Date.now(),
        message: `Traffic simulation stopped. sent=${sentRef.current}, ok=${okRef.current}, fail=${failRef.current}`,
      })
    );
  }, [pushLog]);

  const start = useCallback(() => {
    if (running) return;
    sentRef.current = 0;
    okRef.current = 0;
    failRef.current = 0;
    setRunning(true);
    pushLog?.(
      toLog({
        tsMs: Date.now(),
        message: `Simulating heavy traffic → hitting /route (~${rate} req/s)`,
      })
    );

    timerRef.current = setInterval(async () => {
      const batch = Array.from({ length: perTick }).map(async () => {
        sentRef.current += 1;
        try {
          const res = await routeOnce();
          okRef.current += 1;
          pushLog?.(
            toLog({
              tsMs: Date.now(),
              message: `routed → Agent ${res?.agent_id ?? "?"} (${res?.strategy ?? "?"})`,
            })
          );
        } catch (e) {
          failRef.current += 1;
          pushLog?.(
            toLog({
              tsMs: Date.now(),
              message: `route failed: ${e?.message || "unknown error"}`,
            })
          );
        }
      });
      // Don't await sequentially; let it overlap for "load" effect.
      Promise.allSettled(batch).catch(() => {});
    }, tickMs);

    // Auto-stop after 10 seconds for demo safety
    setTimeout(() => {
      if (timerRef.current) stop();
    }, 10000);
  }, [perTick, pushLog, rate, running, stop]);

  return (
    <div className="glass neon-border p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">
            Traffic simulation
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Demo button to generate live load on <code>/route</code>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Auto-stops after <span className="text-slate-200">10s</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <label className="text-xs text-slate-400">
          Intensity (~req/s): <span className="text-slate-200">{rate}</span>
        </label>
        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={rate}
          disabled={disabled || running}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full accent-sky-400"
        />

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            disabled={disabled || running}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            onClick={start}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/20 to-violet-500/10 px-3 py-3 text-sm font-semibold text-slate-100 hover:from-sky-500/25 hover:to-violet-500/15 disabled:opacity-60"
          >
            <Zap className="h-4 w-4 text-sky-200" />
            Simulate Heavy Traffic
          </motion.button>

          <button
            type="button"
            disabled={disabled || !running}
            onClick={stop}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-60"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

