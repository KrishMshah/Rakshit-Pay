export default function ConfidenceBar({ confidence }) {
  const percent = Math.round(confidence * 100);

  return (
    <div style={{ marginTop: "8px" }}>
      <p style={{ marginBottom: "4px" }}>
        <strong>Confidence Score:</strong> {percent}%
      </p>

      <div style={styles.bar}>
        <div
          style={{
            ...styles.fill,
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  bar: {
    width: "100%",
    height: "10px",
    background: "#eee",
    borderRadius: "5px",
  },
  fill: {
    height: "100%",
    background: "#4caf50",
    borderRadius: "5px",
  },
};
