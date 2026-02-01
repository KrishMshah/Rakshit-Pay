import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useMetrics } from "./hooks/useMetrics.js";

import Overview from "./pages/Overview.jsx";
import RoutesPage from "./pages/Routes.jsx";
import Experiments from "./pages/Experiments.jsx";
import Decisions from "./pages/Decisions.jsx";

export default function App() {
  const { overview, routes, experiments, decisions, loading, error, wsStatus, refresh } = useMetrics({
    refreshMs: 3000
  });

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.brand}>Rakshit Pay</div>
          <div style={styles.subBrand}>Real time agentic payment operations manager</div>
        </div>

        <div style={styles.headerRight}>
          <span style={styles.pill}>WS: {wsStatus}</span>
          <button style={styles.btn} onClick={refresh}>
            Refresh
          </button>
        </div>
      </header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <NavItem to="/" label="Overview" end />
          <NavItem to="/routes" label="Routes" />
          <NavItem to="/experiments" label="Experiments" />
          <NavItem to="/decisions" label="Decisions" />

          <div style={styles.sidebarFoot}>
            <div style={styles.footLabel}>Status</div>
            <div style={styles.footRow}>
              <span style={styles.footKey}>REST:</span>
              <span style={styles.footVal}>{loading ? "loading" : "ok"}</span>
            </div>
            <div style={styles.footRow}>
              <span style={styles.footKey}>Error:</span>
              <span style={styles.footVal}>{error ?? "none"}</span>
            </div>
          </div>
        </aside>

        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Overview data={overview} wsStatus={wsStatus} loading={loading} error={error} />} />
            <Route path="/routes" element={<RoutesPage routes={routes} loading={loading} error={error} />} />
            <Route path="/experiments" element={<Experiments experiments={experiments} loading={loading} error={error} />} />
            <Route path="/decisions" element={<Decisions decisions={decisions} loading={loading} error={error} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : null)
      })}
    >
      {label}
    </NavLink>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    color: "white",
    background: "radial-gradient(1200px 700px at 20% 0%, rgba(70,120,255,0.18), transparent 55%), #0b0f18"
  },
  header: {
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  brandRow: { display: "flex", flexDirection: "column" },
  brand: { fontSize: 16, fontWeight: 800, letterSpacing: 0.2 },
  subBrand: { fontSize: 12, opacity: 0.8, marginTop: 2 },
  headerRight: { display: "flex", gap: 10, alignItems: "center" },
  pill: {
    fontSize: 12,
    opacity: 0.85,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)"
  },
  btn: {
    height: 34,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer"
  },
  body: { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 64px)" },
  sidebar: {
    padding: 14,
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  navItem: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.85)",
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid transparent",
    background: "transparent"
  },
  navItemActive: {
    color: "white",
    border: "1px solid rgba(120,180,255,0.35)",
    background: "rgba(120,180,255,0.10)"
  },
  sidebarFoot: {
    marginTop: "auto",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 12,
    opacity: 0.9
  },
  footLabel: { fontSize: 12, opacity: 0.8, marginBottom: 8 },
  footRow: { display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.85 },
  footKey: { opacity: 0.75 },
  footVal: { textAlign: "right", marginLeft: 10, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" },

  main: { padding: 18 }
};
