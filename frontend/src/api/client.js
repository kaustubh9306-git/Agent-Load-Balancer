// Requirement: auto refresh from http://127.0.0.1:8000/status
// You can override with VITE_API_BASE (e.g. "/api" to use Vite proxy).
const DEFAULT_BASE = "http://127.0.0.1:8000";

function getBaseUrl() {
  // For production (or if you don't use Vite proxy), set:
  //   VITE_API_BASE=http://localhost:8000
  return import.meta.env?.VITE_API_BASE || DEFAULT_BASE;
}

async function http(path, options = {}) {
  const base = getBaseUrl();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data && data.error
        ? data.error
        : `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function getStatus() {
  return http("/status");
}

export function setStrategy(strategy) {
  return http("/strategy", {
    method: "POST",
    body: JSON.stringify({ strategy }),
  });
}

export function resetStats() {
  return http("/reset", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function routeOnce() {
  return http("/route");
}
