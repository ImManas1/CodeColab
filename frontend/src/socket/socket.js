import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Fix: Allow polling as fallback so connection works even if WebSocket is blocked.
// autoConnect: true means it connects immediately.
// Socket.io buffers events emitted before connection — they fire once connected.
export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});