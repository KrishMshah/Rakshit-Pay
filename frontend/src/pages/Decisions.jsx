import { useEffect, useState } from "react";
import { fetchHypotheses } from "../api";
import DecisionLog from "../components/DecisionLog";

export default function Decisions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchHypotheses();
        setItems(res.data);
      } catch (e) {
        console.error("Failed to load hypotheses", e);
      } finally {
        setLoading(false);
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <p>Loading decisions…</p>;

  return (
    <div>
      <h2>Agent Decisions</h2>

      {items.length === 0 && (
        <p>No active hypotheses — system healthy.</p>
      )}

      {items.map((h, idx) => (
        <DecisionLog key={idx} hypothesis={h} />
      ))}
    </div>
  );
}
