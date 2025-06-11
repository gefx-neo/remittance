// src/plugins/socket.js
import { io } from "socket.io-client";
import { useEnvironment } from "@/composables/useEnvironment";
const { apiRateBaseUrl } = useEnvironment();
let socket;
const maxAttempts = 10;
let attempts = 0;

function connectSocket() {
  socket = io(apiRateBaseUrl, {
    reconnection: false, // Disable built-in reconnection
  });

  socket.on("connect", () => {
    // console.log("✅ WebSocket connected:", socket.id);
    attempts = 0; // Reset attempts on successful connection
  });

  socket.on("disconnect", (reason) => {
    // console.warn("❌ WebSocket disconnected:", reason);
    if (reason === "io server disconnect") {
      // If the server disconnected, try to reconnect
      // console.warn("❗ Attempting to reconnect...");
      reconnectSocket();
    } else if (reason === "io client disconnect") {
      // Client initiated disconnect, no need to reconnect
      // console.warn("Client-initiated disconnect, no reconnection needed.");
    } else {
      // Other disconnection reasons (network issues)
      reconnectSocket();
    }
  });

  socket.on("connect_error", (error) => {
    // console.error("❗ Connection error:", error.message);
    reconnectSocket();
  });

  return socket;
}

function reconnectSocket() {
  if (attempts < maxAttempts) {
    const delay = Math.min(1000 * 2 ** attempts, 30000); // Exponential backoff
    attempts += 1;
    // console.log(
    //   `🔄 Reconnecting in ${delay / 1000} seconds... (Attempt ${attempts})`
    // );
    setTimeout(() => {
      socket.connect();
    }, delay);
  } else {
    // console.error(
    //   "⚠️ Max reconnection attempts reached. Please refresh the page."
    // );
  }
}

socket = connectSocket();

export default socket;
