import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // If you run frontend separately, you can proxy to backend here.
    // proxy: { "/api": "http://localhost:8000", "/ws": { target: "ws://localhost:8000", ws: true } }
  }
});


