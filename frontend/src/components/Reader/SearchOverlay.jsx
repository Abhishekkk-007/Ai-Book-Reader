import React, { useEffect, useRef, useState } from 'react';
import { useReader } from '../../context/ReaderContext';

export default function SearchOverlay({ onJumpToResult }) {
  const {
    searchQuery, setSearchQuery,
    searchResults, setSearchResults,
    activeSearchResult, setActiveSearchResult,
    setSearchVisible, pageTextsRef,
    numPages,
  } = useReader();

  const inputRef = useRef(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const doSearch = async (q) => {
    if (!q.trim() || q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const results = [];
    const query = q.toLowerCase();

    // Search through cached page texts
    for (let page = 1; page <= numPages; page++) {
      const text = pageTextsRef.current[page] || '';
      let idx = 0;
      while (true) {
        const pos = text.toLowerCase().indexOf(query, idx);
        if (pos === -1) break;
        const snippet = text.slice(Math.max(0, pos - 40), pos + query.length + 40);
        results.push({ page, pos, snippet, index: results.length });
        idx = pos + 1;
        if (results.length >= 100) break; // cap results
      }
      if (results.length >= 100) break;
    }

    setSearchResults(results);
    setActiveSearchResult(0);
    setSearching(false);
    if (results.length > 0) onJumpToResult(results[0]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchVisible(false);
      setSearchQuery('');
      setSearchResults([]);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        const next = (activeSearchResult + 1) % searchResults.length;
        setActiveSearchResult(next);
        onJumpToResult(searchResults[next]);
      } else {
        doSearch(searchQuery);
      }
    }
  };

  const handleChange = (val) => {
    setSearchQuery(val);
    if (!val.trim()) { setSearchResults([]); return; }
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => doSearch(val), 400);
  };

  const jump = (idx) => {
    setActiveSearchResult(idx);
    onJumpToResult(searchResults[idx]);
  };

  const highlight = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-ember-400/40 text-[var(--text-primary)] rounded-sm">{part}</mark>
        : part
    );
  };

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="text-[var(--text-muted)] text-sm shrink-0">🔍</span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          placeholder="Search in this book…"
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {searching && <div className="spinner !w-4 !h-4 !border-2 shrink-0" />}

        {searchResults.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {activeSearchResult + 1}/{searchResults.length}
            </span>
            <button
              onClick={() => { const i = (activeSearchResult - 1 + searchResults.length) % searchResults.length; jump(i); }}
              className="btn-ghost w-6 h-6 flex items-center justify-center text-xs"
            >↑</button>
            <button
              onClick={() => { const i = (activeSearchResult + 1) % searchResults.length; jump(i); }}
              className="btn-ghost w-6 h-6 flex items-center justify-center text-xs"
            >↓</button>
          </div>
        )}

        <button
          onClick={() => { setSearchVisible(false); setSearchQuery(''); setSearchResults([]); }}
          className="btn-ghost w-6 h-6 flex items-center justify-center text-sm shrink-0"
        >×</button>
      </div>

      {/* Results list */}
      {searchResults.length > 0 && (
        <div className="max-h-48 overflow-y-auto border-t border-[var(--border)]">
          {searchResults.map((r, i) => (
            <button
              key={r.index}
              onClick={() => jump(i)}
              className={`w-full text-left px-4 py-2 text-xs transition-colors border-b border-[var(--border)]/50
                ${i === activeSearchResult ? 'bg-ember-500/15 text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'}`}
            >
              <span className="font-mono text-ember-400 mr-2">p.{r.page}</span>
              <span className="text-[var(--text-muted)]">…</span>
              {highlight(r.snippet, searchQuery)}
              <span className="text-[var(--text-muted)]">…</span>
            </button>
          ))}
        </div>
      )}

      {searchQuery && !searching && searchResults.length === 0 && (
        <p className="text-xs text-[var(--text-muted)] px-4 py-2 border-t border-[var(--border)]">
          No results found
        </p>
      )}
    </div>
  );
}