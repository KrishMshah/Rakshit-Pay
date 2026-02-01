import useMetrics from "../hooks/useMetrics";

export default function Overview() {
  // Must match backend ingestion keys
  const routeId = "primary_route";
  const issuer = "hdfc";

  const { data, loading, error } = useMetrics(routeId, issuer);

  if (loading) {
    return <p>Loading metrics…</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Failed to load metrics</p>;
  }

  if (!data || data.total_count === 0) {
    return <p>Waiting for live payment traffic…</p>;
  }

  return (
    <div>
      <h2>Payment Overview</h2>

      <div style={{ marginTop: "16px" }}>
        <p>
          <strong>Route:</strong> {data.route_id}
        </p>
        <p>
          <strong>Issuer:</strong> {data.issuer_bank}
        </p>
        <p>
          <strong>Total Transactions:</strong> {data.total_count}
        </p>
        <p>
          <strong>Success Rate:</strong>{" "}
          {(data.success_rate * 100).toFixed(2)}%
        </p>
        <p>
          <strong>Average Latency:</strong> {data.avg_latency_ms} ms
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(data.last_updated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
