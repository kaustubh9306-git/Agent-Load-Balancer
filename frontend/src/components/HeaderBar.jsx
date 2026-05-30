import { motion } from "framer-motion";
import { Activity, CloudCog, RefreshCcw } from "lucide-react";
import { formatTime } from "../utils/format";

export default function HeaderBar({
  strategy,
  lastUpdated,
  error,
  onRefresh,
  failoverActive,
}) {
  return (
    <div className="glass neon-border scanline p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-violet-500/20"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudCog className="h-5 w-5 text-sky-200" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold tracking-tight text-slate-100">
                Agent Load Balancer
              </div>
              {failoverActive ? (
                <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-xs text-rose-200">
                  FAILOVER ACTIVE
                </span>
              ) : (
                <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                  All systems nominal
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                <Activity className="h-3.5 w-3.5 text-sky-200" />
                Strategy: <span className="text-slate-100">{strategy || "—"}</span>
              </span>
              <span className="text-slate-400">
                Last update: {formatTime(lastUpdated)}
              </span>
              {error ? (
                <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-rose-200">
                  {error}
                </span>
              ) : (
                <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-sky-200">
                  http://127.0.0.1:8000/status
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={onRefresh}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            <RefreshCcw className="h-4 w-4 text-slate-200" />
            Refresh now
          </motion.button>
        </div>
      </div>
    </div>
  );
}

