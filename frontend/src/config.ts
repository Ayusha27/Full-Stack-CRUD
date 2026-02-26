// frontend/src/config.ts

// Detect if we are on localhost or a production server
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocalhost 
  ? "http://127.0.0.1:8001" 
  : "https://full-stack-crud-8rhb.onrender.com";