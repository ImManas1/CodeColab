import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://codecolab-0oea.onrender.com";

// autoConnect: true means it connects immediately.
// Socket.io buffers events emitted before connection — they fire once connected.
export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});