export default function Tooltip({ children, content }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-2 left-1/2 z-50 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-white/10 bg-slate-950/90 px-2 py-1 text-[11px] text-slate-200 shadow-glow backdrop-blur-xl group-hover:block">
        {content}
      </span>
    </span>
  );
}

