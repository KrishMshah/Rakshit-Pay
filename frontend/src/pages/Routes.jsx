import React, { useMemo, useState } from "react";
import MetricCard from "../components/MetricCard.jsx";
import ConfidenceBar from "../components/ConfidenceBar.jsx";

function toPct(x) {
  if (x == null) return null;
  const n = Number(x);
  if (!Number.isFinite(n)) return null;
  return `${(n * 100).toFixed(2)}%`;
}

export default function Routes({ routes = [], loading, error }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return routes;
    return routes.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }, [routes, q]);

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.h2}>Routes</h2>
        <div style={styles.right}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter routes…"
            style={styles.input}
          />
          {loading ? <span style={styles.badge}>Loading…</span> : null}
          {error ? <span style={{ ...styles.badge, borderColor: "rgba(255,120,120,0.5)" }}>{error}</span> : null}
        </div>
      </div>

      <div style={styles.grid}>
        {filtered.map((r, idx) => {
          const id = r.route_id ?? r.id ?? idx;
          const name =
            r.name ??
            `${r.merchant ?? "merchant"} • ${r.provider ?? r.gateway ?? "gateway"} • ${r.issuer ?? "issuer"}`;

          const ps = r.ps ?? r.prob_success ?? r.probability_of_success;
          const p95 = r.latency_p95_ms ?? r.p95_ms;
          const err = r.error_rate ?? r.fail_rate;

          // If analyst emits confidence for degradation detection
          const conf = r.confidence ?? r.degradation_confidence;

          return (
            <div key={id} style={styles.routeCard}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{r.status ?? ""}</div>
              </div>

              <div style={styles.miniGrid}>
                <MetricCard title="Ps" value={toPct(ps) ?? "—"} subtitle="Rolling success probability." />
                <MetricCard title="p95 latency" value={p95 != null ? `${Math.round(Number(p95))} ms` : "—"} subtitle="Tail latency." />
                <MetricCard title="error rate" value={toPct(err) ?? "—"} subtitle="Rolling failure share." />
              </div>

              {conf != null ? (
                <div style={{ marginTop: 10 }}>
                  <ConfidenceBar value={conf} label="Degradation confidence" />
                </div>
              ) : null}

              {r.tags?.length ? (
                <div style={styles.tags}>
                  {r.tags.map((t) => (
                    <span key={t} style={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  h2: { margin: 0 },
  right: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" },
  input: {
    height: 34,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
    minWidth: 220
  },
  badge: {
    fontSize: 12,
    opacity: 0.85,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)"
  },
  grid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12
  },
  routeCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14
  },
  miniGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
  tags: { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" },
  tag: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    opacity: 0.9
  }
};
