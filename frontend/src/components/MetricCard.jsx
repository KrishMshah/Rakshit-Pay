import React from "react";

export default function MetricCard({ title, value, subtitle, trend, right }) {
  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div style={styles.title}>{title}</div>
        {right ? <div style={styles.right}>{right}</div> : null}
      </div>

      <div style={styles.valueRow}>
        <div style={styles.value}>{value ?? "—"}</div>
        {trend ? <div style={styles.trend}>{trend}</div> : null}
      </div>

      {subtitle ? <div style={styles.subtitle}>{subtitle}</div> : null}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14,
    minHeight: 90
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12
  },
  title: { fontSize: 12, opacity: 0.8, letterSpacing: 0.2 },
  right: { fontSize: 12, opacity: 0.8 },
  valueRow: { display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 },
  value: { fontSize: 26, fontWeight: 700 },
  trend: { fontSize: 12, opacity: 0.9 },
  subtitle: { marginTop: 6, fontSize: 12, opacity: 0.75, lineHeight: 1.3 }
};
