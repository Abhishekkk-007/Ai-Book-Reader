import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useReader } from '../../context/ReaderContext';
import HighlightToolbar from './HighlightToolbar';
import { uploadsUrl } from '../../utils/api';

export default function PDFReader({
  book,
  onHighlight,
  highlights,
  searchQuery,
  searchResults,
  activeSearchResult,
}) {
  const {
    numPages, setNumPages,
    currentPage, setCurrentPage,
    zoom,
    pageTextsRef,
  } = useReader();

  const containerRef = useRef(null);
  const pageRefs = useRef({});
  const [hlToolbar, setHlToolbar] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Measure container width for responsive page sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 800;
      setContainerWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Scroll to current page when it changes (sidebar jump, search result, etc.)
  useEffect(() => {
    const el = pageRefs.current[currentPage];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  // Jump to page of active search result
  useEffect(() => {
    if (searchResults.length > 0 && activeSearchResult < searchResults.length) {
      setCurrentPage(searchResults[activeSearchResult].page);
    }
  }, [activeSearchResult, searchResults, setCurrentPage]);

  // IntersectionObserver: update currentPage as user scrolls naturally
  useEffect(() => {
    if (!containerRef.current || numPages === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let best = null;
        let bestRatio = 0;
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            best = e.target;
          }
        });
        if (best) {
          const pg = parseInt(best.dataset.page, 10);
          if (pg) setCurrentPage(pg);
        }
      },
      { root: containerRef.current, threshold: [0.3, 0.5, 0.7] }
    );
    const refs = pageRefs.current;
    Object.values(refs).forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [numPages, setCurrentPage]);

  const onDocumentLoadSuccess = useCallback(({ numPages: n }) => {
    setNumPages(n);
  }, [setNumPages]);

  // Cache page text for TTS + Search
  const onPageLoadSuccess = useCallback(async (page) => {
    try {
      const content = await page.getTextContent();
      pageTextsRef.current[page.pageNumber] = content.items.map((i) => i.str).join(' ');
    } catch {
      // Non-critical
    }
  }, [pageTextsRef]);

  // Text selection → highlight toolbar
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { setHlToolbar(null); return; }
    const text = sel.toString().trim();
    if (text.length < 3) { setHlToolbar(null); return; }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setHlToolbar({ text, x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const handleHighlight = useCallback((payload) => {
    window.getSelection()?.removeAllRanges();
    setHlToolbar(null);
    onHighlight({ ...payload, page: currentPage });
  }, [onHighlight, currentPage]);

  const pageWidth = Math.min(containerWidth - 48, 900) * zoom;

  if (!book?.filename) return null;

  // BUG FIX: was '/uploads/filename' which only worked locally via Vite proxy.
  // Now uses uploadsUrl() which prepends VITE_API_URL in production.
  const pdfUrl = uploadsUrl(book.filename);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[var(--bg-secondary)] relative select-text"
      onMouseUp={handleMouseUp}
      onMouseDown={() => setHlToolbar(null)}
    >
      <div className="flex flex-col items-center py-8 px-6 min-h-full">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="spinner" />
              <p className="text-sm text-[var(--text-muted)]">Loading PDF…</p>
            </div>
          }
          error={<PDFError filename={book.filename} />}
          noData={
            <div className="flex flex-col items-center justify-center h-96 gap-3">
              <div className="text-5xl">📄</div>
              <p className="text-sm text-[var(--text-muted)]">No PDF file specified</p>
            </div>
          }
        >
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                ref={(el) => { pageRefs.current[pageNum] = el; }}
                data-page={pageNum}
                className="relative mb-5 last:mb-0"
              >
                <Page
                  pageNumber={pageNum}
                  width={pageWidth}
                  onLoadSuccess={onPageLoadSuccess}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={
                    <div
                      className="bg-[var(--bg-card)] rounded animate-pulse flex items-center justify-center shadow-lg"
                      style={{ width: pageWidth, height: Math.round(pageWidth * 1.414) }}
                    >
                      <div className="spinner" />
                    </div>
                  }
                  error={
                    <div
                      className="bg-[var(--bg-card)] rounded flex items-center justify-center shadow-lg"
                      style={{ width: pageWidth, height: Math.round(pageWidth * 1.414) }}
                    >
                      <p className="text-xs text-[var(--text-muted)]">Page {pageNum} failed to render</p>
                    </div>
                  }
                />
                <div className="flex justify-center mt-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full
                    ${pageNum === currentPage ? 'bg-ember-500/20 text-ember-400' : 'text-[var(--text-muted)]'}`}>
                    {pageNum}
                  </span>
                </div>
              </div>
            ))}
        </Document>
      </div>

      {hlToolbar && (
        <HighlightToolbar
          x={hlToolbar.x}
          y={hlToolbar.y}
          text={hlToolbar.text}
          onHighlight={handleHighlight}
          onClose={() => setHlToolbar(null)}
        />
      )}
    </div>
  );
}

// ─── Detailed error component ─────────────────────────────────────────────────
function PDFError({ filename }) {
  const pdfUrl = uploadsUrl(filename);
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center max-w-md mx-auto p-6">
      <div className="text-5xl">⚠️</div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Failed to load PDF</p>
        <div className="text-left space-y-2 text-xs text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg p-3 border border-[var(--border)]">
          <p className="font-medium text-[var(--text-secondary)] mb-2">Checklist:</p>
          <p>1. Backend running? → <a href="/api/health" target="_blank" rel="noreferrer" className="text-ember-400 underline">/api/health</a></p>
          <p>2. File URL reachable? → <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-ember-400 underline break-all">{pdfUrl}</a></p>
          <p>3. CORS configured? Check <code className="bg-[var(--bg-secondary)] px-1 rounded">ALLOWED_ORIGINS</code> in backend env.</p>
          <p>4. On Render? Files in <code className="bg-[var(--bg-secondary)] px-1 rounded">uploads/</code> are ephemeral — use S3/Cloudinary for production storage.</p>
        </div>
      </div>
    </div>
  );
}