import { motion } from "framer-motion";
import { Shuffle, Split, TimerReset } from "lucide-react";
import Tooltip from "./Tooltip";

const STRATEGY_META = {
  round_robin: {
    label: "Round Robin",
    icon: Split,
    desc: "Cycles through healthy agents evenly in order.",
  },
  random: {
    label: "Random",
    icon: Shuffle,
    desc: "Picks a healthy agent randomly (good for demos, can be uneven).",
  },
  least_connections: {
    label: "Least Connections",
    icon: TimerReset,
    desc: "Routes to the agent with the fewest active in-flight requests.",
  },
};

export default function StrategySwitcher({
  current,
  available,
  onSetStrategy,
  onResetStats,
  disabled,
}) {
  return (
    <div className="glass neon-border p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">
            Routing control
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Switch strategy live (POST <code>/strategy</code>)
          </div>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={onResetStats}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 hover:bg-white/10 disabled:opacity-60"
          title="POST /reset"
        >
          Reset stats
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(available || []).map((key) => {
          const meta = STRATEGY_META[key] || { label: key, desc: key };
          const Icon = meta.icon || Split;
          const active = key === current;
          return (
            <Tooltip key={key} content={meta.desc}>
              <motion.button
                type="button"
                disabled={disabled}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSetStrategy(key)}
                className={[
                  "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm",
                  "transition disabled:opacity-60",
                  active
                    ? "border-sky-500/30 bg-gradient-to-br from-sky-500/20 to-violet-500/10 text-slate-100"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{meta.label}</span>
              </motion.button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

