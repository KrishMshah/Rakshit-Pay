import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api.js";

export function useWebSocket({ onMessage } = {}) {
  const [status, setStatus] = useState("disconnected"); // disconnected | connecting | connected | error
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);

  const url = useMemo(() => api.liveWsUrl(), []);

  useEffect(() => {
    let alive = true;
    let retryTimer = null;

    const connect = () => {
      if (!alive) return;
      setStatus("connecting");

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => alive && setStatus("connected");
        ws.onerror = () => alive && setStatus("error");

        ws.onclose = () => {
          if (!alive) return;
          setStatus("disconnected");
          // simple backoff
          retryTimer = window.setTimeout(connect, 1200);
        };

        ws.onmessage = (evt) => {
          let payload = evt.data;
          try {
            payload = JSON.parse(evt.data);
          } catch {
            // allow plain text
          }
          if (!alive) return;
          setLastMessage(payload);
          onMessage?.(payload);
        };
      } catch {
        setStatus("error");
        retryTimer = window.setTimeout(connect, 1500);
      }
    };

    connect();

    return () => {
      alive = false;
      if (retryTimer) window.clearTimeout(retryTimer);
      try {
        wsRef.current?.close();
      } catch {
        // ignore
      }
    };
  }, [url, onMessage]);

  const send = (obj) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(typeof obj === "string" ? obj : JSON.stringify(obj));
    return true;
  };

  return { status, lastMessage, send };
}
