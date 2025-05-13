// src/plugins/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_RATE_API_URL); // from your .env

export default socket;
