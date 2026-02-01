import React, { useMemo } from "react";
import TrafficSplit from "../components/TrafficSplit.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ConfidenceBar from "../components/ConfidenceBar.jsx";

function pct(x) {
  if (x == null) return "—";
  const n = Number(x);
  if (!Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(2)}%`;
}

export default function Experiments({ experiments = [], loading, error }) {
  const active = useMemo(
    () => experiments.filter((e) => (e.status ?? e.state ?? "").toLowerCase().includes("active")),
    [experiments]
  );

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.h2}>Experiments</h2>
        <div style={styles.badges}>
          <span style={styles.badge}>Active: {active.length}</span>
          {loading ? <span style={styles.badge}>Loading…</span> : null}
          {error ? <span style={{ ...styles.badge, borderColor: "rgba(255,120,120,0.5)" }}>{error}</span> : null}
        </div>
      </div>

      <div style={styles.grid}>
        {experiments.length === 0 ? (
          <div style={styles.empty}>No experiments yet.</div>
        ) : (
          experiments.map((e, idx) => {
            const id = e.experiment_id ?? e.id ?? idx;
            const title = e.title ?? e.hypothesis ?? e.reason ?? "Experiment";
            const control = e.control_pct ?? e.control ?? 95;
            const test = e.test_pct ?? e.test ?? 5;

            const controlPs = e.control_ps ?? e.control_prob_success;
            const testPs = e.test_ps ?? e.test_prob_success;
            const delta = e.delta_ps ?? (controlPs != null && testPs != null ? Number(testPs) - Number(controlPs) : null);

            const conf = e.confidence ?? e.stat_confidence ?? e.significance;

            return (
              <div key={id} style={styles.card}>
                <div style={styles.topRow}>
                  <div style={styles.title}>{title}</div>
                  <div style={styles.meta}>{e.status ?? e.state ?? ""}</div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <TrafficSplit controlPct={control} testPct={test} label="Traffic split" />
                </div>

                <div style={styles.miniGrid}>
                  <MetricCard title="Control Ps" value={pct(controlPs)} subtitle="Baseline performance." />
                  <MetricCard title="Test Ps" value={pct(testPs)} subtitle="Candidate route." />
                  <MetricCard
                    title="Δ Ps"
                    value={delta != null ? `${(Number(delta) * 100).toFixed(2)}%` : "—"}
                    subtitle="Test minus control."
                  />
                </div>

                {conf != null ? (
                  <div style={{ marginTop: 10 }}>
                    <ConfidenceBar value={conf} label="Stat confidence" />
                  </div>
                ) : null}

                {e.guardrails ? (
                  <pre style={styles.pre}>{JSON.stringify(e.guardrails, null, 2)}</pre>
                ) : null}
              </div>
            );
          })
        )}
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
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 12
  },
  empty: {
    padding: 14,
    border: "1px dashed rgba(255,255,255,0.18)",
    borderRadius: 14,
    opacity: 0.8
  },
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14
  },
  topRow: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" },
  title: { fontWeight: 700 },
  meta: { fontSize: 12, opacity: 0.75 },
  miniGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
  pre: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    background: "rgba(0,0,0,0.35)",
    overflow: "auto",
    fontSize: 12
  }
};
