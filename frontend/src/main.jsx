import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { pdfjs } from 'react-pdf';

// ✅ Vite fix: use CDN worker URL matching the installed pdfjs-dist version.
// Do NOT use `new URL('pdfjs-dist/...', import.meta.url)` — Vite cannot bundle
// the worker correctly and causes "WorkerMessageHandler undefined" error.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);