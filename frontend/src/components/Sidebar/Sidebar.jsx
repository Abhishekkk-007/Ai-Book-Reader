import React from 'react';
import { useReader } from '../../context/ReaderContext';
import BookmarksList from './BookmarksList';
import HighlightsList from './HighlightsList';
import SummaryPanel from '../AI/SummaryPanel';

const TABS = [
  { id: 'bookmarks', emoji: '🔖', title: 'Bookmarks' },
  { id: 'highlights', emoji: '✏️', title: 'Highlights' },
  { id: 'summary',   emoji: '🤖', title: 'AI Summary' },
];

export default function Sidebar({ bookmarks, highlights, onRemoveBookmark, onRemoveHighlight, onUpdateHighlight, onJumpPage }) {
  const { sidebarOpen, sidebarTab, setSidebarTab } = useReader();

  if (!sidebarOpen) return null;

  const activeTab = TABS.find((t) => t.id === sidebarTab);

  return (
    <aside className="w-72 shrink-0 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col overflow-hidden animate-slide-right">
      {/* Tab strip */}
      <div className="flex border-b border-[var(--border)] shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSidebarTab(t.id)}
            title={t.title}
            className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-xs transition-all duration-150
              ${sidebarTab === t.id
                ? 'text-ember-400 border-b-2 border-ember-400 bg-ember-500/5'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`}
          >
            <span className="text-base leading-none">{t.emoji}</span>
            <span className="text-[9px] uppercase tracking-wider font-medium">{t.title}</span>
          </button>
        ))}
      </div>

      {/* Count badge */}
      <div className="px-3 py-2 border-b border-[var(--border)] shrink-0 flex items-center justify-between">
        <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
          {activeTab?.title}
        </p>
        {sidebarTab === 'bookmarks' && bookmarks.length > 0 && (
          <span className="text-[10px] bg-ember-500/20 text-ember-400 px-1.5 py-0.5 rounded-full font-mono">
            {bookmarks.length}
          </span>
        )}
        {sidebarTab === 'highlights' && highlights.length > 0 && (
          <span className="text-[10px] bg-ember-500/20 text-ember-400 px-1.5 py-0.5 rounded-full font-mono">
            {highlights.length}
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {sidebarTab === 'bookmarks' && (
          <BookmarksList
            bookmarks={bookmarks}
            onRemove={onRemoveBookmark}
            onJump={onJumpPage}
          />
        )}
        {sidebarTab === 'highlights' && (
          <HighlightsList
            highlights={highlights}
            onRemove={onRemoveHighlight}
            onUpdate={onUpdateHighlight}
            onJump={onJumpPage}
          />
        )}
        {sidebarTab === 'summary' && <SummaryPanel />}
      </div>
    </aside>
  );
}