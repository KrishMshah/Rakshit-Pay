import { useEffect, useState } from "react";
import { fetchMetrics } from "../api";

export default function useMetrics(routeId, issuer) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timer;

    const load = async () => {
      try {
        const res = await fetchMetrics(routeId, issuer);
        setData(res.data);
        setError(null);
      } catch (e) {
        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    load();
    timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, [routeId, issuer]);

  return { data, loading, error };
}
