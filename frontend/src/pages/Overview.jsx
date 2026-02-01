import React from "react";
import MetricCard from "../components/MetricCard.jsx";

export default function Overview({ data, wsStatus, loading, error }) {
  const o = data ?? {};

  const ps = o.ps ?? o.prob_success ?? o.probability_of_success;
  const latencyP95 = o.latency_p95_ms ?? o.p95_latency_ms ?? o.p95_ms;
  const errRate = o.error_rate ?? o.fail_rate ?? o.failure_rate;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.h2}>System Health</h2>
        <div style={styles.badges}>
          <span style={styles.badge}>WS: {wsStatus}</span>
          {loading ? <span style={styles.badge}>Loading…</span> : null}
          {error ? <span style={{ ...styles.badge, borderColor: "rgba(255,120,120,0.5)" }}>{error}</span> : null}
        </div>
      </div>

      <div style={styles.grid}>
        <MetricCard
          title="Probability of Success (Global)"
          value={ps != null ? `${(Number(ps) * 100).toFixed(2)}%` : "—"}
          subtitle="Rolling estimate across all live routes."
        />
        <MetricCard
          title="Latency (p95)"
          value={latencyP95 != null ? `${Math.round(Number(latencyP95))} ms` : "—"}
          subtitle="Tail latency indicator for payment completion."
        />
        <MetricCard
          title="Failure / Error rate"
          value={errRate != null ? `${(Number(errRate) * 100).toFixed(2)}%` : "—"}
          subtitle="Share of failed attempts in the rolling window."
        />
        <MetricCard
          title="Active experiments"
          value={o.active_experiments ?? o.experiments_active ?? "—"}
          subtitle="Micro-experiments currently running under guardrails."
        />
      </div>

      <div style={styles.panel}>
        <div style={styles.panelTitle}>Notes</div>
        <div style={styles.panelBody}>
          This page is driven by REST snapshots plus WebSocket patches. If your backend emits live messages,
          you’ll see updates without refresh.
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  h2: { margin: 0 },
  badges: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12
  },
  panel: {
    marginTop: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14
  },
  panelTitle: { fontSize: 12, opacity: 0.8, marginBottom: 8 },
  panelBody: { fontSize: 13, opacity: 0.9, lineHeight: 1.5 }
};
