export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Neon glows */}
      <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="absolute top-32 -right-56 h-[520px] w-[780px] rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute -bottom-56 -left-56 h-[620px] w-[900px] rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}

