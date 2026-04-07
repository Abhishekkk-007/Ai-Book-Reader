import React, { useState } from 'react';
import { useReader } from '../../context/ReaderContext';
import { useApp } from '../../context/AppContext';

export default function TopBar({ book, onBookmark, isBookmarked }) {
  const {
    currentPage, numPages, goToPage,
    zoom, zoomIn, zoomOut, resetZoom,
    toggleSidebar, sidebarOpen,
    setSearchVisible, searchVisible,
    setTtsPanelOpen, ttsPanelOpen,
    ttsActive,
  } = useReader();
  const { closeBook, toggleTheme, isDark } = useApp();
  const [pageInput, setPageInput] = useState('');

  const handlePageJump = (e) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (p >= 1 && p <= numPages) goToPage(p);
    setPageInput('');
  };

  const pct = numPages ? Math.round((currentPage / numPages) * 100) : 0;

  return (
    <header className="flex flex-col border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
      <div className="flex items-center justify-between px-4 py-2.5 gap-2">
        {/* Left: back + sidebar + title */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={closeBook} className="btn-ghost w-8 h-8 flex items-center justify-center shrink-0" title="Back to library">
            ←
          </button>
          <button onClick={toggleSidebar} className="btn-ghost w-8 h-8 flex items-center justify-center shrink-0" title="Toggle sidebar">
            {sidebarOpen ? '◧' : '▧'}
          </button>
          <div className="min-w-0">
            <h1 className="font-serif text-sm font-semibold text-[var(--text-primary)] truncate leading-tight">
              {book?.title || 'Untitled'}
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{book?.author}</p>
          </div>
        </div>

        {/* Center: page nav */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="btn-ghost w-7 h-7 flex items-center justify-center text-xs disabled:opacity-30">
            ‹
          </button>
          <form onSubmit={handlePageJump} className="flex items-center gap-1">
            <input
              className="w-10 text-center text-xs py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-ember-400"
              value={pageInput || currentPage}
              onChange={(e) => setPageInput(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <span className="text-xs text-[var(--text-muted)]">/ {numPages || '—'}</span>
          </form>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= numPages} className="btn-ghost w-7 h-7 flex items-center justify-center text-xs disabled:opacity-30">
            ›
          </button>
        </div>

        {/* Right: tools */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Zoom */}
          <button onClick={zoomOut} className="btn-ghost w-7 h-7 flex items-center justify-center text-base" title="Zoom out">−</button>
          <button onClick={resetZoom} className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] w-10 text-center transition-colors">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={zoomIn} className="btn-ghost w-7 h-7 flex items-center justify-center text-base" title="Zoom in">+</button>

          <div className="w-px h-4 bg-[var(--border)] mx-1" />

          {/* Bookmark */}
          <button
            onClick={onBookmark}
            className={`btn-ghost w-8 h-8 flex items-center justify-center text-base transition-colors
              ${isBookmarked ? 'text-ember-400' : ''}`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark page'}
          >
            {isBookmarked ? '🔖' : '🏷'}
          </button>

          {/* Search */}
          <button
            onClick={() => setSearchVisible(!searchVisible)}
            className={`btn-ghost w-8 h-8 flex items-center justify-center text-sm
              ${searchVisible ? 'text-ember-400 bg-ember-500/10' : ''}`}
            title="Search in PDF"
          >
            🔍
          </button>

          {/* TTS */}
          <button
            onClick={() => setTtsPanelOpen(!ttsPanelOpen)}
            className={`btn-ghost w-8 h-8 flex items-center justify-center text-sm
              ${ttsActive ? 'text-ember-400 animate-pulse-soft' : ''}
              ${ttsPanelOpen ? 'bg-ember-500/10' : ''}`}
            title="Text-to-Speech"
          >
            🔊
          </button>

          {/* Theme */}
          <button onClick={toggleTheme} className="btn-ghost w-8 h-8 flex items-center justify-center text-sm" title="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--border)]">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </header>
  );
}