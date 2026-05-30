import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev convenience: proxy /api/* → Flask load balancer (port 8000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

