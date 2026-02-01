import ConfidenceBar from "./ConfidenceBar";

export default function DecisionLog({ hypothesis }) {
  return (
    <div style={styles.card}>
      <h4>Issuer: {hypothesis.issuer_bank}</h4>

      <p>
        <strong>Route:</strong> {hypothesis.route_id}
      </p>

      <p>
        <strong>Cause:</strong> {hypothesis.suspected_cause}
      </p>

      <p>
        <strong>Current Success Prob:</strong>{" "}
        {hypothesis.current_ps}
      </p>

      <p>
        <strong>Suggested Traffic Shift:</strong>{" "}
        {hypothesis.suggested_traffic_shift * 100}%
      </p>

      <ConfidenceBar confidence={hypothesis.confidence} />

      <small>
        Detected at{" "}
        {new Date(hypothesis.created_at).toLocaleString()}
      </small>
    </div>
  );
}

const styles = {
  card: {
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
};
