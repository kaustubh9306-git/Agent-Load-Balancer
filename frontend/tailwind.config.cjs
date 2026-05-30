/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-soft": "pulseSoft 2.2s ease-in-out infinite",
        "alert": "alert 0.9s ease-in-out infinite",
        "float-slow": "floatSlow 5s ease-in-out infinite",
        "scan": "scan 2.5s linear infinite",
        "flow": "flow 1.4s linear infinite",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148,163,184,0.18), 0 12px 30px rgba(0,0,0,0.45)",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.65" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        alert: {
          "0%, 100%": { transform: "translateY(0px)", boxShadow: "0 0 0 1px rgba(244,63,94,0.25), 0 0 18px rgba(244,63,94,0.35)" },
          "50%": { transform: "translateY(-1px)", boxShadow: "0 0 0 1px rgba(244,63,94,0.35), 0 0 26px rgba(244,63,94,0.55)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        scan: {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(140%)" },
        },
        flow: {
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
    },
  },
  plugins: [],
};
