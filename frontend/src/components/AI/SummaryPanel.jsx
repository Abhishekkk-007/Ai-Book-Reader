import React, { useState } from 'react';
import { generateChapterSummaries } from '../../utils/summaryUtils';
import { useReader } from '../../context/ReaderContext';

export default function SummaryPanel() {
  const { numPages, pageTextsRef, currentPage, goToPage } = useReader();
  const [summaries, setSummaries] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const generate = () => {
    setGenerating(true);
    // Simulate async AI processing with timeout
    setTimeout(() => {
      const texts = Array.from({ length: numPages }, (_, i) => pageTextsRef.current[i + 1] || '');
      const result = generateChapterSummaries(texts);
      setSummaries(result);
      setGenerating(false);
      setGenerated(true);
    }, 1200);
  };

  const reset = () => {
    setGenerated(false);
    setSummaries([]);
    setExpanded(null);
  };

  const pagesLoaded = Object.keys(pageTextsRef.current).length;

  return (
    <div className="p-3">
      {!generated ? (
        <div className="text-center py-6 px-2">
          <div className="text-5xl mb-3">🤖</div>
          <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)] mb-1">
            AI Chapter Summary
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-1 leading-relaxed">
            Automatically detect chapters and generate key summaries from the book's content.
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mb-4">
            {pagesLoaded} of {numPages || '?'} pages indexed
          </p>

          {pagesLoaded === 0 ? (
            <p className="text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 mb-3">
              📄 Open the reader and scroll through a few pages first so text can be indexed.
            </p>
          ) : null}

          <button
            onClick={generate}
            disabled={generating || pagesLoaded === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {generating ? (
              <>
                <span className="spinner !w-4 !h-4 !border-2" />
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate Summary</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                {summaries.length} section{summaries.length !== 1 ? 's' : ''} found
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">Tap a section to jump to it</p>
            </div>
            <button
              onClick={reset}
              className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] btn-ghost !px-2 !py-1"
            >
              ↺ Redo
            </button>
          </div>

          {summaries.map((ch, i) => (
            <div
              key={i}
              className={`card overflow-hidden transition-all duration-200
                ${ch.startPage === currentPage || expanded === i ? 'border-ember-500/50' : ''}`}
            >
              {/* Chapter header */}
              <button
                className="w-full flex items-start justify-between p-2.5 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                onClick={() => {
                  goToPage(ch.startPage);
                  setExpanded(expanded === i ? null : i);
                }}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate leading-tight">
                    {ch.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                    Starts p.{ch.startPage}
                  </p>
                </div>
                <span className={`text-[10px] text-[var(--text-muted)] transition-transform mt-1 shrink-0 ${expanded === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {/* Summary text */}
              {expanded === i && (
                <div className="px-2.5 pb-2.5 animate-fade-in">
                  <div className="border-t border-[var(--border)] pt-2">
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {ch.summary || 'No summary available for this section.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}