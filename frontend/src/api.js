// Centralized API client.
// Configure base URLs via Vite envs:
//  - VITE_API_BASE (e.g. http://localhost:8000)
//  - VITE_WS_BASE  (e.g. ws://localhost:8000)
//
// If not set, defaults to same-origin.

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");
const WS_BASE = (import.meta.env.VITE_WS_BASE ?? "").replace(/\/$/, "");

function join(base, path) {
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function httpGet(path) {
  const url = join(API_BASE, path);
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Metrics
  getOverview: () => httpGet("/api/metrics/overview"),
  getRoutes: () => httpGet("/api/metrics/routes"),

  // Ops artifacts
  getDecisions: () => httpGet("/api/decisions"),
  getExperiments: () => httpGet("/api/experiments"),

  // WebSocket URL
  liveWsUrl: () => join(WS_BASE, "/ws/live")
};
