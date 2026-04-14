import axios from 'axios';

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Local dev  → VITE_API_URL is unset → baseURL = '/api'  (Vite proxy forwards to :5000)
// Production → VITE_API_URL = 'https://folio-backend.onrender.com'
//              baseURL = 'https://folio-backend.onrender.com/api'
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s — give uploads time to complete on cold Render instances

  // ─── FIX 2 ─────────────────────────────────────────────────────────────────
  // withCredentials: true causes the browser to send a CORS preflight (OPTIONS)
  // for every cross-origin request. The server must then respond with:
  //   Access-Control-Allow-Credentials: true
  //   Access-Control-Allow-Origin: <exact origin>  (not *)
  // If either is missing the preflight fails and the actual request never fires.
  //
  // We only need withCredentials if we're using cookies/sessions. This app uses
  // none — remove it to eliminate an entire class of CORS preflight failures.
  // ───────────────────────────────────────────────────────────────────────────
  withCredentials: false,
});

// ─── Request logger (dev only) ────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.debug(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

// ─── Response logger ─────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.debug(`[API ←] ${res.status} ${res.config.url}`);
    }
    return res;
  },
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.error || err.message;
    const url     = err.config?.url;
    const base    = err.config?.baseURL;

    // Print the full URL that was actually requested — makes 404 debugging trivial
    console.error(`[API Error] ${status ?? 'Network'} on ${base}${url} — ${message}`);
    return Promise.reject(err);
  }
);

export default api;

// ─── Uploads URL helper ───────────────────────────────────────────────────────
// Always use this to build URLs pointing at stored files.
// Local:      /uploads/uuid.pdf          (Vite proxy → backend :5000)
// Production: https://backend.onrender.com/uploads/uuid.pdf
export function uploadsUrl(filename) {
  if (!filename) return '';
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/uploads/${filename}`;
}