export default function MetricCard({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  card: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    minWidth: "140px",
  },
};
