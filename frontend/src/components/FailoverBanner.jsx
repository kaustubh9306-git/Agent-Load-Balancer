import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function FailoverBanner({ active }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass neon-border border-rose-500/25 bg-rose-500/10 px-4 py-3"
        >
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-200" />
              <div className="text-sm font-semibold text-rose-100">
                FAILOVER ACTIVATED
              </div>
              <div className="text-xs text-rose-200/80">
                One or more agents are down. Traffic is being rerouted automatically.
              </div>
            </div>
            <div className="text-xs text-rose-200/80">
              Watch the request flow + event logs for recovery.
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

