import { useEffect, useState } from "react";
import { fetchActiveExperiment } from "../api";

export default function Experiments() {
  const [experiment, setExperiment] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchActiveExperiment();
        setExperiment(res.data);
      } catch (e) {
        console.error("Failed to load experiment", e);
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2>Active Experiment</h2>

      {!experiment && <p>No active experiments.</p>}

      {experiment && (
        <div style={styles.card}>
          <p><strong>Issuer:</strong> {experiment.issuer}</p>
          <p><strong>Route:</strong> {experiment.route}</p>
          <p><strong>Backup Route:</strong> {experiment.backup_route}</p>
          <p>
            <strong>Traffic Shift:</strong>{" "}
            {experiment.traffic_shift * 100}%
          </p>
          <p>
            <strong>Confidence Score:</strong>{" "}
            {Math.round(experiment.confidence * 100)}%
          </p>
          <p>
            <strong>Started At:</strong>{" "}
            {new Date(experiment.started_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
};
