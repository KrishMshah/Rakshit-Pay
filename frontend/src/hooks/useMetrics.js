import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { useWebSocket } from "./useWebSocket.js";

// This hook merges:
// - periodic REST fetch (ground truth / initial load)
// - live WS patches (fast UI updates)
//
// WS message formats are flexible. We support common shapes:
// 1) { type: "overview", data: {...} }
// 2) { type: "routes", data: [...] }
// 3) { type: "decision", data: {...} } // optional
// 4) { type: "experiment", data: {...} } // optional

export function useMetrics({ refreshMs = 2500 } = {}) {
  const [overview, setOverview] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [decisions, setDecisions] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [o, r, e, d] = await Promise.all([
        api.getOverview(),
        api.getRoutes(),
        api.getExperiments().catch(() => []),
        api.getDecisions().catch(() => [])
      ]);

      setOverview(o);
      setRoutes(Array.isArray(r) ? r : (r?.routes ?? []));
      setExperiments(Array.isArray(e) ? e : (e?.experiments ?? []));
      setDecisions(Array.isArray(d) ? d : (d?.decisions ?? []));
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const onWs = useCallback(
    (msg) => {
      if (!msg || typeof msg !== "object") return;

      const { type, data } = msg;

      if (type === "overview" && data) setOverview(data);
      if (type === "routes" && data) setRoutes(Array.isArray(data) ? data : (data?.routes ?? []));
      if (type === "decision" && data) setDecisions((prev) => [data, ...prev].slice(0, 200));
      if (type === "experiment" && data) setExperiments((prev) => [data, ...prev].slice(0, 200));

      // optional generic patch format:
      // { type: "patch", target: "overview|routes|decisions|experiments", data: ... }
      if (type === "patch" && msg.target) {
        if (msg.target === "overview") setOverview(msg.data);
        if (msg.target === "routes") setRoutes(msg.data ?? []);
        if (msg.target === "decisions") setDecisions(msg.data ?? []);
        if (msg.target === "experiments") setExperiments(msg.data ?? []);
      }
    },
    [setOverview, setRoutes, setDecisions, setExperiments]
  );

  const ws = useWebSocket({ onMessage: onWs });

  useEffect(() => {
    refresh();
    const t = window.setInterval(refresh, refreshMs);
    return () => window.clearInterval(t);
  }, [refresh, refreshMs]);

  const state = useMemo(
    () => ({
      overview,
      routes,
      experiments,
      decisions,
      error,
      loading,
      wsStatus: ws.status,
      refresh
    }),
    [overview, routes, experiments, decisions, error, loading, ws.status, refresh]
  );

  return state;
}
