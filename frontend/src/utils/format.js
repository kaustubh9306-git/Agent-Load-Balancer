export function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat().format(n);
}

export function formatPct(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return `${(v * 100).toFixed(1)}%`;
}

export function formatMs(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1000) return `${Math.round(n)} ms`;
  return `${(n / 1000).toFixed(2)} s`;
}

export function formatTime(tsMs) {
  if (!tsMs) return "—";
  const d = new Date(tsMs);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

