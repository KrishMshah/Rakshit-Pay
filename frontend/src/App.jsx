import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Overview from "./pages/Overview";
import Decisions from "./pages/Decisions";
import Experiments from "./pages/Experiments";
import RoutesPage from "./pages/Routes";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <Link to="/">Overview</Link>
        <Link to="/decisions">Decisions</Link>
        <Link to="/experiments">Experiments</Link>
        <Link to="/routes">Routes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/decisions" element={<Decisions />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "16px",
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
};
