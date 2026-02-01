import React from "react";

export default function TrafficSplit({ controlPct = 95, testPct = 5, label = "Split" }) {
  const c = Math.max(0, Math.min(100, Number(controlPct) || 0));
  const t = Math.max(0, Math.min(100, Number(testPct) || 0));

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={styles.title}>{label}</div>
        <div style={styles.pct}>
          {c}/{t}
        </div>
      </div>

      <div style={styles.track}>
        <div style={{ ...styles.control, width: `${c}%` }} />
        <div style={{ ...styles.test, width: `${t}%` }} />
      </div>

      <div style={styles.legend}>
        <span style={{ ...styles.dot, background: "rgba(255,255,255,0.25)" }} /> Control
        <span style={{ width: 12 }} />
        <span style={{ ...styles.dot, background: "rgba(120,180,255,0.9)" }} /> Test
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
  title: { fontSize: 12, opacity: 0.8 },
  pct: { fontSize: 12, opacity: 0.8 },
  track: {
    marginTop: 10,
    height: 12,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    display: "flex"
  },
  control: { height: "100%", background: "rgba(255,255,255,0.25)" },
  test: { height: "100%", background: "rgba(120,180,255,0.9)" },
  legend: { marginTop: 10, fontSize: 12, opacity: 0.85, display: "flex", alignItems: "center" },
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: 999, marginRight: 6 }
};
