import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchMetrics = (routeId, issuer) =>
  api.get(`/metrics/route/${routeId}/issuer/${issuer}`);

export const fetchHypotheses = () =>
  api.get("/decisions/hypotheses");

export default api;

export const fetchActiveExperiment = () =>
  api.get("/experiments/active");
