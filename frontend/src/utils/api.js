import axios from 'axios';

// ─── API base URL ─────────────────────────────────────────────────────────────
// BUG FIX: was hardcoded to '/api' which only works when Vite's dev proxy is
// running.  In production (Render static site) there is no proxy — requests
// to '/api' hit the same static host and 404.
//
// Solution: set VITE_API_URL in your Render frontend environment variables:
//   VITE_API_URL=https://your-backend-name.onrender.com
//
// Locally, leave VITE_API_URL unset and the Vite proxy handles '/api'.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Log in development to confirm the right URL is being used
  if (import.meta.env.DEV) {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || err.message;
    const status = err.response?.status;
    console.error(`[API Error] ${status || 'Network'}: ${msg}`);
    return Promise.reject(err);
  }
);

export default api;

// ─── Uploads URL helper ───────────────────────────────────────────────────────
// Use this wherever you build a URL to a stored PDF or asset.
// Locally:     /uploads/filename.pdf   (served by Vite proxy → backend)
// Production:  https://your-backend.onrender.com/uploads/filename.pdf
export function uploadsUrl(filename) {
  if (!filename) return '';
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/uploads/${filename}`;
}