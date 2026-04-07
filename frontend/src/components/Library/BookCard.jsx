import React, { useState } from 'react';
import { formatFileSize, formatDate } from '../../utils/textUtils';

const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#14b8a6',
  '#f59e0b','#ef4444','#3b82f6','#10b981',
];

export default function BookCard({ book, progress, onOpen, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const pct = progress ? Math.round(progress.percentage || 0) : 0;
  const color = book.coverColor || COLORS[0];

  const circumference = 2 * Math.PI * 18;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="card group relative cursor-pointer overflow-hidden
        hover:border-[var(--accent)] hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-200 animate-fade-in"
      onClick={() => onOpen(book)}
    >
      {/* Cover */}
      <div
        className="h-48 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
      >
        <div className="text-center px-4">
          <div className="text-4xl mb-2">📖</div>
          <p className="font-serif text-white text-sm font-semibold line-clamp-3 leading-tight">
            {book.title}
          </p>
        </div>

        {/* Progress ring */}
        {pct > 0 && (
          <div className="absolute top-2 right-2">
            <svg width="44" height="44" className="rotate-[-90deg]">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke="white" strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-mono font-bold rotate-90">
              {pct}%
            </span>
          </div>
        )}

        {/* Menu button */}
        <button
          className="absolute top-2 left-2 w-7 h-7 rounded-full
            bg-black/30 hover:bg-black/60 text-white text-xs
            opacity-0 group-hover:opacity-100 transition-opacity
            flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); setShowMenu((m) => !m); }}
        >
          ⋯
        </button>

        {showMenu && (
          <div
            className="absolute top-9 left-2 card shadow-xl z-20 py-1 min-w-[120px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => { onDelete(book._id); setShowMenu(false); }}
            >
              🗑 Delete book
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-2 truncate">{book.author}</p>

        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span>{formatFileSize(book.size)}</span>
          {progress?.currentPage > 1 && (
            <span className="text-ember-400">p. {progress.currentPage}</span>
          )}
          <span>{formatDate(book.uploadedAt)}</span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-ember-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}