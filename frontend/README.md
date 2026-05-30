# Agent Load Balancer — Premium Dashboard (React)

Hackathon-grade, real-time DevOps-style monitoring dashboard for the Flask load balancer API.

## What it shows
- Dark futuristic theme (glassmorphism + neon gradients) + smooth animations
- Live agent cards:
  - health pulse / red failover alert
  - active connections
  - request counts (routed by LB + handled by agent)
  - response latency (direct ping to agent `/health`)
- Animated request flow + architecture diagram (Client → LB → Agents)
- Live charts:
  - request distribution per agent (bar)
  - requests over time (line, derived from 2s polling)
- Terminal-style event log with colored levels + auto-scroll
- Strategy switching controls with tooltips (POST `/strategy`)
- “Simulate Heavy Traffic” demo button (hits `/route` repeatedly)
- Auto-refresh every **2 seconds** (GET `http://127.0.0.1:8000/status`)

## Prerequisites
- Node.js 18+ recommended
- Flask load balancer running on **http://127.0.0.1:8000**

## Run (dev)
```bash
cd frontend
npm install
npm run dev
```

By default, the frontend calls the backend directly at:
`http://127.0.0.1:8000`

## Configure API base (optional)
Override the API base URL with:
```bash
VITE_API_BASE=http://127.0.0.1:8000
```

### Using Vite proxy (optional)
This repo also includes a Vite dev proxy config. To use it, set:
```bash
VITE_API_BASE=/api
```
Then `/api/*` will be proxied to `http://localhost:8000/*`.

## Production build
```bash
npm run build
npm run preview
```
