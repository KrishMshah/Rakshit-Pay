import React from "react";
import DecisionLog from "../components/DecisionLog.jsx";

export default function Decisions({ decisions = [], loading, error }) {
  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.h2}>Decisions</h2>
        <div style={styles.badges}>
          <span style={styles.badge}>Total: {decisions.length}</span>
          {loading ? <span style={styles.badge}>Loading…</span> : null}
          {error ? <span style={{ ...styles.badge, borderColor: "rgba(255,120,120,0.5)" }}>{error}</span> : null}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <DecisionLog items={decisions} />
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
  }
};
