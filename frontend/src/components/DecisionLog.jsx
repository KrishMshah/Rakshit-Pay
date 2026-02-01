import React from "react";
import ConfidenceBar from "./ConfidenceBar.jsx";

function fmtTs(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return d.toLocaleString();
}

export default function DecisionLog({ items = [] }) {
  return (
    <div style={styles.wrap}>
      {items.length === 0 ? (
        <div style={styles.empty}>No decisions yet.</div>
      ) : (
        items.map((it, idx) => {
          const id = it.id ?? it.decision_id ?? idx;
          const title = it.title ?? it.action ?? it.kind ?? "Decision";
          const reason = it.reason ?? it.explanation ?? it.summary ?? "";
          const confidence = it.confidence ?? it.confidence_score ?? it.p ?? null;

          return (
            <div key={id} style={styles.item}>
              <div style={styles.topRow}>
                <div style={styles.title}>{title}</div>
                <div style={styles.ts}>{fmtTs(it.ts ?? it.created_at ?? it.time)}</div>
              </div>

              {reason ? <div style={styles.reason}>{reason}</div> : null}

              {confidence !== null && confidence !== undefined ? (
                <div style={{ marginTop: 10 }}>
                  <ConfidenceBar value={confidence} label="Confidence" />
                </div>
              ) : null}

              {it.meta ? (
                <pre style={styles.pre}>{JSON.stringify(it.meta, null, 2)}</pre>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", gap: 12 },
  empty: {
    padding: 14,
    border: "1px dashed rgba(255,255,255,0.18)",
    borderRadius: 14,
    opacity: 0.8
  },
  item: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14
  },
  topRow: { display: "flex", justifyContent: "space-between", gap: 12 },
  title: { fontWeight: 700 },
  ts: { fontSize: 12, opacity: 0.75 },
  reason: { marginTop: 8, fontSize: 13, opacity: 0.9, lineHeight: 1.4 },
  pre: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    background: "rgba(0,0,0,0.35)",
    overflow: "auto",
    fontSize: 12
  }
};
