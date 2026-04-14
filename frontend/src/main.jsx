import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { pdfjs } from 'react-pdf';

// ─── PDF.js worker (Vite-safe) ────────────────────────────────────────────────
// Using `new URL('pdfjs-dist/...', import.meta.url)` fails in Vite because
// Vite cannot statically analyze & bundle the worker file.
//
// Solution: point to the CDN worker that exactly matches the installed version.
// `pdfjs.version` is read at runtime from the package so versions never drift.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);