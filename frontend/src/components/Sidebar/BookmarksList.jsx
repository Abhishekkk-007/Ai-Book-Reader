import React from 'react';
import { useReader } from '../../context/ReaderContext';

export default function BookmarksList({ bookmarks, onRemove, onJump }) {
  const { currentPage } = useReader();

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-4">
        <span className="text-3xl">🏷</span>
        <p className="text-xs text-[var(--text-muted)]">No bookmarks yet. Press the bookmark icon to save a page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {bookmarks.map((b) => (
        <div
          key={b._id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-all
            ${b.page === currentPage ? 'bg-ember-500/15 text-ember-400' : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
          onClick={() => onJump(b.page)}
        >
          <span className="text-sm">🔖</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {b.label || `Page ${b.page}`}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Page {b.page}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(b._id); }}
            className="w-5 h-5 rounded flex items-center justify-center text-[10px]
              opacity-0 group-hover:opacity-100
              hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}