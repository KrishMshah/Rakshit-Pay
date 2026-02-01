import React from "react";

export default function ConfidenceBar({ value = 0, label = "Confidence" }) {
  const pct = Math.max(0, Math.min(1, Number(value) || 0));

  return (
    <div style={styles.wrap}>
      <div style={styles.labelRow}>
        <span>{label}</span>
        <span>{Math.round(pct * 100)}%</span>
      </div>
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

const styles = {
  wrap: { width: "100%" },
  labelRow: { display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.8 },
  track: {
    marginTop: 6,
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    background: "rgba(120,180,255,0.9)"
  }
};
